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
    private static IQueryable<ExamTaker> IncludeExamData(
      this IQueryable<ExamTaker> query,
      bool includeQuestions,
      bool includeAnswers
    )
    {
      if (includeAnswers)
      {
        return query.Include(x => x.Exam.Questions).ThenInclude(q => q.ExamTakerAnswers);
      }

      if (includeQuestions)
      {
        return query.Include(x => x.Exam.Questions);
      }

      return query;
    }
  }
}
