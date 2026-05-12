namespace PPI.Api.Domain.Entities;

/// <summary>
/// Registro inmutable de cada cambio de estado del informe.
/// Solo se inserta, nunca se modifica ni elimina.
/// </summary>
public class InformeAuditoria
{
    public Guid Id { get; set; }

    public Guid InformeId { get; set; }
    public Informe Informe { get; set; } = null!;

    public Guid AdminId { get; set; }
    public Admin Admin { get; set; } = null!;

    public string EstadoAnterior { get; set; } = string.Empty;
    public string EstadoNuevo { get; set; } = string.Empty;

    /// <summary>Obligatorio cuando EstadoNuevo es "Devuelto".</summary>
    public string? Observacion { get; set; }

    public DateTime CreadoEn { get; set; } = DateTime.UtcNow;
}
