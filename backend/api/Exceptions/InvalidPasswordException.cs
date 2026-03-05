using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Exceptions
{
  public sealed class InvalidPasswordException : Exception
  {
    public InvalidPasswordException()
      : base("Current password is incorrect.") { }
  }
}
