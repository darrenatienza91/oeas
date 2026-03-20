import { AppConfig } from '@batstateu/app-config';

export const environment: AppConfig = {
  production: false,
  apiUrl: 'http://localhost:5004/api',
  uploadUrl: 'http://localhost:8081',
  allowRecording: false,
  fetchPreviousExam: true,
  inactiveTimeInSeconds: 30,
};
