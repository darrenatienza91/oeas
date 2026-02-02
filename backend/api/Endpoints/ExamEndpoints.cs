using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using api.Auth;
using api.Contracts;
using api.Endpoints.Validators;
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
      app.MapGet("/exams", GetExamsBySectionAndStartOn);

      app.MapGet(
        "/user-details/{userDetailId}/sections/{sectionId}/exams",
        GetExamsBySectionIdUserDetailIdAndCriteria
      );

      app.MapPost("/exams", Add)
        .RequireAuthorization(policy => policy.RequireRole(Roles.Teacher, Roles.SuperAdmin))
        .AddEndpointFilter<ValidationFilter<AddExamDto>>();
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

    static async Task<IResult> GetExamsBySectionIdUserDetailIdAndCriteria(
      IExamService service,
      [FromRoute] int sectionId,
      [FromRoute] int userDetailId,
      [FromQuery] string criteria
    )
    {
      var exams = await service.GetExamsBySectionIdUserDetailIdAndCriteriaAsync(
        sectionId,
        userDetailId,
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
  }
}
