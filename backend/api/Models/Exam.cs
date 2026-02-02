using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api.Models
{
  public class Exam : BaseEntity<int>
  {
    public string Name { get; set; } = null!;
    public string Subject { get; set; } = null!;
    public DateTimeOffset StartOn { get; set; }
    public int Duration { get; set; }
    public int SectionId { get; set; }
    public bool IsActive { get; set; }
    public string Instructions { get; set; } = null!;
    public int? UserDetailId { get; private set; }

    // Navigation properties
    public Section Section { get; set; } = null!;
    public UserDetail? UserDetail { get; private set; }
    public ICollection<Question> Questions { get; set; } = [];
    public ICollection<ExamTaker> ExamTakers { get; set; } = [];

    public void SetUserDetailId(int? userDetailId)
    {
      if (userDetailId is null)
      {
        throw new DomainException($"{nameof(userDetailId)} is required!");
      }

      this.UserDetailId = userDetailId;
    }
  }

  public class ExamConfiguration : IEntityTypeConfiguration<Exam>
  {
    public void Configure(EntityTypeBuilder<Exam> entity)
    {
      entity.ToTable("Exams");

      entity.HasKey(e => e.Id);

      entity.Property(e => e.Name).HasMaxLength(255).IsRequired();

      entity.Property(e => e.Subject).HasMaxLength(255).IsRequired();

      entity
        .Property(e => e.StartOn)
        .HasConversion(v => v.UtcDateTime.ToString("O"), v => DateTimeOffset.Parse(v))
        .HasColumnType("TEXT")
        .IsRequired();

      entity.Property(e => e.Duration).IsRequired();

      entity.Property(e => e.IsActive).IsRequired();

      entity.Property(e => e.Instructions).HasMaxLength(1000).IsRequired();

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
