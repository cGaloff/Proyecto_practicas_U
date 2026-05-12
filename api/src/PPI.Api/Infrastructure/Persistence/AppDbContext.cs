using Microsoft.EntityFrameworkCore;
using PPI.Api.Domain.Entities;

namespace PPI.Api.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Programa> Programas => Set<Programa>();
    public DbSet<Docente> Docentes => Set<Docente>();
    public DbSet<Admin> Admins => Set<Admin>();
    public DbSet<GrupoAsignado> GruposAsignados => Set<GrupoAsignado>();
    public DbSet<Informe> Informes => Set<Informe>();
    public DbSet<EntradaInforme> EntradasInforme => Set<EntradaInforme>();
    public DbSet<InformeAuditoria> InformeAuditorias => Set<InformeAuditoria>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
