namespace PPI.Api.Domain.Entities;

public class GrupoAsignado
{
    public Guid Id { get; set; }

    public Guid DocenteId { get; set; }
    public Docente Docente { get; set; } = null!;

    public Guid ProgramaId { get; set; }
    public Programa Programa { get; set; } = null!;

    /// <summary>Valores: "I", "II", "III", "IV", "V", "PP"</summary>
    public string Practica { get; set; } = string.Empty;

    public int NumeroGrupo { get; set; }
    public int Matriculados { get; set; }

    /// <summary>Formato: "2026-I"</summary>
    public string Semestre { get; set; } = string.Empty;
    public int Anio { get; set; }

    public EntradaInforme? EntradaInforme { get; set; }
}
