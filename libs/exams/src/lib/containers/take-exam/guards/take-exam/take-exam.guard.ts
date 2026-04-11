import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TakeExamService } from '../../../../services/take-exam/take-exam.service';
import { map, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromAuth from '@batstateu/auth';

export const takeExamGuard: CanActivateFn = (route, state) => {
  const takeExamService = inject(TakeExamService);

  const store = inject(Store<fromAuth.State>);
  const router = inject(Router);

  const auth = store.selectSignal(fromAuth.getAuthSuccess);

  const id = route.params['examId'];

  return takeExamService.getExamAttemptByExamId(id).pipe(
    take(1),
    map((detail) => {
      if (!detail) {
        return router.createUrlTree([`dashboard`]);
      }

      if (detail.isSubmitted) {
        return router.createUrlTree([`exams/${id}/result`]);
      }

      return true;
    }),
  );
};
