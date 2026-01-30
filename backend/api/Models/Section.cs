using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api.Models
{
  public class Section : BaseEntity<int>
  {
    public string Name { get; set; }
    public Department Department { get; set; }
    public int DepartmentId { get; set; }

    // Navigation
    public ICollection<Exam> Exams { get; set; } = new List<Exam>();
  }

  public class SectionConfiguration : IEntityTypeConfiguration<Section>
  {
    public void Configure(EntityTypeBuilder<Section> entity)
    {
      entity.ToTable("Sections");

      entity.HasKey(e => e.Id);

      entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();

      entity
        .HasOne(e => e.Department)
        .WithMany(s => s.Sections)
        .HasForeignKey(e => e.DepartmentId)
        .OnDelete(DeleteBehavior.Restrict);
    }
  }
}
