import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserService } from '@batstateu/shared';
import { ForgotPassword } from '@batstateu/data-models';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ForgotPasswordFormComponent } from '../../components/forgot-password-form/forgot-password-form.component';

@Component({
  imports: [ForgotPasswordFormComponent],
  selector: 'batstateu-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit {
  onSubmit(forgotPassword: ForgotPassword) {
    this.userService.validateForgotPassword(forgotPassword).subscribe({
      next: (val) =>
        this.userService.requestReset(val.id).subscribe(() =>
          this.modal.success({
            nzTitle: 'Successful',
            nzContent: `Your password reset request has been received.`,
            nzOnOk: () => {
              // this.router.navigate(['/auth/login']);
            },
          })
        ),
      error: (err) =>
        this.modal.error({
          nzTitle: 'Error while requesting password reset',
          nzContent: `${err}`,
          nzOnOk: () => {
            // this.router.navigate(['/auth/login']);
          },
        }),
    });
  }
  constructor(
    private userService: UserService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void { }
}
