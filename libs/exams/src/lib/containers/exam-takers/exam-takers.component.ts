import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamTakerList } from '@batstateu/data-models';
import { ExamsService } from '@batstateu/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { ExamTakersListComponent } from '../../components/exam-takers-list/exam-takers-list.component';

@Component({
  imports: [ExamTakersListComponent],
  selector: 'batstateu-exam-takers',
  templateUrl: './exam-takers.component.html',
  styleUrls: ['./exam-takers.component.less'],
})
export class ExamTakersComponent implements OnInit {
  examTakerList!: ExamTakerList[];
  examId!: number;
  criteria = '';
  private searchSubject$ = new BehaviorSubject<string>('');

  onViewScore(takerExamIdObj: any) {
    this.examService
      .getAllTakerAnswers(takerExamIdObj.userDetailId, takerExamIdObj.examId)
      .subscribe((val) => {
        this.modal.success({
          nzTitle: 'Total Score',
          nzContent: `The total score is: ${val.reduce(
            (a: any, b: any) => a + b['points'] || 0,
            0
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
    private modal: NzModalService
  ) { }
  getAll(criteria: string) {
    this.examService
      .getAllExamTakers(this.examId, criteria)
      .subscribe((val) => {
        this.examTakerList = val;
      });
  }

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));

    this.searchSubject$
      .asObservable()
      .pipe(
        map((val) => val.trim()),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((val) => {
        this.getAll(val);
      });
  }
}
