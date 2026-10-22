import { Service, computed, inject, signal } from '@angular/core';
import { SiteContentService } from './site-content';
import { SiteSettingsDto } from '../models/site-content.models';

export const FALLBACK_PHONE = '+221 77 226 39 06';

/** Adresse et horaires de la maquette (la doctoresse doit les confirmer). */
export const ADDRESS_STREET = '[Rue et numéro]';
export const ADDRESS_CITY = 'Sacré-Cœur 3, Dakar';
/** Charge les réglages du site une seule fois et les partage entre les pages. */
@Service()
export class SiteSettings {
  private readonly content = inject(SiteContentService);

  readonly settings = signal<SiteSettingsDto | null>(null);

  readonly phone = computed(() => this.settings()?.phone || FALLBACK_PHONE);
  readonly email = computed(() => this.settings()?.email || 'contact@draissatoumamadou.com');
  readonly address = computed(() => ADDRESS_CITY);
  readonly telHref = computed(() => 'tel:' + this.phone().replace(/[^+\d]/g, ''));
  readonly whatsappHref = computed(() => {
    const raw = this.settings()?.whatsappNumber || this.phone();
    const digits = raw.replace(/\D/g, '');
    return digits ? `https://wa.me/${digits}` : '';
  });

  constructor() {
    this.content
      .getSettings()
      .subscribe({ next: (value) => this.settings.set(value), error: () => undefined });
  }
}
