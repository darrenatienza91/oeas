import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromAuth from '@batstateu/auth';
import { map, take } from 'rxjs';
export const dashboardGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<fromAuth.State>);
  const router = inject(Router);
  return store.select(fromAuth.getAuthSuccess).pipe(
    take(1),
    map((auth) => {
      const hasDetail = auth?.user?.hasUserDetail;

      if (!hasDetail) {
        return router.createUrlTree(['/account/profile']);
      }

      return true;
    }),
  );
};
