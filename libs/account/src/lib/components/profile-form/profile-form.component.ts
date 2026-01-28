import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { UserDetail } from '@batstateu/data-models';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';

@Component({
  imports: [NgZorroAntdModule, ReactiveFormsModule],
  selector: 'batstateu-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.less'],
})
export class ProfileFormComponent implements OnInit {
  @Output() save = new EventEmitter<UserDetail>();

  validateForm!: UntypedFormGroup;
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone',
  };

  setValue(userDetail: UserDetail) {
    this.validateForm.patchValue(userDetail);
  }
  submitForm(): void {
    if (this.validateForm.valid) {
      const userDetail: UserDetail = { ...this.validateForm.value };
      this.save.emit(userDetail);
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
      this.validateForm.controls['checkPassword'].updateValueAndValidity()
    );
  }

  confirmationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  constructor(private fb: UntypedFormBuilder, private modal: NzModalService) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      code: [{ value: null, disabled: true }, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      firstName: [null, [Validators.required]],
      middleName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      address: [null, [Validators.required]],
      contactNumberPrefix: ['+63'],
      contactNumber: [null, [Validators.required]],
      departmentId: [null, [Validators.required]],
      sectionId: [null, [Validators.required]],
      isActive: [{ value: false, disabled: true }],
    });
  }
}
