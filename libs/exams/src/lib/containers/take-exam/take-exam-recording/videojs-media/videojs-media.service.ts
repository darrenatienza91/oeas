import { Injectable } from '@angular/core';
import { Record } from '@batstateu/videojs-record';
import videojs from 'video.js';
import * as RecordRTC from 'recordrtc';
import { VideoJsPlayerWithRecord } from './videojs-with-record';

@Injectable({
  providedIn: 'root',
})
export class VideojsMediaService {
  private player!: VideoJsPlayerWithRecord | null;
  private config!: VideoJSConfig;

  // save reference to plugin (so it initializes)
  public plugin = Record;

  public initCore(limit: number): void {
    this.player = null;

    // video.js configuration
    this.config = {
      controls: true,
      autoplay: false,
      fluid: false,
      loop: false,
      width: 320,
      height: 240,
      bigPlayButton: false,
      controlBar: {
        volumePanel: false,
      },
      plugins: {
        // configure videojs-record plugin
        record: {
          audio: true,
          screen: true,
          maxLength: limit,
          convertEngine: 'ts-ebml',
          videoMimeType: 'video/webm;codecs=vp8',
          debug: true,
        },
      },
    };
  }

  public initScreenRecorder(idx: string) {
    const DEVICE_READY: VideoJsRecordEvent = 'deviceReady';
    const START_RECORD: VideoJsRecordEvent = 'startRecord';
    const FINISH_CONVERT: VideoJsRecordEvent = 'finishConvert';
    const ERROR: VideoJsRecordEvent = 'error';
    const DEVICE_ERROR: VideoJsRecordEvent = 'deviceError';
    // ID with which to access the template's video element
    const el = 'video_' + idx;

    // setup the player via the unique element ID
    this.player = videojs(document.getElementById(el) as HTMLVideoElement, this.config, () => {
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
    }) as VideoJsPlayerWithRecord;

    // device is ready
    this.player.on(DEVICE_READY, () => {
      console.log('device is ready!');
      this.player?.record().start();
    });

    // user completed recording and stream is available
    this.player.on(FINISH_CONVERT, () => {
      // recordedData is a blob object containing the recorded data that
      // can be downloaded by the user, stored on server etc.
      console.log('finished convert: ', this.player?.convertedData);
      const data = this.player?.convertedData;
      // this.uploadRecord.emit(data);
    });

    this.player.on(START_RECORD, () => {});

    // error handling
    this.player.on(ERROR, (element: any, error: any) => {
      console.warn(error);
    });

    this.player.on(DEVICE_ERROR, () => {
      const error = this.player?.deviceErrorCode ?? ({} as { code: number });
      if (error.code > 0) {
        console.error('device error:', this.player?.deviceErrorCode);
      }
    });

    navigator.permissions
      .query({ name: 'microphone' })
      .then((permissionObj) => {
        console.log(permissionObj.state);
      })
      .catch((error) => {
        console.log('Got error :', error);
      });

    navigator.permissions
      .query({ name: 'camera' })
      .then((permissionObj) => {
        console.log(permissionObj.state);
      })
      .catch((error) => {
        console.log('Got error :', error);
      });
  }
}

type ConvertEngine = 'ts-ebml';
type VideoMimeType = 'video/webm;codecs=vp8';
type VideoJSConfig = {
  controls: boolean;
  autoplay: boolean;
  fluid: boolean;
  loop: boolean;
  width: number;
  height: number;
  bigPlayButton: boolean;
  controlBar: {
    volumePanel: boolean;
  };
  plugins: {
    // configure videojs-record plugin
    record: {
      audio: boolean;
      screen: boolean;
      maxLength: number;
      convertEngine: ConvertEngine;
      videoMimeType: VideoMimeType;
      debug: boolean;
    };
  };
};

export type VideoJsRecordEvent =
  | 'deviceReady'
  | 'startRecord'
  | 'stopRecord'
  | 'finishRecord'
  | 'finishConvert'
  | 'deviceError'
  | 'error';
