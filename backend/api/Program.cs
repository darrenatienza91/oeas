using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Data;
using api.Endpoints;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
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

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<UserDetailService>();
builder.Services.AddScoped<IExamService, ExamService>();
builder.Services.AddScoped<ISectionService, SectionService>();

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

// ⚠️ Order matters
app.UseAuthentication();
app.UseAuthorization();

app.UseCors("AllowFrontend");
var api = app.MapGroup("/api");

api.MapAuthEndpoints();
api.MapUserDetailEndpoints();
api.MapUserEndpoints();
api.MapExamEndpoints();
api.MapSectionEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();
