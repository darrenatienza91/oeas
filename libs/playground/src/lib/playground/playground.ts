import { AfterViewInit, Component, effect, ElementRef, inject, ViewChild } from '@angular/core';
import {
  CAMERA_RECORDER,
  SCREEN_RECORDER,
  VideoJsPlayerWithRecord,
  VideoRecorderFacadeService,
} from '@batstateu/shared';
import videojs from 'video.js';
import * as RecordRTC from 'recordrtc';
@Component({
  selector: 'lib-playground',
  providers: [
    { provide: CAMERA_RECORDER, useClass: VideoRecorderFacadeService },
    { provide: SCREEN_RECORDER, useClass: VideoRecorderFacadeService },
  ],
  imports: [],
  templateUrl: './playground.html',
  styleUrl: './playground.css',
})
export class Playground implements AfterViewInit {
  public readonly cameraRecorderFacade = inject(CAMERA_RECORDER);
  public readonly screenRecorderFacade = inject(SCREEN_RECORDER);

  @ViewChild('recorder', { static: true })
  recorder!: ElementRef<HTMLVideoElement>;

  @ViewChild('camera', { static: true })
  camera!: ElementRef<HTMLVideoElement>;

  private myEffect = effect(() => {
    if (this.screenRecorderFacade.isStarted()) {
      this.screenRecorderFacade.pause();
      this.myEffect.destroy();
    }
  });
  constructor() {}

  private playerRecorder!: VideoJsPlayerWithRecord;
  private cameraRecorder!: VideoJsPlayerWithRecord;

  ngAfterViewInit() {
    this.playerRecorder = videojs(
      this.recorder.nativeElement,
      {
        controls: true,
        plugins: {
          record: {
            audio: true,
            video: false,
            screen: true,
            maxLength: 50,
          },
        },
      },
      () => {
        console.log('player ready! id:', this.recorder.nativeElement.id);

        // print version information at startup
        const msg =
          'Using video.js ' +
          //videojs.VERSION +
          ' with videojs-record ' +
          videojs.getPluginVersion('record') +
          ' and recordrtc ' +
          RecordRTC.version;
        videojs.log(msg);
      },
    ) as VideoJsPlayerWithRecord;

    this.screenRecorderFacade.init(this.playerRecorder);

    this.cameraRecorder = videojs(
      this.camera.nativeElement,
      {
        controls: true,
        plugins: {
          record: {
            audio: true,
            video: true,
            screen: false,
          },
        },
      },
      () => {
        console.log('player ready! id:', this.recorder.nativeElement.id);

        // print version information at startup
        const msg =
          'Using video.js ' +
          //videojs.VERSION +
          ' with videojs-record ' +
          videojs.getPluginVersion('record') +
          ' and recordrtc ' +
          RecordRTC.version;
        videojs.log(msg);
      },
    ) as VideoJsPlayerWithRecord;

    this.cameraRecorderFacade.init(this.cameraRecorder);
  }
}
