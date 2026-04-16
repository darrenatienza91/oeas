import { HttpParams } from '@angular/common/http';

type Primitive = string | number | boolean | Date;

export type QueryParams<T> = {
  [K in keyof T]?: T[K] extends Primitive | Primitive[] ? T[K] : never;
};

export function buildHttpParams<T>(query: QueryParams<T>): HttpParams {
  let params = new HttpParams();

  Object.entries(query as Record<string, any>).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    // Dates → ISO string
    if (value instanceof Date) {
      params = params.set(key, value.toISOString());
      return;
    }

    // Arrays
    if (Array.isArray(value)) {
      value.forEach((v) => {
        params = params.append(key, String(v));
      });
      return;
    }

    // Primitives
    params = params.set(key, String(value));
  });

  return params;
}
