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
  IMediaConverterResolver mediaConverterResolver,
  IChunkMerger chunkMerger
) : IChunkedUploadService
{
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
    var tempDir = Path.Combine("temp", sessionId);

    var chunkFiles = await fileStorage.GetFilesAsync(tempDir, ct);

    if (chunkFiles.Count() != totalChunks)
      throw new FinalizeUploadFileException(
        $"Missing chunks ({chunkFiles.Count()} / {totalChunks})"
      );

    var orderedChunks = chunkFiles.OrderBy(f => int.Parse(Path.GetFileNameWithoutExtension(f)));

    var mergedPath = Path.Combine(fileStorage.RootPath, "temp", $"{sessionId}_merged.webm");

    await chunkMerger.MergeAsync(orderedChunks, mergedPath, ct);

    var finalFileName = Path.ChangeExtension(fileName, ".mp4");
    var finalPath = Path.Combine(fileStorage.RootPath, "final", finalFileName);

    await mediaConverterResolver.Resolve(ConverterFormats.Mp4).Convert(finalPath, mergedPath, ct);

    await fileStorage.DeleteAsync(mergedPath, ct);
    await fileStorage.DeleteAsync(tempDir, ct);

    return finalFileName;
  }
}
