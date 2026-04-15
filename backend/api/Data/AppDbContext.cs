using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Auth;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
  public class AppDbContext(DbContextOptions<AppDbContext> options, ICurrentUser currentUser)
    : DbContext(options)
  {
    public DbSet<User> Users => Set<User>();
    public DbSet<Answer> Answers => Set<Answer>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Exam> Exams => Set<Exam>();
    public DbSet<ExamAttempt> ExamAttempts => Set<ExamAttempt>();
    public DbSet<ExamAttemptAnswer> ExamAttemptAnswers => Set<ExamAttemptAnswer>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<Section> Sections => Set<Section>();
    public DbSet<UserDetail> UserDetails => Set<UserDetail>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

      modelBuilder
        .Entity<Exam>()
        .HasQueryFilter(x =>
          !currentUser.IsAuthenticated
          || (
            (currentUser.Role == Roles.Teacher && x.UserDetailId == currentUser.UserDetailId)
            || (
              currentUser.Role == Roles.Student
              && x.SectionId == currentUser.SectionId
              && x.IsActive
            )
          )
        );

      modelBuilder
        .Entity<ExamAttempt>()
        .HasQueryFilter(x =>
          !currentUser.IsAuthenticated
          || (
            currentUser.Role == Roles.Student
            && x.UserDetailId == currentUser.UserDetailId
            && x.Exam.SectionId == currentUser.SectionId
            && x.Exam.IsActive
          )
        );

      modelBuilder
        .Entity<Question>()
        .HasQueryFilter(x =>
          !currentUser.IsAuthenticated
          || (
            (currentUser.Role == Roles.Teacher && x.Exam.UserDetailId == currentUser.UserDetailId)
            || (
              currentUser.Role == Roles.Student
              && x.Exam.SectionId == currentUser.SectionId
              && x.Exam.IsActive
            )
          )
        );
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
      foreach (var entry in ChangeTracker.Entries<IUserOwned>())
      {
        if (entry.State == EntityState.Added)
        {
          entry.Entity.UserDetailId = currentUser.UserDetailId;
        }
      }

      foreach (var entry in ChangeTracker.Entries<IOptionalUserOwned>())
      {
        if (entry.State == EntityState.Added)
        {
          entry.Entity.UserDetailId = currentUser.UserDetailId;
        }
      }

      foreach (var entry in ChangeTracker.Entries<IHasCreateDate>())
      {
        if (entry.State == EntityState.Added)
        {
          entry.Entity.CreateDate = DateTimeOffset.UtcNow;
        }
      }

      return await base.SaveChangesAsync(cancellationToken);
    }
  }
}
