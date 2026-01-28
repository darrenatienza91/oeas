import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamRecordViewModel } from '@batstateu/data-models';
import { ExamsService } from '@batstateu/shared';
import { BehaviorSubject } from 'rxjs';
import { ExamRecordingViewComponent } from '../../components/exam-recording-view/exam-recording-view.component';

@Component({
  imports: [ExamRecordingViewComponent],
  selector: 'batstateu-exam-recording',
  templateUrl: './exam-recording.component.html',
  styleUrls: ['./exam-recording.component.less'],
})
export class ExamRecordingComponent implements OnInit {
  examRecordViewModelSubject$ = new BehaviorSubject<ExamRecordViewModel | null>(null);
  examRecordViewModel$ = this.examRecordViewModelSubject$.asObservable();

  url = '';
  examId = 0;
  takerId = 0;

  getTakerExam() {
    this.examService
      .getExamTakerByExamIdTakerId(this.examId, this.takerId)
      .subscribe((val) => {
        this.examRecordViewModelSubject$.next(val);

      });
  }
  constructor(
    private examService: ExamsService,
    private route: ActivatedRoute
  ) {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
    this.takerId = Number(this.route.snapshot.paramMap.get('takerId'));
  }

  ngOnInit(): void {
    this.getTakerExam();
  }
}
