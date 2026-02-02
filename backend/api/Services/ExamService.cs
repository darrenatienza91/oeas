using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Exceptions;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
  public interface IExamService
  {
    Task<Exam> AddExam(Exam exam);
    Task<Exam?> GetExamById(int id);
    Task<IEnumerable<Exam>> GetExamsBySectionAndStartOn(int sectionId, DateTimeOffset startOn);
    Task<IEnumerable<Exam>> GetExamsBySectionIdUserDetailIdAndCriteriaAsync(
      int sectionId,
      int userDetailId,
      string criteria
    );
  }

  public class ExamService(AppDbContext appDbContext) : IExamService
  {
    private readonly AppDbContext appDbContext = appDbContext;

    public async Task<Exam> AddExam(Exam exam)
    {
      await appDbContext.Exams.AddAsync(exam);

      await appDbContext.SaveChangesAsync();

      return exam;
    }

    public async Task<Exam?> GetExamById(int id)
    {
      return await appDbContext.Exams.FindAsync(id);
    }

    public async Task<IEnumerable<Exam>> GetExamsBySectionAndStartOn(
      int sectionId,
      DateTimeOffset startOn
    )
    {
      return await appDbContext
        .Exams.Where(x => x.SectionId == sectionId && x.StartOn >= startOn)
        .ToListAsync();
    }

    public async Task<IEnumerable<Exam>> GetExamsBySectionIdUserDetailIdAndCriteriaAsync(
      int sectionId,
      int userDetailId,
      string criteria
    )
    {
      return await appDbContext
        .Exams.Where(x =>
          x.SectionId == sectionId && x.UserDetailId == userDetailId && x.Name.Contains(criteria)
        )
        .ToListAsync();
    }
  }
}
