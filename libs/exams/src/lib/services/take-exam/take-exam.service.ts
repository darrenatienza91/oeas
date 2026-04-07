import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from '@batstateu/app-config';

@Injectable({
  providedIn: 'root',
})
export class TakeExamService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly appConfig: AppConfig = inject(APP_CONFIG);
}
