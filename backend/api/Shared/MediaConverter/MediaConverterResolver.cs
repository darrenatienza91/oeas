using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Shared.MediaConverter;

public interface IMediaConverterResolver
{
  IMediaConverter Resolve(ConverterFormats format);
}

public class MediaConverterResolver(IEnumerable<IMediaConverter> converters)
  : IMediaConverterResolver
{
  private readonly IEnumerable<IMediaConverter> _converters = converters;

  public IMediaConverter Resolve(ConverterFormats format)
  {
    return _converters.First(x =>
      x.Format.ToString().Equals(format.ToString(), StringComparison.OrdinalIgnoreCase)
    );
  }
}
