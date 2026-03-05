import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChangePassword } from '@batstateu/data-models';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { confirmationValidator } from '@batstateu/shared';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';

@Component({
  imports: [NgZorroAntdModule, ReactiveFormsModule, CommonModule, RouterModule],
  selector: 'batstateu-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.less'],
})
export class ChangePasswordFormComponent {
  private readonly _confirmationValidator = confirmationValidator;
  private readonly fb: UntypedFormBuilder = inject(UntypedFormBuilder);

  public save = output<ChangePassword>();
  public validateForm: UntypedFormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required]],
    checkPassword: ['', [this._confirmationValidator]],
  });
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone',
  };

  submitForm(): void {
    if (this.validateForm.valid) {
      const formData = this.validateForm.value;
      this.save.emit(this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.validateForm.controls['checkPassword'].updateValueAndValidity(),
    );
  }
}
