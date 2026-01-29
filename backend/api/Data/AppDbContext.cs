using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
  public class AppDbContext : DbContext
  {
    public DbSet<User> Users => Set<User>();
    public DbSet<UserDetail> UserDetails => Set<UserDetail>();

    public AppDbContext(DbContextOptions<AppDbContext> options)
      : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      modelBuilder.Entity<User>().Property(t => t.UserType).HasDefaultValue(UserType.Student);
      modelBuilder
        .Entity<User>()
        .HasOne(u => u.UserDetail)
        .WithOne(p => p.User)
        .HasForeignKey<UserDetail>(p => p.UserId);
    }
  }
}
