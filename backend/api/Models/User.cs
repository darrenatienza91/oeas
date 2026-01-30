using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api.Models
{
  public class User : BaseEntity<int>
  {
    public string UserName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public bool IsResetPassword { get; set; }
    public string Role { get; set; } = Roles.Student;
    public UserDetail? UserDetail { get; set; }
  }

  public class UserConfiguration : IEntityTypeConfiguration<User>
  {
    public void Configure(EntityTypeBuilder<User> entity)
    {
      entity.ToTable("Users");

      entity.HasKey(e => e.Id);

      entity.Property(t => t.Role).HasDefaultValue(Roles.Student);
      entity
        .HasOne(u => u.UserDetail)
        .WithOne(p => p.User)
        .HasForeignKey<UserDetail>(p => p.UserId);
      ;
    }
  }
}
