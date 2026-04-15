using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Helpers
{
  public static class IQueryableExtensions
  {
    private static IQueryable<ExamAttempt> IncludeExamData(
      this IQueryable<ExamAttempt> query,
      bool includeQuestions,
      bool includeAnswers
    )
    {
      if (includeAnswers)
      {
        return query.Include(x => x.Exam.Questions).ThenInclude(q => q.ExamAttemptAnswers);
      }

      if (includeQuestions)
      {
        return query.Include(x => x.Exam.Questions);
      }

      return query;
    }
  }
}
