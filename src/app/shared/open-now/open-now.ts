import { Component, DestroyRef, afterNextRender, inject, input, signal } from '@angular/core';

/** Horaires du cabinet par jour (0 = dimanche), en minutes depuis minuit ; à confirmer avec la doctoresse. */
const SCHEDULE: Record<number, [number, number] | null> = {
  0: null,
  1: [9 * 60, 17 * 60 + 30],
  2: [9 * 60, 17 * 60 + 30],
  3: [9 * 60, 17 * 60 + 30],
  4: [9 * 60, 17 * 60 + 30],
  5: [9 * 60, 17 * 60 + 30],
  6: [9 * 60, 13 * 60],
};

const DAY_NAMES = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const WEEKDAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

interface Status {
  open: boolean;
  text: string;
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${String(m).padStart(2, '0')}`;
}

/** Heure et jour à Dakar, quel que soit le fuseau du visiteur. */
function dakarNow(date: Date): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Dakar',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '0';
  return {
    day: WEEKDAYS[get('weekday')] ?? 0,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  };
}

export function statusAt(date: Date): Status {
  const { day, minutes } = dakarNow(date);
  const today = SCHEDULE[day];
  if (today && minutes >= today[0] && minutes < today[1]) {
    return { open: true, text: `Ouvert · jusqu'à ${formatTime(today[1])}` };
  }
  if (today && minutes < today[0]) {
    return { open: false, text: `Fermé · ouvre à ${formatTime(today[0])}` };
  }
  for (let offset = 1; offset <= 7; offset++) {
    const next = (day + offset) % 7;
    const hours = SCHEDULE[next];
    if (hours) {
      const when = offset === 1 ? 'demain' : DAY_NAMES[next];
      return { open: false, text: `Fermé · réouverture ${when} ${formatTime(hours[0])}` };
    }
  }
  return { open: false, text: 'Fermé' };
}

/**
 * Pastille « Ouvert maintenant » calculée avec les horaires du cabinet, à l'heure de Dakar.
 * Le point respire quand le cabinet est ouvert ; il reste fixe quand il est fermé.
 */
@Component({
  selector: 'app-open-now',
  styleUrl: './open-now.css',
  template: `
    @if (status(); as s) {
      <span
        class="inline-flex items-center gap-2 text-[13.5px] font-semibold"
        [class]="tone() === 'dark' ? 'text-[#F3EAE0]' : 'text-forest-900'"
      >
        <span class="open-dot" [class.open-dot-on]="s.open" aria-hidden="true"></span>
        <span>{{ s.text }}</span>
      </span>
    }
  `,
})
export class OpenNow {
  readonly tone = input<'light' | 'dark'>('light');
  protected readonly status = signal<Status | null>(null);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const refresh = () => this.status.set(statusAt(new Date()));
      refresh();
      const timer = setInterval(refresh, 60_000);
      destroyRef.onDestroy(() => clearInterval(timer));
    });
  }
}
