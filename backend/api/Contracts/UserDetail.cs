using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Contracts
{
  public record UserDetailDto(int Id, string FirstName, int UserId, int? SectionId);

  public record AddUserDetailDto(string FirstName, int UserId);

  public static class UserDetailMapper
  {
    public static UserDetailDto MapToUserDetailDto(UserDetail userDetail)
    {
      return new(
        Id: userDetail.Id,
        FirstName: userDetail.FirstName,
        UserId: userDetail.UserId,
        SectionId: userDetail.SectionId
      );
    }

    public static UserDetail MapToUserDetail(AddUserDetailDto dto)
    {
      return new() { FirstName = dto.FirstName, UserId = dto.UserId };
    }
  }
}
