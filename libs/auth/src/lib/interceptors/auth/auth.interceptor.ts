import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, switchMap, take, throwError } from 'rxjs';
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
    return this.store.select(getAuthState).pipe(
      take(1),
      switchMap((state) => {
        const authReq = state?.authPayload?.token
          ? req.clone({
              setHeaders: {
                Authorization: `Bearer ${state.authPayload.token}`,
              },
            })
          : req.clone({ withCredentials: true });

        return next.handle(authReq);
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 0) {
          this.showNotification('error', 'Error', `Can't connect to server!`);
        }

        if (err.status === 401) {
          this.showNotification('error', 'Login', 'Token expired! Please login again.');
          this.store.dispatch(authActions.logout());
        }

        const error = err.error;

        if (error?.code === 1011) {
          this.store.dispatch(authActions.logout());
        }

        if (
          (this.router.url === '/auth/login' && error?.code === 1003) ||
          (this.router.url === '/account/profile' && error?.code === 1003)
        ) {
          this.router.navigate(['/account/profile']);
          this.showNotification(
            'warning',
            'Update your profile now!',
            'Please update your profile now so administrator can review and activate it!',
          );
        }

        if (error?.code === 1010) {
          this.showNotification(
            'error',
            'Error',
            'Record is related to other record. Cannot delete!',
          );
        }

        if (error?.code === 1013) {
          this.showNotification('error', 'Error', 'Invalid Input!');
        }

        return throwError(() => err);
      }),
    );
  }

  private showNotification(type: 'error' | 'warning' | 'info', title: string, message: string) {
    this.modal.create(type, title, message);
  }
}
