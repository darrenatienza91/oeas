import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionList } from '@batstateu/data-models';
import { QuestionService } from '@batstateu/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { QuestionListComponent } from '../../components/question-list/question-list.component';

@Component({
  imports: [QuestionListComponent],
  selector: 'batstateu-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.less'],
})
export class QuestionsComponent implements OnInit {
  private searchSubject$ = new BehaviorSubject<string>('');
  public questionList = signal<QuestionList[]>([]);
  criteria = '';
  examId!: number;
  delete(id: number) {
    alert(id);
  }
  constructor(
    private questionService: QuestionService,
    private modal: NzModalService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));

    this.searchSubject$
      .asObservable()
      .pipe(
        map((val) => val.trim()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((search) => this.questionService.getAll(this.examId, search)),
      )
      .subscribe((val) => {
        this.questionList.set(val);
      });
  }

  onSearch(criteria: string) {
    this.criteria = criteria;
    this.searchSubject$.next(criteria);
  }

  onDelete(questionList: QuestionList) {
    this.questionService
      .delete(questionList.id, questionList.examId)
      .pipe(switchMap(() => this.questionService.getAll(this.examId, '')))
      .subscribe((questions) => {
        this.questionList.set(questions);
        this.modal.success({
          nzTitle: 'Delete Success',
          nzContent: `Record has been deleted`,
        });
      });
  }
}
