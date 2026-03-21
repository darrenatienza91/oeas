export type VideoJsRecordEvents = {
  deviceReady: void;
  startRecord: void;
  stopRecord: void;
  finishRecord: Blob; // we’ll map this
  deviceError: string;
  error: string | null;
};
