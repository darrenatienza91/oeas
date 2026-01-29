using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api.Models
{
  public class Exam : BaseEntity<int>
  {
    public string Name { get; set; } = null!;
    public string Subject { get; set; } = null!;
    public DateTime StartOn { get; set; }
    public int Duration { get; set; }
    public int SectionId { get; set; }
    public bool IsActive { get; set; }
    public string Instructions { get; set; } = null!;
    public int? UserDetailId { get; set; }

    // Navigation properties
    public Section Section { get; set; } = null!;
    public UserDetail? UserDetail { get; set; }
    public ICollection<Question> Questions { get; set; } = new List<Question>();
    public ICollection<ExamTaker> ExamTakers { get; set; } = new List<ExamTaker>();
  }

  public class ExamConfiguration : IEntityTypeConfiguration<Exam>
  {
    public void Configure(EntityTypeBuilder<Exam> entity)
    {
      entity.ToTable("exams");

      entity.HasKey(e => e.Id);

      entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();

      entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(255).IsRequired();

      entity.Property(e => e.Subject).HasColumnName("subject").HasMaxLength(255).IsRequired();

      entity
        .Property(e => e.StartOn)
        .HasColumnName("startOn")
        .HasColumnType("datetime")
        .IsRequired();

      entity.Property(e => e.Duration).HasColumnName("duration").IsRequired();

      entity.Property(e => e.SectionId).HasColumnName("sectionId").IsRequired();

      entity
        .Property(e => e.IsActive)
        .HasColumnName("isActive")
        .HasColumnType("tinyint(1)")
        .IsRequired();

      entity
        .Property(e => e.Instructions)
        .HasColumnName("instructions")
        .HasColumnType("text")
        .UseCollation("utf8mb4_0900_ai_ci")
        .IsRequired();

      entity.Property(e => e.UserDetailId).HasColumnName("userDetailId");

      // Relationships
      entity
        .HasOne(e => e.Section)
        .WithMany(s => s.Exams)
        .HasForeignKey(e => e.SectionId)
        .OnDelete(DeleteBehavior.Restrict);

      entity
        .HasOne(e => e.UserDetail)
        .WithMany(u => u.Exams)
        .HasForeignKey(e => e.UserDetailId)
        .OnDelete(DeleteBehavior.SetNull);
    }
  }
}
