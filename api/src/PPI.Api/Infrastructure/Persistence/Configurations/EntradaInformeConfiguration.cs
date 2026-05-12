using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PPI.Api.Domain.Entities;
using PPI.Api.Domain.Enums;

namespace PPI.Api.Infrastructure.Persistence.Configurations;

public class EntradaInformeConfiguration : IEntityTypeConfiguration<EntradaInforme>
{
    public void Configure(EntityTypeBuilder<EntradaInforme> b)
    {
        b.ToTable("entradas_informe");
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).ValueGeneratedOnAdd();

        b.Property(x => x.Estado)
            .HasConversion<string>()
            .HasDefaultValue(EstadoEntrada.SinIniciar);

        b.Property(x => x.EnlaceEvidencias).HasMaxLength(500);
        b.Property(x => x.FirmaDigital).HasMaxLength(200);
        b.Property(x => x.ObservacionAdmin).HasMaxLength(1000);

        b.OwnsOne(x => x.Seccion2B,  nav => { nav.ToJson(); });
        b.OwnsOne(x => x.Seccion3,   nav => { nav.ToJson(); });
        b.OwnsOne(x => x.Seccion4A,  nav => {
            nav.ToJson();
            nav.OwnsOne(x => x.SalidasCampo);
            nav.OwnsOne(x => x.EventosAcademicos);
            nav.OwnsOne(x => x.ClasesEspejo);
        });
        b.OwnsOne(x => x.Seccion4B,  nav => { nav.ToJson(); });
        b.OwnsOne(x => x.Seccion5A,  nav => { nav.ToJson(); });
        b.OwnsOne(x => x.Seccion5B,  nav => { nav.ToJson(); });

        b.HasIndex(x => x.GrupoAsignadoId).IsUnique();

        b.HasOne(x => x.Informe)
            .WithMany(i => i.Entradas)
            .HasForeignKey(x => x.InformeId)
            .OnDelete(DeleteBehavior.Cascade);

        b.HasOne(x => x.GrupoAsignado)
            .WithOne(g => g.EntradaInforme)
            .HasForeignKey<EntradaInforme>(x => x.GrupoAsignadoId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
