export interface User {
  userName: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  departmentId?: number | null;
  id: number;
  isActive: boolean;
  sectionId: number | null;
  role: string;
  hasUserDetail: boolean;
}

export type EditUserDto = Omit<
  User,
  | 'userName'
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'id'
  | 'isActive'
  | 'userType'
  | 'hasUserDetail'
>;
// TODO: update UI for Address and contactNumber
export interface EditMeDto {
  firstName: string;
  middleName?: string;
  lastName: string;
  address: string;
  contactNumber: string;
}

export interface AddProfileDto {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface Me {
  firstName: string;
  middleName?: string;
  lastName: string;
  department: string;
  section: string;
  hasProfile: boolean;
}
