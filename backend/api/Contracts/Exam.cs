using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Contracts
{
  public record ExamDto(int Id, string Name, DateTimeOffset Schedule, int Duration, bool IsActive);

  public record AddExamDto(
    string Name,
    string Subject,
    DateTimeOffset StartOn,
    int Duration,
    int SectionId,
    string Instruction
  );

  public static class ExamMapper
  {
    public static ExamDto MapToExamDto(Exam exam)
    {
      return new(
        Id: exam.Id,
        Name: exam.Name,
        Schedule: exam.StartOn,
        Duration: exam.Duration,
        IsActive: exam.IsActive
      );
    }

    public static Exam MapToExam(AddExamDto dto)
    {
      return new()
      {
        Name = dto.Name,
        StartOn = dto.StartOn,
        Duration = dto.Duration,
        SectionId = dto.SectionId,
      };
    }
  }
}
