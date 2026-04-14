using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.Extensions.Options;

namespace api.Helpers;

public sealed record PatchRequest<T>(T Model, HashSet<string> ModifiedProperties);

public static class PatchRequestReader
{
  public static async Task<PatchRequest<T>?> ReadAsync<T>(HttpRequest request)
  {
    var json = await request.ReadFromJsonAsync<JsonElement>();

    if (json.ValueKind == JsonValueKind.Undefined)
      return null;

    var modified = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

    foreach (var prop in json.EnumerateObject())
      modified.Add(prop.Name);

    var jsonOptions = request
      .HttpContext.RequestServices.GetRequiredService<IOptions<JsonOptions>>()
      .Value.SerializerOptions;

    var model = json.Deserialize<T>(jsonOptions);

    if (model is null)
      return null;

    return new PatchRequest<T>(model, modified);
  }
}
