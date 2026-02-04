using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Auth
{
  public interface ICurrentUser
  {
    int UserDetailId { get; }
    bool IsAuthenticated { get; }
  }

  public sealed class CurrentUser(IHttpContextAccessor accessor) : ICurrentUser
  {
    public int UserDetailId =>
      int.Parse(accessor.HttpContext!.User.GetUserDetailId().ToString());

    public bool IsAuthenticated => accessor.HttpContext?.User?.Identity?.IsAuthenticated == true;
  }
}
