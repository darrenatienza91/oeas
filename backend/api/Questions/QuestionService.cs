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

    // Task RemoveExam(Exam exam);
    // Task<Exam> EditExam(Exam exam);
    // Task<Exam?> GetExamById(int id);
    // Task<IEnumerable<Exam>> GetExamsBySectionAndStartOn(
    //   int sectionId,
    //   DateTimeOffset startOn,
    //   int userDetailId
    // );
    Task<IEnumerable<Question>> GetQuestions(int examId, string criteria);
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

    // public async Task RemoveExam(Exam exam)
    // {
    //   appDbContext.Remove(exam);

    //   await appDbContext.SaveChangesAsync();
    // }

    // public async Task<Exam> EditExam(Exam exam)
    // {
    //   appDbContext.Exams.Update(exam);

    //   await appDbContext.SaveChangesAsync();

    //   return exam;
    // }

    // public async Task<Exam?> GetExamById(int id)
    // {
    //   return await appDbContext.Exams.FindAsync(id);
    // }

    public async Task<IEnumerable<Question>> GetQuestions(int examId, string criteria)
    {
      return await appDbContext
        .Questions.Where(x => x.ExamId == examId && x.Description.Contains(criteria))
        .ToListAsync();
    }

    // public async Task<IEnumerable<Exam>> GetExamsBySectionIdUserDetailIdAndCriteriaAsync(
    //   int sectionId,
    //   int userDetailId,
    //   string criteria
    // )
    // {
    //   return await appDbContext
    //     .Exams.Where(x => x.SectionId == sectionId && x.Name.Contains(criteria))
    //     .ToListAsync();
    // }
  }
}
