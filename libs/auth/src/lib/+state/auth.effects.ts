import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { AuthActionTypes } from './auth.actions';
import * as authActions from './auth.actions';
import { AuthService } from './../services/auth/auth.service';
import { of } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserService } from '@batstateu/account';
import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private modal: NzModalService,
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActionTypes.Login),
      exhaustMap((action) => {
        const { payload } = action;
        return this.authService.login(payload).pipe(
          map((authSuccess) =>
            authActions.loginSuccess({
              payload: {
                token: authSuccess.token,
                user: {
                  id: authSuccess.user.id,
                  isActive: authSuccess.user.isActive,
                  userName: authSuccess.user.userName,
                  firstName: authSuccess.user.firstName,
                  sectionId: authSuccess.user.sectionId,
                  role: authSuccess.user.role,
                  hasUserDetail: authSuccess.user.hasUserDetail,
                },
              },
            }),
          ),
          catchError(() => of(authActions.loginFailure({ payload: 'Login Failed' }))),
        );
      }),
    ),
  );

  navigateToDashboard$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActionTypes.LoginSuccess),
        tap(() => {
          this.router.navigate([`/dashboard`]);
        }),
      ),
    { dispatch: false },
  );

  navigateToProfile$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActionTypes.LoginSuccessNewAccount),
        tap(() => {
          this.modal.warning({
            nzTitle: 'Update your profile now!',
            nzContent: `Please update your profile now so administrator can review and activate it!`,
          });
          this.router.navigate([`/account/profile`]);
        }),
      ),
    { dispatch: false },
  );

  loginFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActionTypes.LoginFail),
        tap(() => {
          console.log('Login Failed!');
        }),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActionTypes.Logout),
        tap(() => {
          this.router.navigate([`/auth/login`]);
        }),
      ),
    { dispatch: false },
  );
}
