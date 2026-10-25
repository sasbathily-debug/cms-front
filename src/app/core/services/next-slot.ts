import { Service, computed, inject, signal } from '@angular/core';
import { AvailabilityService } from './availability';
import { AvailableSlotDto } from '../models/availability.models';

const WINDOW_DAYS = 45;
const TICK_MS = 30_000;
/** On redemande au serveur au plus toutes les 5 minutes (un créneau a pu être pris entre-temps). */
const REFETCH_MS = 5 * 60_000;
/** Quand il n'y a plus de créneau à venir, on réessaie plus vite. */
const RETRY_MS = 60_000;

/** Les horaires du cabinet sont ceux de Dakar, qui est à UTC+0 toute l'année : on lit « 17:00 » comme 17:00 UTC. */
function instant(slot: AvailableSlotDto): number {
  return Date.parse(`${slot.date}T${slot.time}Z`);
}

/** Ce que montre l'étiquette de l'accueil : le jour en abrégé, son numéro, et une phrase (« lundi à 9 h »). */
export interface SlotTicket {
  jour: string;
  numero: string;
  phrase: string;
}

/** « 09:00:00 » devient « 9 h », « 17:30:00 » devient « 17 h 30 ». */
export function formatHeure(time: string): string {
  const heures = Number(time.slice(0, 2));
  const minutes = time.slice(3, 5);
  return !minutes || minutes === '00' ? `${heures} h` : `${heures} h ${minutes}`;
}

/**
 * Le prochain créneau libre affiché sur l'accueil. Il reste juste tant que la page est ouverte : l'heure avance
 * toutes les 30 secondes (un créneau passé disparaît tout de suite) et la liste est relue au serveur toutes les
 * 5 minutes ainsi qu'au retour sur l'onglet.
 */
@Service()
export class NextSlot {
  private readonly availability = inject(AvailabilityService);

  private readonly slots = signal<AvailableSlotDto[]>([]);
  private readonly now = signal(Date.now());
  private lastFetch = 0;

  /** Le premier créneau qui n'est pas encore passé, ou null s'il n'y en a pas. */
  readonly next = computed(() => this.slots().find((slot) => instant(slot) > this.now()) ?? null);

  /** Le prochain créneau sous la forme de l'étiquette de l'accueil, ou null s'il n'y en a pas. */
  readonly ticket = computed<SlotTicket | null>(() => {
    const slot = this.next();
    if (!slot) return null;
    const jour = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', timeZone: 'UTC' })
      .format(new Date(`${slot.date}T12:00:00Z`))
      .replace('.', '')
      .toUpperCase();
    return {
      jour,
      numero: String(Number(slot.date.slice(8, 10))),
      phrase: `${this.dayLabel(slot)} à ${formatHeure(slot.time)}`,
    };
  });

  constructor() {
    this.fetch();
    window.setInterval(() => this.tick(), TICK_MS);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) this.tick();
    });
  }

  /** « aujourd'hui » ou le nom du jour (heure de Dakar). */
  dayLabel(slot: AvailableSlotDto): string {
    const today = new Date(this.now()).toISOString().slice(0, 10);
    if (slot.date === today) return "aujourd'hui";
    return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', timeZone: 'UTC' }).format(
      new Date(`${slot.date}T12:00:00Z`),
    );
  }

  private tick(): void {
    if (document.hidden) return;
    this.now.set(Date.now());
    const age = Date.now() - this.lastFetch;
    if (age >= REFETCH_MS || (this.next() === null && age >= RETRY_MS)) this.fetch();
  }

  private fetch(): void {
    this.lastFetch = Date.now();
    const from = new Date();
    const to = new Date();
    to.setDate(to.getDate() + WINDOW_DAYS);
    this.availability
      .getAvailableSlots(from.toISOString().slice(0, 10), to.toISOString().slice(0, 10))
      .subscribe({
        next: (slots) => {
          this.now.set(Date.now());
          this.slots.set(slots);
        },
        error: () => undefined,
      });
  }
}
