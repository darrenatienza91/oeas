import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromAuth from '../../+state/auth.reducer';
import { Store, select } from '@ngrx/store';
import { getAuthSuccess } from '../../+state/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private router: Router,
    private store: Store<fromAuth.State>,
  ) {}
  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select(getAuthSuccess),
      map((user) => {
        if (user) {
          return true;
        } else {
          this.router.navigate([`/auth/login`]);
          return false;
        }
      }),
    );
  }
}
