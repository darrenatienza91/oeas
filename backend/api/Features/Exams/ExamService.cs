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
    Task<IEnumerable<Exam>> GetExamsAsync(DateTimeOffset? startOn, string? criteria);
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

    public async Task<IEnumerable<Exam>> GetExamsAsync(DateTimeOffset? startOn, string? criteria)
    {
      var query = appDbContext.Exams.Include(x => x.Section.Department).AsQueryable();

      if (startOn.HasValue)
      {
        query = query.Where(x => x.StartOn >= startOn.Value);
      }

      query = query.Where(x => EF.Functions.Like(x.Name, $"%{criteria}%"));

      return await query.ToListAsync();
    }
  }
}
