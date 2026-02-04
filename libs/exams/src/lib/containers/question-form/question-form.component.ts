import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionDetail } from '@batstateu/data-models';
import { QuestionService } from '@batstateu/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { toHTML } from 'ngx-editor';
import { QuestionFormViewComponent } from '../../components/question-form-view/question-form-view.component';

@Component({
  imports: [QuestionFormViewComponent],
  selector: 'batstateu-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.less'],
})
export class QuestionFormComponent implements OnInit {
  public questionDetail: QuestionDetail = {} as QuestionDetail;

  onSave(val: any) {
    const examId = Number(this.route.snapshot.paramMap.get('examId'));
    if (this.questionDetail && this.questionDetail.id > 0) {
      this.questionService.edit({ ...val, id: this.questionDetail.id }).subscribe(() =>
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
          description: toHTML(val.description),
          correctAnswer: toHTML(val.correctAnswer),
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
  getValues() {
    const id = Number(this.route.snapshot.paramMap.get('questionId'));
    if (id) {
      this.questionService.get(id).subscribe((val) => {
        this.questionDetail = val;
      });
    }
  }
  constructor(
    private modal: NzModalService,
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.getValues();
  }
}
