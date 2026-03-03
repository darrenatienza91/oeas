using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Contracts
{
  public record UserRegisterDto(string UserName, string Password);

  public record LoginDto(string UserName, string Password);

  public record CurrentUserDto(
    int Id,
    string UserName,
    string Role,
    bool IsActive,
    string? FirstName,
    int? UserDetailId,
    int? SectionId,
    bool HasUserDetail);

  public record LoginResponseDto(string Token, CurrentUserDto User);

  public static class AuthMapper
  {
    public static CurrentUserDto MapToCurrentUserDTO(User user)
    {
      return new(
        Id: user.Id,
        UserName: user.UserName,
        Role: user.Role,
        IsActive: user.IsActive,
        FirstName: user.UserDetail?.FirstName,
        UserDetailId: user.UserDetail?.Id,
        SectionId: user.UserDetail?.SectionId,
        HasUserDetail: user.UserDetail is not null
      );
    }
  }
}
