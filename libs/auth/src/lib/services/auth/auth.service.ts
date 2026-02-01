import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Authenticate, AuthPayload } from '@batstateu/data-models';
import { Store } from '@ngrx/store';
// eslint-disable-next-line @nx/enforce-module-boundaries
import * as fromAuth from '@batstateu/auth';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '@batstateu/app-config';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private store: Store<fromAuth.State>,
    @Inject(APP_CONFIG) private appConfig: any,
  ) {}

  login(authenticate: Authenticate): Observable<AuthPayload> {
    return this.httpClient.post<AuthPayload>(`${this.appConfig.API_URL}/auth/login`, authenticate);
  }

  register(authenticate: any): Observable<Authenticate> {
    return this.httpClient.post<Authenticate>(`${this.appConfig.API_URL}/register`, authenticate);
  }

  logout() {
    this.store.dispatch(fromAuth.logout());
  }
}
