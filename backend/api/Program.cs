using api.Data;
using api.Endpoints;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<UserDetailService>();
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
app.UseCors("AllowFrontend");
var api = app.MapGroup("/api");

api.MapAuthEndpoints();
api.MapUserDetailEndpoints();
api.MapUserEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();
