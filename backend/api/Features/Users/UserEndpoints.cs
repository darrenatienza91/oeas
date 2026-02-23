using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using api.Auth;
using api.Contracts;
using api.Endpoints.Validators;
using api.Exceptions;
using api.Features.Users;
using api.Helpers;
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
      app.MapGet("/users", GetAllUsers)
        .RequireAuthorization(policy => policy.RequireRole(Roles.SuperAdmin));

      app.MapGet("/users/{id}", GetOne)
        .RequireAuthorization(policy => policy.RequireRole(Roles.SuperAdmin));

      app.MapGet("/me", GetMe).RequireAuthorization();
      app.MapPut("/me", PutProfileDetail).RequireAuthorization();

      app.MapPatch("/users/{id}", PatchUser)
        .RequireAuthorization(policy => policy.RequireRole(Roles.SuperAdmin));

      app.MapDelete("/users/{id}", DeleteUser)
        .RequireAuthorization(policy => policy.RequireRole(Roles.SuperAdmin));

      app.MapPatch("/users/{id}/activate", ActivateUser)
        .RequireAuthorization(policy => policy.RequireRole(Roles.SuperAdmin));

      app.MapPatch("/users/{id}/deactivate", DeActivateUser)
        .RequireAuthorization(policy => policy.RequireRole(Roles.SuperAdmin));
    }

    static async Task<IResult> PatchUser(
      HttpContext context,
      IUserService userService,
      [FromRoute] int id
    )
    {
      var user =
        await userService.GetUserByIdAsync(id)
        ?? throw new NotFoundException($"User with id {id}  was not found.");

      if (user.UserDetail is null)
      {
        throw new NotFoundException("User Detail with User id {id}  was not found.");
      }

      var patch = await PatchRequestReader.ReadAsync<PatchUserDto>(context.Request);

      if (patch is null)
      {
        return Results.BadRequest();
      }

      UserMapper.ApplyPatch(user, patch.Model, patch.ModifiedProperties);

      await userService.EditAsync(user);

      return Results.NoContent();
    }

    static async Task<IResult> GetAllUsers(IUserService service, [FromQuery] string criteria)
    {
      var users = await service.GetUsersAsync(criteria);

      return Results.Ok(users.Select(UserMapper.MapToUserListDto));
    }

    static async Task<IResult> GetOne(IUserService service, [FromRoute] int id)
    {
      var user =
        await service.GetUserByIdAsync(id)
        ?? throw new NotFoundException($"User with id {id}  was not found.");

      return Results.Ok(UserMapper.MapUserToUserReadDto(user));
    }

    static async Task<IResult> GetMe(IUserService service, ICurrentUser currentUser)
    {
      var user =
        await service.GetUserByIdAsync(currentUser.UserDetailId)
        ?? throw new NotFoundException(
          $"Your id with value {currentUser.UserDetailId}  was not found."
        );

      return Results.Ok(UserMapper.MapUserToProfileDetailDto(user));
    }

    static async Task<IResult> DeleteUser(IUserService service, [FromRoute] int id)
    {
      var user =
        await service.GetUserByIdAsync(id)
        ?? throw new NotFoundException($"User with id {id}  was not found.");

      await service.DeleteUser(user);
      return Results.NoContent();
    }

    static async Task<IResult> ActivateUser(IUserService service, [FromRoute] int id)
    {
      var user =
        await service.GetUserByIdAsync(id)
        ?? throw new NotFoundException($"User with id {id}  was not found.");

      user.Activate();
      await service.EditAsync(user);
      return Results.NoContent();
    }

    static async Task<IResult> DeActivateUser(IUserService service, [FromRoute] int id)
    {
      var user =
        await service.GetUserByIdAsync(id)
        ?? throw new NotFoundException($"User with id {id}  was not found.");

      user.DeActivate();
      await service.EditAsync(user);
      return Results.NoContent();
    }

    static async Task<IResult> PutProfileDetail(
      IUserService userService,
      ICurrentUser currentUser,
      [FromBody] UpdateProfileDetailDto dto
    )
    {
      var user =
        await userService.GetUserByIdAsync(currentUser.Id)
        ?? throw new NotFoundException($"User with id {currentUser.Id}  was not found.");

      if (user.UserDetail is null)
      {
        throw new NotFoundException($"User Detail with Userid {currentUser.Id}  was not found.");
      }

      UserMapper.UpdateUserProfile(user, dto);

      await userService.EditAsync(user);

      return Results.NoContent();
    }
  }
}
