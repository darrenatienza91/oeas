using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api.Models
{
  public class ExamTakerAnswer : BaseEntity<int>
  {
    public int? AnswerId { get; set; }
    public int ExamTakerId { get; set; }
    public int QuestionId { get; set; }
    public string AnswerText { get; set; }
    public ExamTaker ExamTaker { get; set; }
    public Question Question { get; set; }
    public Answer Answer { get; set; }
    public DateTime CreateDate { get; set; }
  }

  public class ExamTakerAnswerConfiguration : IEntityTypeConfiguration<ExamTakerAnswer>
  {
    public void Configure(EntityTypeBuilder<ExamTakerAnswer> entity)
    {
      entity.ToTable("ExamTakerAnswers");

      entity.HasKey(e => e.Id);

      entity.Property(e => e.AnswerId).IsRequired(false);

      entity
        .HasOne(e => e.ExamTaker)
        .WithMany(s => s.ExamTakerAnswers)
        .HasForeignKey(e => e.ExamTakerId)
        .OnDelete(DeleteBehavior.Restrict);

      entity
        .HasOne(e => e.Question)
        .WithMany(s => s.ExamTakerAnswers)
        .HasForeignKey(e => e.QuestionId)
        .OnDelete(DeleteBehavior.Restrict);

      entity
        .HasOne(e => e.Answer)
        .WithMany(s => s.ExamTakerAnswers)
        .HasForeignKey(e => e.AnswerId)
        .OnDelete(DeleteBehavior.SetNull);
    }
  }
}
