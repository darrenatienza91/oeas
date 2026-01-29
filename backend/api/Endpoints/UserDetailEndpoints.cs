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
  public static class UserDetailEndpoints
  {
    public static void MapUserDetailEndpoints(this IEndpointRouteBuilder app)
    {
      app.MapPost("/user-details/{id}", GetOne);
      app.MapPost("/user-details", Add);
    }

    static async Task<IResult> GetOne(UserDetailService service, [FromRoute] int id)
    {
      var userDetail = await service.GetUserDetailAsync(id);

      if (userDetail is null)
      {
        return Results.NotFound();
      }

      return Results.Ok(UserDetailMapper.MapToUserDetailDto(userDetail));
    }

    static async Task<IResult> Add(AddUserDetailDto dto, UserDetailService service)
    {
      var userDetail = UserDetailMapper.MapToUserDetail(dto);

      await service.AddUserDetailAsync(userDetail);

      return Results.Created();
    }
  }
}
