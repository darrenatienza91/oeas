using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Departments
{
  public interface IDepartmentService
  {
    Task<IEnumerable<Department>> GetAllDepartmentsAsync();
  }

  public class DepartmentService(AppDbContext appDbContext) : IDepartmentService
  {
    private readonly AppDbContext appDbContext = appDbContext;

    public async Task<IEnumerable<Department>> GetAllDepartmentsAsync()
    {
      return await appDbContext.Departments.ToListAsync();
    }
  }
}
