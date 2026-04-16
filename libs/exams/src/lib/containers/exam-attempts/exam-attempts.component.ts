import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamsService } from '@batstateu/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject } from 'rxjs';
import { ExamAttemptListComponent } from './exam-attempt-list/exam-attempt-list.component';
import { ExamAttemptList } from './exam-attempt-list.model';

@Component({
  imports: [ExamAttemptListComponent],
  selector: 'batstateu-exam-attempts',
  templateUrl: './exam-attempts.component.html',
  styleUrls: ['./exam-attempts.component.less'],
})
export class ExamAttemptsComponent implements OnInit {
  examAttemptList!: ExamAttemptList[];
  examId!: number;
  criteria = '';
  private searchSubject$ = new BehaviorSubject<string>('');

  onViewScore(takerExamIdObj: any) {
    this.examService
      .getAllAttemptAnswers(takerExamIdObj.userDetailId, takerExamIdObj.examId)
      .subscribe((val) => {
        this.modal.success({
          nzTitle: 'Total Score',
          nzContent: `The total score is: ${val.reduce(
            (a: any, b: any) => a + b['points'] || 0,
            0,
          )}`,
        });
      });
  }
  onSearch(criteria: string) {
    this.criteria = criteria;
    this.searchSubject$.next(criteria);
  }
  constructor(
    private examService: ExamsService,
    private route: ActivatedRoute,
    private modal: NzModalService,
  ) {}
  getAll(criteria: string) {
    this.examService.getAllExamAttempts(this.examId, criteria).subscribe((val) => {
      this.examAttemptList = val;
    });
  }

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));

    // this.searchSubject$
    //   .asObservable()
    //   .pipe(
    //     map((val) => val.trim()),
    //     debounceTime(1000),
    //     distinctUntilChanged(),
    //   )
    //   .subscribe((val) => {
    //     this.getAll(val);
    //   });
  }
}
