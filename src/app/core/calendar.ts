/** Un rendez-vous à ajouter à l'agenda du téléphone (fichier .ics, lu par iPhone, Android et les agendas en ligne). */
export interface CalendarEvent {
  /** « 2026-11-10 » */
  date: string;
  /** « 09:00:00 » ou « 09:00 » */
  time: string;
  title: string;
  location?: string;
  description?: string;
  /** Durée en minutes : la durée d'une consultation n'est pas connue, on prend l'écart entre deux créneaux. */
  minutes?: number;
}

/** Les horaires du cabinet sont ceux de Dakar, qui est à UTC+0 toute l'année : on écrit l'heure telle quelle, en UTC. */
function stamp(date: string, time: string, addMinutes = 0): string {
  const base = Date.parse(`${date}T${time.slice(0, 5)}:00Z`) + addMinutes * 60_000;
  return new Date(base)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

function escapeText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

export function icsFile(event: CalendarEvent, now = new Date()): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cabinet Dr Aïssatou Mamadou Fall//Rendez-vous//FR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${stamp(event.date, event.time)}-rdv@draissatoumamadou.com`,
    `DTSTAMP:${now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '')}`,
    `DTSTART:${stamp(event.date, event.time)}`,
    `DTEND:${stamp(event.date, event.time, event.minutes ?? 30)}`,
    `SUMMARY:${escapeText(event.title)}`,
  ];
  if (event.location) lines.push(`LOCATION:${escapeText(event.location)}`);
  if (event.description) lines.push(`DESCRIPTION:${escapeText(event.description)}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}
