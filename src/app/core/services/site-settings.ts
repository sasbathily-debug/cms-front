import { Service, computed, inject, signal } from '@angular/core';
import { SiteContentService } from './site-content';
import { SiteSettingsDto } from '../models/site-content.models';

export const FALLBACK_PHONE = '+221 77 226 39 06';

/** Adresse et horaires de la maquette (la doctoresse doit les confirmer). */
/** Tant que la rue n'est pas saisie dans l'admin, on n'affiche que le quartier. */
export const ADDRESS_STREET = '';
export const ADDRESS_CITY = 'Cité Keur Gorgui';
/** Charge les réglages du site une seule fois et les partage entre les pages. */
@Service()
export class SiteSettings {
  private readonly content = inject(SiteContentService);

  readonly settings = signal<SiteSettingsDto | null>(null);

  readonly phone = computed(() => this.settings()?.phone || FALLBACK_PHONE);
  readonly email = computed(() => this.settings()?.email || 'contact@draissatoumamadou.com');
  /** Ville et quartier, saisis dans l'admin ; la maquette sert de repli. */
  readonly address = computed(() => this.settings()?.address?.trim() || ADDRESS_CITY);
  /** Rue et numéro, saisis dans l'admin ; un texte à compléter sert de repli. */
  readonly street = computed(() => this.settings()?.addressStreet?.trim() || ADDRESS_STREET);
  /** Repère pour trouver le cabinet, saisi dans l'admin ; vide s'il n'est pas renseigné. */
  /** « rue, quartier » ou seulement le quartier tant que la rue n'est pas saisie. */
  readonly addressLine = computed(() => [this.street(), this.address()].filter(Boolean).join(', '));
  readonly landmark = computed(() => this.settings()?.landmark?.trim() || '');
  /** Numéro d'urgence saisi dans l'admin ; vide s'il n'est pas renseigné. */
  /** Le numéro d'urgence des réglages ; à défaut, le SAMU national (1515), validé par la doctoresse. */
  readonly emergencyNumber = computed(
    () => this.settings()?.emergencyNumber?.trim() || 'SAMU 1515',
  );
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
