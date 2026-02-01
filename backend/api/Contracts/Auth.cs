using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Contracts
{
  public record UserRegisterDto(string UserName, string Password);

  public record LoginDto(string UserName, string Password);

  public record CurrentUserDTO(int Id, string UserName, string Role, bool IsActive);

  public record LoginResponseDto(string Token, CurrentUserDTO User);

  public static class AuthMapper
  {
    public static CurrentUserDTO MapToCurrentUserDTO(User user)
    {
      return new(Id: user.Id, UserName: user.UserName, Role: user.Role, IsActive: user.IsActive);
    }
  }
}
