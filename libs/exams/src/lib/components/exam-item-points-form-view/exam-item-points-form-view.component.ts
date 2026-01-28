import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AnswerFormModel } from '@batstateu/data-models';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { ExamsModule } from '../../exams.module';

@Component({
  imports: [ExamsModule],
  selector: 'batstateu-exam-item-points-form-view',
  templateUrl: './exam-item-points-form-view.component.html',
  styleUrls: ['./exam-item-points-form-view.component.less'],
})
export class ExamItemPointsFormViewComponent implements OnInit {
  @Input() answerFormModel$!: Observable<AnswerFormModel | null>;
  @Output() save = new EventEmitter<number>();
  question = '';
  answer = '';
  correctAns = '';

  limit = 60;
  validateForm!: UntypedFormGroup;

  setValue() {
    this.answerFormModel$.subscribe((val) => {
      this.question = val?.question || '';
      this.answer = val?.answer || '';
      this.correctAns = val?.correctAnswer || '';
      this.validateForm.patchValue(val || {});
      this.limit = val?.maxPoints || 0;
    });
  }
  confirmationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value > this.limit) {
      return { confirm: true, error: true };
    }
    return {};
  };
  submitForm(): void {
    if (this.validateForm.valid) {
      this.modal.confirm({
        nzIconType: 'warning',
        nzTitle: 'Submit Points',
        nzContent: `Are you sure you want to submit points? <br/> Submitted points can't be reverted.`,
        nzOnOk: () => {
          this.save.emit(this.validateForm.controls['points'].value);
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

  constructor(
    private fb: UntypedFormBuilder,
    private modal: NzModalService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      points: [null, [Validators.required, this.confirmationValidator]],
    });
    this.setValue();
  }
}
