import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '@batstateu/app-config';
import { Department, ResponseWrapper } from '@batstateu/data-models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {

  getAll(): Observable<Department[]> {
    return this.httpClient
      .get<ResponseWrapper<Department>>(
        `${this.appConfig.API_URL}/records/departments`
      )
      .pipe(
        map((res: ResponseWrapper<Department>) => {
          return res.records;
        })
      );
  }

  constructor(
    private httpClient: HttpClient,
    @Inject(APP_CONFIG) private appConfig: any
  ) { }
}
