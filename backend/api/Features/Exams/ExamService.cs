using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using api.Auth;
using api.Contracts;
using api.Data;
using api.Exceptions;
using api.Features.Exams;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
  public interface IExamService
  {
    Task AddExam(Exam exam);
    Task RemoveExam(Exam exam);
    Task<Exam> EditExam(Exam exam);
    Task<Exam?> GetExamById(int id);
    Task<IEnumerable<Exam>> GetExamsAsync(DateTimeOffset? startOn, string? criteria);
    Task<ExamAttempt?> GetAttempt(int examId);
    Task<ExamAttemptDetailDto?> GetAttemptDetails(int examId);
    Task<ExamAttempt?> AddAttempt(ExamAttempt examAttempt);
  }

  public class ExamService(AppDbContext appDbContext) : IExamService
  {
    private readonly AppDbContext appDbContext = appDbContext;

    public async Task AddExam(Exam exam)
    {
      await appDbContext.Exams.AddAsync(exam);

      await appDbContext.SaveChangesAsync();
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
      return await appDbContext
        .Exams.Include(x => x.Section.Department)
        .Include(x => x.Questions)
        .FirstOrDefaultAsync(x => x.Id == id);
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

    public async Task<ExamAttempt?> GetAttempt(int examId)
    {
      return await appDbContext.ExamAttempts.FirstOrDefaultAsync(x => x.ExamId == examId);
    }

    public async Task<ExamAttempt?> AddAttempt(ExamAttempt examAttempt)
    {
      appDbContext.ExamAttempts.Add(examAttempt);

      await appDbContext.SaveChangesAsync();

      return examAttempt;
    }

    public async Task<ExamAttemptDetailDto?> GetAttemptDetails(int examId)
    {
      return await appDbContext
        .ExamAttempts.Where(x => x.ExamId == examId)
        .Select(x => new ExamAttemptDetailDto(
          Id: x.Id,
          RecUrl: x.RecUrl,
          CreateDate: x.CreateDate,
          IsSubmitted: x.IsAttemptSubmitted,
          ExamId: x.ExamId
        ))
        .FirstOrDefaultAsync();
    }
  }
}
