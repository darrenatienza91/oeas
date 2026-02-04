using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Contracts
{
  public record ExamWriteDto(
    string Name,
    string Subject,
    DateTimeOffset StartOn,
    int Duration,
    int SectionId,
    string Instructions,
    bool IsActive
  );

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
  ) : ExamWriteDto(Name, Subject, StartOn, Duration, SectionId, Instructions, IsActive);

  public record EditExamDto(
    string Name,
    string Subject,
    DateTimeOffset StartOn,
    int Duration,
    int SectionId,
    string Instructions,
    bool IsActive
  ) : ExamWriteDto(Name, Subject, StartOn, Duration, SectionId, Instructions, IsActive);

  public static class ExamMapper
  {
    public static ExamDto MapToExamDto(Exam exam) =>
      new(
        exam.Id,
        exam.Name,
        exam.StartOn,
        exam.Duration,
        exam.IsActive,
        exam.Subject,
        exam.Instructions,
        exam.SectionId
      );

    public static Exam MapToExam(ExamWriteDto dto, int userDetailId)
    {
      var exam = new Exam
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

    public static void MapToExistingExam(ExamWriteDto dto, Exam exam)
    {
      exam.Name = dto.Name;
      exam.StartOn = dto.StartOn;
      exam.Duration = dto.Duration;
      exam.SectionId = dto.SectionId;
      exam.IsActive = dto.IsActive;
      exam.Subject = dto.Subject;
      exam.Instructions = dto.Instructions;
    }
  }
}
