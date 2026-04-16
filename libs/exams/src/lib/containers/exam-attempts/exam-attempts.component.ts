import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamAttemptListComponent } from './exam-attempt-list/exam-attempt-list.component';
import { ExamAttemptService } from './services/exam-attempt/exam-attempt.service';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';

@Component({
  imports: [ExamAttemptListComponent],
  selector: 'batstateu-exam-attempts',
  templateUrl: './exam-attempts.component.html',
  styleUrls: ['./exam-attempts.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamAttemptsComponent {
  private readonly examAttemptService = inject(ExamAttemptService);
  private readonly route = inject(ActivatedRoute);
  private readonly examId = Number(this.route.snapshot.paramMap.get('examId'));
  public searchText = signal<string>('');
  public searchText$ = toObservable(this.searchText).pipe(
    map((val) => val.trim()),
    distinctUntilChanged(),
    debounceTime(500),
    switchMap((search) =>
      this.examAttemptService.getAllExamAttempts(this.examId, { criteria: search }),
    ),
    takeUntilDestroyed(),
  );

  public examAttemptList = toSignal(this.searchText$, { initialValue: [] });
}
