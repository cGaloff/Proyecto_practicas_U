using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PPI.Api.Domain.Entities;

namespace PPI.Api.Infrastructure.Persistence.Configurations;

public class AdminConfiguration : IEntityTypeConfiguration<Admin>
{
    public void Configure(EntityTypeBuilder<Admin> b)
    {
        b.ToTable("admins");
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).ValueGeneratedOnAdd();
        b.Property(x => x.NombreCompleto).IsRequired().HasMaxLength(200);
        b.Property(x => x.Correo).IsRequired().HasMaxLength(150);
        b.HasIndex(x => x.Correo).IsUnique();
        b.Property(x => x.PasswordHash).IsRequired();
    }
}
