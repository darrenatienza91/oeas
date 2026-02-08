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
    Task RemoveExam(Exam exam);
    Task<Exam> EditExam(Exam exam);
    Task<Exam?> GetExamById(int id);
    Task<IEnumerable<Exam>> GetExamsBySectionAndStartOn(int sectionId, DateTimeOffset startOn);
    Task<IEnumerable<Exam>> GetExamsBySectionIdAndCriteriaAsync(int sectionId, string criteria);
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

    public async Task RemoveExam(Exam exam)
    {
      appDbContext.Remove(exam);

      await appDbContext.SaveChangesAsync();
    }

    public async Task<Exam> EditExam(Exam exam)
    {
      appDbContext.Exams.Update(exam);

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
        .Exams.Where(x => x.SectionId == sectionId && x.StartOn >= startOn && x.IsActive)
        .ToListAsync();
    }

    public async Task<IEnumerable<Exam>> GetExamsBySectionIdAndCriteriaAsync(
      int sectionId,
      string criteria
    )
    {
      return await appDbContext
        .Exams.Where(x => x.SectionId == sectionId && EF.Functions.Like(x.Name, $"%{criteria}%"))
        .ToListAsync();
    }
  }
}
