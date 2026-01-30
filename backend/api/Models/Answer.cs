using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api.Models
{
  public class Answer : BaseEntity<int>
  {
    public int Points { get; set; }
    public bool IsCorrect { get; set; }
    public int QuestionId { get; set; }
    public Question Question { get; set; } = null!;
    public ICollection<ExamTakerAnswer> ExamTakerAnswers { get; set; } = [];
  }

  public class AnswerConfiguration : IEntityTypeConfiguration<Answer>
  {
    public void Configure(EntityTypeBuilder<Answer> entity)
    {
      entity.ToTable("Answers");

      entity.HasKey(e => e.Id);
      entity.HasKey(e => e.Id);
      entity
        .HasOne(e => e.Question)
        .WithMany(s => s.Answers)
        .HasForeignKey(e => e.QuestionId)
        .OnDelete(DeleteBehavior.Restrict);
    }
  }
}
