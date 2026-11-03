import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { INTENTS, bookingQuery } from '../../core/site-nav';
import { Specialties } from '../../core/services/specialties';

type OrganId = 'hy' | 'th' | 'pa' | 'ov';

interface Organ {
  id: OrganId;
  label: string;
  /** Hauteur sur la silhouette, en % de sa hauteur. */
  y: number;
  /** Côté où s'écrit le nom, pour que les traits ne se croisent pas. */
  side: 'l' | 'r';
}

/** Les glandes repérées sur la silhouette. Seules celles qui correspondent à une spécialité y figurent. */
const ORGANS: Organ[] = [
  { id: 'hy', label: 'Hypophyse', y: 18, side: 'r' },
  { id: 'th', label: 'Thyroïde', y: 34, side: 'l' },
  { id: 'pa', label: 'Pancréas', y: 52, side: 'r' },
  { id: 'ov', label: 'Ovaires et testicules', y: 68, side: 'l' },
];

/** Quels organes s'allument pour quelle spécialité. Obésité, nutrition et cholestérol ne se résument pas à un organe. */
const ORGANS_BY_SPECIALTY: Record<string, OrganId[]> = {
  di: ['pa'],
  th: ['th'],
  ho: ['ov', 'hy'],
};

/** Le schéma passe de lui-même d'une spécialité à l'autre, tant que personne n'y touche. */
const TOUR = ['di', 'th', 'ho'];
const TOUR_EVERY_MS = 4500;
const PAUSE_AFTER_TOUCH_MS = 9000;

/**
 * La silhouette du logo avec les glandes repérées, à côté des motifs de consultation à la première personne
 * (« Je viens pour mon diabète »). Sans interaction, le schéma parcourt lentement les organes ; au survol ou au
 * toucher, il suit la ligne choisie, et le détail (signes, réservation pour ce motif) apparaît.
 */
@Component({
  selector: 'app-silhouette-specialties',
  imports: [RouterLink],
  styleUrl: './silhouette-specialties.css',
  templateUrl: './silhouette-specialties.html',
})
export class SilhouetteSpecialties {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly specialties = inject(Specialties).list;

  readonly eyebrow = input('OÙ AGISSENT LES HORMONES ?');
  readonly title = input('Là où agissent les hormones');
  readonly intro = input(
    'Passez la souris sur un motif, ou laissez le schéma tourner : la glande concernée s’allume.',
  );

  /** « dark » : version de l'accueil (fond prune) ; « light » : fond crème. */
  readonly variant = input<'light' | 'dark'>('light');

  readonly organs = ORGANS;
  readonly activeKey = signal(TOUR[0]);

  readonly intents = computed(() =>
    INTENTS.map((intent) => ({
      ...intent,
      specialty: this.specialties().find((s) => s.key === intent.key)!,
      query: bookingQuery(intent),
    })).filter((i) => i.specialty),
  );
  readonly active = computed(
    () => this.intents().find((i) => i.key === this.activeKey()) ?? this.intents()[0],
  );

  private pausedUntil = 0;

  isLit(organ: OrganId): boolean {
    return ORGANS_BY_SPECIALTY[this.activeKey()]?.includes(organ) ?? false;
  }

  /** Survol, focus ou toucher : le schéma suit le choix, et le tour automatique s'arrête un moment. */
  select(key: string): void {
    this.activeKey.set(key);
    this.pausedUntil = Date.now() + PAUSE_AFTER_TOUCH_MS;
  }

  constructor() {
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      let visible = false;
      const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
        threshold: 0.3,
      });
      observer.observe(this.host.nativeElement);
      const timer = setInterval(() => {
        if (!visible || document.hidden || Date.now() < this.pausedUntil) return;
        const next = TOUR[(TOUR.indexOf(this.activeKey()) + 1) % TOUR.length];
        this.activeKey.set(next);
      }, TOUR_EVERY_MS);
      this.destroyRef.onDestroy(() => {
        clearInterval(timer);
        observer.disconnect();
      });
    });
  }
}
