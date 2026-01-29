using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
  public class UserDetailService(AppDbContext appDbContext)
  {
    private readonly AppDbContext appDbContext = appDbContext;

    public async Task<UserDetail?> GetUserDetailAsync(int id)
    {
      return await appDbContext.UserDetails.FindAsync(id);
    }

    public async Task<UserDetail> AddUserDetailAsync(UserDetail userDetail)
    {
      await appDbContext.UserDetails.AddAsync(userDetail);

      await appDbContext.SaveChangesAsync();

      return userDetail;
    }
  }
}
