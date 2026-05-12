namespace PPI.Api.Domain.Enums;

public enum EstadoEntrada
{
    SinIniciar,
    Borrador,
    Enviado,
    Devuelto
}

public enum EstadoInforme
{
    Pendiente,
    EnProgreso,
    ListoParaRevision,
    EnRevision,
    Aprobado,
    Devuelto
}

public enum RolUsuario
{
    Docente,
    Admin
}
