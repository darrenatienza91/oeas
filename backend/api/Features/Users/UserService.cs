using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Users
{
  public interface IUserService
  {
    Task<IEnumerable<User>> GetUsersAsync(string criteria);
    Task<User?> GetUserByUserNameAsync(string userName);

    Task<User?> GetUserByIdAsync(int id);
    Task<User> AddUserAsync(User user);
    Task AddUserDetailAsync(UserDetail userDetail);
    Task EditAsync(User user);
    Task DeleteUser(User user);
  }

  public class UserService(AppDbContext appDbContext) : IUserService
  {
    private readonly AppDbContext appDbContext = appDbContext;

    public async Task<User?> GetUserByIdAsync(int id)
    {
      return await appDbContext
        .Users.Include(x => x.UserDetail)
        .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<UserDetail> AddUserDetailAsync(UserDetail userDetail)
    {
      await appDbContext.UserDetails.AddAsync(userDetail);

      await appDbContext.SaveChangesAsync();

      return userDetail;
    }

    public async Task<IEnumerable<User>> GetUsersAsync(string criteria)
    {
      return await appDbContext
        .Users.Include(x => x.UserDetail)
          .ThenInclude(x => x.Department)
        .Where(x => EF.Functions.Like(x.UserName, $"%{criteria}%"))
        .ToListAsync();
    }

    public async Task<User?> GetUserByUserNameAsync(string userName)
    {
      return await appDbContext
        .Users.Include(x => x.UserDetail)
        .FirstOrDefaultAsync(x => x.UserName == userName);
    }

    public async Task<User> AddUserAsync(User user)
    {
      await appDbContext.Users.AddAsync(user);

      await appDbContext.SaveChangesAsync();

      return user;
    }

    Task IUserService.AddUserDetailAsync(UserDetail userDetail)
    {
      return AddUserDetailAsync(userDetail);
    }

    public async Task EditAsync(User user)
    {
      appDbContext.Users.Update(user);

      await appDbContext.SaveChangesAsync();
    }

    public async Task DeleteUser(User user)
    {
      appDbContext.Users.Remove(user);

      await appDbContext.SaveChangesAsync();
    }
  }
}
