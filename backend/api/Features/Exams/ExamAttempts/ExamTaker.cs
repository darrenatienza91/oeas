using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Features.Exams.ExamAttempts;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api.Models
{
  public class ExamAttempt : BaseEntity<int>, IUserOwned, IHasCreateDate
  {
    public int UserDetailId { get; set; }
    public int ExamId { get; set; }
    public string RecUrl { get; set; }
    public UserDetail UserDetail { get; set; }
    public Exam Exam { get; set; }
    public ICollection<ExamAttemptAnswer> ExamAttemptAnswers { get; set; } = [];
    public DateTimeOffset CreateDate { get; set; }
    public int CurrentQuestionIndex { get; set; }
    public ExamAttemptCheckingStatus CheckingStatus { get; set; }
    public bool IsAttemptSubmitted { get; set; }
    public double FinalScore { get; set; }
    public bool HasRecording
    {
      get => !string.IsNullOrEmpty(RecUrl);
    }
  }

  public class ExamAttemptConfiguration : IEntityTypeConfiguration<ExamAttempt>
  {
    public void Configure(EntityTypeBuilder<ExamAttempt> entity)
    {
      entity.ToTable("ExamAttempts");

      entity.HasKey(e => e.Id);

      entity
        .HasOne(e => e.Exam)
        .WithMany(s => s.ExamAttempts)
        .HasForeignKey(e => e.ExamId)
        .OnDelete(DeleteBehavior.Restrict);

      entity
        .HasOne(e => e.UserDetail)
        .WithMany(s => s.ExamAttempts)
        .HasForeignKey(e => e.UserDetailId)
        .OnDelete(DeleteBehavior.Restrict);
    }
  }
}
