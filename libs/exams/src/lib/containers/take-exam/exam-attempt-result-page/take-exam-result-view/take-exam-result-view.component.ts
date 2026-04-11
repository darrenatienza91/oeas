import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { ExamAttemptResultDto } from '../models/exam-attempt-dto';

@Component({
  imports: [ReactiveFormsModule, FormsModule, NgZorroAntdModule, RouterLink, CommonModule],
  selector: 'batstateu-take-exam-result-view',
  templateUrl: './take-exam-result-view.component.html',
  styleUrls: ['./take-exam-result-view.component.less'],
})
export class TakeExamResultViewComponent {
  public examAttemptResult = input<ExamAttemptResultDto>();
  public status = computed(() => {
    if (!this.examAttemptResult()) {
      return 'info';
    }

    const percentage = this.examAttemptResult()?.percentage ?? 0;

    if (this.examAttemptResult()?.result === 'Waiting') {
      return 'info';
    }

    return percentage < 75 ? 'error' : 'success';
  });

  public subTitle = computed(() => {
    if (!this.examAttemptResult()) {
      return 'Thank you for taking this examination!';
    }

    const percentage = this.examAttemptResult()?.percentage ?? 0;

    if (this.examAttemptResult()?.result === 'Waiting') {
      return 'The result of your examination will be posted once it was checked. Thank you!';
    }

    return percentage < 75
      ? 'Sorry you failed the examination'
      : 'Good Job! You pass the Examination';
  });

  public overAllPoints = computed(() => {
    if (!this.examAttemptResult()) {
      return '';
    }

    return `${this.examAttemptResult()?.totalAcquired} / ${this.examAttemptResult()?.totalPossible}`;
  });
}
