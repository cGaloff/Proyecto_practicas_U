namespace PPI.Api.Domain.Entities;

public class Docente
{
    public Guid Id { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;

    /// <summary>Correo institucional. Es el username de login.</summary>
    public string Correo { get; set; } = string.Empty;

    /// <summary>Hash bcrypt de la contraseña.</summary>
    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>
    /// true = fuerza cambio de contraseña en el próximo login.
    /// Se inicializa en true en el seed para todos los docentes.
    /// </summary>
    public bool PrimerLogin { get; set; } = true;
    public bool EsAuxiliar { get; set; } = false;

    public Guid ProgramaId { get; set; }
    public Programa Programa { get; set; } = null!;

    public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

    public ICollection<GrupoAsignado> GruposAsignados { get; set; } = [];
}
