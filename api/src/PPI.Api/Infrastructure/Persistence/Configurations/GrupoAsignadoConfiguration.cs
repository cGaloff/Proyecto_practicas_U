using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PPI.Api.Domain.Entities;

namespace PPI.Api.Infrastructure.Persistence.Configurations;

public class GrupoAsignadoConfiguration : IEntityTypeConfiguration<GrupoAsignado>
{
    public void Configure(EntityTypeBuilder<GrupoAsignado> b)
    {
        b.ToTable("grupos_asignados");
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).ValueGeneratedOnAdd();
        b.Property(x => x.Practica).IsRequired().HasMaxLength(10);
        b.Property(x => x.NumeroGrupo).IsRequired();
        b.Property(x => x.Matriculados).IsRequired();
        b.Property(x => x.Semestre).IsRequired().HasMaxLength(10);
        b.Property(x => x.Anio).IsRequired();

        b.HasIndex(x => new { x.DocenteId, x.Practica, x.NumeroGrupo, x.Semestre, x.Anio })
            .IsUnique();

        b.HasOne(x => x.Docente)
            .WithMany(d => d.GruposAsignados)
            .HasForeignKey(x => x.DocenteId)
            .OnDelete(DeleteBehavior.Restrict);

        b.HasOne(x => x.Programa)
            .WithMany(p => p.GruposAsignados)
            .HasForeignKey(x => x.ProgramaId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
