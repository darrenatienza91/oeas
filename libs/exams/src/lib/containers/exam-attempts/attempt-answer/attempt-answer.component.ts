import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AttemptAnswerFormViewComponent } from './attempt-answer-form-view/attempt-answer-form-view.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExamAttemptService } from '../services/exam-attempt/exam-attempt.service';
import { AttemptAnswerDto } from '../attempt-answer.dto';

@Component({
  imports: [AttemptAnswerFormViewComponent],
  selector: 'batstateu-attempt-answer',
  templateUrl: './attempt-answer.component.html',
  styleUrls: ['./attempt-answer.component.less'],
})
export class AttemptAnswerComponent {
  private readonly examService: ExamAttemptService = inject(ExamAttemptService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly modal: NzModalService = inject(NzModalService);
  private readonly location: Location = inject(Location);
  private readonly id = Number(this.route.snapshot.paramMap.get('examAnsId'));
  private readonly attemptId = Number(this.route.snapshot.paramMap.get('attemptId'));

  public attemptAnswer = toSignal(this.examService.getAttemptAnswer(this.id, this.attemptId), {
    initialValue: {} as AttemptAnswerDto,
  });

  onSave(points: number) {
    this.examService.editAnswerPoints(this.id, this.attemptId, points).subscribe(() => {
      this.modal.info({
        nzTitle: 'Submit Points',
        nzContent: `Points has been submitted!`,
        nzOnOk: () => {
          this.location.back();
        },
      });
    });
  }
}
