import { User } from './user.model';

export interface UserDetail extends User {
  code: string;
  email: string;
  isActive: boolean;
  middleName: string;
  lastName: string;
  address: string;
  departmentId: number;
  sectionId: any | null;

  contactNumber: string;
  user_id: number;
  contactNumberPrefix: string;
  sectionName: string;
  departmentName: string;
  userType: string;
  userTypeId: number;
  isResetPassword: boolean;
}
