using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Features.Exams.ExamAttempts;
using api.Models;

namespace api.Features.ExamAttempts
{
  public record ExamAttemptQuestionDto(int Id, string QuestionText, string ExamTakerAnswerText);
  public record ExamAttemptResultDto(
    ExamAttemptCheckingStatus CheckingStatus,
    ExamAttemptResult Result,
    double Percentage,
    double TotalPossible,
    double TotalAcquired
  );

  public record SetAnswerDto(string AnswerText);

  public record RecordingUploadDto(string SessionId, string FileName, int TotalChunks);

  public static class ExamAttemptMapper
  {
    public static ExamAttemptQuestionDto MapToExamAttemptQuestionDto(this Question question)
    {
      return new(question.Id, question.Description, "");
    }
  }
}
