using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PPI.Api.Application.Auth;
using PPI.Api.Application.Word;
using PPI.Api.Domain.Entities;
using PPI.Api.Domain.Enums;
using PPI.Api.Infrastructure.Persistence;

namespace PPI.Api.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
[Produces("application/json")]
public class AdminController(AppDbContext db) : ControllerBase
{
    // ── GET /api/admin/programas ───────────────────────────────
    /// <summary>
    /// Lista todos los programas con el estado de su informe activo.
    /// </summary>
    [HttpGet("programas")]
    [ProducesResponseType(200)]
    public async Task<IActionResult> GetProgramas()
    {
        var programas = await db.Informes
            .Include(i => i.Programa)
            .Where(i => i.Semestre == "2026-I")
            .Select(i => new
            {
                programaId   = i.ProgramaId,
                nombre       = i.Programa.Nombre,
                codigo       = i.Programa.Codigo,
                informeId    = i.Id,
                semestre     = i.Semestre,
                estado       = i.Estado.ToString(),
                totalEntradas = i.Entradas.Count,
                enviadas      = i.Entradas.Count(e => e.Estado == EstadoEntrada.Enviado),
                fechaEntrega  = i.FechaEntrega
            })
            .OrderBy(x => x.nombre)
            .ToListAsync();

        return Ok(programas);
    }

