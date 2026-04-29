using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using api.Exceptions;

namespace api.Shared.MediaConverter
{
  public class Mp4MediaConverter : IMediaConverter
  {
    public ConverterFormats Format => ConverterFormats.Mp4;

    public async Task Convert(string finalFilePath, string tempFilePath, CancellationToken ct)
    {
      Directory.CreateDirectory(Path.GetDirectoryName(finalFilePath)!);

      // FFmpeg command
      var ffmpegArgs =
        $"-y -i \"{tempFilePath}\" -movflags faststart -c:v libx264 -c:a aac \"{finalFilePath}\"";

      var process = new Process
      {
        StartInfo = new ProcessStartInfo
        {
          FileName = "ffmpeg",
          Arguments = ffmpegArgs,
          RedirectStandardError = true,
          UseShellExecute = false,
          CreateNoWindow = true,
        },
      };

      process.Start();

      // Capture error output (VERY useful for debugging)
      var error = await process.StandardError.ReadToEndAsync(ct);

      await process.WaitForExitAsync(ct);

      if (process.ExitCode != 0)
      {
        throw new MediaConvertException($"FFmpeg failed: {error}");
      }
    }
  }
}
