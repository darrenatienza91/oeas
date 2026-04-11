import { InjectionToken } from '@angular/core';

export interface AppConfig {
  production: boolean;
  apiUrl: string;
  uploadUrl: string;
  allowRecording: boolean;
  fetchPreviousExam: boolean;
  inactiveTimeInSeconds: number;
  recordingToPauseTimeInSeconds: number;
  allowInactiveTimePenalty: boolean;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('Application config');
