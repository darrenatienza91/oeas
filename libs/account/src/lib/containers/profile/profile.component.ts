import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
// eslint-disable-next-line @nx/enforce-module-boundaries

import { NzModalService } from 'ng-zorro-antd/modal';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserService } from '@batstateu/shared';
import { EditMeDto } from 'libs/data-models/src/lib/user.model';
import { ProfileFormComponent } from './profile-form/profile-form.component';
@Component({
  imports: [ProfileFormComponent],
  selector: 'batstateu-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
})
export class ProfileComponent {
  private readonly userService = inject(UserService);
  private readonly modal = inject(NzModalService);
  public currentUser = toSignal(this.userService.getCurrentUserProfile());

  onSave(userDetail: EditMeDto) {
    this.userService.editProfile(userDetail).subscribe(() => {
      this.modal.success({
        nzTitle: 'Success',
        nzContent: 'Record has been saved',
        nzOkText: 'Ok',
      });
    });
  }
}
