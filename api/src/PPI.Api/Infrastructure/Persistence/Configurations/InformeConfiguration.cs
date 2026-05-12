using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PPI.Api.Domain.Entities;
using PPI.Api.Domain.Enums;

namespace PPI.Api.Infrastructure.Persistence.Configurations;

public class InformeConfiguration : IEntityTypeConfiguration<Informe>
{
    public void Configure(EntityTypeBuilder<Informe> b)
    {
        b.ToTable("informes");
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).ValueGeneratedOnAdd();
        b.Property(x => x.Semestre).IsRequired().HasMaxLength(10);
        b.Property(x => x.Anio).IsRequired();
        b.Property(x => x.CoordinadorNombre).IsRequired().HasMaxLength(200);

        b.Property(x => x.Estado)
            .HasConversion<string>()
            .HasDefaultValue(EstadoInforme.Pendiente);

        b.HasIndex(x => new { x.ProgramaId, x.Semestre, x.Anio }).IsUnique();

        b.HasOne(x => x.Programa)
            .WithMany(p => p.Informes)
            .HasForeignKey(x => x.ProgramaId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
