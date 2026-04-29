using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using api.Exceptions;
using api.Shared.MediaConverter;

namespace api.Shared;

public interface IChunkedUploadService
{
  Task UploadChunkAsync(Stream file, int index, string sessionId, CancellationToken ct);

  Task<string> FinalizeAsync(
    string sessionId,
    int totalChunks,
    string fileName,
    CancellationToken ct
  );
}

public class ChunkedUploadService(
  IWebHostEnvironment env,
  IFileStorage fileStorage,
  IMediaConverterResolver mediaConverterResolver
) : IChunkedUploadService
{
  private readonly string _rootPath = Path.Combine(env.ContentRootPath, "uploads");
  private readonly IMediaConverterResolver mediaConverterResolver = mediaConverterResolver;

  public async Task UploadChunkAsync(Stream file, int index, string sessionId, CancellationToken ct)
  {
    var path = Path.Combine("temp", sessionId, $"{index}.chunk");
    await fileStorage.WriteAsync(path, file, ct);
  }

  public async Task<string> FinalizeAsync(
    string sessionId,
    int totalChunks,
    string fileName,
    CancellationToken ct
  )
  {
    var tempDir = Path.Combine(_rootPath, "temp", sessionId);

    if (!Directory.Exists(tempDir))
    {
      throw new FinalizeUploadFileException("Temp directory not found.");
    }

    var chunkFiles = Directory.GetFiles(tempDir);

    if (chunkFiles.Length != totalChunks)
    {
      throw new FinalizeUploadFileException(
        $"Missing chunks ({chunkFiles.Length} / {totalChunks})"
      );
    }

    var orderedChunks = chunkFiles
      .OrderBy(f => int.Parse(Path.GetFileNameWithoutExtension(f)))
      .ToList();

    // Temp merged file (raw concatenation)
    var mergedPath = Path.Combine(_rootPath, "temp", $"{sessionId}_merged.webm");

    await using (
      var output = new FileStream(
        mergedPath,
        FileMode.Create,
        FileAccess.Write,
        FileShare.None,
        bufferSize: 64 * 1024,
        useAsync: true
      )
    )
    {
      foreach (var chunk in orderedChunks)
      {
        await using var chunkStream = new FileStream(
          chunk,
          FileMode.Open,
          FileAccess.Read,
          FileShare.Read,
          bufferSize: 64 * 1024,
          useAsync: true
        );

        await chunkStream.CopyToAsync(output, ct);
      }
    }

    // FINAL OUTPUT (force MP4 for best compatibility)
    var finalFileName = Path.ChangeExtension(fileName, ".mp4");
    var finalFullPath = Path.Combine(_rootPath, "final", finalFileName);

    await mediaConverterResolver
      .Resolve(ConverterFormats.Mp4)
      .Convert(finalFullPath, mergedPath, ct);

    // Cleanup
    File.Delete(mergedPath);
    Directory.Delete(tempDir, true);

    // Return relative path (adjust if needed)
    return Path.Combine("final", finalFileName);
  }
}
