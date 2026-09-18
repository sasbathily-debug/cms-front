export type Role = 'ADMIN' | 'USER';

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  emailReminders: boolean;
  smsReminders: boolean;
  role: Role;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  emailReminders: boolean;
  smsReminders: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
