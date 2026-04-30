import { Component, OnDestroy, input, viewChild, ElementRef, effect } from '@angular/core';
import videojs from 'video.js';
import { NgZorroAntdModule } from '../../../../../../../ng-zorro-antd/src/lib/ng-zorro-antd.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ExamAttemptRecordingPreviewDto } from '../../services/exam-attempt/exam-attempt-recording-preview.dto';
@Component({
  imports: [ReactiveFormsModule, FormsModule, NgZorroAntdModule, RouterLink, CommonModule],
  selector: 'batstateu-exam-attempt-recording-view',
  templateUrl: './exam-attempt-recording-view.component.html',
  styleUrls: ['./exam-attempt-recording-view.component.less'],
})
export class ExamAttemptRecordingViewComponent implements OnDestroy {
  public recordingPreview = input<ExamAttemptRecordingPreviewDto | undefined>();
  private player: any;
  public readonly takeExamRecording = viewChild<ElementRef<HTMLVideoElement>>('player');

  private readonly playerEffect = effect(() => {
    if (this.takeExamRecording() && this.recordingPreview()?.recordingUrl) {
      this.player = videojs(
        this.takeExamRecording()!.nativeElement,
        {
          controls: true,
          autoplay: true,
          fluid: false,
          loop: false,
          width: 640,
          height: 400,
          bigPlayButton: true,
          sources: {
            src: this.recordingPreview()!.recordingUrl,
            type: 'video/webm',
          },
          controlBar: {
            volumePanel: false,
          },
        },
        function () {
          this.on('deviceReady', () => {
            console.log('device is ready!');
          });
        },
      );
      this.playerEffect.destroy();
    }
  });

  // use ngOnDestroy to detach event handlers and remove the player
  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
