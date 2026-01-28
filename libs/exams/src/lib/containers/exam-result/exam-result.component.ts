import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamTakerResultList } from '@batstateu/data-models';
import { ExamsService } from '@batstateu/shared';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { ExamResultListComponent } from '../../components/exam-result-list/exam-result-list.component';

@Component({
  imports: [ExamResultListComponent],
  selector: 'batstateu-exam-result',
  templateUrl: './exam-result.component.html',
  styleUrls: ['./exam-result.component.less'],
})
export class ExamResultComponent implements OnInit {
  examId!: number;
  userDetailId!: number;
  examTakerResultList!: ExamTakerResultList[];
  criteria = '';
  private searchSubject$ = new BehaviorSubject<string>('');
  onSearch(criteria: string) {
    this.criteria = criteria;
    this.searchSubject$.next(criteria);
  }
  getAll(criteria: string) {
    this.examService
      .getAllTakerAnswersByCriteria(
        this.userDetailId,
        this.examId,
        criteria
      )
      .subscribe((val) => {
        this.examTakerResultList = val;
      });
  }
  constructor(private examService: ExamsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
    this.userDetailId = Number(this.route.snapshot.paramMap.get('takerId'));
    this.getAll('');
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
