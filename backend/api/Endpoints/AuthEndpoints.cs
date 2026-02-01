using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using api.Auth;
using api.Contracts;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

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
      IConfiguration config,
      IPasswordHasher<User> passwordHasher,
      UserService service,
      LoginDto dto
    )
    {
      var user = await service.GetUsersAsync(dto.UserName);
      if (
        user is null
        || !user.IsActive
        || !PasswordValidator.IsPasswordValid(passwordHasher, user, dto.Password)
      )
      {
        return Results.Unauthorized();
      }

      var token = JwtTokenGenerator.GenerateToken(user, config);

      return Results.Ok(new LoginResponseDto(token, AuthMapper.MapToCurrentUserDTO(user)));
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
