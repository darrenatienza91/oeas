import { inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as fromAuth from '../../+state/auth.reducer';
import * as authActions from './../../+state/auth.actions';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { getAuthState } from '../../+state/auth.selectors';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly modal = inject(NzNotificationService);
  constructor(
    private router: Router,

    private store: Store<fromAuth.State>,
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true,
    });

    this.store
      .select(getAuthState)
      .pipe(take(1))
      .subscribe((state) => {
        if (state) {
          req = req.clone({
            withCredentials: true,
            setHeaders: {
              Authorization: `Bearer ${state.authPayload?.token}`,
            },
          });
        }
      });
    return next.handle(req).pipe(
      tap({
        error: (err: { error: { code: number; message: string }; status: number }) => {
          if (err.status === 0) {
            this.showNotification('error', 'Error', `Can't connect to server!`);
          }

          // una authorized
          if (err.status === 401) {
            this.showNotification('error', 'Login', 'Incorrect user name or password!');
          }
          const error = err?.error;
          if (!error) {
            return;
          }

          // expired token
          if (error.code === 1011) {
            this.store.dispatch(authActions.logout());
          }

          if (
            (this.router.url === '/auth/login' && error.code === 1003) ||
            (this.router.url === '/account/profile' && error.code === 1003)
          ) {
            this.router.navigate(['/account/profile']);
            this.showNotification(
              'warning',
              'Update your profile now!',
              `Please update your profile now so administrator can review and activate it!`,
            );
          }

          if (error.code === 1010) {
            this.showNotification(
              'error',
              'Error',
              `Record is related to other record. Cannot delete!`,
            );
          }

          if (error.code === 1013) {
            this.showNotification('error', 'Error', `Invalid Input!`);
          }
        },
      }),
    );
  }
  private showNotification(type: 'error' | 'warning' | 'info', title: string, message: string) {
    this.modal.create(type, title, message);
  }
}
