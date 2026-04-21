using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Exceptions;
using api.Features.Exams;
using api.Helpers;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace api.Features.ExamAttempts
{
  public static class ExamAttemptEndpoints
  {
    public static void MapExamAttemptEndpoints(this IEndpointRouteBuilder app)
    {
      app.MapPatch("/exam-attempts/{id}", Edit)
        .RequireAuthorization(policy =>
          policy.RequireRole(Roles.Student, Roles.Teacher, Roles.SuperAdmin)
        );

      app.MapGet("/exam-attempts/{attemptId}/questions/{questionId}", GetExamAttemptQuestion)
        .RequireAuthorization(policy =>
          policy.RequireRole(Roles.Student, Roles.Teacher, Roles.SuperAdmin)
        );

      app.MapGet("/exam-attempts/{attemptId}/current-question", GetCurrentExamAttemptQuestion)
        .RequireAuthorization(policy =>
          policy.RequireRole(Roles.Student, Roles.Teacher, Roles.SuperAdmin)
        );

      app.MapPut("/exam-attempts/{attemptId}/questions/{questionId}/answer", SetAnswer)
        .RequireAuthorization(policy =>
          policy.RequireRole(Roles.Student, Roles.Teacher, Roles.SuperAdmin)
        );

      app.MapPost("/exam-attempts/{attemptId}/next-question", MoveNextQuestion)
        .RequireAuthorization(policy =>
          policy.RequireRole(Roles.Student, Roles.Teacher, Roles.SuperAdmin)
        );

      app.MapPost("/exam-attempts/{attemptId}/previous-question", MovePreviousQuestion)
        .RequireAuthorization(policy =>
          policy.RequireRole(Roles.Student, Roles.Teacher, Roles.SuperAdmin)
        );
      app.MapPost("/exam-attempts/{attemptId}/recording/init", InitializeUploadRecording)
        .RequireAuthorization(policy =>
          policy.RequireRole(Roles.Student, Roles.Teacher, Roles.SuperAdmin)
        );

      app.MapPost("/exam-attempts/{attemptId}/recording/chunk", UploadChunkRecordings)
        .RequireAuthorization(policy =>
          policy.RequireRole(Roles.Student, Roles.Teacher, Roles.SuperAdmin)
        )
        .DisableAntiforgery();

      app.MapPost("/exam-attempts/{attemptId}/recording/finalize", FinalizeRecordingUpload);

      app.MapGet("/exams/{id}/my-result", GetResult)
        .RequireAuthorization(policy =>
          policy.RequireRole(Roles.Student, Roles.Teacher, Roles.SuperAdmin)
        );

      app.MapGet("/exams/{id}/attempts", GetExamAttempts)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher));

      app.MapGet("/exam-attempts/{id}/answers", GetExamAttemptAnswers)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher));

      app.MapGet("/exam-attempts/{attemptId}/answers/{id}", GetExamAttemptAnswer)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher));

      app.MapGet("/exam-attempts/{attemptId}/recordings/{fileName}", GetExamAttemptRecording)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher));

      app.MapPatch("/exam-attempts/{attemptId}/answers/{id}", PatchExamAttemptAnswers)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher));
    }

    static async Task<IResult> GetExamAttemptRecording(
      IExamAttemptRecordingService service,
      [FromRoute] int attemptId,
      [FromRoute] string fileName,
      CancellationToken ct
    )
    {
      var (stream, contentType) = await service.GetRecordingAsync(attemptId, fileName, ct);

      return Results.File(stream, contentType, enableRangeProcessing: true);
    }

    static async Task<IResult> GetExamAttemptAnswer(
      IExamAttemptService service,
      [FromRoute] int id,
      [FromRoute] int attemptId
    )
    {
      var examAttempQuestion = await service.GetExamAttemptAnswer(id, attemptId);

      return Results.Ok(examAttempQuestion);
    }

    static async Task<IResult> PatchExamAttemptAnswers(
      HttpContext context,
      IExamAttemptService service,
      [FromRoute] int id,
      [FromRoute] int attemptId
    )
    {
      var patch = await PatchRequestReader.ReadAsync<ExamAttemptAnswerPatchDto>(context.Request);

      if (patch is null)
      {
        return Results.BadRequest();
      }

      await service.EditAnswerPointsAsync(id, attemptId, patch.Model, patch.ModifiedProperties);

      return Results.Ok();
    }

    static async Task<IResult> GetExamAttemptAnswers(
      IExamAttemptService service,
      [FromRoute] int id,
      string? criteria
    )
    {
      var examAttempQuestion = await service.GetExamAttemptAnswers(id, criteria).ToListAsync();

      return Results.Ok(examAttempQuestion);
    }

    static async Task<IResult> GetExamAttempts(
      IExamAttemptService service,
      [FromRoute] int id,
      string? criteria
    )
    {
      var examAttempQuestion = await service.GetExamAttempts(id, criteria).ToListAsync();

      return Results.Ok(examAttempQuestion);
    }

    static async Task<IResult> Edit(
      HttpContext context,
      IExamAttemptService service,
      [FromRoute] int id
    )
    {
      var patch = await PatchRequestReader.ReadAsync<ExamAttemptPatchDto>(context.Request);

      if (patch is null)
      {
        return Results.BadRequest();
      }

      await service.EditAsync(id, patch.Model, patch.ModifiedProperties);

      return Results.NoContent();
    }

    static async Task<IResult> GetResult(IExamAttemptService service, [FromRoute] int id)
    {
      var examAttempt = await service.GetResult(id);

      return Results.Ok(examAttempt);
    }

    static async Task<IResult> FinalizeRecordingUpload(
      int attemptId,
      RecordingUploadDto dto,
      IExamAttemptRecordingService service,
      CancellationToken ct
    )
    {
      var path = await service.FinalizeRecordingAsync(
        attemptId,
        dto.SessionId,
        dto.TotalChunks,
        dto.FileName,
        ct
      );

      return Results.Ok(new { path });
    }

    static async Task<IResult> UploadChunkRecordings(
      [FromForm] IFormFile file,
      [FromForm] int index,
      [FromForm] int total,
      [FromForm] string sessionId,
      [FromRoute] int attemptId,
      IExamAttemptRecordingService service,
      CancellationToken ct
    )
    {
      await service.UploadChunkAsync(attemptId, total, file.OpenReadStream(), index, sessionId, ct);

      return Results.Ok();
    }

    static async Task<IResult> GetExamAttemptQuestion(
      IExamAttemptService service,
      [FromRoute] int attemptId,
      [FromRoute] int questionId
    )
    {
      var examAttempQuestion = await service.GetExamAttemptQuestion(attemptId, questionId);

      return examAttempQuestion is null
        ? Results.NotFound()
        : Results.Ok(examAttempQuestion.MapToExamAttemptQuestionDto());
    }

    static async Task<IResult> GetCurrentExamAttemptQuestion(
      IExamAttemptService service,
      [FromRoute] int attemptId
    )
    {
      var examAttemptQuestion = await service.GetCurrentExamAttemptQuestion(attemptId);

      return examAttemptQuestion is null ? Results.NotFound() : Results.Ok(examAttemptQuestion);
    }

    static async Task<IResult> SetAnswer(
      IExamAttemptService service,
      [FromRoute] int attemptId,
      [FromRoute] int questionId,
      [FromBody] SetAnswerDto dto
    )
    {
      await service.SetAnswer(attemptId, questionId, dto.AnswerText);

      return Results.NoContent();
    }

    static async Task<IResult> MoveNextQuestion(
      IExamAttemptService service,
      [FromRoute] int attemptId
    )
    {
      var result = await service.MoveNextQuestion(attemptId);

      return result switch
      {
        MoveNextQuestionResult.Last => Results.Ok(new { IsLast = true }),
        _ => Results.NoContent(),
      };
    }

    static async Task<IResult> InitializeUploadRecording(
      IExamAttemptService service,
      [FromRoute] int attemptId
    )
    {
      return Results.Ok(
        await service.HasExamAttempt(attemptId)
          ? new { sessionId = $"attempt-{attemptId}" }
          : new { sessionId = "" }
      );
    }

    static async Task<IResult> MovePreviousQuestion(
      IExamAttemptService service,
      [FromRoute] int attemptId
    )
    {
      var result = await service.MovePreviousQuestion(attemptId);

      return result switch
      {
        MovePreviousQuestionResult.First => Results.Ok(new { IsFirst = true }),
        _ => Results.NoContent(),
      };
    }
  }
}
