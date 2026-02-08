export interface Exam {
  sectionId: number;
  id: number | null;
  name: string;
  subject: string;
  startOn: string;
  duration: number;
  passers: string;
  department: string;
  isActive: boolean;
  instructions: string;
}
