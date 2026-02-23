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
}

export type EditUserDto = Omit<
  User,
  'userName' | 'firstName' | 'middleName' | 'lastName' | 'id' | 'isActive' | 'userType'
>;

export interface EditMeDto {
  firstName: string;
  middleName?: string;
  lastName: string;
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
