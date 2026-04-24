using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using api.Auth;
using api.Data;
using api.Endpoints;
using api.Exceptions;
using api.Features.Departments;
using api.Features.ExamAttempts;
using api.Features.Exams;
using api.Features.Users;
using api.Models;
using api.Services;
using api.Shared;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// JWT config values
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

builder.Services.Configure<AppSetting>(builder.Configuration.GetSection("ApiSettings"));

builder.Services.ConfigureHttpJsonOptions(options =>
{
  options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

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

builder.Services.Configure<FormOptions>(options =>
{
  options.MultipartBodyLengthLimit = long.MaxValue;
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<IExamService, ExamService>();
builder.Services.AddScoped<ISectionService, SectionService>();
builder.Services.AddScoped<IQuestionService, QuestionService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IExamAttemptService, ExamAttemptService>();
builder.Services.AddScoped<IChunkedUploadService, ChunkedUploadService>();
builder.Services.AddScoped<IFileStorage, LocalFileStorage>();
builder.Services.AddScoped<IExamAttemptRecordingService, ExamAttemptRecordingService>();

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

app.UseExceptionHandler(ExceptionHandler.Handle);

// ⚠️ Order matters
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
var api = app.MapGroup("/api");

api.MapAuthEndpoints();
api.MapUserEndpoints();
api.MapExamEndpoints();
api.MapExamAttemptEndpoints();
api.MapQuestionEndpoints();
api.MapSectionEndpoints();
api.MapDepartmentEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.MapOpenApi();
}

app.UseHttpsRedirection();

await app.RunAsync();
