using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PPI.Api.Application.Auth;
using PPI.Api.Infrastructure.Persistence;

namespace PPI.Api.Api.Controllers;

[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public class AuthController(
    AppDbContext db,
    IJwtService jwtService,
    IPasswordService passwordService) : ControllerBase
{
    // ── POST /api/auth/login ───────────────────────────────────
    /// <summary>
    /// Autentica un docente o admin con correo y contraseña.
    /// Retorna JWT con claims de rol y estado primer_login.
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(LoginResponse), 200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var correo = req.Correo.Trim().ToLower();

        // Buscar primero en docentes
        var docente = await db.Docentes
            .Include(d => d.Programa)
            .FirstOrDefaultAsync(d => d.Correo == correo);

        if (docente is not null)
        {
            if (!passwordService.Verificar(req.Password, docente.PasswordHash))
                return Unauthorized(new MensajeResponse
                {
                    Exitoso = false,
                    Mensaje = "Credenciales incorrectas."
                });

            var token = jwtService.GenerarToken(
                docente.Id, docente.Correo, "Docente", docente.PrimerLogin);

            return Ok(new LoginResponse
            {
                Token = token,
                NombreCompleto = docente.NombreCompleto,
                Correo = docente.Correo,
                Rol = "Docente",
                PrimerLogin = docente.PrimerLogin,
                ExpiraEn = DateTime.UtcNow.AddMinutes(480)
            });
        }

        // Si no es docente, buscar en admins
        var admin = await db.Admins
            .FirstOrDefaultAsync(a => a.Correo == correo);

        if (admin is not null)
        {
            if (!passwordService.Verificar(req.Password, admin.PasswordHash))
                return Unauthorized(new MensajeResponse
                {
                    Exitoso = false,
                    Mensaje = "Credenciales incorrectas."
                });

            var token = jwtService.GenerarToken(
                admin.Id, admin.Correo, "Admin", false);

            return Ok(new LoginResponse
            {
                Token = token,
                NombreCompleto = admin.NombreCompleto,
                Correo = admin.Correo,
                Rol = "Admin",
                PrimerLogin = false,
                ExpiraEn = DateTime.UtcNow.AddMinutes(480)
            });
        }

        // No encontrado en ninguna tabla
        return Unauthorized(new MensajeResponse
        {
            Exitoso = false,
            Mensaje = "Credenciales incorrectas."
        });
    }

    // ── POST /api/auth/change-password ────────────────────────
    /// <summary>
    /// Cambia la contraseña del usuario autenticado.
    /// Si es el primer login, actualiza el flag PrimerLogin a false.
    /// Solo accesible con JWT válido.
    /// </summary>
    [HttpPost("change-password")]
    [Authorize]
    [ProducesResponseType(typeof(MensajeResponse), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");

        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var rol = User.FindFirstValue(ClaimTypes.Role);

        if (rol == "Docente")
        {
            var docente = await db.Docentes.FindAsync(userId);
            if (docente is null) return Unauthorized();

            if (!passwordService.Verificar(req.PasswordActual, docente.PasswordHash))
                return BadRequest(new MensajeResponse
                {
                    Exitoso = false,
                    Mensaje = "La contraseña actual no es correcta."
                });

            if (req.PasswordNuevo == req.PasswordActual)
                return BadRequest(new MensajeResponse
                {
                    Exitoso = false,
                    Mensaje = "La nueva contraseña no puede ser igual a la actual."
                });

            docente.PasswordHash = passwordService.Hashear(req.PasswordNuevo);
            docente.PrimerLogin = false;
            await db.SaveChangesAsync();

            return Ok(new MensajeResponse
            {
                Mensaje = "Contraseña actualizada correctamente."
            });
        }

        if (rol == "Admin")
        {
            var admin = await db.Admins.FindAsync(userId);
            if (admin is null) return Unauthorized();

            if (!passwordService.Verificar(req.PasswordActual, admin.PasswordHash))
                return BadRequest(new MensajeResponse
                {
                    Exitoso = false,
                    Mensaje = "La contraseña actual no es correcta."
                });

            admin.PasswordHash = passwordService.Hashear(req.PasswordNuevo);
            await db.SaveChangesAsync();

            return Ok(new MensajeResponse
            {
                Mensaje = "Contraseña actualizada correctamente."
            });
        }

        return Unauthorized();
    }

    // ── POST /api/auth/refresh ─────────────────────────────────
    /// <summary>Placeholder — se implementa en sprint de seguridad.</summary>
    [HttpPost("refresh")]
    [AllowAnonymous]
    [ProducesResponseType(501)]
    public IActionResult Refresh() =>
        StatusCode(501, new MensajeResponse
        {
            Exitoso = false,
            Mensaje = "Refresh token no implementado aún."
        });

    // ── POST /api/auth/logout ──────────────────────────────────
    /// <summary>
    /// En JWT stateless el logout es del lado del cliente.
    /// El frontend elimina el token local. Este endpoint confirma la acción.
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(typeof(MensajeResponse), 200)]
    public IActionResult Logout() =>
        Ok(new MensajeResponse
        {
            Mensaje = "Sesión cerrada. Elimina el token del lado del cliente."
        });
}
