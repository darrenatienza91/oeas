import {
  AfterViewInit,
  Component, Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import videojs from 'video.js';
import { Observable } from 'rxjs';
import { ExamsModule } from '@batstateu/exams';
@Component({
  imports: [ExamsModule],
  selector: 'batstateu-take-exam-camera-view',
  templateUrl: './take-exam-camera-view.component.html',
  styleUrls: ['./take-exam-camera-view.component.css'],
})
export class TakeExamCameraViewComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() videoVisible$!: Observable<boolean>;
  @Input() tabActive$!: Observable<boolean | null>;
  videoVisible!: boolean;
  private videoPlayer: any;
  private videoConf: any;
  idx2 = 'clip2';
  limit = 0;
  setVideoVisible() {
    this.videoVisible$.subscribe((val) => {
      if (val) {
        this.videoVisible = true;
      }
    });
  }
  initCameraView() {
    // ID with which to access the template's video element
    const el = 'video_' + this.idx2;
    // setup the player via the unique element ID
    this.videoPlayer = videojs(
      document.getElementById(el) as HTMLVideoElement,
      this.videoConf,
      () => {
        console.log('player ready! id:', el);
      }
    );
    // error handling
    this.videoPlayer.on('deviceError', () => {
      console.warn('device error:', this.videoPlayer.deviceErrorCode);
    });

    this.videoPlayer.on('error', function (element: any, error: any) {
      console.error(error);
    });
    this.videoPlayer.on('enterPIP', function (element: any, evt: any) {
      console.log('Entered Picture-in-Picture');
    });
    this.videoPlayer.record().getDevice();
  }
  constructor() {
    // video.js configuration
    this.videoConf = {
      controls: false,
      width: 320,
      height: 240,
      fluid: false,

      plugins: {
        record: {
          pip: false,
          audio: false,
          video: true,

          displayMilliseconds: false,
          debug: true,
        },
      },
    };
  }
  ngAfterViewInit(): void {
    this.initCameraView();
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    if (this.videoPlayer) {
      this.videoPlayer.dispose();
      this.videoPlayer = false;
    }
  }
}
