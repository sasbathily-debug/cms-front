import { Component, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { CurrentUserStore } from '../../../core/services/current-user-store';

interface AdminLink {
  /** Symbole à deux lettres, comme sur les tuiles du menu du site. */
  sym: string;
  label: string;
  route: string;
}

interface AdminGroup {
  title: string;
  links: AdminLink[];
}

/** Espace professionnel : barre latérale sombre (même langage que les tuiles du site) et contenu à droite. */
@Component({
  selector: 'app-admin-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NgTemplateOutlet],
  styleUrl: './admin-shell.css',
  templateUrl: './admin-shell.html',
})
export class AdminShell {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  protected readonly store = inject(CurrentUserStore);

  readonly mobileMenuOpen = signal(false);

  readonly groups: AdminGroup[] = [
    {
      title: 'Activité',
      links: [
        { sym: 'Rv', label: 'Rendez-vous', route: '/admin/appointments' },
        { sym: 'Ag', label: 'Agenda', route: '/admin/availability' },
        { sym: 'Do', label: 'Documents', route: '/admin/documents' },
      ],
    },
    {
      title: 'Contenu du site',
      links: [
        { sym: 'Se', label: 'Services', route: '/admin/services' },
        { sym: 'Cs', label: 'Conseils santé', route: '/admin/health-tips' },
        { sym: 'Fq', label: 'FAQ', route: '/admin/faq' },
        { sym: 'Rg', label: 'Réglages du site', route: '/admin/settings' },
      ],
    },
  ];

  readonly displayName = computed(() => {
    const user = this.store.user();
    return user ? `${user.firstName} ${user.lastName}`.trim() : 'Mon profil';
  });

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  /** Quoi qu'il arrive côté serveur (lent, en veille, erreur), on retourne à la page de connexion. */
  logout(): void {
    this.closeMobileMenu();
    const goToLogin = () => this.router.navigate(['/login']);
    this.auth.logout().subscribe({ next: goToLogin, error: goToLogin });
  }
}
