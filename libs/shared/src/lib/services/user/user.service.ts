import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '@batstateu/app-config';
import {
  AuthPayload,
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
    return this.httpClient.patch<void>(`${this.appConfig.API_URL}/users/${id}/activate`, null);
  }

  public deActivate(id: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.appConfig.API_URL}/users/${id}/deactivate`, null);
  }

  updateResetPasswordDefaultStatus(id: number): Observable<number> {
    return this.httpClient
      .put<number>(`${this.appConfig.API_URL}/records/userDetails/${id}`, {
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
      .put<number>(`${this.appConfig.API_URL}/records/users/${id}`, {
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
      .put<number>(`${this.appConfig.API_URL}/records/userDetails/${id}`, {
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
      >(`${this.appConfig.API_URL}/records/userDetails?filter=email,eq,${forgotPassword.email}&join=users`)
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

  save(id: number, user: EditUserDto): Observable<void> {
    return this.httpClient.patch<void>(`${this.appConfig.API_URL}/users/${id}`, user);
  }

  public editProfile(me: EditMeDto): Observable<void> {
    return this.httpClient.put<void>(`${this.appConfig.API_URL}/me`, me);
  }

  public addProfile(id: number, user: EditMeDto): Observable<void> {
    return this.httpClient.patch<void>(`${this.appConfig.API_URL}/users/${id}`, user);
  }

  changePassword(username: string, oldPass: string, newPass: string): Observable<User> {
    return this.httpClient.post<User>(`${this.appConfig.API_URL}/password`, {
      username: username,
      password: oldPass,
      newPassword: newPass,
    });
  }

  public getCurrentUserProfile(): Observable<Me> {
    return this.httpClient.get<Me>(`${this.appConfig.API_URL}/me`);
  }

  public getUserDetail(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.appConfig.API_URL}/users/${id}`);
  }

  getAll(criteria: string): Observable<UserDetail[]> {
    return this.httpClient.get<UserDetail[]>(
      `${this.appConfig.API_URL}/users?criteria=${criteria}`,
    );
  }
  getAllUserTypes(): Observable<UserType[]> {
    return this.httpClient
      .get<ResponseWrapper<UserType>>(`${this.appConfig.API_URL}/records/user_types`)
      .pipe(
        map((res: ResponseWrapper<UserType>) => {
          return res.records;
        }),
      );
  }
  public deleteUser(user_id: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.appConfig.API_URL}/users/${user_id}`);
  }

  private getUserId() {
    this.user$.subscribe((val) => (this.userId = val?.user.id || 0));
  }

  user$!: Observable<AuthPayload | null>;
  userId!: number;

  constructor(
    private httpClient: HttpClient,
    @Inject(APP_CONFIG) private appConfig: any,
    private store: Store<fromAuth.State>,
  ) {
    this.user$ = store.select(fromAuth.getAuthSuccess);
    this.getUserId();
  }
}
