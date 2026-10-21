import { Service, computed, inject, signal } from '@angular/core';
import { SiteContentService } from './site-content';
import { SiteSettingsDto } from '../models/site-content.models';

export const FALLBACK_PHONE = '+221 77 226 39 06';
const FALLBACK_HOURS = 'Lundi – Vendredi : 9h00 – 17h30\nSamedi : 9h00 – 13h00\nDimanche : Fermé';

/** Charge les réglages du site une seule fois et les partage entre les pages. */
@Service()
export class SiteSettings {
  private readonly content = inject(SiteContentService);

  readonly settings = signal<SiteSettingsDto | null>(null);

  readonly phone = computed(() => this.settings()?.phone || FALLBACK_PHONE);
  readonly email = computed(() => this.settings()?.email || 'contact@draissatoumamadou.com');
  readonly address = computed(() => this.settings()?.address || 'Sacré-Cœur 3, Dakar, Sénégal');
  readonly openingHours = computed(() => this.settings()?.openingHours || FALLBACK_HOURS);
  readonly telHref = computed(() => 'tel:' + this.phone().replace(/[^+\d]/g, ''));
  readonly whatsappHref = computed(() => {
    const raw = this.settings()?.whatsappNumber || this.phone();
    const digits = raw.replace(/\D/g, '');
    return digits ? `https://wa.me/${digits}` : '';
  });

  constructor() {
    this.content.getSettings().subscribe({ next: (value) => this.settings.set(value), error: () => undefined });
  }
}
