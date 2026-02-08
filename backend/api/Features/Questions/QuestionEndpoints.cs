using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using api.Auth;
using api.Contracts;
using api.Endpoints.Validators;
using api.Exceptions;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Endpoints
{
  public static class QuestionEndpoints
  {
    public static void MapQuestionEndpoints(this IEndpointRouteBuilder app)
    {
      app.MapGet("/exams/{examid}/questions", GetQuestionsByExamId)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher, Roles.SuperAdmin));

      app.MapGet("/exams/{examId}/questions/{id}", GetQuestionByExamIdAndId)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher, Roles.SuperAdmin));
      ;

      app.MapPost("/exams/{examid}/questions", Add)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher, Roles.SuperAdmin))
        .AddEndpointFilter<ValidationFilter<AddQuestionDto>>();

      app.MapPut("/exams/{examid}/questions/{id}", Edit)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher, Roles.SuperAdmin))
        .AddEndpointFilter<ValidationFilter<EditQuestionDto>>();

      app.MapDelete("/exams/{examId}/questions/{id}", Delete)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher, Roles.SuperAdmin));
    }

    static async Task<IResult> GetQuestionsByExamId(
      IQuestionService service,
      [FromRoute] int examId,
      [FromQuery] string criteria
    )
    {
      var questions = await service.GetQuestions(examId, criteria);

      return Results.Ok(questions.Select(QuestionMapper.MapToReadQuestionDto));
    }

    static async Task<IResult> GetQuestionByExamIdAndId(
      IQuestionService service,
      [FromRoute] int examId,
      [FromRoute] int id
    )
    {
      var question =
        await service.GetQuestionByExamIdAndId(examId, id)
        ?? throw new NotFoundException(
          $"Question with id {id}  was not found for Exam with id {examId}"
        );
      ;

      return Results.Ok(QuestionMapper.MapToReadQuestionDto(question));
    }

    static async Task<IResult> Add(
      AddQuestionDto dto,
      [FromRoute] int examId,
      IQuestionService service,
      IExamService examService,
      HttpContext http
    )
    {
      _ =
        await examService.GetExamById(dto.ExamId)
        ?? throw new NotFoundException($"Exam with id {dto.ExamId}  was not found.");

      var question = QuestionMapper.MapToQuestion(dto);

      await service.AddQuestion(question);

      var response = QuestionMapper.MapToReadQuestionDto(question);

      return Results.Created($"{http.Request.Path}/{question.Id}", response);
    }

    static async Task<IResult> Edit(
      [FromRoute] int id,
      [FromRoute] int examId,
      [FromBody] EditQuestionDto dto,
      IQuestionService service,
      HttpContext http
    )
    {
      var question =
        await service.GetQuestionByExamIdAndId(examId, id)
        ?? throw new NotFoundException(
          $"Question with id {id}  was not found for Exam with id {examId}"
        );

      QuestionMapper.MapToExistingQuestion(dto, question);

      await service.EditQuestion(question);

      return Results.NoContent();
    }

    static async Task<IResult> Delete(
      [FromRoute] int id,
      [FromRoute] int examId,
      IQuestionService service
    )
    {
      var question =
        await service.GetQuestionByExamIdAndId(examId, id)
        ?? throw new NotFoundException(
          $"Question with id {id}  was not found for Exam with id {examId}"
        );

      await service.RemoveExam(question);

      return Results.NoContent();
    }
  }
}
