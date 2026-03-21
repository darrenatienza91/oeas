import Player from 'video.js/dist/types/player';

export type VideoJsPlayerWithRecord = Player & {
  record: () => {
    resume(): void;
    stopDevice(): void;
    start: () => void;
    stop: () => void;
    getDevice: () => void;
    pause: () => void;
  };
  on(event: string, handler: () => void): void;
  off(event: string, handler: () => void): void;
  convertedData: Blob;
  recordedData: Blob;
  deviceErrorCode: string;
};
