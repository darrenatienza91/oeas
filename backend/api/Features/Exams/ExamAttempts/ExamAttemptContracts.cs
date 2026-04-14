using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Features.Exams.ExamAttempts;
using api.Helpers;
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

  public record ExamTakerPatchDto(bool IsAttemptSubmitted);

  public static class ExamAttemptMapper
  {
    public static ExamAttemptQuestionDto MapToExamAttemptQuestionDto(this Question question)
    {
      return new(question.Id, question.Description, "");
    }

    internal static void ApplyPatch(
      ExamTaker examTaker,
      ExamTakerPatchDto dto,
      HashSet<string> modified
    )
    {
      new PatchBuilder<ExamTakerPatchDto>(dto, modified).Map(
        nameof(dto.IsAttemptSubmitted),
        x => x.IsAttemptSubmitted,
        value => examTaker.IsAttemptSubmitted = value
      );
    }
  }
}
