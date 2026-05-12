using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PPI.Api.Domain.Entities;

namespace PPI.Api.Infrastructure.Persistence.Configurations;

public class ProgramaConfiguration : IEntityTypeConfiguration<Programa>
{
    public void Configure(EntityTypeBuilder<Programa> b)
    {
        b.ToTable("programas");
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).ValueGeneratedOnAdd();
        b.Property(x => x.Nombre).IsRequired().HasMaxLength(200);
        b.Property(x => x.Codigo).IsRequired().HasMaxLength(20);
        b.HasIndex(x => x.Codigo).IsUnique();
    }
}
