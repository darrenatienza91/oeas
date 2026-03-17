using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Features.ExamAttempts
{
  public record ExamAttemptQuestionDto(int Id, string QuestionText, string ExamTakerAnswerText);

  public record SetAnswerDto(string AnswerText);

  public static class ExamAttemptMapper
  {
    public static ExamAttemptQuestionDto MapToExamAttemptQuestionDto(this Question question)
    {
      return new(question.Id, question.Description, "");
    }
  }
}
