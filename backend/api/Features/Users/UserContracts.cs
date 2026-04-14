using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Helpers;
using api.Models;

namespace api.Features.Users
{
  public record UserListDto(
    int Id,
    string UserName,
    string FirstName,
    string LastName,
    string Role,
    bool IsResetPassword,
    bool IsActive,
    string? DepartmentName
  );

  public record UserDetailDto(
    string UserName,
    string FirstName,
    string LastName,
    string MiddleName,
    string Role,
    int? DepartmentId,
    bool IsActive,
    int? SectionId
  );

  public sealed record ProfileDetailDto(
    string UserName,
    string FirstName,
    string LastName,
    string? MiddleName,
    string? Address,
    string? ContactNumber,
    bool HasProfile
  );

  public sealed record UpdateProfileDetailDto(
    string FirstName,
    string LastName,
    string? MiddleName,
    string ContactNumber,
    string Address
  );

  public sealed record AddProfileDetailDto(
    string FirstName,
    string LastName,
    string? MiddleName,
    string Address,
    string ContactNumber
  );

  public sealed record ChangePasswordDto(string CurrentPassword, string NewPassword);

  public record PatchUserDto(int? DepartmentId, int? SectionId);

  public static class UserMapper
  {
    internal static UserListDto MapToUserListDto(User user)
    {
      return new(
        Id: user.Id,
        UserName: user.UserName,
        FirstName: user.UserDetail?.FirstName ?? "",
        LastName: user.UserDetail?.LastName ?? "",
        DepartmentName: user.UserDetail?.Department?.Name,
        Role: user.Role,
        IsResetPassword: user.IsResetPassword,
        IsActive: user.IsActive
      );
    }

    internal static UserDetailDto MapUserToUserReadDto(User user)
    {
      return new(
        UserName: user.UserName,
        FirstName: user.UserDetail?.FirstName ?? "",
        MiddleName: user.UserDetail?.MiddleName ?? "",
        LastName: user.UserDetail?.LastName ?? "",
        Role: user.Role,
        DepartmentId: user.UserDetail?.DepartmentId,
        SectionId: user.UserDetail?.SectionId,
        IsActive: user.IsActive
      );
    }

    internal static ProfileDetailDto MapUserToProfileDetailDto(User user)
    {
      return new(
        UserName: user.UserName,
        FirstName: user.UserDetail?.FirstName ?? "",
        MiddleName: user.UserDetail?.MiddleName ?? "",
        LastName: user.UserDetail?.LastName ?? "",
        Address: user.UserDetail?.Address,
        ContactNumber: user.UserDetail?.ContactNumber,
        HasProfile: user.HasProfile
      );
    }

    internal static void UpdateUserProfile(User user, UpdateProfileDetailDto updatePRofileDetailDto)
    {
      user.UserDetail?.FirstName = updatePRofileDetailDto.FirstName ?? "";
      user.UserDetail?.MiddleName = updatePRofileDetailDto.MiddleName ?? "";
      user.UserDetail?.LastName = updatePRofileDetailDto.LastName ?? "";
      user.UserDetail?.ContactNumber = updatePRofileDetailDto.ContactNumber ?? "";
      user.UserDetail?.Address = updatePRofileDetailDto.Address ?? "";
    }

    internal static void AddUserProfile(User user, AddProfileDetailDto addProfileDetailDto)
    {
      user.UserDetail = new()
      {
        FirstName = addProfileDetailDto.FirstName ?? "",
        MiddleName = addProfileDetailDto.MiddleName ?? "",
        LastName = addProfileDetailDto.LastName ?? "",
        Address = addProfileDetailDto.Address ?? "",
        ContactNumber = addProfileDetailDto.ContactNumber ?? "",
      };
    }

    internal static void ApplyPatch(User user, PatchUserDto dto, HashSet<string> modified)
    {
      user.UserDetail ??= new UserDetail();

      new PatchBuilder<PatchUserDto>(dto, modified)
        .Map(
          nameof(dto.DepartmentId),
          x => x.DepartmentId,
          value => user.UserDetail.DepartmentId = value
        )
        .Map(nameof(dto.SectionId), x => x.SectionId, value => user.UserDetail.SectionId = value);
    }
  }
}
