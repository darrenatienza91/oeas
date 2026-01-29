using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
  public class UserService(AppDbContext appDbContext)
  {
    private readonly AppDbContext appDbContext = appDbContext;

    public async Task<User?> GetUsersAsync(string userName)
    {
      return await appDbContext.Users.FirstOrDefaultAsync(x => x.UserName == userName);
    }

    public async Task<User> AddUserAsync(User user)
    {
      await appDbContext.Users.AddAsync(user);

      await appDbContext.SaveChangesAsync();

      return user;
    }

    public async Task<UserDetail?> GetUserDetailByUserIdAsync(int id)
    {
      return await appDbContext.UserDetails.FirstOrDefaultAsync(x => x.UserId == id);
    }
  }
}
