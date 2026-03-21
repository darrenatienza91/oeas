import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { VideoJsPlayerWithRecord, VideoRecorderFacadeService } from '@batstateu/shared';
import videojs from 'video.js';
import * as RecordRTC from 'recordrtc';
@Component({
  selector: 'lib-playground',
  providers: [VideoRecorderFacadeService],
  imports: [],
  templateUrl: './playground.html',
  styleUrl: './playground.css',
})
export class Playground implements AfterViewInit {
  @ViewChild('target', { static: true })
  target!: ElementRef<HTMLVideoElement>;

  private player!: VideoJsPlayerWithRecord;

  constructor(public facade: VideoRecorderFacadeService) {}

  ngAfterViewInit() {
    this.player = videojs(
      this.target.nativeElement,
      {
        controls: true,
        plugins: {
          record: {
            audio: true,
            video: false,
            screen: true,
          },
        },
      },
      () => {
        console.log('player ready! id:', this.target.nativeElement.id);

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

    this.facade.init(this.player);
  }
}
