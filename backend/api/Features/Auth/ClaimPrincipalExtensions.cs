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
      int.TryParse(user.FindFirstValue("UserDetailId"), out int userDetailId) ? userDetailId : 0;

    public static int GetCurrenUserId(this ClaimsPrincipal user) =>
      int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

    public static int GetSectionId(this ClaimsPrincipal user) =>
      int.TryParse(user.FindFirstValue("SectionId"), out int sectionId) ? sectionId : 0;

    public static string GetRole(this ClaimsPrincipal user) =>
      user.FindFirstValue(ClaimTypes.Role)!;
  }
}
