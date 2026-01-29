using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  public class UserDetail : BaseEntity<int>
  {
    public string FirstName { get; set; } = string.Empty;
    public string MiddleName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Address { get; set; } = null!;
    public string ContactNumber { get; set; } = null!;
    public int? DepartmentId { get; set; }
    public int? SectionId { get; set; }
    public int UserId { get; set; }
    public string? ContactNumberPrefix { get; set; }
    public User? User { get; set; }

    // Navigation
    public ICollection<Exam> Exams { get; set; } = new List<Exam>();
    public ICollection<ExamTaker> ExamTakers { get; set; } = new List<ExamTaker>();
  }
}
