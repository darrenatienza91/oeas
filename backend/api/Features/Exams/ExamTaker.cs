using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api.Models
{
  public class ExamTaker : BaseEntity<int>, IUserOwned, IHasCreateDate
  {
    public int UserDetailId { get; set; }
    public int ExamId { get; set; }
    public string RecUrl { get; set; }
    public UserDetail UserDetail { get; set; }
    public Exam Exam { get; set; }
    public ICollection<ExamTakerAnswer> ExamTakerAnswers { get; set; } = [];
    public DateTimeOffset CreateDate { get; set; }
    public int CurrentQuestionIndex { get; set; }
  }

  public class ExamTakerConfiguration : IEntityTypeConfiguration<ExamTaker>
  {
    public void Configure(EntityTypeBuilder<ExamTaker> entity)
    {
      entity.ToTable("ExamTakers");

      entity.HasKey(e => e.Id);

      entity
        .HasOne(e => e.Exam)
        .WithMany(s => s.ExamTakers)
        .HasForeignKey(e => e.ExamId)
        .OnDelete(DeleteBehavior.Restrict);

      entity
        .HasOne(e => e.UserDetail)
        .WithMany(s => s.ExamTakers)
        .HasForeignKey(e => e.UserDetailId)
        .OnDelete(DeleteBehavior.Restrict);
    }
  }
}
