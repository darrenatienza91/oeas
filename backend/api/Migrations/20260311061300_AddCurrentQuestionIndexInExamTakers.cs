using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
  /// <inheritdoc />
  public partial class AddCurrentQuestionIndexInExamTakers : Migration
  {
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.AddColumn<int>(
        name: "CurrentQuestionIndex",
        table: "ExamTakers",
        type: "INTEGER",
        nullable: false,
        defaultValue: 0
      );
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropColumn(name: "CurrentQuestionIndex", table: "ExamTakers");
    }
  }
}
