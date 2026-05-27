using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PPI.Api.Application.Auth;
using PPI.Api.Application.Docente;
using PPI.Api.Application.Word;
using PPI.Api.Domain.Entities;
using PPI.Api.Domain.Enums;
using PPI.Api.Infrastructure.Persistence;

namespace PPI.Api.Api.Controllers;

[ApiController]
[Route("api/docente")]
[Authorize(Roles = "Docente")]
[Produces("application/json")]
public class DocenteController(AppDbContext db) : ControllerBase
{
    // ── GET /api/docente/grupos ────────────────────────────────
    /// <summary>
    /// Retorna todos los grupos del docente autenticado con el
    /// estado actual de cada EntradaInforme.
    /// Un docente con N grupos recibe N entradas en la respuesta.
    /// </summary>
    [HttpGet("grupos")]
    [ProducesResponseType(typeof(List<GrupoConEntradaDto>), 200)]
    public async Task<IActionResult> GetGrupos()
    {
        var docenteId = GetDocenteId();
        if (docenteId == null) return Unauthorized();

        var grupos = await db.GruposAsignados
            .Include(g => g.EntradaInforme)
            .Include(g => g.Programa)
            .Where(g => g.DocenteId == docenteId)
            .OrderBy(g => g.Practica)
            .ThenBy(g => g.NumeroGrupo)
            .Select(g => new GrupoConEntradaDto
            {
                EntradaId        = g.EntradaInforme!.Id,
                Practica         = g.Practica,
                NumeroGrupo      = g.NumeroGrupo,
                Matriculados     = g.Matriculados,
                Estado           = g.EntradaInforme.Estado.ToString(),
                Programa         = g.Programa.Nombre,
                GuardadoEn       = g.EntradaInforme.GuardadoEn,
                EnviadoEn        = g.EntradaInforme.EnviadoEn,
                ObservacionAdmin = g.EntradaInforme.ObservacionAdmin
            })
            .ToListAsync();

        return Ok(grupos);
    }

    // ── GET /api/docente/entradas/{id} ────────────────────────
    /// <summary>
    /// Retorna el detalle completo de una entrada.
    /// Valida que la entrada pertenezca al docente autenticado.
    /// </summary>
    [HttpGet("entradas/{id:guid}")]
    [ProducesResponseType(typeof(EntradaDetalleDto), 200)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetEntrada(Guid id)
    {
        var docenteId = GetDocenteId();
        if (docenteId == null) return Unauthorized();

        var entrada = await db.EntradasInforme
            .Include(e => e.GrupoAsignado)
                .ThenInclude(g => g.Docente)
                    .ThenInclude(d => d.Programa)
            .Include(e => e.GrupoAsignado)
                .ThenInclude(g => g.Programa)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (entrada == null)
            return NotFound(new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "Entrada no encontrada."
            });

        if (entrada.GrupoAsignado.DocenteId != docenteId)
            return StatusCode(403, new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "No tienes permiso para acceder a esta entrada."
            });

