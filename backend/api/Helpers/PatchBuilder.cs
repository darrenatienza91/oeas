using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers;

public class PatchBuilder<TDto>(TDto dto, HashSet<string> modified)
{
  private readonly TDto _dto = dto;
  private readonly HashSet<string> _modified = modified;

  public PatchBuilder<TDto> Map<TValue>(
    string propertyName,
    Func<TDto, TValue> getValue,
    Action<TValue> apply
  )
  {
    if (_modified.Contains(propertyName))
    {
      apply(getValue(_dto));
    }

    return this;
  }
}
