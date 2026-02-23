using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Features.Departments
{
  public record DepartmentListDto(int Id, string Name);

  public static class DepartmentMapper
  {
    public static DepartmentListDto MapDepartmentToDepartmentListDto(Department department)
    {
      return new(Id: department.Id, Name: department.Name);
    }
  }
}
