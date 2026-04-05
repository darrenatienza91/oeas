import { Component, inject, OnInit } from '@angular/core';
import { ExamsService, TakeExamService } from '@batstateu/shared';
import { ActivatedRoute } from '@angular/router';
import { TakeExamResultViewComponent } from './take-exam-result-view/take-exam-result-view.component';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
  imports: [TakeExamResultViewComponent],
  selector: 'batstateu-take-exam-result',
  templateUrl: './take-exam-result.component.html',
  styleUrls: ['./take-exam-result.component.less'],
})
export class TakeExamResultComponent implements OnInit {
  private readonly examService: ExamsService = inject(ExamsService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly takeExamService = inject(TakeExamService);
  public examId = Number(this.route.snapshot.paramMap.get('examId'));
  public readonly examResult = toSignal(this.takeExamService.getTakeExamResult());

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
