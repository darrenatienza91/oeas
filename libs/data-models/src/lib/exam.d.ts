export interface Exam {
  sectionId: number;
  id: number | null;
  name: string;
  subject: string;
  startOn: string;
  duration: number;
  passers: string;
  departmentName: string;
  isActive: boolean;
  instructions: string;
}
