using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
  public interface ISectionService
  {
    Task<IEnumerable<Section>> GetSections();
  }

  public class SectionService(AppDbContext appDbContext) : ISectionService
  {
    private readonly AppDbContext appDbContext = appDbContext;

    public async Task<IEnumerable<Section>> GetSections() =>
      await appDbContext.Sections.ToListAsync();
  }
}
