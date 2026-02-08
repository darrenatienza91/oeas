using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Contracts;
using FluentValidation;

namespace api.Endpoints.Validators
{
  public abstract class ExamWriteDtoValidatorBase<T> : AbstractValidator<T> where T : ExamWriteDto
  {
    protected ExamWriteDtoValidatorBase()
    {
      RuleFor(x => x.Name).NotEmpty();
      RuleFor(x => x.SectionId).GreaterThan(0);
      RuleFor(x => x.Duration).GreaterThan(0);
      RuleFor(x => x.Instructions).NotEmpty();
      RuleFor(x => x.Subject).NotEmpty();
    }
  }

  public sealed class CreateExamDtoValidator : ExamWriteDtoValidatorBase<AddExamDto>
  {
    public CreateExamDtoValidator()
    {
      RuleFor(x => x.StartOn).GreaterThan(DateTimeOffset.UtcNow);
    }
  }

  public sealed class EditExamDtoValidator : ExamWriteDtoValidatorBase<PatchExamDto>
  {
    public EditExamDtoValidator()
    {
      RuleFor(x => x.StartOn).GreaterThan(DateTimeOffset.UtcNow.AddMinutes(-1));
    }
  }
}
