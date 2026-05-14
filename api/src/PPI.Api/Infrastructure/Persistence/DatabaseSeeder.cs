using Microsoft.EntityFrameworkCore;
using PPI.Api.Domain.Entities;

namespace PPI.Api.Infrastructure.Persistence;

/// <summary>
/// Ejecuta los seeds iniciales al arrancar.
/// Todos los métodos son idempotentes: verifican existencia antes de insertar.
/// </summary>
public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await SeedProgramasAsync(context);
        await SeedAdminAsync(context);
    }

    private static async Task SeedProgramasAsync(AppDbContext context)
    {
        if (await context.Programas.AnyAsync())
            return;

        var sqlPath = Path.Combine(
            AppContext.BaseDirectory,
            "Infrastructure", "Persistence", "Migrations",
            "seed_ppi_2026_I.sql"
        );

        if (!File.Exists(sqlPath))
            throw new FileNotFoundException(
                $"Archivo de seed no encontrado: {sqlPath}");

        var sql = await File.ReadAllTextAsync(sqlPath);
        await context.Database.ExecuteSqlRawAsync(sql);
    }

    private static async Task SeedAdminAsync(AppDbContext context)
    {
        const string correoAdmin = "adminpracticas@unimagdalena.edu.co";

        if (await context.Admins.AnyAsync(a => a.Correo == correoAdmin))
            return;

        context.Admins.Add(new Admin
        {
            Id            = Guid.Parse("a1b2c3d4-0000-0000-0000-000000000001"),
            NombreCompleto = "Administrador PPI",
            Correo        = correoAdmin,
            // Hash bcrypt rounds=10 de "adminpracticas"
            PasswordHash  = "$2a$10$chX510pCqGC7sH5f1erg1uLMFUFHnOTy3rlq41cpW93II4.5naaU2",
            CreadoEn      = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        });

        await context.SaveChangesAsync();
    }
}
