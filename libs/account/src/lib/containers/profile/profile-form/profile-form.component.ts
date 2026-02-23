import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { Me } from 'libs/data-models/src/lib/user.model';

@Component({
  imports: [NgZorroAntdModule, ReactiveFormsModule, RouterModule],
  selector: 'batstateu-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.less'],
})
export class ProfileFormComponent {
  private fb = inject(FormBuilder);

  public me = input<Me>();
  public save = output<Me>();

  public form: UntypedFormGroup = this.fb.group({
    userName: [{ value: null, disabled: true }],
    firstName: ['', [Validators.required]],
    middleName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    department: '',
    section: '',
  });

  private onLoadEffect = effect(() => {
    if (!this.me()) {
      return;
    }

    this.form.patchValue({ ...this.me() });

    this.onLoadEffect.destroy();
  });

  submitForm(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value);
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
