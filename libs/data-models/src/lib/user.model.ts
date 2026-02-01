export interface User {
  userName: string;
  firstName: string;
  id: number;
  isActive: boolean;
  userDetailId: number;
  sectionId: number | null;
  userType: string;
}
