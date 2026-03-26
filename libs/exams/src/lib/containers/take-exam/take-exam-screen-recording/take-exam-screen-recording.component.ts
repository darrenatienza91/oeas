import { Component, ElementRef, viewChild } from '@angular/core';
import { CountdownTimerService } from '../../../countdown-timer/countdown-timer.service';

@Component({
  providers: [CountdownTimerService],
  selector: 'batstateu-take-exam-screen-recording',
  templateUrl: './take-exam-screen-recording.component.html',
  styleUrls: ['./take-exam-screen-recording.component.less'],
})
export class TakeExamScreenRecordingComponent {
  public readonly screenRecorder =
    viewChild.required<ElementRef<HTMLVideoElement>>('screenRecorder');
}
