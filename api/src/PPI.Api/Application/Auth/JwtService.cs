using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace PPI.Api.Application.Auth;

public interface IJwtService
{
    string GenerarToken(Guid docenteId, string correo, string rol, bool primerLogin);
    ClaimsPrincipal? ValidarToken(string token);
}

public class JwtService(IOptions<JwtSettings> opts) : IJwtService
{
    private readonly JwtSettings _cfg = opts.Value;

    public string GenerarToken(Guid docenteId, string correo, string rol, bool primerLogin)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_cfg.Secret));

        var creds = new SigningCredentials(
            key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, docenteId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, correo),
            new Claim(ClaimTypes.Role, rol),
            new Claim("primer_login", primerLogin.ToString().ToLower()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var token = new JwtSecurityToken(
            issuer: _cfg.Issuer,
            audience: _cfg.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_cfg.ExpiryMinutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public ClaimsPrincipal? ValidarToken(string token)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_cfg.Secret));

        try
        {
            var principal = new JwtSecurityTokenHandler().ValidateToken(
                token,
                new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = true,
                    ValidIssuer = _cfg.Issuer,
                    ValidateAudience = true,
                    ValidAudience = _cfg.Audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                },
                out _);

            return principal;
        }
        catch
        {
            return null;
        }
    }
}
