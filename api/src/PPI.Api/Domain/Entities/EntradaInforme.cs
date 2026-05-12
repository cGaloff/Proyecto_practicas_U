using PPI.Api.Domain.Enums;

namespace PPI.Api.Domain.Entities;

/// <summary>
/// Lo que UN docente diligenció para UN grupo.
/// Equivale a UNA FILA en cada tabla del Word consolidado.
/// N:1 con Informe — 1:1 con GrupoAsignado.
/// </summary>
public class EntradaInforme
{
    public Guid Id { get; set; }

    public Guid InformeId { get; set; }
    public Informe Informe { get; set; } = null!;

    public Guid GrupoAsignadoId { get; set; }
    public GrupoAsignado GrupoAsignado { get; set; } = null!;

    public EstadoEntrada Estado { get; set; } = EstadoEntrada.SinIniciar;

    public Seccion2B? Seccion2B { get; set; }
    public Seccion3? Seccion3 { get; set; }
    public Seccion4A? Seccion4A { get; set; }
    public Seccion4B? Seccion4B { get; set; }
    public Seccion5A? Seccion5A { get; set; }
    public Seccion5B? Seccion5B { get; set; }

    public string? EnlaceEvidencias { get; set; }
    public string? FirmaDigital { get; set; }
    public string? ObservacionAdmin { get; set; }

    public DateTime CreadoEn { get; set; } = DateTime.UtcNow;
    public DateTime? GuardadoEn { get; set; }
    public DateTime? EnviadoEn { get; set; }
}

public class Seccion2B
{
    public int Publica { get; set; }
    public int Privada { get; set; }
    public int OngSocial { get; set; }
    public int VinculacionLaboral { get; set; }
    public int EnCasa { get; set; }
    public int OtrosMunicipios { get; set; }
    public int Total =>
        Publica + Privada + OngSocial + VinculacionLaboral + EnCasa + OtrosMunicipios;
}

public class Seccion3
{
    public int Iniciaron { get; set; }
    public int Finalizaron { get; set; }
    public int Retirados { get; set; }
    public int Pendientes { get; set; }
    public int NoAprobaron { get; set; }
}

public class Seccion4A
{
    public ActividadItem SalidasCampo { get; set; } = new();
    public ActividadItem EventosAcademicos { get; set; } = new();
    public ActividadItem ClasesEspejo { get; set; } = new();
}

public class ActividadItem
{
    public bool Aplica { get; set; }
    public string Descripcion { get; set; } = string.Empty;
}

public class Seccion4B
{
    public string Estrategias { get; set; } = string.Empty;
    public string Publicaciones { get; set; } = string.Empty;
    public string Otras { get; set; } = string.Empty;
}

public class Seccion5A
{
    public string Logros { get; set; } = string.Empty;
    public string Lecciones { get; set; } = string.Empty;
}

public class Seccion5B
{
    public string Limitaciones { get; set; } = string.Empty;
    public string Recomendaciones { get; set; } = string.Empty;
}
