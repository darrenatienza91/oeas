using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Microsoft.AspNetCore.Identity;

namespace api.Auth
{
  public static class PasswordValidator
  {
    public static bool IsPasswordValid(
      IPasswordHasher<User> passwordHasher,
      User user,
      string password
    )
    {
      return passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password)
        != PasswordVerificationResult.Failed;
    }
  }
}
