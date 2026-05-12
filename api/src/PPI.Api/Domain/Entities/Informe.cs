using PPI.Api.Domain.Enums;

namespace PPI.Api.Domain.Entities;

public class Informe
{
    public Guid Id { get; set; }

    public Guid ProgramaId { get; set; }
    public Programa Programa { get; set; } = null!;

    public string Semestre { get; set; } = string.Empty;
    public int Anio { get; set; }

    /// <summary>
    /// Estado derivado. Se recalcula al cambiar el estado
    /// de cualquier EntradaInforme hija.
    /// </summary>
    public EstadoInforme Estado { get; set; } = EstadoInforme.Pendiente;

    public string CoordinadorNombre { get; set; } = string.Empty;
    public DateOnly? FechaEntrega { get; set; }

    public DateTime CreadoEn { get; set; } = DateTime.UtcNow;
    public DateTime ActualizadoEn { get; set; } = DateTime.UtcNow;

    public ICollection<EntradaInforme> Entradas { get; set; } = [];
    public ICollection<InformeAuditoria> Auditorias { get; set; } = [];
}
