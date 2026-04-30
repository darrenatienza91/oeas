using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Exceptions;

namespace api.Shared;

public interface IFileStorage
{
  public string RootPath { get; }
  Task WriteAsync(string path, Stream data, CancellationToken ct);
  Task<Stream> ReadAsync(string path, CancellationToken ct);
  Task DeleteAsync(string path, CancellationToken ct);
  string GetUrl(string path);
  Task<IEnumerable<string>> GetFilesAsync(string path, CancellationToken ct);
}

public class LocalFileStorage(IWebHostEnvironment env) : IFileStorage
{
  private readonly string _rootPath = Path.Combine(env.ContentRootPath, "uploads");

  public string RootPath => _rootPath;

  public Task DeleteAsync(string path, CancellationToken ct)
  {
    var fullPath = Path.Combine(_rootPath, path);

    if (File.Exists(fullPath))
    {
      File.Delete(fullPath);
    }
    else if (Directory.Exists(fullPath))
    {
      Directory.Delete(fullPath, true);
    }

    return Task.CompletedTask;
  }

  public Task<IEnumerable<string>> GetFilesAsync(string path, CancellationToken ct)
  {
    var fullPath = Path.Combine(_rootPath, path);

    var files = Directory.GetFiles(fullPath);

    return Task.FromResult(files.AsEnumerable());
  }

  public string GetUrl(string path)
  {
    throw new NotImplementedException();
  }

  public async Task<Stream> ReadAsync(string path, CancellationToken ct)
  {
    var fullPath = Path.Combine(_rootPath, path);

    try
    {
      return new FileStream(
        fullPath,
        FileMode.Open,
        FileAccess.Read,
        FileShare.Read,
        81920,
        useAsync: true
      );
    }
    catch (FileNotFoundException)
    {
      throw new NotFoundException($"File not found: {path}");
    }
    catch (DirectoryNotFoundException)
    {
      throw new NotFoundException($"Directory not found: {path}");
    }
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
