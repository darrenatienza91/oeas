export interface ExamAttemptList {
  id: number;
  fullName: string;
  section: string;
  department: string;
  finalScore: number;
  hasRecording: boolean;
  recUrl: string;
  userDetailId: number;
  examId: number;
}
