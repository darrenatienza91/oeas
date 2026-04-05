using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Shared;

public interface IFileStorage
{
  Task WriteAsync(string path, Stream data, CancellationToken ct);
  Task<Stream> ReadAsync(string path, CancellationToken ct);
  Task DeleteAsync(string path, CancellationToken ct);
  string GetUrl(string path);
}

public class LocalFileStorage(IWebHostEnvironment env) : IFileStorage
{
  private readonly string _rootPath = Path.Combine(env.ContentRootPath, "uploads");

  public Task DeleteAsync(string path, CancellationToken ct)
  {
    throw new NotImplementedException();
  }

  public string GetUrl(string path)
  {
    throw new NotImplementedException();
  }

  public Task<Stream> ReadAsync(string path, CancellationToken ct)
  {
    throw new NotImplementedException();
  }

  public async Task WriteAsync(string path, Stream data, CancellationToken ct)
  {
    var fullPath = Path.Combine(_rootPath, path);

    var directory = Path.GetDirectoryName(fullPath)!;
    Directory.CreateDirectory(directory);

    await using var fileStream = new FileStream(
      fullPath,
      FileMode.Create,
      FileAccess.Write,
      FileShare.None,
      bufferSize: 81920,
      useAsync: true
    );

    await data.CopyToAsync(fileStream, ct);
  }
}
