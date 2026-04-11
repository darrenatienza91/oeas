using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Exceptions;

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

public class ChunkedUploadService(IWebHostEnvironment env, IFileStorage fileStorage)
  : IChunkedUploadService
{
  private readonly string _rootPath = Path.Combine(env.ContentRootPath, "uploads");

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
    var finalPath = Path.Combine("final", fileName);

    var chunkFiles = Directory.GetFiles(tempDir);

    if (chunkFiles.Length != totalChunks)
    {
      throw new FinalizeUploadFileException(
        $"Missing chunks ({chunkFiles.Length} / {totalChunks})"
      );
    }

    var orderedChunkFiles = chunkFiles.OrderBy(f => int.Parse(Path.GetFileNameWithoutExtension(f)));

    await using var output = new MemoryStream();

    foreach (var chunk in orderedChunkFiles)
    {
      await using var chunkStream = new FileStream(chunk, FileMode.Open);
      await chunkStream.CopyToAsync(output, ct);
    }

    output.Position = 0;

    await fileStorage.WriteAsync(finalPath, output, ct);

    Directory.Delete(tempDir, true);

    return finalPath;
  }
}
