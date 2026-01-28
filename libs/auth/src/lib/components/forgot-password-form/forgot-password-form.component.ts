import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ForgotPassword } from '@batstateu/data-models';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  imports: [NgZorroAntdModule, ReactiveFormsModule],
  selector: 'batstateu-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.less']
})
export class ForgotPasswordFormComponent implements OnInit {

  constructor(private fb: UntypedFormBuilder, private modal: NzModalService) { }

  @Output() submitForm = new EventEmitter<ForgotPassword>();
  passwordVisible = false;
  validateForm!: UntypedFormGroup;

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.required]]
    });
  }

  reset() {
    if (this.validateForm.valid) {
      this.submitForm.emit(this.validateForm.value);
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
