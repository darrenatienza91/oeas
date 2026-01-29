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
    public string QuestionText { get; set; } = null!;
    public string CorrectAnswer { get; set; } = null!;
    public int MaxPoints { get; set; }
    public int ExamId { get; set; }

    // Navigation
    public Exam Exam { get; set; } = null!;
    public ICollection<ExamAnswer> ExamAnswers { get; set; } = [];
  }

  public class QuestionConfiguration : IEntityTypeConfiguration<Question>
  {
    public void Configure(EntityTypeBuilder<Question> entity)
    {
      entity.ToTable("questions");

      entity.HasKey(q => q.Id);

      entity.Property(q => q.Id).HasColumnName("id").ValueGeneratedOnAdd();

      entity
        .Property(q => q.QuestionText)
        .HasColumnName("question")
        .HasColumnType("text")
        .UseCollation("utf8mb4_0900_ai_ci")
        .IsRequired();

      entity
        .Property(q => q.CorrectAnswer)
        .HasColumnName("correctAnswer")
        .HasColumnType("text")
        .UseCollation("utf8mb4_0900_ai_ci")
        .IsRequired();

      entity.Property(q => q.MaxPoints).HasColumnName("maxpoints").IsRequired();

      entity.Property(q => q.ExamId).HasColumnName("examId").IsRequired();

      entity.HasIndex(q => q.ExamId).HasDatabaseName("questions_FK");

      entity
        .HasOne(q => q.Exam)
        .WithMany(e => e.Questions)
        .HasForeignKey(q => q.ExamId)
        .OnDelete(DeleteBehavior.Restrict);
    }
  }
}
