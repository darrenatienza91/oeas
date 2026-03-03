import { Component, inject } from '@angular/core';
import { ChangePassword } from '@batstateu/data-models';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { confirmationValidator, UserService } from '@batstateu/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { take } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { ChangePasswordFormComponent } from './change-password-form/change-password-form.component';
import { CommonModule } from '@angular/common';
@Component({
  imports: [ChangePasswordFormComponent, CommonModule],
  selector: 'batstateu-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less'],
})
export class ChangePasswordComponent {
  private readonly fb = inject(FormBuilder);

  private readonly form = this.fb.group({
    newpassword: [null, [Validators.required]],
    oldpassword: [null, [Validators.required]],
    checkPassword: [null, [Validators.required, confirmationValidator]],
  });

  constructor(
    private modal: NzModalService,
    private userService: UserService,
  ) {}

  onSave(changePassword: ChangePassword) {
    this.userService
      .changePassword(changePassword)
      .pipe(take(1))
      .subscribe(() =>
        this.modal.success({
          nzTitle: 'Success Password Changed',
          nzContent: 'Your password has been changed.',
          nzOkText: 'Ok',
        }),
      );
  }
}
