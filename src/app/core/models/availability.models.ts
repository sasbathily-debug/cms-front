export interface AvailableSlotDto {
  date: string;
  time: string;
}

export type DayOfWeek =
  'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface AvailabilityRuleDto {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
}

export interface AvailabilityRuleRequest {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
}

export interface ScheduleExceptionDto {
  id: string;
  date: string;
  closed: boolean;
  customStartTime: string | null;
  customEndTime: string | null;
  slotDurationMinutes: number | null;
  note: string | null;
}

export interface ScheduleExceptionRequest {
  date: string;
  closed: boolean;
  customStartTime: string | null;
  customEndTime: string | null;
  slotDurationMinutes: number | null;
  note: string | null;
}
