import { Service, computed, inject, signal } from '@angular/core';
import { SiteContentService } from './site-content';
import { OpeningHourDto } from '../models/site-content.models';
import { DEFAULT_DAYS, groupDays, hoursSentence, longLabel, shortLabel } from '../opening-hours';

/** Horaires du cabinet, saisis dans l'admin : chargés une seule fois et partagés entre les pages. */
@Service()
export class OpeningHours {
  private readonly content = inject(SiteContentService);

  readonly days = signal<OpeningHourDto[]>(DEFAULT_DAYS);
  private readonly groups = computed(() => groupDays(this.days()));

  /** Pied de page : « Lun – Ven : 9h00 – 17h30 », « Dimanche : fermé ». */
  readonly footerLines = computed(() =>
    this.groups().map((g) => `${shortLabel(g)} : ${g.closed ? 'fermé' : g.hours}`),
  );

  /** Accueil : « Lun – Ven · 9h00 – 17h30 » (jours fermés omis). */
  readonly homeLines = computed(() =>
    this.groups()
      .filter((g) => !g.closed)
      .map((g) => `${shortLabel(g)} · ${g.hours}`),
  );

  /** Tableau des horaires : « Lundi au vendredi », « Dimanche » avec « Fermé ». */
  readonly rows = computed(() =>
    this.groups().map((g) => ({ jour: longLabel(g), heures: g.closed ? 'Fermé' : g.hours })),
  );

  /** Phrase : « du lundi au vendredi de 9h00 à 17h30 et le samedi de 9h00 à 13h00 ». */
  readonly sentence = computed(() => hoursSentence(this.groups()));

  constructor() {
    this.content.getOpeningHours().subscribe({
      next: (days) => {
        if (days.length === 7) this.days.set(days);
      },
      error: () => undefined,
    });
  }
}
