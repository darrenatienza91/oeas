using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Contracts
{
  public record QuestionWriteDto(
    string Description,
    string CorrectAnswer,
    int Points,
    int Duration,
    int ExamId
  );

  public record ReadQuestionDto(int Id, string Description, int Points, string CorrectAnswer);

  public record AddQuestionDto(
    string Description,
    string CorrectAnswer,
    int Points,
    int Duration,
    int ExamId
  ) : QuestionWriteDto(Description, CorrectAnswer, Points, Duration, ExamId);

  public record EditQuestionDto(
    string Name,
    string Subject,
    DateTimeOffset StartOn,
    int Duration,
    int SectionId,
    string Instructions,
    bool IsActive
  ) : ExamWriteDto(Name, Subject, StartOn, Duration, SectionId, Instructions, IsActive);

  public static class QuestionMapper
  {
    public static ReadQuestionDto MapToReadQuestionDto(Question question) =>
      new(question.Id, question.Description, question.Points, question.CorrectAnswer);

    public static Question MapToQuestion(QuestionWriteDto dto)
    {
      var exam = new Question
      {
        Description = dto.Description,
        CorrectAnswer = dto.CorrectAnswer,
        ExamId = dto.ExamId,
        Points = dto.Points,
      };

      return exam;
    }

    // public static void MapToExistingExam(QuestionWriteDto dto, Question exam)
    // {
    //   exam.Name = dto.Name;
    //   exam.StartOn = dto.StartOn;
    //   exam.Duration = dto.Duration;
    //   exam.SectionId = dto.SectionId;
    //   exam.IsActive = dto.IsActive;
    //   exam.Subject = dto.Subject;
    //   exam.Instructions = dto.Instructions;
    // }
  }
}
