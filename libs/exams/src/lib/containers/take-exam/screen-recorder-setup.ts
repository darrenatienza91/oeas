import { VideoJsPlayerWithRecord } from '@batstateu/shared';
import RecordRTC from 'recordrtc';
import videojs from 'video.js';

export const screenRecorderSetup = (
  screenRecorder: HTMLVideoElement,
  maxLength: number,
  htmlVideoElementId: string | undefined,
) =>
  videojs(
    screenRecorder,
    {
      controls: true,
      plugins: {
        record: {
          audio: true,
          video: false,
          screen: true,
          maxLength: maxLength,
          mediaRecorderOptions: {
            mimeType: 'video/webm;codecs=vp8,opus',
          },
        },
      },
    },
    () => {
      console.log('player ready! id:', htmlVideoElementId);

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
