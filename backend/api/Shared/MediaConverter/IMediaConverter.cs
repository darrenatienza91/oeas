using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Shared.MediaConverter
{
  public interface IMediaConverter
  {
    ConverterFormats Format { get; }
    Task Convert(string finalFilePath, string tempFilePath, CancellationToken ct);
  }

  public enum ConverterFormats
  {
    Mp4,
  }
}
