using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api.Models
{
  public class Question : BaseEntity<int>
  {
    public string Description { get; set; } = null!;
    public string CorrectAnswer { get; set; } = null!;
    public int Points { get; set; }
    public int ExamId { get; set; }

    // Navigation
    public Exam Exam { get; set; } = null!;
    public ICollection<Answer> Answers { get; set; } = [];
    public ICollection<ExamTakerAnswer> ExamTakerAnswers { get; set; } = [];
  }

  public class QuestionConfiguration : IEntityTypeConfiguration<Question>
  {
    public void Configure(EntityTypeBuilder<Question> entity)
    {
      entity.ToTable("Questions");

      entity.HasKey(q => q.Id);

      entity.Property(q => q.Description).IsRequired();

      entity.Property(q => q.Points).IsRequired();

      entity.Property(q => q.ExamId).IsRequired();

      entity
        .HasOne(q => q.Exam)
        .WithMany(e => e.Questions)
        .HasForeignKey(q => q.ExamId)
        .OnDelete(DeleteBehavior.Restrict);
    }
  }
}
