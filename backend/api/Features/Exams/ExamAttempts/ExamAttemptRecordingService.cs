using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Exceptions;
using api.Models;
using api.Shared;

namespace api.Features.Exams;

public interface IExamAttemptRecordingService
{
  Task UploadChunkAsync(
    int attemptId,
    int total,
    Stream file,
    int index,
    string sessionId,
    CancellationToken ct
  );

  Task<string> FinalizeRecordingAsync(
    int attemptId,
    string sessionId,
    int total,
    string fileName,
    CancellationToken ct
  );
}

public class ExamAttemptRecordingService(IChunkedUploadService upload, AppDbContext appDbContext)
  : IExamAttemptRecordingService
{
  private readonly IChunkedUploadService upload = upload;
  private readonly AppDbContext appDbContext = appDbContext;

  public async Task UploadChunkAsync(
    int attemptId,
    int total,
    Stream file,
    int index,
    string sessionId,
    CancellationToken ct
  )
  {
    await GetValidAttempt(attemptId, ct);

    if (index < 0 || index >= total)
    {
      throw new UploadFileException("Invalid chunk index");
    }

    await upload.UploadChunkAsync(file, index, sessionId, ct);
  }

  public async Task<string> FinalizeRecordingAsync(
    int attemptId,
    string sessionId,
    int total,
    string fileName,
    CancellationToken ct
  )
  {
    await GetValidAttempt(attemptId, ct);

    // Example domain rules
    // if (attempt.IsSubmitted)
    //   throw new InvalidOperationException("Attempt already submitted.");

    var path = await upload.FinalizeAsync(sessionId, total, fileName, ct);

    // Save recording reference
    // attempt.RecordingPath = path;

    await appDbContext.SaveChangesAsync(ct);

    return path;
  }

  private async Task<ExamAttempt> GetValidAttempt(int attemptId, CancellationToken ct)
  {
    return await appDbContext.ExamAttempts.FindAsync([attemptId], ct)
      ?? throw new NotFoundException("Exam attempt not found.");
  }
}
