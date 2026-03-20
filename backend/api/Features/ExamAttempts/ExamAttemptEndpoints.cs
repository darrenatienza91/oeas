using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Exceptions;
using api.Models;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.ExamAttempts
{
  public static class ExamAttemptEndpoints
  {
    public static void MapExamAttemptEndpoints(this IEndpointRouteBuilder app)
    {
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
