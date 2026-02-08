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
  public static class ExamEndpoints
  {
    public static void MapExamEndpoints(this IEndpointRouteBuilder app)
    {
      app.MapGet("/exams", GetExamsBySectionAndStartOn)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher, Roles.SuperAdmin));

      app.MapGet("/exams/{id}", GetExamById)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher, Roles.SuperAdmin));

      app.MapGet("/sections/{sectionId}/exams", GetExamsBySectionIdUserDetailIdAndCriteria)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher, Roles.SuperAdmin));

      app.MapPost("/exams", Add)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher, Roles.SuperAdmin))
        .AddEndpointFilter<ValidationFilter<AddExamDto>>();

      app.MapPatch("/exams/{id}", Edit)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher, Roles.SuperAdmin))
        .AddEndpointFilter<ValidationFilter<PatchExamDto>>();

      app.MapDelete("/exams/{id}", Delete)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher, Roles.SuperAdmin));

      app.MapPatch("/exams/{id}/activate", Activate)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher, Roles.SuperAdmin));

      app.MapPatch("/exams/{id}/de-activate", Deactivate)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher, Roles.SuperAdmin));
    }

    static async Task<IResult> GetExamsBySectionAndStartOn(
      IExamService service,
      [FromQuery] int sectionId,
      [FromQuery] DateTime startOn
    )
    {
      var exams = await service.GetExamsBySectionAndStartOn(sectionId, startOn);

      return Results.Ok(exams.Select(ExamMapper.MapToExamDto));
    }

    static async Task<IResult> GetExamById(IExamService service, [FromRoute] int id)
    {
      var exam =
        await service.GetExamById(id)
        ?? throw new NotFoundException($"Exam with id {id}  was not found.");

      return Results.Ok(ExamMapper.MapToExamDto(exam));
    }

    static async Task<IResult> GetExamsBySectionIdUserDetailIdAndCriteria(
      IExamService service,
      [FromRoute] int sectionId,
      [FromQuery] string criteria
    )
    {
      var exams = await service.GetExamsBySectionIdAndCriteriaAsync(
        sectionId,
        criteria
      );

      return Results.Ok(exams.Select(ExamMapper.MapToExamDto));
    }

    static async Task<IResult> Add(
      AddExamDto dto,
      IExamService service,
      HttpContext http,
      ClaimsPrincipal user
    )
    {
      var exam = ExamMapper.MapToExam(dto, user.GetUserDetailId());

      await service.AddExam(exam);

      var response = ExamMapper.MapToExamDto(exam);

      return Results.Created($"{http.Request.Path}/{exam.Id}", response);
    }

    static async Task<IResult> Edit(
      [FromRoute] int id,
      [FromBody] PatchExamDto dto,
      IExamService service,
      HttpContext http
    )
    {
      var exam =
        await service.GetExamById(id)
        ?? throw new NotFoundException($"Exam with id {id}  was not found.");

      ExamMapper.ApplyPatch(dto, exam);

      await service.EditExam(exam);

      return Results.NoContent();
    }

    static async Task<IResult> Delete(
      [FromRoute] int id,
      IExamService service,
      ClaimsPrincipal user
    )
    {
      var exam =
        await service.GetExamById(id)
        ?? throw new NotFoundException($"Exam with id {id}  was not found.");

      await service.RemoveExam(exam);

      return Results.NoContent();
    }

    static async Task<IResult> Activate([FromRoute] int id, IExamService service)
    {
      var exam =
        await service.GetExamById(id)
        ?? throw new NotFoundException($"Exam with id {id}  was not found.");

      exam.Activate(true);

      await service.EditExam(exam);

      return Results.NoContent();
    }

    static async Task<IResult> Deactivate([FromRoute] int id, IExamService service)
    {
      var exam =
        await service.GetExamById(id)
        ?? throw new NotFoundException($"Exam with id {id}  was not found.");

      exam.Activate(false);

      await service.EditExam(exam);

      return Results.NoContent();
    }
  }
}
