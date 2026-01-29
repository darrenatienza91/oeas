using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Contracts
{
  public record UserRegisterDto(string UserName, string Password);

  public record LoginDto(string UserName, string Password);

  public record LoginSuccessDto(int Id, string UserName, UserType? UserType, bool IsActive);

  public static class AuthMapper
  {
    public static LoginSuccessDto MapToLoginSuccessDto(User user)
    {
      return new(
        Id: user.Id,
        UserName: user.UserName,
        UserType: user.UserType,
        IsActive: user.IsActive
      );
    }
  }
}
