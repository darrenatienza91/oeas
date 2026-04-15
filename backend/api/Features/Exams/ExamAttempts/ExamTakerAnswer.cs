using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api.Models
{
  public class ExamAttemptAnswer : BaseEntity<int>, IHasCreateDate
  {
    public int? AnswerId { get; set; }
    public int ExamAttemptId { get; set; }
    public int QuestionId { get; set; }
    public int AcquiredPoints { get; set; }
    public string AnswerText { get; set; } = "";
    public ExamAttempt ExamAttempt { get; set; }
    public Question Question { get; set; }
    public Answer Answer { get; set; }
    public DateTimeOffset CreateDate { get; set; }
  }

  public class ExamAttemptAnswerConfiguration : IEntityTypeConfiguration<ExamAttemptAnswer>
  {
    public void Configure(EntityTypeBuilder<ExamAttemptAnswer> entity)
    {
      entity.ToTable("ExamAttemptAnswers");

      entity.HasKey(e => e.Id);

      entity.Property(e => e.AnswerId).IsRequired(false);

      entity
        .HasOne(e => e.ExamAttempt)
        .WithMany(s => s.ExamAttemptAnswers)
        .HasForeignKey(e => e.ExamAttemptId)
        .OnDelete(DeleteBehavior.Restrict);

      entity
        .HasOne(e => e.Question)
        .WithMany(s => s.ExamAttemptAnswers)
        .HasForeignKey(e => e.QuestionId)
        .OnDelete(DeleteBehavior.Restrict);

      entity
        .HasOne(e => e.Answer)
        .WithMany(s => s.ExamAttemptAnswers)
        .HasForeignKey(e => e.AnswerId)
        .OnDelete(DeleteBehavior.SetNull);
    }
  }
}
