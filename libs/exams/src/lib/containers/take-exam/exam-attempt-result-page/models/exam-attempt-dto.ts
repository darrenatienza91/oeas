import { ExamCheckingStatus } from './exam-checking-status';
import { ExamResultStatus } from './exam-result-status';

export type ExamAttemptResultDto = {
  checkingStatus: ExamCheckingStatus;
  result: ExamResultStatus;
  percentage: number;
  totalPossible: number;
  totalAcquired: number;
};
