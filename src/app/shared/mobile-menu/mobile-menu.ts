import { Component, computed, inject, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { INTENTS, bookingQuery } from '../../core/site-nav';
import { NextSlot } from '../../core/services/next-slot';
import { OpeningHours } from '../../core/services/opening-hours';
import { PageContent } from '../../core/services/page-content';
import { SiteArticles } from '../../core/services/site-articles';
import { SiteSettings } from '../../core/services/site-settings';
import { CONSEILS_SANTE } from '../../core/page-content/defs/conseils-sante';
import { Specialties } from '../../core/services/specialties';
import { InstallButton } from '../install-button/install-button';
import { statusAt } from '../open-now/open-now';

/** Menu plein écran des téléphones : « Je viens pour… » en pastilles, puis les rubriques, et le rendez-vous toujours sous le pouce. */
@Component({
  selector: 'app-mobile-menu',
  imports: [RouterLink, InstallButton],
  templateUrl: './mobile-menu.html',
})
export class MobileMenu {
  protected readonly auth = inject(Auth);
  protected readonly site = inject(SiteSettings);
  protected readonly slot = inject(NextSlot);
  private readonly router = inject(Router);
  private readonly hours = inject(OpeningHours);
  private readonly specialties = inject(Specialties).list;

  readonly closed = output<void>();

  /** Rubrique dépliée : les mêmes liens que les panneaux de la version ordinateur. */
  readonly openSection = signal<string | null>(null);
  protected readonly conseils = inject(PageContent).use(CONSEILS_SANTE);
  private readonly siteArticles = inject(SiteArticles);
  readonly articles = computed(() => this.siteArticles.items().slice(0, 3));

  toggleSection(key: string): void {
    this.openSection.update((open) => (open === key ? null : key));
  }

  readonly intents = computed(() =>
    INTENTS.map((intent) => ({
      ...intent,
      specialty: this.specialties().find((s) => s.key === intent.key),
      query: bookingQuery(intent),
    })).filter((i) => i.specialty),
  );
  readonly intentKey = signal(INTENTS[0].key);
  readonly intent = computed(
    () => this.intents().find((i) => i.key === this.intentKey()) ?? this.intents()[0],
  );

  readonly status = computed(() => statusAt(new Date(), this.hours.days()));

  readonly sections = computed(() => [
    {
      key: 'cabinet',
      label: 'Le cabinet',
      hint: this.status().text,
      links: [
        { label: 'La doctoresse et son parcours', route: '/a-propos' },
        { label: "L'équipe qui vous accueille", route: '/le-cabinet' },
        { label: 'Infos pratiques et accès', route: '/infos-pratiques' },
      ],
    },
    {
      key: 'visite',
      label: 'Votre visite',
      hint: "Ce qu'il faut apporter, déroulé, tarifs",
      links: [
        { label: 'Première consultation', route: '/premiere-consultation' },
        { label: 'Tarifs et assurances', route: '/infos-pratiques' },
        { label: 'Questions fréquentes', route: '/faq' },
      ],
    },
    {
      key: 'conseils',
      label: 'Conseils',
      hint: "Guide de l'alimentation du diabétique, articles",
      links: [{ label: 'Tous les conseils santé', route: '/conseils-sante' }],
    },
  ]);

  readonly spaceLink = computed(() => {
    if (!this.auth.isAuthenticated()) {
      return '/login';
    }
    return this.auth.currentUser()?.role === 'ADMIN' ? '/admin' : '/client';
  });

  /** Déconnecte le patient, ferme le menu et ramène à la page de connexion. */
  logout(): void {
    this.closed.emit();
    const goToLogin = () => this.router.navigate(['/login']);
    this.auth.logout().subscribe({ next: goToLogin, error: goToLogin });
  }
}
