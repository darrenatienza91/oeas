using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Exceptions;
using api.Features.Exams.ExamAttempts;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Features.ExamAttempts;

public interface IExamAttemptService
{
  Task<ExamAttemptQuestionDto?> GetCurrentExamAttemptQuestion(int attemptId);
  Task<Question?> GetExamAttemptQuestion(int attemptId, int questionId);
  Task SetAnswer(int attemptId, int questionId, string answerText);
  Task<MoveNextQuestionResult> MoveNextQuestion(int attemptId);
  Task<MovePreviousQuestionResult> MovePreviousQuestion(int attemptId);
  Task<bool> HasExamAttempt(int attemptId);
  Task<ExamAttemptResultDto> GetResult(int id);
  Task EditAsync(int id, ExamAttemptPatchDto dto, HashSet<string> modified);
}

public class ExamAttemptService(AppDbContext appDbContext) : IExamAttemptService
{
  public async Task<ExamAttemptResultDto> GetResult(int id)
  {
    var examAttemptResult =
      await appDbContext
        .ExamAttempts.Select(x => new
        {
          ExamId = x.ExamId,
          x.CheckingStatus,
          Points = x.ExamAttemptAnswers.Select(ans => new
          {
            ans.AcquiredPoints,
            QuestionPoints = ans.Question.Points,
          }),
        })
        .FirstOrDefaultAsync(x => x.ExamId == id)
      ?? throw new NotFoundException($"Exam Attempt with exam id {id} not found");

    var checkingStatus = examAttemptResult?.CheckingStatus ?? 0;

    if (checkingStatus == ExamAttemptCheckingStatus.NotYetChecked)
    {
      return new ExamAttemptResultDto(
        CheckingStatus: checkingStatus,
        Result: ExamAttemptResult.Waiting,
        Percentage: 0,
        TotalPossible: 0,
        TotalAcquired: 0
      );
    }

    double totalPercentage = 0;

    var result = ExamAttemptResult.Waiting;

    double totalAcquired = 0;
    double totalPossible = 0;

    if (examAttemptResult?.CheckingStatus == ExamAttemptCheckingStatus.Done)
    {
      totalAcquired = examAttemptResult?.Points.Sum(x => x.AcquiredPoints) ?? 0;
      totalPossible = examAttemptResult?.Points.Sum(x => x.QuestionPoints) ?? 0;

      totalPercentage = totalPossible is 0 ? 0 : totalAcquired / totalPossible * 100;
      result = totalPercentage >= 75 ? ExamAttemptResult.Pass : ExamAttemptResult.Failed;
    }

    return new ExamAttemptResultDto(
      CheckingStatus: checkingStatus,
      Result: result,
      Percentage: totalPercentage,
      TotalPossible: totalPossible,
      TotalAcquired: totalAcquired
    );
  }

  public async Task<ExamAttemptQuestionDto?> GetCurrentExamAttemptQuestion(int attemptId)
  {
    var examAttempt =
      await appDbContext
        .ExamAttempts.AsNoTracking()
        .Where(x => x.Id == attemptId)
        .Select(x => new { x.ExamId, x.CurrentQuestionIndex })
        .FirstOrDefaultAsync()
      ?? throw new NotFoundException($"ExamAttempt {attemptId} not found");

    return await appDbContext
      .Questions.Where(q => q.ExamId == examAttempt.ExamId)
      .OrderBy(q => q.Id)
      .Skip(examAttempt.CurrentQuestionIndex)
      .Select(q => new ExamAttemptQuestionDto(
        q.Id,
        q.Description,
        q.ExamAttemptAnswers.Where(a => a.ExamAttemptId == attemptId)
          .Select(a => a.AnswerText)
          .FirstOrDefault()
          ?? ""
      ))
      .FirstOrDefaultAsync();
  }

  public async Task<Models.Question?> GetExamAttemptQuestion(int attemptId, int questionId)
  {
    var examAttempt = await GetExamAttempt(attemptId);
    return await appDbContext
      .Questions.Where(x => x.ExamId == examAttempt.ExamId && x.Id == questionId)
      .FirstOrDefaultAsync();
  }

  public async Task SetAnswer(int attemptId, int questionId, string answerText)
  {
    await GetExamAttempt(attemptId);
    await GetQuestion(questionId);

    var examAttemptAnswer = await appDbContext.ExamAttemptAnswers.FirstOrDefaultAsync(x =>
      x.QuestionId == questionId && x.ExamAttemptId == attemptId
    );

    if (examAttemptAnswer is null)
    {
      appDbContext.ExamAttemptAnswers.Add(
        new()
        {
          AnswerText = answerText,
          QuestionId = questionId,
          ExamAttemptId = attemptId,
        }
      );
    }
    else
    {
      examAttemptAnswer.AnswerText = answerText;
    }

    await appDbContext.SaveChangesAsync();
  }

  public async Task<MoveNextQuestionResult> MoveNextQuestion(int attemptId)
  {
    var examAttempt = await GetExamAttempt(attemptId);

    var questionCount = await appDbContext
      .Questions.Where(q => q.ExamId == examAttempt.ExamId)
      .CountAsync();

    if (examAttempt.CurrentQuestionIndex + 1 >= questionCount)
    {
      return MoveNextQuestionResult.Last;
    }

    examAttempt.CurrentQuestionIndex++;

    await appDbContext.SaveChangesAsync();

    return MoveNextQuestionResult.Moved;
  }

  private async Task<ExamAttempt> GetExamAttempt(
    int attemptId,
    Func<IQueryable<ExamAttempt>, IQueryable<ExamAttempt>>? include = null
  )
  {
    IQueryable<ExamAttempt> query = appDbContext.ExamAttempts;

    if (include is not null)
    {
      query = include(query);
    }

    return await query.FirstOrDefaultAsync(x => x.Id == attemptId)
      ?? throw new NotFoundException($"Exam Attempt with id {attemptId} not found");
  }

  private async Task<Question> GetQuestion(int questionId)
  {
    return await appDbContext.Questions.FindAsync(questionId)
      ?? throw new NotFoundException($"Question with id {questionId} not found");
  }

  public async Task<MovePreviousQuestionResult> MovePreviousQuestion(int attemptId)
  {
    var examAttempt = await GetExamAttempt(attemptId);

    if (examAttempt.CurrentQuestionIndex == 0)
    {
      return MovePreviousQuestionResult.First;
    }

    examAttempt.CurrentQuestionIndex--;

    await appDbContext.SaveChangesAsync();

    return MovePreviousQuestionResult.Moved;
  }

  public async Task<bool> HasExamAttempt(int attemptId)
  {
    return await GetExamAttempt(attemptId) is not null;
  }

  public async Task EditAsync(int id, ExamAttemptPatchDto dto, HashSet<string> modified)
  {
    var attempt =
      await appDbContext.ExamAttempts.FirstOrDefaultAsync(x => x.Id == id)
      ?? throw new NotFoundException($"Attemp with id {id}  was not found.");

    ExamAttemptMapper.ApplyPatch(attempt, dto, modified);

    appDbContext.ExamAttempts.Update(attempt);

    await appDbContext.SaveChangesAsync();
  }
}
