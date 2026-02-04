using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Auth;
using api.Data;
using api.Endpoints;
using api.Exceptions;
using api.Models;
using api.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// JWT config values
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

// Add Authentication
builder
  .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options =>
  {
    options.TokenValidationParameters = new TokenValidationParameters
    {
      ValidateIssuer = true,
      ValidateAudience = true,
      ValidateLifetime = true,
      ValidateIssuerSigningKey = true,

      ValidIssuer = jwtSettings["Issuer"],
      ValidAudience = jwtSettings["Audience"],
      IssuerSigningKey = new SymmetricSecurityKey(key),
      RoleClaimType = ClaimTypes.Role,
    };
  });

// Add Authorization
builder.Services.AddAuthorization();

// Needed for accessing HttpContext in services
builder.Services.AddHttpContextAccessor();

// Current user abstraction
builder.Services.AddScoped<ICurrentUser, CurrentUser>();

builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<UserDetailService>();
builder.Services.AddScoped<IExamService, ExamService>();
builder.Services.AddScoped<ISectionService, SectionService>();
builder.Services.AddScoped<IQuestionService, QuestionService>();

builder.Services.AddDbContext<AppDbContext>(options =>
  options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);
builder.Services.AddCors(options =>
{
  options.AddPolicy(
    "AllowFrontend",
    policy =>
    {
      policy
        .WithOrigins("http://localhost:4200") // your frontend
        .AllowAnyHeader()
        .AllowCredentials()
        .AllowAnyMethod();
    }
  );
});
var app = builder.Build();

app.UseExceptionHandler(errorApp =>
{
  errorApp.Run(async context =>
  {
    var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;

    ProblemDetails problem;

    switch (exception)
    {
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
});

// ⚠️ Order matters
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
var api = app.MapGroup("/api");

api.MapAuthEndpoints();
api.MapUserDetailEndpoints();
api.MapUserEndpoints();
api.MapExamEndpoints();
api.MapQuestionEndpoints();
api.MapSectionEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();
