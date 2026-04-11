using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Exceptions
{
  public sealed class FinalizeUploadFileException(string message) : Exception(message) { }
}
