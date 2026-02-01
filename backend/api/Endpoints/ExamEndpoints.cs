using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Contracts;
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

    static async Task<IResult> Add(AddExamDto dto, IExamService service)
    {
      var exam = ExamMapper.MapToExam(dto);

      await service.AddExam(exam);

      return Results.Created();
    }
  }
}
