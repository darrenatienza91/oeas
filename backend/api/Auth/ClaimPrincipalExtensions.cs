using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace api.Auth
{
  public static class ClaimsPrincipalExtensions
  {
    public static int GetUserDetailId(this ClaimsPrincipal user) =>
      int.Parse(user.FindFirstValue("UserDetailId")!);
  }
}
