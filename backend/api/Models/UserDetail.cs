using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  public class UserDetail
  {
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public User? User { get; set; }
    public int UserId { get; set; }
  }
}
