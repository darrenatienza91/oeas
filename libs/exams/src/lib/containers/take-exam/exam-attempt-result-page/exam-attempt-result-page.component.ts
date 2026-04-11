import { Component, inject, OnInit } from '@angular/core';
import { ExamsService } from '@batstateu/shared';
import { ActivatedRoute } from '@angular/router';
import { TakeExamResultViewComponent } from './take-exam-result-view/take-exam-result-view.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExamResultService } from './services/exam-result/exam-result.service';
@Component({
  imports: [TakeExamResultViewComponent],
  selector: 'batstateu-exam-attempt-result-page',
  templateUrl: './exam-attempt-result-page.component.html',
  styleUrls: ['./exam-attempt-result-page.component.less'],
})
export class ExamAttemptResultPageComponent implements OnInit {
  private readonly examService: ExamsService = inject(ExamsService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly examResultService = inject(ExamResultService);
  public examId = Number(this.route.snapshot.paramMap.get('examId'));
  public readonly examResult = toSignal(this.examResultService.getExamResult(this.examId));

  percentage!: number | null;
  examTitle!: string;
  scoreSummary!: string;

  getExam() {}

  ngOnInit(): void {}
}
