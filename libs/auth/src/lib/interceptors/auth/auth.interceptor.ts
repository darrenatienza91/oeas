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
        const error = err.error as { title: string; detail: string };
        if (err.status === 0) {
          this.showNotification('error', 'Error', `Can't connect to server!`);
        }

        if (err.status === 401) {
          this.showNotification('error', 'Login', 'Authorization Failed!');
          this.store.dispatch(authActions.logout());
        }

        if (err.status === 404) {
          this.showNotification('error', 'Not Found', 'Requested resource not found!');
        }

        if (err.status === 400) {
          this.showNotification('error', error.title, `${error.detail}`);
        }

        return throwError(() => err);
      }),
    );
  }

  private showNotification(type: 'error' | 'warning' | 'info', title: string, message: string) {
    this.modal.create(type, title, message);
  }
}
