import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttemptAnswerListViewComponent } from './attempt-answer-list-view/attempt-answer-list-view.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ExamAttemptService } from '../services/exam-attempt/exam-attempt.service';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';

@Component({
  imports: [AttemptAnswerListViewComponent],
  selector: 'batstateu-attempt-answers',
  templateUrl: './attempt-answers.component.html',
  styleUrls: ['./attempt-answers.component.less'],
})
export class AttemptAnswersComponent {
  private readonly examService: ExamAttemptService = inject(ExamAttemptService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly attemptId = Number(this.route.snapshot.paramMap.get('attemptId'));
  public readonly searchText = signal<string>('');
  private readonly searchSubject$ = toObservable(this.searchText).pipe(
    map((val) => val.trim()),
    distinctUntilChanged(),
    debounceTime(500),
    switchMap((search) =>
      this.examService.getAllAttemptAnswersByCriteria(this.attemptId, { criteria: search }),
    ),
  );

  public examAttemptResultList = toSignal(this.searchSubject$, { initialValue: [] });
}
