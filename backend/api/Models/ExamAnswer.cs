using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api.Models
{
  public class ExamAnswer : BaseEntity<int>
  {
    public required UserDetail UserDetail { get; set; }
    public int UserDetailId { get; set; }
    public int Points { get; set; }
    public bool IsCorrect { get; set; }
    public int ExamId { get; set; }
    public int QuestionId { get; set; }
    public Question Question { get; set; } = null!;
  }

  public class ExamAnswerConfiguration : IEntityTypeConfiguration<ExamAnswer>
  {
    public void Configure(EntityTypeBuilder<ExamAnswer> entity)
    {
      entity.ToTable("ExamAnswers");

      entity.HasKey(e => e.Id);

      entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();

      entity
        .HasOne(e => e.Question)
        .WithMany(s => s.ExamAnswers)
        .HasForeignKey(e => e.QuestionId)
        .OnDelete(DeleteBehavior.Restrict);
    }
  }
}
