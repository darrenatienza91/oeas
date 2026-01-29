using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  public class User : BaseEntity<int>
  {
    public string UserName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public bool IsResetPassword { get; set; }
    public UserType? UserType { get; set; }
    public UserDetail? UserDetail { get; set; }
  }

  public enum UserType
  {
    Student = 1,
    Teacher = 2,
    Admin = 10,
  }
}
