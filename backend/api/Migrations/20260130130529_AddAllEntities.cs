using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
  /// <inheritdoc />
  public partial class AddAllEntities : Migration
  {
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropColumn(name: "UserType", table: "Users");

      migrationBuilder.AddColumn<bool>(
        name: "IsResetPassword",
        table: "Users",
        type: "INTEGER",
        nullable: false,
        defaultValue: false
      );

      migrationBuilder.AddColumn<string>(
        name: "Role",
        table: "Users",
        type: "TEXT",
        nullable: false,
        defaultValue: "Student"
      );

      migrationBuilder.AddColumn<string>(
        name: "Address",
        table: "UserDetails",
        type: "TEXT",
        nullable: false,
        defaultValue: ""
      );

      migrationBuilder.AddColumn<string>(
        name: "ContactNumber",
        table: "UserDetails",
        type: "TEXT",
        nullable: false,
        defaultValue: ""
      );

      migrationBuilder.AddColumn<string>(
        name: "ContactNumberPrefix",
        table: "UserDetails",
        type: "TEXT",
        nullable: true
      );

      migrationBuilder.AddColumn<int>(
        name: "DepartmentId",
        table: "UserDetails",
        type: "INTEGER",
        nullable: true
      );

      migrationBuilder.AddColumn<string>(
        name: "LastName",
        table: "UserDetails",
        type: "TEXT",
        nullable: false,
        defaultValue: ""
      );

      migrationBuilder.AddColumn<string>(
        name: "MiddleName",
        table: "UserDetails",
        type: "TEXT",
        nullable: false,
        defaultValue: ""
      );

      migrationBuilder.AddColumn<int>(
        name: "SectionId",
        table: "UserDetails",
        type: "INTEGER",
        nullable: true
      );

      migrationBuilder.CreateTable(
        name: "Departments",
        columns: table => new
        {
          Id = table
            .Column<int>(type: "INTEGER", nullable: false)
            .Annotation("Sqlite:Autoincrement", true),
          Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
        },
        constraints: table =>
        {
          table.PrimaryKey("PK_Departments", x => x.Id);
        }
      );

      migrationBuilder.CreateTable(
        name: "Sections",
        columns: table => new
        {
          id = table
            .Column<int>(type: "INTEGER", nullable: false)
            .Annotation("Sqlite:Autoincrement", true),
          Name = table.Column<string>(type: "TEXT", nullable: false),
          DepartmentId = table.Column<int>(type: "INTEGER", nullable: false),
        },
        constraints: table =>
        {
          table.PrimaryKey("PK_Sections", x => x.id);
          table.ForeignKey(
            name: "FK_Sections_Departments_DepartmentId",
            column: x => x.DepartmentId,
            principalTable: "Departments",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict
          );
        }
      );

      migrationBuilder.CreateTable(
        name: "Exams",
        columns: table => new
        {
          Id = table
            .Column<int>(type: "INTEGER", nullable: false)
            .Annotation("Sqlite:Autoincrement", true),
          Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
          Subject = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
          StartOn = table.Column<DateTime>(type: "TEXT", nullable: false),
          Duration = table.Column<int>(type: "INTEGER", nullable: false),
          SectionId = table.Column<int>(type: "INTEGER", nullable: false),
          IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
          Instructions = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false),
          UserDetailId = table.Column<int>(type: "INTEGER", nullable: true),
        },
        constraints: table =>
        {
          table.PrimaryKey("PK_Exams", x => x.Id);
          table.ForeignKey(
            name: "FK_Exams_Sections_SectionId",
            column: x => x.SectionId,
            principalTable: "Sections",
            principalColumn: "id",
            onDelete: ReferentialAction.Restrict
          );
          table.ForeignKey(
            name: "FK_Exams_UserDetails_UserDetailId",
            column: x => x.UserDetailId,
            principalTable: "UserDetails",
            principalColumn: "Id",
            onDelete: ReferentialAction.SetNull
          );
        }
      );

      migrationBuilder.CreateTable(
        name: "ExamTakers",
        columns: table => new
        {
          Id = table
            .Column<int>(type: "INTEGER", nullable: false)
            .Annotation("Sqlite:Autoincrement", true),
          UserDetailId = table.Column<int>(type: "INTEGER", nullable: false),
          ExamId = table.Column<int>(type: "INTEGER", nullable: false),
          RecUrl = table.Column<string>(type: "TEXT", nullable: false),
          CreateDate = table.Column<DateTime>(type: "TEXT", nullable: false),
        },
        constraints: table =>
        {
          table.PrimaryKey("PK_ExamTakers", x => x.Id);
          table.ForeignKey(
            name: "FK_ExamTakers_Exams_ExamId",
            column: x => x.ExamId,
            principalTable: "Exams",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict
          );
          table.ForeignKey(
            name: "FK_ExamTakers_UserDetails_UserDetailId",
            column: x => x.UserDetailId,
            principalTable: "UserDetails",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict
          );
        }
      );

      migrationBuilder.CreateTable(
        name: "Questions",
        columns: table => new
        {
          Id = table
            .Column<int>(type: "INTEGER", nullable: false)
            .Annotation("Sqlite:Autoincrement", true),
          Description = table.Column<string>(type: "TEXT", nullable: false),
          Points = table.Column<int>(type: "INTEGER", nullable: false),
          ExamId = table.Column<int>(type: "INTEGER", nullable: false),
        },
        constraints: table =>
        {
          table.PrimaryKey("PK_Questions", x => x.Id);
          table.ForeignKey(
            name: "FK_Questions_Exams_ExamId",
            column: x => x.ExamId,
            principalTable: "Exams",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict
          );
        }
      );

      migrationBuilder.CreateTable(
        name: "Answers",
        columns: table => new
        {
          Id = table
            .Column<int>(type: "INTEGER", nullable: false)
            .Annotation("Sqlite:Autoincrement", true),
          Points = table.Column<int>(type: "INTEGER", nullable: false),
          IsCorrect = table.Column<bool>(type: "INTEGER", nullable: false),
          QuestionId = table.Column<int>(type: "INTEGER", nullable: false),
        },
        constraints: table =>
        {
          table.PrimaryKey("PK_Answers", x => x.Id);
          table.ForeignKey(
            name: "FK_Answers_Questions_QuestionId",
            column: x => x.QuestionId,
            principalTable: "Questions",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict
          );
        }
      );

      migrationBuilder.CreateTable(
        name: "ExamTakerAnswers",
        columns: table => new
        {
          Id = table
            .Column<int>(type: "INTEGER", nullable: false)
            .Annotation("Sqlite:Autoincrement", true),
          AnswerId = table.Column<int>(type: "INTEGER", nullable: true),
          ExamTakerId = table.Column<int>(type: "INTEGER", nullable: false),
          QuestionId = table.Column<int>(type: "INTEGER", nullable: false),
          AnswerText = table.Column<string>(type: "TEXT", nullable: false),
          CreateDate = table.Column<DateTime>(type: "TEXT", nullable: false),
        },
        constraints: table =>
        {
          table.PrimaryKey("PK_ExamTakerAnswers", x => x.Id);
          table.ForeignKey(
            name: "FK_ExamTakerAnswers_Answers_AnswerId",
            column: x => x.AnswerId,
            principalTable: "Answers",
            principalColumn: "Id",
            onDelete: ReferentialAction.SetNull
          );
          table.ForeignKey(
            name: "FK_ExamTakerAnswers_ExamTakers_ExamTakerId",
            column: x => x.ExamTakerId,
            principalTable: "ExamTakers",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict
          );
          table.ForeignKey(
            name: "FK_ExamTakerAnswers_Questions_QuestionId",
            column: x => x.QuestionId,
            principalTable: "Questions",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict
          );
        }
      );

      migrationBuilder.CreateIndex(
        name: "IX_UserDetails_DepartmentId",
        table: "UserDetails",
        column: "DepartmentId"
      );

      migrationBuilder.CreateIndex(
        name: "IX_UserDetails_SectionId",
        table: "UserDetails",
        column: "SectionId"
      );

      migrationBuilder.CreateIndex(
        name: "IX_Answers_QuestionId",
        table: "Answers",
        column: "QuestionId"
      );

      migrationBuilder.CreateIndex(name: "IX_Exams_SectionId", table: "Exams", column: "SectionId");

      migrationBuilder.CreateIndex(
        name: "IX_Exams_UserDetailId",
        table: "Exams",
        column: "UserDetailId"
      );

      migrationBuilder.CreateIndex(
        name: "IX_ExamTakerAnswers_AnswerId",
        table: "ExamTakerAnswers",
        column: "AnswerId"
      );

      migrationBuilder.CreateIndex(
        name: "IX_ExamTakerAnswers_ExamTakerId",
        table: "ExamTakerAnswers",
        column: "ExamTakerId"
      );

      migrationBuilder.CreateIndex(
        name: "IX_ExamTakerAnswers_QuestionId",
        table: "ExamTakerAnswers",
        column: "QuestionId"
      );

      migrationBuilder.CreateIndex(
        name: "IX_ExamTakers_ExamId",
        table: "ExamTakers",
        column: "ExamId"
      );

      migrationBuilder.CreateIndex(
        name: "IX_ExamTakers_UserDetailId",
        table: "ExamTakers",
        column: "UserDetailId"
      );

      migrationBuilder.CreateIndex(
        name: "IX_Questions_ExamId",
        table: "Questions",
        column: "ExamId"
      );

      migrationBuilder.CreateIndex(
        name: "IX_Sections_DepartmentId",
        table: "Sections",
        column: "DepartmentId"
      );

      migrationBuilder.AddForeignKey(
        name: "FK_UserDetails_Departments_DepartmentId",
        table: "UserDetails",
        column: "DepartmentId",
        principalTable: "Departments",
        principalColumn: "Id",
        onDelete: ReferentialAction.Restrict
      );

      migrationBuilder.AddForeignKey(
        name: "FK_UserDetails_Sections_SectionId",
        table: "UserDetails",
        column: "SectionId",
        principalTable: "Sections",
        principalColumn: "id"
      );
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropForeignKey(
        name: "FK_UserDetails_Departments_DepartmentId",
        table: "UserDetails"
      );

      migrationBuilder.DropForeignKey(
        name: "FK_UserDetails_Sections_SectionId",
        table: "UserDetails"
      );

      migrationBuilder.DropTable(name: "ExamTakerAnswers");

      migrationBuilder.DropTable(name: "Answers");

      migrationBuilder.DropTable(name: "ExamTakers");

      migrationBuilder.DropTable(name: "Questions");

      migrationBuilder.DropTable(name: "Exams");

      migrationBuilder.DropTable(name: "Sections");

      migrationBuilder.DropTable(name: "Departments");

      migrationBuilder.DropIndex(name: "IX_UserDetails_DepartmentId", table: "UserDetails");

      migrationBuilder.DropIndex(name: "IX_UserDetails_SectionId", table: "UserDetails");

      migrationBuilder.DropColumn(name: "IsResetPassword", table: "Users");

      migrationBuilder.DropColumn(name: "Role", table: "Users");

      migrationBuilder.DropColumn(name: "Address", table: "UserDetails");

      migrationBuilder.DropColumn(name: "ContactNumber", table: "UserDetails");

      migrationBuilder.DropColumn(name: "ContactNumberPrefix", table: "UserDetails");

      migrationBuilder.DropColumn(name: "DepartmentId", table: "UserDetails");

      migrationBuilder.DropColumn(name: "LastName", table: "UserDetails");

      migrationBuilder.DropColumn(name: "MiddleName", table: "UserDetails");

      migrationBuilder.DropColumn(name: "SectionId", table: "UserDetails");

      migrationBuilder.AddColumn<int>(
        name: "UserType",
        table: "Users",
        type: "INTEGER",
        nullable: true,
        defaultValue: 1
      );
    }
  }
}