    // ── GET /api/admin/programas/{id}/entradas ─────────────────
    /// <summary>
    /// Lista todas las EntradaInforme del programa para el semestre activo,
    /// ordenadas por práctica y número de grupo.
    /// </summary>
    [HttpGet("programas/{id:guid}/entradas")]
    [ProducesResponseType(200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetEntradas(Guid id)
    {
        var informe = await db.Informes
            .Include(i => i.Programa)
            .Include(i => i.Entradas)
                .ThenInclude(e => e.GrupoAsignado)
                    .ThenInclude(g => g.Docente)
            .FirstOrDefaultAsync(i =>
                i.ProgramaId == id && i.Semestre == "2026-I");

        if (informe == null)
            return NotFound(new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "No se encontró un informe activo para este programa."
            });

        var entradas = informe.Entradas
            .OrderBy(e => e.GrupoAsignado.Practica)
            .ThenBy(e => e.GrupoAsignado.NumeroGrupo)
            .Select(e => new
            {
                id           = e.Id,
                practica     = e.GrupoAsignado.Practica,
                numeroGrupo  = e.GrupoAsignado.NumeroGrupo,
                matriculados = e.GrupoAsignado.Matriculados,
                docente      = e.GrupoAsignado.Docente.NombreCompleto,
                estado       = e.Estado.ToString(),
                guardadoEn   = e.GuardadoEn,
                enviadoEn    = e.EnviadoEn
            })
            .ToList();

        return Ok(new
        {
            programa = informe.Programa.Nombre,
            semestre = informe.Semestre,
            estado   = informe.Estado.ToString(),
            entradas
        });
    }

    // ── GET /api/admin/entradas/{id}/descargar ────────────────
    /// <summary>
    /// Descarga el .docx de una entrada específica.
    /// El admin puede descargar cualquier entrada sin restricción
    /// de ownership. Solo entradas en estado Enviado o superior.
    /// </summary>
    [HttpGet("entradas/{id:guid}/descargar")]
    [ProducesResponseType(typeof(FileContentResult), 200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(409)]
    public async Task<IActionResult> DescargarEntrada(
        Guid id,
        [FromServices] IWordGeneratorService wordService)
    {
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

        if (entrada.Estado != EstadoEntrada.Enviado)
            return Conflict(new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "Solo se puede descargar una entrada en estado Enviado."
            });

        var bytes = await wordService.GenerarAsync(
            programa:     entrada.GrupoAsignado.Programa.Nombre,
            semestre:     entrada.Informe.Semestre,
            coordinador:  entrada.Informe.CoordinadorNombre,
            fechaEntrega: entrada.Informe.FechaEntrega,
            entradas:     [entrada]);

        var practica  = entrada.GrupoAsignado.Practica;
        var grupo     = entrada.GrupoAsignado.NumeroGrupo;
        var docNombre = entrada.GrupoAsignado.Docente.NombreCompleto
            .Replace(" ", "_").ToLower();
        var fileName = $"informe_PPI_{practica}_grupo{grupo}_{docNombre}.docx";

        return File(
            bytes,
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            fileName);
    }

    // ── GET /api/admin/programas/{id}/consolidado ─────────────
    /// <summary>
    /// Genera y descarga el informe consolidado de un programa.
    /// Contiene UNA FILA POR CADA GRUPO de cada docente del programa,
    /// ordenadas por práctica ASC, número de grupo ASC.
    /// Solo disponible cuando TODAS las entradas están Enviadas
    /// (estado del informe: ListoParaRevision, EnRevision o Aprobado).
    /// </summary>
    [HttpGet("programas/{id:guid}/consolidado")]
    [ProducesResponseType(typeof(FileContentResult), 200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(409)]
    public async Task<IActionResult> DescargarConsolidado(
        Guid id,
        [FromServices] IWordGeneratorService wordService)
    {
        var informe = await db.Informes
            .Include(i => i.Programa)
            .Include(i => i.Entradas)
                .ThenInclude(e => e.GrupoAsignado)
                    .ThenInclude(g => g.Docente)
                        .ThenInclude(d => d.Programa)
            .Include(i => i.Entradas)
                .ThenInclude(e => e.GrupoAsignado)
                    .ThenInclude(g => g.Programa)
            .FirstOrDefaultAsync(i =>
                i.ProgramaId == id && i.Semestre == "2026-I");

        if (informe == null)
            return NotFound(new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "No se encontró un informe activo para este programa."
            });

        var estadosPermitidos = new[]
        {
            EstadoInforme.ListoParaRevision,
            EstadoInforme.EnRevision,
            EstadoInforme.Aprobado
        };

        if (!estadosPermitidos.Contains(informe.Estado))
        {
            var enviadas = informe.Entradas
                .Count(e => e.Estado == EstadoEntrada.Enviado);
            var total = informe.Entradas.Count;

            return Conflict(new MensajeResponse
            {
                Exitoso = false,
                Mensaje = $"El consolidado no está disponible todavía. " +
                          $"{enviadas} de {total} entradas han sido enviadas. " +
                          $"Todas deben estar enviadas para generar el consolidado."
            });
        }

        var entradasOrdenadas = informe.Entradas
            .OrderBy(e => e.GrupoAsignado.Practica)
            .ThenBy(e => e.GrupoAsignado.NumeroGrupo)
            .ToList();

        var bytes = await wordService.GenerarAsync(
            programa:     informe.Programa.Nombre,
            semestre:     informe.Semestre,
            coordinador:  informe.CoordinadorNombre,
            fechaEntrega: informe.FechaEntrega,
            entradas:     entradasOrdenadas);

        var progNombre = informe.Programa.Nombre
            .Replace(" ", "_")
            .Replace("/", "-")
            .ToLower();
        var fileName = $"consolidado_PPI_{progNombre}_{informe.Semestre}.docx";

        return File(
            bytes,
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            fileName);
    }

    // ── GET /api/admin/docentes/{id}/entradas ──────────────────
    /// <summary>
    /// Retorna el docente con todas sus entradas para el semestre activo.
    /// </summary>
    [HttpGet("docentes/{id:guid}/entradas")]
    [ProducesResponseType(200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetEntradasDocente(Guid id)
    {
        var docente = await db.Docentes
            .Include(d => d.Programa)
            .Include(d => d.GruposAsignados)
                .ThenInclude(g => g.EntradaInforme)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (docente == null)
            return NotFound(new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "Docente no encontrado."
            });

        var grupos = docente.GruposAsignados
            .OrderBy(g => g.Practica)
            .ThenBy(g => g.NumeroGrupo)
            .Select(g => new
            {
                entradaId       = g.EntradaInforme?.Id,
                practica        = g.Practica,
                numeroGrupo     = g.NumeroGrupo,
                matriculados    = g.Matriculados,
                estado          = g.EntradaInforme?.Estado.ToString() ?? "SinIniciar",
                guardadoEn      = g.EntradaInforme?.GuardadoEn,
                enviadoEn       = g.EntradaInforme?.EnviadoEn,
                observacionAdmin = g.EntradaInforme?.ObservacionAdmin
            })
            .ToList();

        return Ok(new
        {
            docenteId = docente.Id,
            nombre    = docente.NombreCompleto,
            correo    = docente.Correo,
            programa  = docente.Programa.Nombre,
            grupos
        });
    }

    // ── PUT /api/admin/informes/{id}/estado ────────────────────
    /// <summary>
    /// Cambia el estado de un informe consolidado.
    /// Si el nuevo estado es "Devuelto", la observación es obligatoria
    /// y se propaga a todas las entradas del informe.
    /// Registra un evento en la auditoría del informe.
    /// </summary>
    [HttpPut("informes/{id:guid}/estado")]
    [ProducesResponseType(typeof(MensajeResponse), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> CambiarEstado(
        Guid id,
        [FromBody] CambiarEstadoRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (!Enum.TryParse<EstadoInforme>(req.NuevoEstado, out var nuevoEstado))
            return BadRequest(new MensajeResponse
            {
                Exitoso = false,
                Mensaje = $"Estado '{req.NuevoEstado}' no válido."
            });

        if (nuevoEstado == EstadoInforme.Devuelto &&
            string.IsNullOrWhiteSpace(req.Observacion))
            return BadRequest(new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "La observación es obligatoria cuando el estado es Devuelto."
            });

        var adminId = GetAdminId();
        if (adminId == null) return Unauthorized();

        var informe = await db.Informes
            .Include(i => i.Entradas)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (informe == null)
            return NotFound(new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "Informe no encontrado."
            });

        var estadoAnterior = informe.Estado.ToString();
        informe.Estado       = nuevoEstado;
        informe.ActualizadoEn = DateTime.UtcNow;

        // Propagar Devuelto a todas las entradas con su observación
        if (nuevoEstado == EstadoInforme.Devuelto)
        {
            foreach (var entrada in informe.Entradas)
            {
                entrada.Estado           = EstadoEntrada.Devuelto;
                entrada.ObservacionAdmin = req.Observacion;
            }
        }

        // Registrar auditoría
        db.InformeAuditorias.Add(new InformeAuditoria
        {
            InformeId      = id,
            AdminId        = adminId.Value,
            EstadoAnterior = estadoAnterior,
            EstadoNuevo    = nuevoEstado.ToString(),
            Observacion    = req.Observacion,
            CreadoEn       = DateTime.UtcNow
        });

        await db.SaveChangesAsync();

        return Ok(new MensajeResponse
        {
            Mensaje = $"Estado del informe actualizado: {estadoAnterior} → {nuevoEstado}."
        });
    }

    // ── GET /api/admin/informes/{id}/auditoria ─────────────────
    /// <summary>
    /// Retorna el historial de cambios de estado del informe,
    /// ordenado del más reciente al más antiguo.
    /// </summary>
    [HttpGet("informes/{id:guid}/auditoria")]
    [ProducesResponseType(200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetAuditoria(Guid id)
    {
        var existe = await db.Informes.AnyAsync(i => i.Id == id);
        if (!existe)
            return NotFound(new MensajeResponse
            {
                Exitoso = false,
                Mensaje = "Informe no encontrado."
            });

        var auditorias = await db.InformeAuditorias
            .Include(a => a.Admin)
            .Where(a => a.InformeId == id)
            .OrderByDescending(a => a.CreadoEn)
            .Select(a => new
            {
                id             = a.Id,
                adminNombre    = a.Admin.NombreCompleto,
                estadoAnterior = a.EstadoAnterior,
                estadoNuevo    = a.EstadoNuevo,
                observacion    = a.Observacion,
                creadoEn       = a.CreadoEn
            })
            .ToListAsync();

        return Ok(auditorias);
    }

    // ── Helper ─────────────────────────────────────────────────

    private Guid? GetAdminId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}

public class CambiarEstadoRequest
{
    [Required]
    public string NuevoEstado { get; set; } = string.Empty;

    public string? Observacion { get; set; }
}
