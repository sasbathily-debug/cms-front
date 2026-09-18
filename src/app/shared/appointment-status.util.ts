import { AppointmentStatus } from '../core/models/appointment.models';

export function appointmentStatusLabel(status: AppointmentStatus): string {
  switch (status) {
    case 'PENDING':
      return 'En attente';
    case 'CONFIRMED':
      return 'Confirmé';
    case 'CANCELLED':
      return 'Annulé';
  }
}

export function appointmentStatusClasses(status: AppointmentStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-[#FBF0D9] text-[#A9760F]';
    case 'CONFIRMED':
      return 'bg-[#E3F1E6] text-[#2E7D46]';
    case 'CANCELLED':
      return 'bg-[#FBE7E6] text-[#B2453B]';
  }
}

export function appointmentStatusDotClasses(status: AppointmentStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-[#E0A83E]';
    case 'CONFIRMED':
      return 'bg-[#3E9E5B]';
    case 'CANCELLED':
      return 'bg-[#D9564B]';
  }
}
