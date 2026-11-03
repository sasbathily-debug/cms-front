import {
  Component,
  DestroyRef,
  afterNextRender,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { OpeningHourDto } from '../../core/models/site-content.models';
import { DEFAULT_DAYS } from '../../core/opening-hours';
import { OpeningHours } from '../../core/services/opening-hours';

const DAY_NAMES = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

const toMinutes = (time: string): number => {
  const [h, m] = time.split(':');
  return Number(h) * 60 + Number(m);
};

/** Horaires de la journée `day` (0 = dimanche), en minutes depuis minuit ; `null` si fermé. */
function scheduleFor(days: OpeningHourDto[], day: number): [number, number] | null {
  const found = days.find((d) => d.dayOfWeek === (day === 0 ? 7 : day));
  if (!found || found.closed || !found.opens || !found.closes) return null;
  return [toMinutes(found.opens), toMinutes(found.closes)];
}
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

export function statusAt(date: Date, days: OpeningHourDto[] = DEFAULT_DAYS): Status {
  const { day, minutes } = dakarNow(date);
  const today = scheduleFor(days, day);
  if (today && minutes >= today[0] && minutes < today[1]) {
    return { open: true, text: `Ouvert · jusqu'à ${formatTime(today[1])}` };
  }
  if (today && minutes < today[0]) {
    return { open: false, text: `Fermé · ouvre à ${formatTime(today[0])}` };
  }
  for (let offset = 1; offset <= 7; offset++) {
    const next = (day + offset) % 7;
    const hours = scheduleFor(days, next);
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
      @if (variant() === 'bande') {
        <span class="flex flex-col gap-1.5">
          <span class="text-xs font-semibold tracking-[0.2em] text-peach">{{
            s.text.split(' · ')[0].toUpperCase()
          }}</span>
          <span class="font-display text-[21px] font-medium leading-tight text-white">{{
            s.text.split(' · ').slice(1).join(' · ')
          }}</span>
        </span>
      } @else {
        <span
          class="inline-flex items-center gap-2 text-[13.5px] font-semibold"
          [class]="tone() === 'dark' ? 'text-on-plum' : 'text-fg'"
        >
          <span class="open-dot" [class.open-dot-on]="s.open" aria-hidden="true"></span>
          <span>{{ s.text }}</span>
        </span>
      }
    }
  `,
})
export class OpenNow {
  readonly tone = input<'light' | 'dark'>('light');
  /** « bande » : deux lignes (Ouvert / jusqu'à 17h30) sans pastille, pour la bande du bas du bandeau d'accueil. */
  readonly variant = input<'pastille' | 'bande'>('pastille');
  private readonly hours = inject(OpeningHours);
  protected readonly status = signal<Status | null>(null);
  /** Heure de la dernière mise à jour ; `null` tant que la page n'est pas affichée dans le navigateur. */
  private readonly now = signal<Date | null>(null);

  constructor() {
    const destroyRef = inject(DestroyRef);
    // Se recalcule chaque minute, et dès que les horaires de l'admin arrivent.
    effect(() => {
      const now = this.now();
      const days = this.hours.days();
      if (now) this.status.set(statusAt(now, days));
    });
    afterNextRender(() => {
      this.now.set(new Date());
      const timer = setInterval(() => this.now.set(new Date()), 60_000);
      destroyRef.onDestroy(() => clearInterval(timer));
    });
  }
}
