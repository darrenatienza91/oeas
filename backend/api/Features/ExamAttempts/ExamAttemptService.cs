using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Exceptions;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Features.ExamAttempts;

public interface IExamAttemptService
{
  Task<Models.Question?> GetCurrentExamAttemptQuestion(int attemptId);
  Task<ExamAttemptQuestionDto?> GetExamAttemptQuestion(int attemptId, int questionId);
  Task SetAnswer(int attemptId, int questionId, string answerText);
  Task<MoveNextQuestionResult> MoveNextQuestion(int attemptId);
  Task<MovePreviousQuestionResult> MovePreviousQuestion(int attemptId);
}

public class ExamAttemptService(AppDbContext appDbContext) : IExamAttemptService
{
  public async Task<Question?> GetCurrentExamAttemptQuestion(int attemptId)
  {
    var examTaker = await GetExamTaker(
      attemptId,
      query => query.Include(x => x.Exam.Questions).ThenInclude(q => q.ExamTakerAnswers)
    );

    return examTaker
      .Exam.Questions.Where(q => q.ExamId == examTaker.ExamId)
      .OrderBy(q => q.Id)
      .Skip(examTaker.CurrentQuestionIndex)
      .FirstOrDefault();
  }

  public async Task<Models.Question?> GetExamAttemptQuestion(int attemptId, int questionId)
  {
    var examTaker = await GetExamTaker(attemptId);
    return await appDbContext
      .Questions.Where(x => x.ExamId == examTaker.ExamId && x.Id == questionId)
      .FirstOrDefaultAsync();
  }

  public async Task SetAnswer(int attemptId, int questionId, string answerText)
  {
    await GetExamTaker(attemptId);
    await GetQuestion(questionId);

    var examTakerAnswer = await appDbContext.ExamTakerAnswers.FirstOrDefaultAsync(x =>
      x.QuestionId == questionId && x.ExamTakerId == attemptId
    );

    if (examTakerAnswer is null)
    {
      appDbContext.ExamTakerAnswers.Add(
        new()
        {
          AnswerText = answerText,
          QuestionId = questionId,
          ExamTakerId = attemptId,
        }
      );
    }
    else
    {
      examTakerAnswer.AnswerText = answerText;
    }

    await appDbContext.SaveChangesAsync();
  }

  public async Task<MoveNextQuestionResult> MoveNextQuestion(int attemptId)
  {
    var examTaker = await GetExamTaker(attemptId);

    var questionCount = await appDbContext
      .Questions.Where(q => q.ExamId == examTaker.ExamId)
      .CountAsync();

    if (examTaker.CurrentQuestionIndex + 1 >= questionCount)
    {
      return MoveNextQuestionResult.Last;
    }

    examTaker.CurrentQuestionIndex++;

    await appDbContext.SaveChangesAsync();

    return MoveNextQuestionResult.Moved;
  }

  private async Task<ExamTaker> GetExamTaker(
    int attemptId,
    Func<IQueryable<ExamTaker>, IQueryable<ExamTaker>>? include = null
  )
  {
    IQueryable<ExamTaker> query = appDbContext.ExamTakers;

    if (include is not null)
    {
      query = include(query);
    }

    return await query.FirstOrDefaultAsync(x => x.Id == attemptId)
      ?? throw new NotFoundException($"Exam Taker with id {attemptId} not found");
  }

  private async Task<Question> GetQuestion(int questionId)
  {
    return await appDbContext.Questions.FindAsync(questionId)
      ?? throw new NotFoundException($"Question with id {questionId} not found");
  }

  public async Task<MovePreviousQuestionResult> MovePreviousQuestion(int attemptId)
  {
    var examTaker = await GetExamTaker(attemptId);

    if (examTaker.CurrentQuestionIndex == 0)
    {
      return MovePreviousQuestionResult.First;
    }

    examTaker.CurrentQuestionIndex--;

    await appDbContext.SaveChangesAsync();

    return MovePreviousQuestionResult.Moved;
  }
}
