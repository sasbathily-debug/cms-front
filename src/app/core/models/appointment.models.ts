export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export interface AppointmentDto {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  reason: string;
  preferredDate: string | null;
  preferredTime: string | null;
  message: string | null;
  userId: string | null;
  status: AppointmentStatus;
  createdAt: string;
}

export interface AppointmentStatusEventDto {
  id: string;
  previousStatus: AppointmentStatus | null;
  newStatus: AppointmentStatus;
  createdAt: string;
}
