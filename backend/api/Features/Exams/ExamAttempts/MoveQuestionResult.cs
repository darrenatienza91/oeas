using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Features.ExamAttempts
{
  public enum MoveNextQuestionResult
  {
    Moved,
    Last,
  }

  public enum MovePreviousQuestionResult
  {
    Moved,
    First,
  }
}
