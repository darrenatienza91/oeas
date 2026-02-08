using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Contracts;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace api.Endpoints.Validators
{
  public sealed class ValidationFilter<T> : IEndpointFilter
  {
    public async ValueTask<object?> InvokeAsync(
      EndpointFilterInvocationContext context,
      EndpointFilterDelegate next
    )
    {
      var validator = context.HttpContext.RequestServices.GetService<IValidator<T>>();

      if (validator is null)
      {
        return await next(context);
      }

      var model = context.Arguments.OfType<T>().FirstOrDefault();

      if (model is null)
      {
        return Results.BadRequest("Invalid request payload.");
      }

      var result = await validator.ValidateAsync(model);

      if (!result.IsValid)
      {
        throw new ValidationException(errors: result.Errors);
      }

      return await next(context);
    }
  }
}
