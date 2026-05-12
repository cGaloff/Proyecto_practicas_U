namespace PPI.Api.Domain.Entities;

public class Admin
{
    public Guid Id { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

    public ICollection<InformeAuditoria> Auditorias { get; set; } = [];
}
