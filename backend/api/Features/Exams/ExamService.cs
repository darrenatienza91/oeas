using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Exceptions;
using api.Features.Exams;
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
    Task<ExamTaker?> GetAttempt(int examId);
    Task<ExamTaker?> AddAttempt(ExamTaker examTaker);
    Task<(
      ExamAttemptCheckingStatus checkingStatus,
      ExamAttemptResult result,
      double percentage
    )> GetResult(int id);
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

    public async Task<ExamTaker?> GetAttempt(int examId)
    {
      return await appDbContext.ExamTakers.FirstOrDefaultAsync(x => x.ExamId == examId);
    }

    public async Task<ExamTaker?> AddAttempt(ExamTaker examTaker)
    {
      appDbContext.ExamTakers.Add(examTaker);

      await appDbContext.SaveChangesAsync();

      return examTaker;
    }

    public async Task<(
      ExamAttemptCheckingStatus checkingStatus,
      ExamAttemptResult result,
      double percentage
    )> GetResult(int id)
    {
      var examTakerResult = await appDbContext
        .ExamTakers.Select(x => new
        {
          x.Id,
          x.CheckingStatus,
          Points = x.ExamTakerAnswers.Select(ans => new
          {
            ans.AcquiredPoints,
            QuestionPoints = ans.Question.Points,
          }),
        })
        .FirstOrDefaultAsync(x => x.Id == id);

      var checkingStatus = examTakerResult?.CheckingStatus ?? 0;

      double totalAcquired = examTakerResult?.Points.Sum(x => x.AcquiredPoints) ?? 0;
      double totalPossible = examTakerResult?.Points.Sum(x => x.QuestionPoints) ?? 0;

      double totalPercentage = totalPossible is 0 ? 0 : totalAcquired / totalPossible * 100;

      var result = totalPercentage >= 75 ? ExamAttemptResult.Pass : ExamAttemptResult.Failed;

      return (checkingStatus, result, totalPercentage);
    }
  }
}
