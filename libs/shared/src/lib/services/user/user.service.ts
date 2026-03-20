import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from '@batstateu/app-config';
import {
  AuthPayload,
  ChangePassword,
  ForgotPassword,
  ResponseWrapper,
  User,
  UserDetail,
  UserType,
} from '@batstateu/data-models';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import * as fromAuth from '@batstateu/auth';
import { Me, EditMeDto, EditUserDto } from 'libs/data-models/src/lib/user.model';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  public activate(id: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.appConfig.apiUrl}/users/${id}/activate`, null);
  }

  public deActivate(id: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.appConfig.apiUrl}/users/${id}/deactivate`, null);
  }

  updateResetPasswordDefaultStatus(id: number): Observable<number> {
    return this.httpClient
      .put<number>(`${this.appConfig.apiUrl}/records/userDetails/${id}`, {
        isResetPassword: 0,
        isActive: 1,
      })
      .pipe(
        map((res: number) => {
          return res;
        }),
      );
  }
  resetPassword(id: number): Observable<number> {
    return this.httpClient
      .put<number>(`${this.appConfig.apiUrl}/records/users/${id}`, {
        password: 'abc123',
      })
      .pipe(
        map((res: number) => {
          return res;
        }),
      );
  }
  requestReset(id: number): Observable<number> {
    return this.httpClient
      .put<number>(`${this.appConfig.apiUrl}/records/userDetails/${id}`, {
        isResetPassword: true,
        isActive: false,
      })
      .pipe(
        map((res: number) => {
          return res;
        }),
      );
  }

  validateForgotPassword(forgotPassword: ForgotPassword): Observable<UserDetail> {
    return this.httpClient
      .get<
        ResponseWrapper<UserDetail>
      >(`${this.appConfig.apiUrl}/records/userDetails?filter=email,eq,${forgotPassword.email}&join=users`)
      .pipe(
        map((res: ResponseWrapper<any>) => {
          const user = res.records[0];
          if (user === undefined || user.user_id.username !== forgotPassword.username) {
            throw Error('User not found');
          } else if (user.isResetPassword) {
            throw Error('User already requested password reset');
          }
          return user;
        }),
      );
  }

  public save(id: number, user: EditUserDto): Observable<void> {
    return this.httpClient.patch<void>(`${this.appConfig.apiUrl}/users/${id}`, user);
  }

  public editProfile(me: EditMeDto): Observable<void> {
    return this.httpClient.put<void>(`${this.appConfig.apiUrl}/me`, me);
  }

  public addProfile(me: EditMeDto): Observable<void> {
    return this.httpClient.post<void>(`${this.appConfig.apiUrl}/me`, me);
  }

  public changePassword(changePassword: ChangePassword): Observable<void> {
    return this.httpClient.patch<void>(`${this.appConfig.apiUrl}/me/password`, changePassword);
  }

  public getCurrentUserProfile(): Observable<Me> {
    return this.httpClient.get<Me>(`${this.appConfig.apiUrl}/me`);
  }

  public getUserDetail(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.appConfig.apiUrl}/users/${id}`);
  }

  getAll(criteria: string): Observable<UserDetail[]> {
    return this.httpClient.get<UserDetail[]>(`${this.appConfig.apiUrl}/users?criteria=${criteria}`);
  }
  getAllUserTypes(): Observable<UserType[]> {
    return this.httpClient
      .get<ResponseWrapper<UserType>>(`${this.appConfig.apiUrl}/records/user_types`)
      .pipe(
        map((res: ResponseWrapper<UserType>) => {
          return res.records;
        }),
      );
  }
  public deleteUser(user_id: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.appConfig.apiUrl}/users/${user_id}`);
  }

  private getUserId() {
    this.user$.subscribe((val) => (this.userId = val?.user.id || 0));
  }

  user$!: Observable<AuthPayload | null>;
  userId!: number;

  constructor(
    private httpClient: HttpClient,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private store: Store<fromAuth.State>,
  ) {
    this.user$ = store.select(fromAuth.getAuthSuccess);
    this.getUserId();
  }
}
