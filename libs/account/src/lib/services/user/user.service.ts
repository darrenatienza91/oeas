import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '@batstateu/app-config';
import { UserDetail } from '@batstateu/data-models';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  save(userDetail: UserDetail): Observable<number> {
    if (userDetail.id > 0) {
      return this.httpClient
        .put<number>(`${this.appConfig.API_URL}/records/userDetails/${userDetail.id}`, userDetail)
        .pipe(
          map((res: number) => {
            return res;
          }),
        );
    }
    return this.httpClient
      .post<number>(`${this.appConfig.API_URL}/records/userDetails`, userDetail)
      .pipe(
        map((res: number) => {
          if (res === undefined) {
            throw Error('User Detail not found!');
          }
          return res;
        }),
      );
  }
  constructor(private httpClient: HttpClient, @Inject(APP_CONFIG) private appConfig: any) { }

  get(userId: number | undefined): Observable<UserDetail> {
    return this.httpClient
      .get<UserDetail>(
        `${this.appConfig.API_URL}/users/${userId}/detail`,
      );
  }
}
