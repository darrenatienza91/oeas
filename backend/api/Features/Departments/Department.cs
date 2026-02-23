using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api.Models;

public class Department : BaseEntity<int>
{
  public string Name { get; set; } = string.Empty;

  public ICollection<Section> Sections { get; set; } = [];
  public ICollection<UserDetail> UserDetails { get; set; } = [];
}

public class DepartmentConfiguration : IEntityTypeConfiguration<Department>
{
  public void Configure(EntityTypeBuilder<Department> entity)
  {
    entity.ToTable("Departments");

    entity.HasKey(e => e.Id);

    entity.Property(e => e.Name).HasMaxLength(255).IsRequired();
  }
}
