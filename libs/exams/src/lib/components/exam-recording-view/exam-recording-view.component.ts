import {
  Component,
  OnInit,
  OnDestroy, Input
} from '@angular/core';
import { Record } from '@batstateu/videojs-record';
import videojs from 'video.js';
import * as RecordRTC from 'recordrtc';
import { Observable } from 'rxjs';
import { ExamRecordViewModel } from '@batstateu/data-models';
import { ExamsModule } from '@batstateu/exams';
@Component({
  imports: [ExamsModule],
  selector: 'batstateu-exam-recording-view',
  templateUrl: './exam-recording-view.component.html',
  styleUrls: ['./exam-recording-view.component.less'],
})
export class ExamRecordingViewComponent implements OnInit, OnDestroy {
  @Input() url = '';
  @Input() examRecordViewModel$!: Observable<ExamRecordViewModel | null>;
  visible = true;
  // index to create unique ID for component
  idx = 'clip1';

  private config: any;
  private player: any;
  private plugin: any;

  createConfig() {
    this.player = false;

    // save reference to plugin (so it initializes)
    this.plugin = Record;

    // video.js configuration
    this.config = {
      controls: true,
      autoplay: false,
      fluid: false,
      loop: false,
      width: 640,
      height: 400,
      bigPlayButton: true,
      sources: {
        src: this.url,
        type: 'video/webm',
      },
      controlBar: {
        volumePanel: false,
      },
      plugins: {},
    };
  }
  initVideo() {
    console.log();
    // ID with which to access the template's video element
    const el = 'video_' + this.idx;

    // setup the player via the unique element ID
    this.player = videojs(
      document.getElementById(el) as HTMLVideoElement,
      this.config,
      () => {
        console.log('player ready! id:', el);

        // print version information at startup
        const msg =
          'Using video.js ' +
          //videojs.VERSION +
          ' with videojs-record ' +
          videojs.getPluginVersion('record') +
          ' and recordrtc ' +
          RecordRTC.version;
        videojs.log(msg);
      }
    );

    // device is ready
    this.player.on('deviceReady', () => {
      console.log('device is ready!');
    });

    // user clicked the record button and started recording
    this.player.on('startRecord', () => {
      this.visible = false;
      console.log('started recording!');
    });

    // user completed recording and stream is available
    this.player.on('finishRecord', () => {
      // recordedData is a blob object containing the recorded data that
      // can be downloaded by the user, stored on server etc.
      console.log('finished recording: ', this.player.recordedData);
      this.visible = true;
    });

    // error handling
    this.player.on('error', (element: any, error: any) => {
      console.warn(error);
    });

    this.player.on('deviceError', () => {
      console.error('device error:', this.player.deviceErrorCode);
    });
  }
  // constructor initializes our declared vars
  constructor() { }
  ngOnInit(): void {
    this.examRecordViewModel$.subscribe((val) => {
      if (val !== null) {
        this.url = val?.recUrl || '';
        this.createConfig();
        this.initVideo();
      }
    });
  }

  // use ngOnDestroy to detach event handlers and remove the player
  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
      this.player = false;
    }
  }
}
