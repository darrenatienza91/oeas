import { Observable } from 'rxjs';
import { VideoJsPlayerWithRecord } from './videojs-with-record';
import { VideoJsRecordEvents } from './video-js-record-event';

const eventExtractors: {
  [K in keyof VideoJsRecordEvents]: (player: VideoJsPlayerWithRecord) => VideoJsRecordEvents[K];
} = {
  finishRecord: (player) => player.recordedData,
  deviceError: (player) => player.deviceErrorCode,
  deviceReady: (_) => undefined,
  startRecord: (_) => undefined,
  stopRecord: (_) => undefined,
  error: (_) => null,
} as {
  [K in keyof VideoJsRecordEvents]: (player: VideoJsPlayerWithRecord) => VideoJsRecordEvents[K];
};

export function fromVideoJsEvent<K extends keyof VideoJsRecordEvents>(
  player: VideoJsPlayerWithRecord,
  event: K,
): Observable<VideoJsRecordEvents[K]> {
  return new Observable((subscriber) => {
    const handler = () => {
      const value = eventExtractors[event](player);

      if (!value) {
        subscriber.next(undefined as VideoJsRecordEvents[K]);
        return;
      }

      subscriber.next(value);
    };

    player.on(event, handler);

    return () => {
      player.off(event, handler);
    };
  });
}
