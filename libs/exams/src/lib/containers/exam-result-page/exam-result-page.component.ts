import { Component, inject, OnInit } from '@angular/core';
import { ExamsService } from '@batstateu/shared';
import { ActivatedRoute } from '@angular/router';
import { TakeExamResultViewComponent } from './take-exam-result-view/take-exam-result-view.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExamResultService } from './services/exam-result/exam-result.service';
@Component({
  imports: [TakeExamResultViewComponent],
  selector: 'batstateu-exam-result-page',
  templateUrl: './exam-result-page.component.html',
  styleUrls: ['./exam-result-page.component.less'],
})
export class ExamResultPageComponent implements OnInit {
  private readonly examService: ExamsService = inject(ExamsService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly examResultService = inject(ExamResultService);
  public examId = Number(this.route.snapshot.paramMap.get('examId'));
  public readonly examResult = toSignal(this.examResultService.getExamResult(this.examId));

  percentage!: number | null;
  examTitle!: string;
  scoreSummary!: string;

  private getExamResultPoints(): void {
    // this.examService
    //   .getAllTakerAnswers(this.userStore?.user.userDetailId || 0, this.examId)
    //   .subscribe((ans) => {
    //     const hasPoints = ans.filter((x) => x.points && x.points > 0).length > 0;
    //     if (hasPoints) {
    //       ans.map((val2) => {
    //         if (val2.points && val2.points >= 0) {
    //           this.totalPoints = this.totalPoints + val2.points;
    //         }
    //       });
    //       this.questionService.getAllByExamId(this.examId).subscribe((val) => {
    //         val.map((val) => {
    //           this.totalQuestionPoints = this.totalQuestionPoints + val.points;
    //         });
    //         this.percentage = Math.round((this.totalPoints / this.totalQuestionPoints) * 100);
    //         this.scoreSummary = `${this.totalPoints} / ${this.totalQuestionPoints}`;
    //       });
    //     } else {
    //       this.percentage = null;
    //     }
    //   });
  }

  getExam() {
    this.examService.get(this.examId).subscribe((val) => (this.examTitle = val.name));
  }

  ngOnInit(): void {
    this.getExam();
    this.getExamResultPoints();
  }
}
