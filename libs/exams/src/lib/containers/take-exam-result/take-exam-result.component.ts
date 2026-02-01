import { Component, OnInit } from '@angular/core';
import { AuthPayload } from '@batstateu/data-models';
import { ExamsService, QuestionService } from '@batstateu/shared';
import { Store } from '@ngrx/store';
import * as fromAuth from '@batstateu/auth';
import { ActivatedRoute } from '@angular/router';
import { TakeExamResultViewComponent } from '../../components/take-exam-result-view/take-exam-result-view.component';
@Component({
  imports: [TakeExamResultViewComponent],
  selector: 'batstateu-take-exam-result',
  templateUrl: './take-exam-result.component.html',
  styleUrls: ['./take-exam-result.component.less'],
})
export class TakeExamResultComponent implements OnInit {
  userStore!: AuthPayload | null;
  examId!: number;
  totalPoints = 0;
  totalQuestionPoints = 0;
  percentage!: number | null;
  examTitle!: string;
  scoreSummary!: string;
  getExamResultPoints() {
    this.examService
      .getAllTakerAnswers(this.userStore?.user.userDetailId || 0, this.examId)
      .subscribe((ans) => {
        const hasPoints = ans.filter((x) => x.points && x.points > 0).length > 0;
        if (hasPoints) {
          ans.map((val2) => {
            if (val2.points && val2.points >= 0) {
              this.totalPoints = this.totalPoints + val2.points;
            }
          });

          this.questionService.getAllByExamId(this.examId).subscribe((val) => {
            val.map((val) => {
              this.totalQuestionPoints = this.totalQuestionPoints + val.maxpoints;
            });
            this.percentage = Math.round((this.totalPoints / this.totalQuestionPoints) * 100);
            this.scoreSummary = `${this.totalPoints} / ${this.totalQuestionPoints}`;
          });
        } else {
          this.percentage = null;
        }
      });
  }
  getExam() {
    this.examService.get(this.examId).subscribe((val) => (this.examTitle = val.name));
  }
  getUser() {
    this.store.select(fromAuth.getAuthSuccess).subscribe((val) => {
      this.userStore = val;
    });
  }
  constructor(
    private examService: ExamsService,
    private questionService: QuestionService,
    private store: Store<fromAuth.State>,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
    this.getExam();
    this.getUser();
    this.getExamResultPoints();
  }
}
