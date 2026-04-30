using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Exceptions;
using api.Models;
using api.Shared;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;

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

  Task<(FileStream fileStream, string contentType)> GetRecordingAsync(
    int attemptId,
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

  public async Task FinalizeRecordingAsync(
    int attemptId,
    string sessionId,
    int total,
    string fileName,
    CancellationToken ct
  )
  {
    var attempt = await GetValidAttempt(attemptId, ct);

    // Example domain rules
    // if (attempt.IsSubmitted)
    //   throw new InvalidOperationException("Attempt already submitted.");

    var finalFileName = await upload.FinalizeAsync(sessionId, total, fileName, ct);

    // Save recording reference
    attempt.RecordingFileName = finalFileName;

    await appDbContext.SaveChangesAsync(ct);

    return finalFileName;
  }

  private async Task<ExamAttempt> GetValidAttempt(int attemptId, CancellationToken ct)
  {
    return await appDbContext.ExamAttempts.FindAsync([attemptId], ct)
      ?? throw new NotFoundException("Exam attempt not found.");
  }

  public async Task<(FileStream fileStream, string contentType)> GetRecordingAsync(
    int attemptId,
    string fileName,
    CancellationToken ct
  )
  {
    var _ =
      await appDbContext.ExamAttempts.FirstOrDefaultAsync(
        x => x.Id == attemptId && x.RecordingFileName == fileName,
        ct
      ) ?? throw new NotFoundException("Exam attempt not found.");

    var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), @"uploads\final");

    var safeFileName = Path.GetFileName(fileName);
    var fullPath = Path.Combine(uploadsPath, safeFileName);

    if (!File.Exists(fullPath))
    {
      throw new NotFoundException("Recording not found.");
    }

    var provider = new FileExtensionContentTypeProvider();

    if (!provider.TryGetContentType(fullPath, out var contentType))
    {
      contentType = "application/octet-stream";
    }

    var stream = new FileStream(
      fullPath,
      FileMode.Open,
      FileAccess.Read,
      FileShare.Read,
      bufferSize: 64 * 1024,
      useAsync: true
    );

    return (stream, contentType);
  }
}