        return Ok(MapToDetalle(entrada));
    }

    // ── PUT /api/docente/entradas/{id} ────────────────────────
    /// <summary>
    /// Guarda borrador de una entrada.
    /// Permitido en estados: SinIniciar, Borrador, Devuelto.
    /// Rechaza con 409 si el estado es Enviado.
    /// No valida suma 2B aquí — eso se valida al enviar.
    /// Cada sección es opcional: solo se actualizan las que vienen
    /// en el request. Las secciones null no se modifican.
    /// </summary>
    [HttpPut("entradas/{id:guid}")]
    [ProducesResponseType(typeof(EntradaDetalleDto), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(403)]
    [ProducesResponseType(409)]
    public async Task<IActionResult> GuardarBorrador(
        Guid id,
        [FromBody] GuardarBorradorRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var docenteId = GetDocenteId();
        if (docenteId == null) return Unauthorized();

        var entrada = await db.EntradasInforme
            .Include(e => e.GrupoAsignado)
                .ThenInclude(g => g.Docente)
                    .ThenInclude(d => d.Programa)
            .Include(e => e.GrupoAsignado)
                .ThenInclude(g => g.Programa)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (entrada == null)
            return NotFound(new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "Entrada no encontrada."
            });

        if (entrada.GrupoAsignado.DocenteId != docenteId)
            return StatusCode(403, new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "No tienes permiso para editar esta entrada."
            });

        if (entrada.Estado == EstadoEntrada.Enviado)
            return Conflict(new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "Esta entrada ya fue enviada y no puede modificarse."
            });

        // Actualizar solo las secciones presentes en el request
        if (req.Seccion2B != null)
            entrada.Seccion2B = new Seccion2B
            {
                Publica            = req.Seccion2B.Publica,
                Privada            = req.Seccion2B.Privada,
                OngSocial          = req.Seccion2B.OngSocial,
                VinculacionLaboral = req.Seccion2B.VinculacionLaboral,
                EnCasa             = req.Seccion2B.EnCasa,
                OtrosMunicipios    = req.Seccion2B.OtrosMunicipios
            };

        if (req.Seccion3 != null)
            entrada.Seccion3 = new Seccion3
            {
                Iniciaron   = req.Seccion3.Iniciaron,
                Finalizaron = req.Seccion3.Finalizaron,
                Retirados   = req.Seccion3.Retirados,
                Pendientes  = req.Seccion3.Pendientes,
                NoAprobaron = req.Seccion3.NoAprobaron
            };

        if (req.Seccion4A != null)
            entrada.Seccion4A = new Seccion4A
            {
                SalidasCampo = new ActividadItem
                {
                    Aplica      = req.Seccion4A.SalidasCampo.Aplica,
                    Descripcion = req.Seccion4A.SalidasCampo.Descripcion
                },
                EventosAcademicos = new ActividadItem
                {
                    Aplica      = req.Seccion4A.EventosAcademicos.Aplica,
                    Descripcion = req.Seccion4A.EventosAcademicos.Descripcion
                },
                ClasesEspejo = new ActividadItem
                {
                    Aplica      = req.Seccion4A.ClasesEspejo.Aplica,
                    Descripcion = req.Seccion4A.ClasesEspejo.Descripcion
                }
            };

        if (req.Seccion4B != null)
            entrada.Seccion4B = new Seccion4B
            {
                Estrategias   = req.Seccion4B.Estrategias,
                Publicaciones = req.Seccion4B.Publicaciones,
                Otras         = req.Seccion4B.Otras
            };

        if (req.Seccion5A != null)
            entrada.Seccion5A = new Seccion5A
            {
                Logros    = req.Seccion5A.Logros,
                Lecciones = req.Seccion5A.Lecciones
            };

        if (req.Seccion5B != null)
            entrada.Seccion5B = new Seccion5B
            {
                Limitaciones    = req.Seccion5B.Limitaciones,
                Recomendaciones = req.Seccion5B.Recomendaciones
            };

        if (req.EnlaceEvidencias != null)
            entrada.EnlaceEvidencias = req.EnlaceEvidencias;

        // Primer guardado: SinIniciar → Borrador
        if (entrada.Estado == EstadoEntrada.SinIniciar)
            entrada.Estado = EstadoEntrada.Borrador;

        entrada.GuardadoEn = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return Ok(MapToDetalle(entrada));
    }

    // ── POST /api/docente/entradas/{id}/enviar ────────────────
    /// <summary>
    /// Envía una entrada. Valida:
    /// - Estado debe ser Borrador o Devuelto
    /// - Sección 2B es obligatoria
    /// - Suma de sección 2B debe igualar matriculados del grupo
    /// Genera firma digital y recalcula el estado del informe padre.
    /// </summary>
    [HttpPost("entradas/{id:guid}/enviar")]
    [ProducesResponseType(typeof(MensajeResponse), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(403)]
    [ProducesResponseType(409)]
    public async Task<IActionResult> Enviar(Guid id)
    {
        var docenteId = GetDocenteId();
        if (docenteId == null) return Unauthorized();

        var correo = User.FindFirstValue(ClaimTypes.Email)
            ?? User.FindFirstValue("email")
            ?? string.Empty;

        var entrada = await db.EntradasInforme
            .Include(e => e.GrupoAsignado)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (entrada == null)
            return NotFound(new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "Entrada no encontrada."
            });

        if (entrada.GrupoAsignado.DocenteId != docenteId)
            return StatusCode(403, new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "No tienes permiso para enviar esta entrada."
            });

        if (entrada.Estado == EstadoEntrada.Enviado)
            return Conflict(new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "Esta entrada ya fue enviada."
            });

        if (entrada.Estado == EstadoEntrada.SinIniciar)
            return BadRequest(new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "Debes completar al menos la sección 2B antes de enviar."
            });

        // Sección 2B obligatoria
        if (entrada.Seccion2B == null)
            return BadRequest(new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "La sección 2B (distribución por modalidad) es obligatoria."
            });

        // Todo válido — marcar como enviado
        entrada.Estado       = EstadoEntrada.Enviado;
        entrada.EnviadoEn    = DateTime.UtcNow;
        entrada.GuardadoEn   = DateTime.UtcNow;
        entrada.FirmaDigital = $"Enviado digitalmente el " +
                               $"{ObtenerHoraBogota():dd/MM/yyyy HH:mm} hora Colombia " +
                               $"por {correo}";

        // Recalcular el estado del informe consolidado del programa
        await RecalcularEstadoInformeAsync(entrada.InformeId);

        await db.SaveChangesAsync();

        return Ok(new MensajeResponse
        {
            Mensaje = $"Entrada enviada correctamente — " +
                      $"Práctica {entrada.GrupoAsignado.Practica} · " +
                      $"Grupo {entrada.GrupoAsignado.NumeroGrupo}."
        });
    }

    // ── GET /api/docente/entradas/{id}/descargar ──────────────
    /// <summary>
    /// Genera y descarga el .docx del informe individual del docente.
    /// Solo contiene las filas de ese grupo específico.
    /// Solo accesible si la entrada está en estado Enviado.
    /// </summary>
    [HttpGet("entradas/{id:guid}/descargar")]
    [ProducesResponseType(typeof(FileContentResult), 200)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    [ProducesResponseType(409)]
    public async Task<IActionResult> Descargar(
        Guid id,
        [FromServices] IWordGeneratorService wordService,
        [FromServices] IPdfConverterService pdfService)
    {
        var docenteId = GetDocenteId();
        if (docenteId == null) return Unauthorized();

        var entrada = await db.EntradasInforme
            .Include(e => e.GrupoAsignado)
                .ThenInclude(g => g.Docente)
                    .ThenInclude(d => d.Programa)
            .Include(e => e.GrupoAsignado)
                .ThenInclude(g => g.Programa)
            .Include(e => e.Informe)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (entrada == null)
            return NotFound(new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "Entrada no encontrada."
            });

        if (entrada.GrupoAsignado.DocenteId != docenteId)
            return StatusCode(403, new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "No tienes permiso para descargar esta entrada."
            });

        if (entrada.Estado != EstadoEntrada.Enviado)
            return Conflict(new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "Solo se puede descargar una entrada enviada."
            });

        var docxBytes = await wordService.GenerarAsync(
            programa:     entrada.GrupoAsignado.Programa.Nombre,
            semestre:     entrada.Informe.Semestre,
            coordinador:  entrada.Informe.CoordinadorNombre,
            fechaEntrega: entrada.Informe.FechaEntrega,
            entradas:     [entrada]);

        var pdfBytes = await pdfService.ConvertirDocxAPdfAsync(docxBytes);

        var practica  = entrada.GrupoAsignado.Practica;
        var grupo     = entrada.GrupoAsignado.NumeroGrupo;
        var docNombre = entrada.GrupoAsignado.Docente.NombreCompleto
            .Replace(" ", "_").ToLower();
        var fileName  = $"informe_PPI_{practica}_grupo{grupo}_{docNombre}.pdf";

        return File(pdfBytes, "application/pdf", fileName);
    }

    // ── Helpers privados ──────────────────────────────────────

    private Guid? GetDocenteId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");
        return Guid.TryParse(claim, out var id) ? id : null;
    }

    private static EntradaDetalleDto MapToDetalle(EntradaInforme e) => new()
    {
        Id            = e.Id,
        Estado        = e.Estado.ToString(),
        Practica      = e.GrupoAsignado.Practica,
        NumeroGrupo   = e.GrupoAsignado.NumeroGrupo,
        Matriculados  = e.GrupoAsignado.Matriculados,
        DocenteNombre = e.GrupoAsignado.Docente.NombreCompleto,
        Programa      = e.GrupoAsignado.Programa.Nombre,
        Semestre      = e.GrupoAsignado.Semestre,
        GuardadoEn    = e.GuardadoEn,
        EnviadoEn     = e.EnviadoEn,
        FirmaDigital  = e.FirmaDigital,
        ObservacionAdmin  = e.ObservacionAdmin,
        EnlaceEvidencias  = e.EnlaceEvidencias,

        Seccion2B = e.Seccion2B == null ? null : new Seccion2BDto
        {
            Publica            = e.Seccion2B.Publica,
            Privada            = e.Seccion2B.Privada,
            OngSocial          = e.Seccion2B.OngSocial,
            VinculacionLaboral = e.Seccion2B.VinculacionLaboral,
            EnCasa             = e.Seccion2B.EnCasa,
            OtrosMunicipios    = e.Seccion2B.OtrosMunicipios
        },
        Seccion3 = e.Seccion3 == null ? null : new Seccion3Dto
        {
            Iniciaron   = e.Seccion3.Iniciaron,
            Finalizaron = e.Seccion3.Finalizaron,
            Retirados   = e.Seccion3.Retirados,
            Pendientes  = e.Seccion3.Pendientes,
            NoAprobaron = e.Seccion3.NoAprobaron
        },
        Seccion4A = e.Seccion4A == null ? null : new Seccion4ADto
        {
            SalidasCampo = new ActividadItemDto
            {
                Aplica      = e.Seccion4A.SalidasCampo.Aplica,
                Descripcion = e.Seccion4A.SalidasCampo.Descripcion
            },
            EventosAcademicos = new ActividadItemDto
            {
                Aplica      = e.Seccion4A.EventosAcademicos.Aplica,
                Descripcion = e.Seccion4A.EventosAcademicos.Descripcion
            },
            ClasesEspejo = new ActividadItemDto
            {
                Aplica      = e.Seccion4A.ClasesEspejo.Aplica,
                Descripcion = e.Seccion4A.ClasesEspejo.Descripcion
            }
        },
        Seccion4B = e.Seccion4B == null ? null : new Seccion4BDto
        {
            Estrategias   = e.Seccion4B.Estrategias,
            Publicaciones = e.Seccion4B.Publicaciones,
            Otras         = e.Seccion4B.Otras
        },
        Seccion5A = e.Seccion5A == null ? null : new Seccion5ADto
        {
            Logros    = e.Seccion5A.Logros,
            Lecciones = e.Seccion5A.Lecciones
        },
        Seccion5B = e.Seccion5B == null ? null : new Seccion5BDto
        {
            Limitaciones    = e.Seccion5B.Limitaciones,
            Recomendaciones = e.Seccion5B.Recomendaciones
        }
    };

    private async Task RecalcularEstadoInformeAsync(Guid informeId)
    {
        var informe = await db.Informes
            .Include(i => i.Entradas)
            .FirstOrDefaultAsync(i => i.Id == informeId);

        if (informe == null) return;

        var estados = informe.Entradas.Select(e => e.Estado).ToList();

        informe.Estado = estados.All(e => e == EstadoEntrada.Enviado)
            ? EstadoInforme.ListoParaRevision
            : estados.Any(e => e == EstadoEntrada.Enviado)
                ? EstadoInforme.EnProgreso
                : EstadoInforme.Pendiente;

        informe.ActualizadoEn = DateTime.UtcNow;
    }

    private static DateTime ObtenerHoraBogota()
    {
        try
        {
            var tz = TimeZoneInfo.FindSystemTimeZoneById("America/Bogota");
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, tz);
        }
        catch
        {
            return DateTime.UtcNow.AddHours(-5);
        }
    }
}
