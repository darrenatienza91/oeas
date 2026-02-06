using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Contracts
{
  public record QuestionWriteDto(string Description, string CorrectAnswer, int Points, int ExamId);

  public record ReadQuestionDto(
    int Id,
    string Description,
    int Points,
    string CorrectAnswer,
    int ExamId
  );

  public record AddQuestionDto(string Description, string CorrectAnswer, int Points, int ExamId)
    : QuestionWriteDto(Description, CorrectAnswer, Points, ExamId);

  public record EditQuestionDto(string CorrectAnswer, string Description, int Points, int ExamId)
    : QuestionWriteDto(Description, CorrectAnswer, Points, ExamId);

  public static class QuestionMapper
  {
    public static ReadQuestionDto MapToReadQuestionDto(Question question) =>
      new(
        question.Id,
        question.Description,
        question.Points,
        question.CorrectAnswer,
        question.ExamId
      );

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

    public static void MapToExistingQuestion(QuestionWriteDto dto, Question exam)
    {
      exam.CorrectAnswer = dto.CorrectAnswer;
      exam.Description = dto.Description;
      exam.Points = dto.Points;
    }
  }
}
