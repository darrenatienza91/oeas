import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
// eslint-disable-next-line @nx/enforce-module-boundaries

import { NzModalService } from 'ng-zorro-antd/modal';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserService } from '@batstateu/shared';
import { EditMeDto } from 'libs/data-models/src/lib/user.model';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromAuth from '../../../../../auth/src/lib/+state/auth.reducer';
import * as authActions from '../../../../../auth/src/lib/+state/auth.actions';
@Component({
  imports: [ProfileFormComponent, NzAlertModule],
  selector: 'batstateu-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
})
export class ProfileComponent {
  private readonly userService = inject(UserService);
  private readonly modal = inject(NzModalService);
  private readonly router = inject(Router);
  public currentUser = toSignal(this.userService.getCurrentUserProfile());
  private readonly store = inject(Store<fromAuth.State>);

  onSave(userDetail: EditMeDto) {
    if (this.currentUser()?.hasProfile) {
      this.userService.editProfile(userDetail).subscribe(() => {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: 'Record has been updated',
          nzOkText: 'Ok',
        });
      });
      return;
    }

    this.userService
      .addProfile(userDetail)
      .pipe(
        switchMap(() =>
          this.modal
            .success({
              nzTitle: 'Success',
              nzContent:
                'Profile details has been saved! Please login again to proceed in the next step.',
              nzOkText: 'Ok',
            })
            .afterClose.pipe(tap(() => this.store.dispatch(authActions.logout()))),
        ),
      )
      .subscribe();
  }
}
