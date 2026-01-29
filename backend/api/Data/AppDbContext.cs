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

      modelBuilder.Entity<Exam>(entity =>
      {
        entity.ToTable("exams");

        entity.HasKey(e => e.Id);

        entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();

        entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(255).IsRequired();

        entity.Property(e => e.Subject).HasColumnName("subject").HasMaxLength(255).IsRequired();

        entity
          .Property(e => e.StartOn)
          .HasColumnName("startOn")
          .HasColumnType("datetime")
          .IsRequired();

        entity.Property(e => e.Duration).HasColumnName("duration").IsRequired();

        entity.Property(e => e.SectionId).HasColumnName("sectionId").IsRequired();

        entity
          .Property(e => e.IsActive)
          .HasColumnName("isActive")
          .HasColumnType("tinyint(1)")
          .IsRequired();

        entity
          .Property(e => e.Instructions)
          .HasColumnName("instructions")
          .HasColumnType("text")
          .UseCollation("utf8mb4_0900_ai_ci")
          .IsRequired();

        entity.Property(e => e.UserDetailId).HasColumnName("userDetailId");

        // Relationships
        entity
          .HasOne(e => e.Section)
          .WithMany(s => s.Exams)
          .HasForeignKey(e => e.SectionId)
          .OnDelete(DeleteBehavior.Restrict);

        entity
          .HasOne(e => e.UserDetail)
          .WithMany(u => u.Exams)
          .HasForeignKey(e => e.UserDetailId)
          .OnDelete(DeleteBehavior.SetNull);
      });

      modelBuilder.Entity<Question>(entity =>
      {
        entity.ToTable("questions");

        entity.HasKey(q => q.Id);

        entity.Property(q => q.Id).HasColumnName("id").ValueGeneratedOnAdd();

        entity
          .Property(q => q.QuestionText)
          .HasColumnName("question")
          .HasColumnType("text")
          .UseCollation("utf8mb4_0900_ai_ci")
          .IsRequired();

        entity
          .Property(q => q.CorrectAnswer)
          .HasColumnName("correctAnswer")
          .HasColumnType("text")
          .UseCollation("utf8mb4_0900_ai_ci")
          .IsRequired();

        entity.Property(q => q.MaxPoints).HasColumnName("maxpoints").IsRequired();

        entity.Property(q => q.ExamId).HasColumnName("examId").IsRequired();

        entity.HasIndex(q => q.ExamId).HasDatabaseName("questions_FK");

        entity
          .HasOne(q => q.Exam)
          .WithMany(e => e.Questions)
          .HasForeignKey(q => q.ExamId)
          .OnDelete(DeleteBehavior.Restrict)
          .IsRequired();
      });

      modelBuilder
        .Entity<User>()
        .HasOne(u => u.UserDetail)
        .WithOne(p => p.User)
        .HasForeignKey<UserDetail>(p => p.UserId);
    }
  }
}
