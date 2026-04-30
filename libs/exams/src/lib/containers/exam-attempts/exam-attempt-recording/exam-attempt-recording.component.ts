import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamAttemptRecordingViewComponent } from './exam-attempt-recording-view/exam-attempt-recording-view.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExamAttemptService } from '../services/exam-attempt/exam-attempt.service';

@Component({
  imports: [ExamAttemptRecordingViewComponent],
  selector: 'batstateu-exam-attempt-recording',
  templateUrl: './exam-attempt-recording.component.html',
  styleUrls: ['./exam-attempt-recording.component.less'],
})
export class ExamAttemptRecordingComponent {
  private examAttemptService: ExamAttemptService = inject(ExamAttemptService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private readonly attemptId = Number(this.route.snapshot.paramMap.get('attemptId'));
  public readonly recordingPreview = toSignal(
    this.examAttemptService.getExamAttemptDetail(this.attemptId),
  );
}
