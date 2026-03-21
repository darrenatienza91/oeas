import { Observable } from 'rxjs';
import { VideoJsPlayerWithRecord } from '../videojs-media/videojs-with-record';

export function fromVideoJsEvent<K extends keyof VideoJsRecordEvents>(
  player: VideoJsPlayerWithRecord,
  event: K,
): Observable<VideoJsRecordEvents[K]> {
  return new Observable((subscriber) => {
    const handler = () => {
      switch (event) {
        case 'finishRecord':
          subscriber.next((player as any).recordedData);
          break;

        case 'deviceError':
          subscriber.next((player as any).deviceErrorCode);
          break;

        default:
          subscriber.next(undefined as VideoJsRecordEvents[K]);
      }
    };

    player.on(event, handler);

    return () => {
      player.off(event, handler);
    };
  });
}
