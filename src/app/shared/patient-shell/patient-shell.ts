import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { CurrentUserStore } from '../../core/services/current-user-store';
import { SiteSettings } from '../../core/services/site-settings';
import { NavIcon, NavIconName } from '../nav-icon/nav-icon';
import { HomeHeader } from '../home-header/home-header';
import { AppFooter } from '../app-footer/app-footer';
import { FloatingActions } from '../floating-actions/floating-actions';

type PatientPage = 'dashboard' | 'profile';

interface NavItem {
  label: string;
  route: string;
  fragment?: string;
  icon: NavIconName;
  active: PatientPage | null;
}

/**
 * Cadre de l'espace patient : en-tête à tuiles, barre latérale (ordinateur), onglets en bas (téléphone),
 * pied de page et boutons d'appel. Le contenu de la page est projeté au centre.
 */
@Component({
  selector: 'app-patient-shell',
  imports: [RouterLink, NavIcon, HomeHeader, AppFooter, FloatingActions],
  templateUrl: './patient-shell.html',
})
export class PatientShell {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  protected readonly site = inject(SiteSettings);
  protected readonly store = inject(CurrentUserStore);

  readonly active = input<PatientPage>('dashboard');

  readonly fullName = computed(() => {
    const user = this.store.user();
    return user ? `${user.firstName} ${user.lastName}`.trim() : '';
  });

  readonly nav: NavItem[] = [
    { label: 'Tableau de bord', route: '/client', icon: 'home', active: 'dashboard' },
    { label: 'Mes rendez-vous', route: '/client', fragment: 'suivi', icon: 'cal', active: null },
    { label: 'Mon suivi', route: '/client', fragment: 'suivi', icon: 'pulse', active: null },
    { label: 'Mes documents', route: '/client', fragment: 'documents', icon: 'doc', active: null },
    { label: 'Conseils santé', route: '/conseils-sante', icon: 'leaf', active: null },
    { label: 'Mon profil', route: '/profile', icon: 'user', active: 'profile' },
  ];

  readonly tabs: NavItem[] = [
    { label: 'Accueil', route: '/client', icon: 'home', active: 'dashboard' },
    { label: 'RDV', route: '/rendez-vous', icon: 'cal', active: null },
    { label: 'Suivi', route: '/client', fragment: 'suivi', icon: 'pulse', active: null },
    { label: 'Documents', route: '/client', fragment: 'documents', icon: 'doc', active: null },
    { label: 'Profil', route: '/profile', icon: 'user', active: 'profile' },
  ];

  logout(): void {
    const goToLogin = () => this.router.navigate(['/login']);
    this.auth.logout().subscribe({ next: goToLogin, error: goToLogin });
  }
}
