import {
  AfterViewInit,
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CountdownTimerService } from '../../../countdown-timer/countdown-timer.service';
import { Observable } from 'rxjs';

@Component({
  providers: [CountdownTimerService],
  selector: 'batstateu-take-exam-recording',
  templateUrl: './take-exam-recording.component.html',
  styleUrls: ['./take-exam-recording.component.less'],
})
export class TakeExamRecordingComponent implements OnInit, OnDestroy, AfterViewInit {
  private coundownTimerService = inject(CountdownTimerService);

  @Input() limit$!: Observable<number>;
  public tabActive = input<boolean>(true);
  @Output() startExam = new EventEmitter();
  @Output() uploadRecord = new EventEmitter();

  idx = 'clip1';
  isRecording = false;

  limit!: number;
  interval: any;
  timeLeft = 5;
  isTabActive = true;

  private readonly recordingFlowEffect = effect(() => {
    const countdownTime = this.coundownTimerService.time();
    if (countdownTime <= 0) {
      if (this.tabActive()) {
        this.player?.record().pause();
      }
      this.coundownTimerService.reset(10);
      return;
    }
  });

  onTabActive() {
    this.tabActive$.subscribe((isActive) => {
      this.isTabActive = isActive ?? true;
      if (this.isRecording) {
        if (isActive) {
          this.coundownTimerService.resume();
        } else {
          this.player?.record().resume();
        }
      }
    });
  }

  public onStartRecord() {
    this.player?.record().getDevice();
  }
  onStopRecord() {
    this.player?.record().stopDevice();
    clearInterval(this.interval);
  }

  constructor() {}

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
  }

  ngOnInit(): void {
    this.setLimit();
  }

  setLimit() {
    this.limit$.subscribe((val) => {
      if (val > 0) {
        this.limit = val;
        this.init();
        this.initScreenRecorder();
        this.onTabActive();
      }
    });
  }

  ngAfterViewInit(): void {}
}
