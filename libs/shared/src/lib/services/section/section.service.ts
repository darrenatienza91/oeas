import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '@batstateu/app-config';
import { Section } from '@batstateu/data-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  public getAll(): Observable<Section[]> {
    return this.httpClient.get<Section[]>(`${this.appConfig.API_URL}/sections`);
  }

  constructor(
    private httpClient: HttpClient,
    @Inject(APP_CONFIG) private appConfig: any,
  ) {}
}
