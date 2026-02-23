using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Features.Departments
{
  public static class DepartmentEndpoints
  {
    public static void MapDepartmentEndpoints(this IEndpointRouteBuilder app)
    {
      app.MapGet("/departments", GetAllDepartments)
        .RequireAuthorization(policy => policy.RequireRole(Roles.SuperAdmin));
    }

    static async Task<IResult> GetAllDepartments(
      HttpContext context,
      IDepartmentService departmentService
    )
    {
      return Results.Ok(
        (await departmentService.GetAllDepartmentsAsync()).Select(
          DepartmentMapper.MapDepartmentToDepartmentListDto
        )
      );
    }
  }
}
