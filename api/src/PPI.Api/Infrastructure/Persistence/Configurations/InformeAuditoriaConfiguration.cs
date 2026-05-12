using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PPI.Api.Domain.Entities;

namespace PPI.Api.Infrastructure.Persistence.Configurations;

public class InformeAuditoriaConfiguration : IEntityTypeConfiguration<InformeAuditoria>
{
    public void Configure(EntityTypeBuilder<InformeAuditoria> b)
    {
        b.ToTable("informe_auditorias");
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).ValueGeneratedOnAdd();
        b.Property(x => x.EstadoAnterior).IsRequired().HasMaxLength(50);
        b.Property(x => x.EstadoNuevo).IsRequired().HasMaxLength(50);
        b.Property(x => x.Observacion).HasMaxLength(1000);

        b.HasOne(x => x.Informe)
            .WithMany(i => i.Auditorias)
            .HasForeignKey(x => x.InformeId)
            .OnDelete(DeleteBehavior.Cascade);

        b.HasOne(x => x.Admin)
            .WithMany(a => a.Auditorias)
            .HasForeignKey(x => x.AdminId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
