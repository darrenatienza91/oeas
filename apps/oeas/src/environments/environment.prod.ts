import { AppConfig } from '@batstateu/app-config';

export const environment: AppConfig = {
  production: true,
  apiUrl: 'http://oeas.online/api',
  uploadUrl: 'http://oeas.online/api',
  allowRecording: false,
  fetchPreviousExam: false,
  inactiveTimeInSeconds: 0,
};
