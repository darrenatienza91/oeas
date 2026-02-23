import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Department, Section, User, UserDetail } from '@batstateu/data-models';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';

@Component({
  imports: [NgZorroAntdModule, ReactiveFormsModule, CommonModule, RouterModule],
  selector: 'batstateu-user-form-view',
  templateUrl: './user-form-view.component.html',
  styleUrls: ['./user-form-view.component.less'],
})
export class UserFormViewComponent {
  public user = input<User>();
  public departments = input<Department[]>([]);
  public sections = input<Section[]>();
  public save = output<UserDetail>();
  private readonly fb = inject(FormBuilder);

  public validateForm: UntypedFormGroup = this.fb.group({
    userName: [{ value: '', disabled: true }],
    firstname: [{ value: '', disabled: true }],
    middlename: [{ value: '', disabled: true }],
    lastname: [{ value: '', disabled: true }],
    departmentId: [null, [Validators.required]],
    sectionId: [null, [Validators.required]],
  });

  private readonly effectRef = effect(() => {
    if (!this.user()) {
      return;
    }

    this.validateForm.patchValue({
      userName: this.user()?.userName,
      firstname: this.user()?.firstName,
      middlename: this.user()?.middleName,
      lastname: this.user()?.lastName,
      departmentId: this.user()?.departmentId ?? null,
      sectionId: this.user()?.sectionId ?? null,
    });

    this.effectRef.destroy();
  });

  submitForm(): void {
    if (this.validateForm.valid) {
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
}
