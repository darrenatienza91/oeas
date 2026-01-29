using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Contracts;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Identity;

namespace api.Endpoints
{
  public static class AuthEndpoints
  {
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
      app.MapPost("/auth/login", Login);
      app.MapPost("/auth/register", Register);
    }

    static async Task<IResult> Login(
      IPasswordHasher<User> passwordHasher,
      UserService service,
      LoginDto dto
    )
    {
      var user = await service.GetUsersAsync(dto.UserName);

      if (user is null)
      {
        return Results.Unauthorized();
      }

      var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);

      if (result == PasswordVerificationResult.Failed)
      {
        return Results.Unauthorized();
      }

      return Results.Ok(AuthMapper.MapToLoginSuccessDto(user));
    }

    static async Task<IResult> Register(
      UserRegisterDto dto,
      IPasswordHasher<User> passwordHasher,
      UserService service
    )
    {
      var user = new User { UserName = dto.UserName };

      user.PasswordHash = passwordHasher.HashPassword(user, dto.Password);

      await service.AddUserAsync(
        new() { UserName = dto.UserName, PasswordHash = user.PasswordHash }
      );

      return Results.Created();
    }
  }
}
