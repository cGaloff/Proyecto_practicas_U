using System.ComponentModel.DataAnnotations;

namespace PPI.Api.Application.Auth;

/// <summary>Request del endpoint POST /api/auth/login</summary>
public class LoginRequest
{
    [Required, EmailAddress]
    public string Correo { get; set; } = string.Empty;

    [Required, MinLength(1)]
    public string Password { get; set; } = string.Empty;
}

/// <summary>Response exitoso del login</summary>
public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string NombreCompleto { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public bool PrimerLogin { get; set; }
    public DateTime ExpiraEn { get; set; }
}

/// <summary>Request del endpoint POST /api/auth/change-password</summary>
public class ChangePasswordRequest
{
    [Required, MinLength(1)]
    public string PasswordActual { get; set; } = string.Empty;

    [Required, MinLength(8)]
    public string PasswordNuevo { get; set; } = string.Empty;

    [Required, Compare(nameof(PasswordNuevo))]
    public string ConfirmacionPassword { get; set; } = string.Empty;
}

/// <summary>Response genérico para operaciones sin cuerpo de retorno</summary>
public class MensajeResponse
{
    public string Mensaje { get; set; } = string.Empty;
    public bool Exitoso { get; set; } = true;
}
