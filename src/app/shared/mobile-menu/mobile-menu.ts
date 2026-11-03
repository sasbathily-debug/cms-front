import { Component, computed, inject, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { INTENTS, bookingQuery } from '../../core/site-nav';
import { NextSlot } from '../../core/services/next-slot';
import { OpeningHours } from '../../core/services/opening-hours';
import { SiteSettings } from '../../core/services/site-settings';
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
