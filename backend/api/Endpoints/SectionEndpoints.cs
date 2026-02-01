using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Contracts;
using api.Services;

namespace api.Endpoints
{
  public static class SectionEndpoints
  {
    public static void MapSectionEndpoints(this IEndpointRouteBuilder app)
    {
      app.MapGet("/sections", GetSections);
    }

    static async Task<IResult> GetSections(ISectionService service)
    {
      var sections = await service.GetSections();

      return Results.Ok(sections.Select(SectionMapper.MapToSectionDto));
    }
  }
}
