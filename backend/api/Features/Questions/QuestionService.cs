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
  public interface IQuestionService
  {
    Task<Question> AddQuestion(Question question);
    Task<Question?> GetQuestionByExamIdAndId(int examId, int id);

    Task RemoveQuestion(Question exam);
    Task<Question> EditQuestion(Question question);
    Task<Question?> GetQuestionByIdAndExamId(int examId, int id);
    Task<IEnumerable<Question>> GetQuestions(int examId, string criteria);
    Task RemoveExam(Question question);
  }

  public class QuestionService(AppDbContext appDbContext) : IQuestionService
  {
    private readonly AppDbContext appDbContext = appDbContext;

    public async Task<Question> AddQuestion(Question question)
    {
      await appDbContext.Questions.AddAsync(question);

      await appDbContext.SaveChangesAsync();

      return question;
    }

    public async Task<Question?> GetQuestionByExamIdAndId(int examId, int id)
    {
      return await appDbContext.Questions.FirstOrDefaultAsync(x =>
        x.ExamId == examId && x.Id == id
      );
    }

    public async Task RemoveQuestion(Question question)
    {
      appDbContext.Remove(question);

      await appDbContext.SaveChangesAsync();
    }

    public async Task<Question> EditQuestion(Question exam)
    {
      appDbContext.Questions.Update(exam);

      await appDbContext.SaveChangesAsync();

      return exam;
    }

    public async Task<Question?> GetQuestionByIdAndExamId(int examId, int id)
    {
      return await appDbContext.Questions.FirstOrDefaultAsync(x =>
        x.ExamId == examId && x.Id == id
      );
    }

    public async Task<IEnumerable<Question>> GetQuestions(int examId, string criteria)
    {
      return await appDbContext
        .Questions.Where(x =>
          x.ExamId == examId && EF.Functions.Like(x.Description, $"%{criteria}%")
        )
        .ToListAsync();
    }

    public Task<Exam?> GetQuestion(int examId, int id)
    {
      throw new NotImplementedException();
    }

    public async Task RemoveExam(Question question)
    {
      this.appDbContext.Remove(question);
      await this.appDbContext.SaveChangesAsync();
    }
  }
}
