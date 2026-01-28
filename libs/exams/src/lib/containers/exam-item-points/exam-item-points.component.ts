import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnswerFormModel } from '@batstateu/data-models';
import { ExamsService } from '@batstateu/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject } from 'rxjs';
import { ExamItemPointsFormViewComponent } from '../../components/exam-item-points-form-view/exam-item-points-form-view.component';

@Component({
  imports: [ExamItemPointsFormViewComponent],
  selector: 'batstateu-exam-item-points',
  templateUrl: './exam-item-points.component.html',
  styleUrls: ['./exam-item-points.component.less'],
})
export class ExamItemPointsComponent implements OnInit {
  id!: number;
  answerFormModelSubject$ = new BehaviorSubject<AnswerFormModel | null>(null);
  answerFormModel$ = this.answerFormModelSubject$.asObservable();
  getData() {
    this.examService.getExamAnswer(this.id).subscribe((val) => {
      this.answerFormModelSubject$.next(val);
    });
  }
  onSave(points: number) {
    this.examService.editAnswerPoints(this.id, points).subscribe((val) => {
      this.modal.info({
        nzTitle: 'Submit Points',
        nzContent: `Points has been submitted!`,
        nzOnOk: () => {
          this.location.back();
        },
      });
    });
  }
  constructor(
    private examService: ExamsService,
    private route: ActivatedRoute,
    private modal: NzModalService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('examAnsId'));
    this.getData();
  }
}
