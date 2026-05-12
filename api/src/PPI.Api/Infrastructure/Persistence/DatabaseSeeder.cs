using Microsoft.EntityFrameworkCore;

namespace PPI.Api.Infrastructure.Persistence;

/// <summary>
/// Ejecuta el seed SQL inicial si la tabla programas está vacía.
/// Idempotente: si los datos ya existen, no hace nada.
/// </summary>
public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Solo seedea si la tabla programas está vacía
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
}
