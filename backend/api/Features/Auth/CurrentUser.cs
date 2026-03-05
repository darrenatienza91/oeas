using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Auth
{
  public interface ICurrentUser
  {
    int UserDetailId { get; }
    int Id { get; }
    bool IsAuthenticated { get; }
    int SectionId { get; }
    string Role { get; }
  }

  public sealed class CurrentUser(IHttpContextAccessor accessor) : ICurrentUser
  {
    public int UserDetailId => accessor.HttpContext!.User.GetUserDetailId();
    public int Id => int.Parse(accessor.HttpContext!.User.GetCurrenUserId().ToString());
    public bool IsAuthenticated => accessor.HttpContext?.User?.Identity?.IsAuthenticated == true;
    public int SectionId => accessor.HttpContext!.User.GetSectionId();
    public string Role => accessor.HttpContext!.User.GetRole();
  }
}
