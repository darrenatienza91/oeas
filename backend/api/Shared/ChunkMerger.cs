using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Shared
{
  public interface IChunkMerger
  {
    Task MergeAsync(IEnumerable<string> chunkPaths, string outputPath, CancellationToken ct);
  }

  public class ChunkMerger : IChunkMerger
  {
    public async Task MergeAsync(
      IEnumerable<string> chunkPaths,
      string outputPath,
      CancellationToken ct
    )
    {
      try
      {
        await using var output = new FileStream(
          outputPath,
          FileMode.Create,
          FileAccess.Write,
          FileShare.None,
          bufferSize: 64 * 1024,
          useAsync: true
        );
        foreach (var chunk in chunkPaths)
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
      catch (Exception ex)
      {
        // Handle exceptions that may occur during file merging
        Console.WriteLine($"An error occurred while merging chunks: {ex.Message}");
        throw;
      }
    }
  }
}
