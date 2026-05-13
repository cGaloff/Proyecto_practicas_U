using System.ComponentModel.DataAnnotations;

namespace PPI.Api.Application.Docente;

public class GrupoConEntradaDto
{
    public Guid EntradaId { get; set; }
    public string Practica { get; set; } = string.Empty;
    public int NumeroGrupo { get; set; }
    public int Matriculados { get; set; }
    public string Estado { get; set; } = string.Empty;
    public DateTime? GuardadoEn { get; set; }
    public DateTime? EnviadoEn { get; set; }
    public string? ObservacionAdmin { get; set; }
}

public class EntradaDetalleDto
{
    public Guid Id { get; set; }
    public string Estado { get; set; } = string.Empty;

    // Solo lectura — vienen del GrupoAsignado, no los edita el docente
    public string Practica { get; set; } = string.Empty;
    public int NumeroGrupo { get; set; }
    public int Matriculados { get; set; }
    public string DocenteNombre { get; set; } = string.Empty;
    public string Programa { get; set; } = string.Empty;
    public string Semestre { get; set; } = string.Empty;

    // Secciones — null si aún no se han diligenciado
    public Seccion2BDto? Seccion2B { get; set; }
    public Seccion3Dto? Seccion3 { get; set; }
    public Seccion4ADto? Seccion4A { get; set; }
    public Seccion4BDto? Seccion4B { get; set; }
    public Seccion5ADto? Seccion5A { get; set; }
    public Seccion5BDto? Seccion5B { get; set; }
    public string? EnlaceEvidencias { get; set; }

    public string? ObservacionAdmin { get; set; }
    public string? FirmaDigital { get; set; }
    public DateTime? GuardadoEn { get; set; }
    public DateTime? EnviadoEn { get; set; }
}

public class GuardarBorradorRequest
{
    public Seccion2BDto? Seccion2B { get; set; }
    public Seccion3Dto? Seccion3 { get; set; }
    public Seccion4ADto? Seccion4A { get; set; }
    public Seccion4BDto? Seccion4B { get; set; }
    public Seccion5ADto? Seccion5A { get; set; }
    public Seccion5BDto? Seccion5B { get; set; }

    [MaxLength(500)]
    public string? EnlaceEvidencias { get; set; }
}

public class Seccion2BDto
{
    [Range(0, 9999)] public int Publica { get; set; }
    [Range(0, 9999)] public int Privada { get; set; }
    [Range(0, 9999)] public int OngSocial { get; set; }
    [Range(0, 9999)] public int VinculacionLaboral { get; set; }
    [Range(0, 9999)] public int EnCasa { get; set; }
    [Range(0, 9999)] public int OtrosMunicipios { get; set; }
}

public class Seccion3Dto
{
    [Range(0, 9999)] public int Iniciaron { get; set; }
    [Range(0, 9999)] public int Finalizaron { get; set; }
    [Range(0, 9999)] public int Retirados { get; set; }
    [Range(0, 9999)] public int Pendientes { get; set; }
    [Range(0, 9999)] public int NoAprobaron { get; set; }
}

public class Seccion4ADto
{
    public ActividadItemDto SalidasCampo { get; set; } = new();
    public ActividadItemDto EventosAcademicos { get; set; } = new();
    public ActividadItemDto ClasesEspejo { get; set; } = new();
}

public class ActividadItemDto
{
    public bool Aplica { get; set; }

    [MaxLength(300)]
    public string Descripcion { get; set; } = string.Empty;
}

public class Seccion4BDto
{
    [MaxLength(300)] public string Estrategias { get; set; } = string.Empty;
    [MaxLength(300)] public string Publicaciones { get; set; } = string.Empty;
    [MaxLength(300)] public string Otras { get; set; } = string.Empty;
}

public class Seccion5ADto
{
    [MaxLength(300)] public string Logros { get; set; } = string.Empty;
    [MaxLength(300)] public string Lecciones { get; set; } = string.Empty;
}

public class Seccion5BDto
{
    [MaxLength(300)] public string Limitaciones { get; set; } = string.Empty;
    [MaxLength(300)] public string Recomendaciones { get; set; } = string.Empty;
}
