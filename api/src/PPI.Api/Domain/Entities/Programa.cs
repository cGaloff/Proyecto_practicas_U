namespace PPI.Api.Domain.Entities;

public class Programa
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Codigo { get; set; } = string.Empty;

    public ICollection<Docente> Docentes { get; set; } = [];
    public ICollection<GrupoAsignado> GruposAsignados { get; set; } = [];
    public ICollection<Informe> Informes { get; set; } = [];
}
