import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { APP_CONFIG } from '@batstateu/app-config';

export abstract class BaseApiService {
  protected http = inject(HttpClient);
  protected appConfig = inject(APP_CONFIG);
  protected baseUrl = this.appConfig.apiUrl;

  protected get<T>(url: string, query?: HttpParams) {
    return this.http.get<T>(url, { params: query });
  }

  // optional: post, put, delete helpers
}
