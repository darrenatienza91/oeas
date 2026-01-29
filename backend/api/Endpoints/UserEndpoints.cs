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
  public static class UserEndPoints
  {
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
      app.MapGet("/users/{id}/detail", GetUserDetail);
    }

    static async Task<IResult> GetUserDetail(UserDetailService service, [FromRoute] int id)
    {
      var userDetail = await service.GetUserDetailAsync(id);

      if (userDetail is null)
      {
        return Results.NotFound();
      }

      return Results.Ok(UserDetailMapper.MapToUserDetailDto(userDetail));
    }
  }
}
