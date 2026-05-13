namespace PPI.Api.Application.Auth;

public interface IPasswordService
{
    string Hashear(string password);
    bool Verificar(string password, string hash);
    string PasswordInicialDesdeCorreo(string correo);
}

public class PasswordService : IPasswordService
{
    public string Hashear(string password) =>
        BCrypt.Net.BCrypt.HashPassword(password, workFactor: 10);

    public bool Verificar(string password, string hash) =>
        BCrypt.Net.BCrypt.Verify(password, hash);

    /// <summary>
    /// Contraseña inicial de un docente = parte antes del @ de su correo.
    /// Ejemplo: "eerojas@unimagdalena.edu.co" → "eerojas"
    /// </summary>
    public string PasswordInicialDesdeCorreo(string correo) =>
        correo.Split('@')[0];
}
