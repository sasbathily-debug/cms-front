export type AppointmentStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

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
  /** Faux pour un rendez-vous pris sans compte et sans e-mail confirmé par code : le cabinet confirme alors lui-même. */
  contactVerified?: boolean;
  createdAt: string;
}

export interface AppointmentStatusEventDto {
  id: string;
  previousStatus: AppointmentStatus | null;
  newStatus: AppointmentStatus;
  createdAt: string;
}
