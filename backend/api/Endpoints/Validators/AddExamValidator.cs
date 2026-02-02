using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Contracts;
using FluentValidation;

namespace api.Endpoints.Validators
{
  public sealed class CreateExamDtoValidator : AbstractValidator<AddExamDto>
  {
    public CreateExamDtoValidator()
    {
      RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.");
      RuleFor(x => x.StartOn).GreaterThan(DateTimeOffset.UtcNow);
      RuleFor(x => x.SectionId).GreaterThan(0);
      RuleFor(x => x.Duration).GreaterThan(0);
      RuleFor(x => x.Instructions).NotEmpty().WithMessage("Instructions is required.");
      RuleFor(x => x.Subject).NotEmpty().WithMessage("Subject is required.");
    }
  }
}
