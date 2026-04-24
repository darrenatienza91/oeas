using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Features.Exams.ExamAttempts;
using api.Helpers;
using api.Models;

namespace api.Features.ExamAttempts
{
  public record ExamAttemptQuestionDto(int Id, string QuestionText, string ExamAttemptAnswerText);

  public record ExamAttemptResultDto(
    ExamAttemptCheckingStatus CheckingStatus,
    ExamAttemptResult Result,
    double Percentage,
    double TotalPossible,
    double TotalAcquired
  );

  public record SetAnswerDto(string AnswerText);

  public record RecordingUploadDto(string SessionId, string FileName, int TotalChunks);

  public record ExamAttemptPatchDto(bool IsAttemptSubmitted);

  public record ExamAttemptListDto(
    int Id,
    string FullName,
    string Department,
    string Section,
    double FinalScore,
    bool HasRecording
  );

  public record ExamAttemptAnswerListDto(int Id, string Question, int Score);

  public record ExamAttemptAnswerDetailDto(
    int Id,
    string Question,
    string Answer,
    string CorrectAnswer,
    int MaxPoints,
    int AcquiredPoints
  );

  public record ExamAttemptAnswerPatchDto(int AcquiredPoints);

  public static class ExamAttemptMapper
  {
    public static ExamAttemptQuestionDto MapToExamAttemptQuestionDto(this Question question)
    {
      return new(question.Id, question.Description, "");
    }

    internal static void ApplyPatch(
      ExamAttempt examAttempt,
      ExamAttemptPatchDto dto,
      HashSet<string> modified
    )
    {
      new PatchBuilder<ExamAttemptPatchDto>(dto, modified).Map(
        nameof(dto.IsAttemptSubmitted),
        x => x.IsAttemptSubmitted,
        value => examAttempt.IsAttemptSubmitted = value
      );
    }

    internal static void ApplyPatchToAnswer(
      ExamAttemptAnswer examAttemptAnswer,
      ExamAttemptAnswerPatchDto dto,
      HashSet<string> modified
    )
    {
      new PatchBuilder<ExamAttemptAnswerPatchDto>(dto, modified).Map(
        nameof(dto.AcquiredPoints),
        x => x.AcquiredPoints,
        value => examAttemptAnswer.AcquiredPoints = value
      );
    }
  }
}
