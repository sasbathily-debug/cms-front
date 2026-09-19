import { AppointmentStatus } from '../core/models/appointment.models';

export function appointmentStatusLabel(status: AppointmentStatus): string {
  switch (status) {
    case 'PENDING':
      return 'En attente';
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
    case 'PENDING':
      return 'bg-[#FBF0D9] text-[#A9760F]';
    case 'CONFIRMED':
      return 'bg-[#E3F1E6] text-[#2E7D46]';
    case 'CANCELLED':
      return 'bg-[#FBE7E6] text-[#B2453B]';
    case 'COMPLETED':
      return 'bg-[#E3E9F1] text-[#2E5C8A]';
    case 'NO_SHOW':
      return 'bg-[#F1E6E3] text-[#8A4A2E]';
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
    case 'COMPLETED':
      return 'bg-[#3E6FA9]';
    case 'NO_SHOW':
      return 'bg-[#A9673E]';
  }
}
