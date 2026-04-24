export interface ExamAttemptDetailDto {
  id: number;
  userDetailId: number;
  examId: number;
  recordingUrl: string;
  isSubmitted: boolean;
}
