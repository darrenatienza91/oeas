import { CommonModule, Location } from '@angular/common';
import { Component, effect, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { AttemptAnswerDto } from '../../attempt-answer.dto';

@Component({
  imports: [ReactiveFormsModule, FormsModule, NgZorroAntdModule, CommonModule],
  selector: 'batstateu-attempt-answer-form-view',
  templateUrl: './attempt-answer-form-view.component.html',
  styleUrls: ['./attempt-answer-form-view.component.less'],
})
export class AttemptAnswerFormViewComponent {
  private readonly fb: UntypedFormBuilder = inject(UntypedFormBuilder);
  private readonly modal: NzModalService = inject(NzModalService);
  private readonly location: Location = inject(Location);

  public attemptAnswer = input<AttemptAnswerDto | null>();
  public save = output<number>();
  public validateForm!: UntypedFormGroup;

  public formEffect = effect(() => {
    if (!this.attemptAnswer()) {
      return;
    }

    this.validateForm = this.fb.group({
      acquiredPoints: [
        this.attemptAnswer()?.acquiredPoints,
        [Validators.required, confirmationValidator(this.attemptAnswer()?.maxPoints ?? 0)],
      ],
    });

    this.formEffect.destroy();
  });

  private get acquiredPoints(): AbstractControl {
    return this.validateForm.get('acquiredPoints')!;
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.modal.confirm({
        nzIconType: 'warning',
        nzTitle: 'Submit Points',
        nzContent: `Are you sure you want to submit points? <br/> Submitted points can't be reverted.`,
        nzOnOk: () => {
          this.save.emit(this.acquiredPoints.value);
        },
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  cancel() {
    this.location.back();
  }
}

export const confirmationValidator = (limit: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value > limit) {
      return { confirm: true, error: true };
    }

    return null;
  };
};
