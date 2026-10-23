import { AppointmentStatus } from '../core/models/appointment.models';

export function appointmentStatusLabel(status: AppointmentStatus): string {
  switch (status) {
    case 'CONFIRMED':
      return 'Confirmé';
    case 'CANCELLED':
      return 'Annulé';
    case 'COMPLETED':
      return 'Terminé';
    case 'NO_SHOW':
      return 'Absent';
  }
}

export function appointmentStatusClasses(status: AppointmentStatus): string {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-success-soft text-success';
    case 'CANCELLED':
      return 'bg-danger-soft text-danger';
    case 'COMPLETED':
      return 'bg-info-soft text-info';
    case 'NO_SHOW':
      return 'bg-brown-soft text-brown';
  }
}

export function appointmentStatusDotClasses(status: AppointmentStatus): string {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-success-solid';
    case 'CANCELLED':
      return 'bg-danger-solid';
    case 'COMPLETED':
      return 'bg-info-solid';
    case 'NO_SHOW':
      return 'bg-brown-solid';
  }
}
