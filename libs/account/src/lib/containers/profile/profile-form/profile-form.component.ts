import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { EditMeDto, Me } from 'libs/data-models/src/lib/user.model';

@Component({
  imports: [NgZorroAntdModule, ReactiveFormsModule, RouterModule],
  selector: 'batstateu-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.less'],
})
export class ProfileFormComponent {
  private readonly fb = inject(FormBuilder);
  public me = input<Me>();
  public save = output<EditMeDto>();

  public form: UntypedFormGroup = this.fb.group({
    userName: [{ value: null, disabled: true }],
    firstName: ['', [Validators.required]],
    middleName: '',
    lastName: ['', [Validators.required]],
    address: ['', [Validators.required]],
    contactNumber: ['', [Validators.required]],
  });

  private readonly onLoadEffect = effect(() => {
    if (!this.me()) {
      return;
    }

    this.form.patchValue({ ...this.me() });

    this.onLoadEffect.destroy();
  });

  submitForm(): void {
    const { userName, ...formValue } = this.form.value;
    if (this.form.valid) {
      this.save.emit(formValue);
      return;
    }

    Object.values(this.form.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
}
