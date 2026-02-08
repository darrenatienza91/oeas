import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionDetail } from '@batstateu/data-models';
import { QuestionService } from '@batstateu/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QuestionFormViewComponent } from '../../components/question-form-view/question-form-view.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  imports: [QuestionFormViewComponent],
  selector: 'batstateu-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionFormComponent {
  private modal: NzModalService = inject(NzModalService);
  private questionService = inject(QuestionService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private id = Number(this.route.snapshot.paramMap.get('id'));
  private examId = Number(this.route.snapshot.paramMap.get('examId'));

  public questionDetail = this.id
    ? toSignal(this.questionService.get(this.id, this.examId))
    : signal({} as QuestionDetail);

  onSave(val: any) {
    const examId = Number(this.route.snapshot.paramMap.get('examId'));
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.questionDetail && this.questionDetail()!.id > 0) {
      this.questionService.edit({ ...val, id: id, examId: examId }).subscribe(() =>
        this.modal.success({
          nzTitle: 'Success',
          nzContent: 'Record has been saved',
          nzOkText: 'Ok',
        }),
      );
    } else {
      this.questionService
        .add({
          ...val,
          examId: examId,
          description: val.description,
          correctAnswer: val.correctAnswer,
        })
        .subscribe(() => {
          this.modal.success({
            nzTitle: 'Success',
            nzContent: 'Record has been saved',
            nzOnOk: () => this.location.back(),
          });
        });
    }
  }
}
