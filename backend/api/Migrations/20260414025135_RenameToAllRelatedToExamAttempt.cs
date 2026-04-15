using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class RenameToAllRelatedToExamAttempt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExamTakerAnswers");

            migrationBuilder.DropTable(
                name: "ExamTakers");

            migrationBuilder.CreateTable(
                name: "ExamAttempts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserDetailId = table.Column<int>(type: "INTEGER", nullable: false),
                    ExamId = table.Column<int>(type: "INTEGER", nullable: false),
                    RecUrl = table.Column<string>(type: "TEXT", nullable: false),
                    CreateDate = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    CurrentQuestionIndex = table.Column<int>(type: "INTEGER", nullable: false),
                    CheckingStatus = table.Column<int>(type: "INTEGER", nullable: false),
                    IsAttemptSubmitted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExamAttempts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExamAttempts_Exams_ExamId",
                        column: x => x.ExamId,
                        principalTable: "Exams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ExamAttempts_UserDetails_UserDetailId",
                        column: x => x.UserDetailId,
                        principalTable: "UserDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ExamAttemptAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AnswerId = table.Column<int>(type: "INTEGER", nullable: true),
                    ExamAttemptId = table.Column<int>(type: "INTEGER", nullable: false),
                    QuestionId = table.Column<int>(type: "INTEGER", nullable: false),
                    AcquiredPoints = table.Column<int>(type: "INTEGER", nullable: false),
                    AnswerText = table.Column<string>(type: "TEXT", nullable: false),
                    CreateDate = table.Column<DateTimeOffset>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExamAttemptAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExamAttemptAnswers_Answers_AnswerId",
                        column: x => x.AnswerId,
                        principalTable: "Answers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ExamAttemptAnswers_ExamAttempts_ExamAttemptId",
                        column: x => x.ExamAttemptId,
                        principalTable: "ExamAttempts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ExamAttemptAnswers_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExamAttemptAnswers_AnswerId",
                table: "ExamAttemptAnswers",
                column: "AnswerId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamAttemptAnswers_ExamAttemptId",
                table: "ExamAttemptAnswers",
                column: "ExamAttemptId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamAttemptAnswers_QuestionId",
                table: "ExamAttemptAnswers",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamAttempts_ExamId",
                table: "ExamAttempts",
                column: "ExamId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamAttempts_UserDetailId",
                table: "ExamAttempts",
                column: "UserDetailId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExamAttemptAnswers");

            migrationBuilder.DropTable(
                name: "ExamAttempts");

            migrationBuilder.CreateTable(
                name: "ExamTakers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ExamId = table.Column<int>(type: "INTEGER", nullable: false),
                    UserDetailId = table.Column<int>(type: "INTEGER", nullable: false),
                    CheckingStatus = table.Column<int>(type: "INTEGER", nullable: false),
                    CreateDate = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    CurrentQuestionIndex = table.Column<int>(type: "INTEGER", nullable: false),
                    IsAttemptSubmitted = table.Column<bool>(type: "INTEGER", nullable: false),
                    RecUrl = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExamTakers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExamTakers_Exams_ExamId",
                        column: x => x.ExamId,
                        principalTable: "Exams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ExamTakers_UserDetails_UserDetailId",
                        column: x => x.UserDetailId,
                        principalTable: "UserDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ExamTakerAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AnswerId = table.Column<int>(type: "INTEGER", nullable: true),
                    ExamTakerId = table.Column<int>(type: "INTEGER", nullable: false),
                    QuestionId = table.Column<int>(type: "INTEGER", nullable: false),
                    AcquiredPoints = table.Column<int>(type: "INTEGER", nullable: false),
                    AnswerText = table.Column<string>(type: "TEXT", nullable: false),
                    CreateDate = table.Column<DateTimeOffset>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExamTakerAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExamTakerAnswers_Answers_AnswerId",
                        column: x => x.AnswerId,
                        principalTable: "Answers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ExamTakerAnswers_ExamTakers_ExamTakerId",
                        column: x => x.ExamTakerId,
                        principalTable: "ExamTakers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ExamTakerAnswers_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExamTakerAnswers_AnswerId",
                table: "ExamTakerAnswers",
                column: "AnswerId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamTakerAnswers_ExamTakerId",
                table: "ExamTakerAnswers",
                column: "ExamTakerId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamTakerAnswers_QuestionId",
                table: "ExamTakerAnswers",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamTakers_ExamId",
                table: "ExamTakers",
                column: "ExamId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamTakers_UserDetailId",
                table: "ExamTakers",
                column: "UserDetailId");
        }
    }
}
