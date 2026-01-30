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
    public DbSet<Answer> Answers => Set<Answer>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Exam> Exams => Set<Exam>();
    public DbSet<ExamTaker> ExamTakers => Set<ExamTaker>();
    public DbSet<ExamTakerAnswer> ExamTakerAnswers => Set<ExamTakerAnswer>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<Section> Sections => Set<Section>();
    public DbSet<UserDetail> UserDetails => Set<UserDetail>();

    public AppDbContext(DbContextOptions<AppDbContext> options)
      : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
  }
}
