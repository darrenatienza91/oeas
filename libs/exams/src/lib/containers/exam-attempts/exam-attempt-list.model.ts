export interface ExamAttemptList {
  id: number;
  name: string;
  section: string;
  department: string;
  score: string;
  hasRecording: boolean;
  recUrl: string;
  userDetailId: number;
  examId: number;
}
