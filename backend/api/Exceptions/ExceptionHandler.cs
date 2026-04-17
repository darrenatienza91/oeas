using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace api.Exceptions
{
  public static class ExceptionHandler
  {
    public static void Handle(IApplicationBuilder builder)
    {
      builder.Run(async context =>
      {
        var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;

        ProblemDetails problem;

        switch (exception)
        {
          case BusinessRuleException businessRuleViolationEx:
            problem = new ProblemDetails
            {
              Title = "Business Rule validation failed",
              Status = StatusCodes.Status422UnprocessableEntity,
              Detail = businessRuleViolationEx.Message,
              Instance = context.Request.Path,
            };
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            break;

          case DomainException domainEx:
            problem = new ProblemDetails
            {
              Title = "Domain validation failed",
              Status = StatusCodes.Status400BadRequest,
              Detail = domainEx.Message,
              Instance = context.Request.Path,
            };
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            break;

          case UploadFileException uploadFileEx:
            problem = new ProblemDetails
            {
              Title = "Upload file failed",
              Status = StatusCodes.Status400BadRequest,
              Detail = uploadFileEx.Message,
              Instance = context.Request.Path,
            };
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            break;

          case FinalizeUploadFileException finalizeUploadEx:
            problem = new ProblemDetails
            {
              Title = "Finalize upload file failed",
              Status = StatusCodes.Status400BadRequest,
              Detail = finalizeUploadEx.Message,
              Instance = context.Request.Path,
            };
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            break;

          case ValidationException validationEx: // FluentValidation
            var errors = validationEx
              .Errors.GroupBy(e => e.PropertyName)
              .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            problem = new ProblemDetails
            {
              Title = "Validation failed",
              Status = StatusCodes.Status400BadRequest,
              Detail = "One or more validation errors occurred.",
              Instance = context.Request.Path,
            };

            problem.Extensions["errors"] = errors;

            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            break;

          case NotFoundException notFoundEx:
            problem = new ProblemDetails
            {
              Title = "Resource not found",
              Status = StatusCodes.Status404NotFound,
              Detail = notFoundEx.Message,
              Instance = context.Request.Path,
            };
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            break;

          case InvalidPasswordException invalidPasswordEx:
            problem = new ProblemDetails
            {
              Title = "Invalid Password",
              Status = StatusCodes.Status400BadRequest,
              Detail = invalidPasswordEx.Message,
              Instance = context.Request.Path,
            };
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            break;

          default:
            problem = new ProblemDetails
            {
              Title = "Internal Server Error",
              Status = StatusCodes.Status500InternalServerError,
              Detail = "An unexpected error occurred.",
              Instance = context.Request.Path,
            };
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            break;
        }

        context.Response.ContentType = "application/problem+json";
        await context.Response.WriteAsJsonAsync(problem);
      });
    }
  }
}
