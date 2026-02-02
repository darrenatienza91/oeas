using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Contracts
{
  public record ExamDto(
    int Id,
    string Name,
    DateTimeOffset StartOn,
    int Duration,
    bool IsActive,
    string Subject,
    string Instructions,
    int SectionId
  );

  public record AddExamDto(
    string Name,
    string Subject,
    DateTimeOffset StartOn,
    int Duration,
    int SectionId,
    string Instructions,
    bool IsActive
  );

  public static class ExamMapper
  {
    public static ExamDto MapToExamDto(Exam exam)
    {
      return new(
        Id: exam.Id,
        Name: exam.Name,
        StartOn: exam.StartOn,
        Duration: exam.Duration,
        IsActive: exam.IsActive,
        Subject: exam.Subject,
        Instructions: exam.Instructions,
        SectionId: exam.SectionId
      );
    }

    public static Exam MapToExam(AddExamDto dto, int userDetailId)
    {
      Exam exam = new()
      {
        Name = dto.Name,
        StartOn = dto.StartOn,
        Duration = dto.Duration,
        SectionId = dto.SectionId,
        IsActive = dto.IsActive,
        Subject = dto.Subject,
        Instructions = dto.Instructions,
      };

      exam.SetUserDetailId(userDetailId);

      return exam;
    }
  }
}
