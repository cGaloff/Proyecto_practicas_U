using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PPI.Api.Domain.Entities;

namespace PPI.Api.Infrastructure.Persistence.Configurations;

public class DocenteConfiguration : IEntityTypeConfiguration<Docente>
{
    public void Configure(EntityTypeBuilder<Docente> b)
    {
        b.ToTable("docentes");
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).ValueGeneratedOnAdd();
        b.Property(x => x.NombreCompleto).IsRequired().HasMaxLength(200);
        b.Property(x => x.Correo).IsRequired().HasMaxLength(150);
        b.HasIndex(x => x.Correo).IsUnique();
        b.Property(x => x.PasswordHash).IsRequired();
        b.Property(x => x.PrimerLogin).HasDefaultValue(true);
        b.Property(x => x.EsAuxiliar).HasDefaultValue(false);

        b.HasOne(x => x.Programa)
            .WithMany(p => p.Docentes)
            .HasForeignKey(x => x.ProgramaId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
