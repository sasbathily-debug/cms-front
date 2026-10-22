import { OpeningHourDto } from './models/site-content.models';

/** Horaires de la maquette, utilisés tant que ceux de l'admin ne sont pas chargés (à confirmer avec la doctoresse). */
export const DEFAULT_DAYS: OpeningHourDto[] = [
  { dayOfWeek: 1, opens: '09:00', closes: '17:30', closed: false },
  { dayOfWeek: 2, opens: '09:00', closes: '17:30', closed: false },
  { dayOfWeek: 3, opens: '09:00', closes: '17:30', closed: false },
  { dayOfWeek: 4, opens: '09:00', closes: '17:30', closed: false },
  { dayOfWeek: 5, opens: '09:00', closes: '17:30', closed: false },
  { dayOfWeek: 6, opens: '09:00', closes: '13:00', closed: false },
  { dayOfWeek: 7, opens: null, closes: null, closed: true },
];

const DAY_NAMES = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const DAY_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

/** « 09:00 » devient « 9h00 », « 17:30 » devient « 17h30 ». */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  return `${Number(hours)}h${minutes}`;
}

/** Jours consécutifs ayant les mêmes horaires, regroupés : lundi à vendredi, samedi, dimanche… */
export interface HoursGroup {
  /** Premier et dernier jour du groupe, de 1 (lundi) à 7 (dimanche). */
  from: number;
  to: number;
  closed: boolean;
  /** « 9h00 – 17h30 » ; vide si fermé. */
  hours: string;
}

export function groupDays(days: OpeningHourDto[]): HoursGroup[] {
  const sorted = [...days].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  const groups: HoursGroup[] = [];
  for (const day of sorted) {
    const hours =
      day.closed || !day.opens || !day.closes
        ? ''
        : `${formatTime(day.opens)} – ${formatTime(day.closes)}`;
    const closed = day.closed || !hours;
    const last = groups[groups.length - 1];
    if (last && last.closed === closed && last.hours === hours && last.to === day.dayOfWeek - 1) {
      last.to = day.dayOfWeek;
    } else {
      groups.push({ from: day.dayOfWeek, to: day.dayOfWeek, closed, hours });
    }
  }
  return groups;
}

/** « Lun – Ven » pour une plage, « Samedi » pour un jour seul. */
export function shortLabel(group: HoursGroup): string {
  return group.from === group.to
    ? capitalize(DAY_NAMES[group.from - 1])
    : `${DAY_SHORT[group.from - 1]} – ${DAY_SHORT[group.to - 1]}`;
}

/** « Lundi au vendredi » pour une plage, « Samedi » pour un jour seul. */
export function longLabel(group: HoursGroup): string {
  return group.from === group.to
    ? capitalize(DAY_NAMES[group.from - 1])
    : `${capitalize(DAY_NAMES[group.from - 1])} au ${DAY_NAMES[group.to - 1]}`;
}

/** « du lundi au vendredi de 9h00 à 17h30 et le samedi de 9h00 à 13h00 » (jours fermés omis). */
export function hoursSentence(groups: HoursGroup[]): string {
  return groups
    .filter((g) => !g.closed)
    .map((g) => {
      const [from, to] = g.hours.split(' – ');
      const days =
        g.from === g.to
          ? `le ${DAY_NAMES[g.from - 1]}`
          : `du ${DAY_NAMES[g.from - 1]} au ${DAY_NAMES[g.to - 1]}`;
      return `${days} de ${from} à ${to}`;
    })
    .join(' et ');
}
