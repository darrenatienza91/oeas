using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Contracts
{
  public record SectionDTO(int Id, string Name);

  public static class SectionMapper
  {
    public static SectionDTO MapToSectionDto(Section section) => new(section.Id, section.Name);
  }
}
