import { Component, computed, inject, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { NAV_GROUPS, NAV_SIMPLE, NavGroup } from '../../core/site-nav';

interface Tile {
  key: string;
  sym: string;
  label: string;
  route: string;
  group?: NavGroup;
}

const SYMBOLS: Record<string, string> = { specialites: 'Sp', cabinet: 'Lc', patients: 'Pa' };
const SIMPLE_SYMBOLS: Record<string, string> = { conseils: 'Cs', contact: 'Co' };

/** Menu plein écran des téléphones : des tuiles qui se déplient, comme sur la maquette. */
@Component({
  selector: 'app-mobile-menu',
  imports: [RouterLink],
  templateUrl: './mobile-menu.html',
})
export class MobileMenu {
  protected readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly closed = output<void>();
  readonly mobileGroup = signal<string | null>(null);

  readonly spaceLink = computed(() => {
    if (!this.auth.isAuthenticated()) {
      return '/login';
    }
    return this.auth.currentUser()?.role === 'ADMIN' ? '/admin' : '/client';
  });

  readonly tiles = computed<Tile[]>(() => [
    ...NAV_GROUPS.map((group) => ({
      key: group.key,
      sym: SYMBOLS[group.key] ?? group.label.slice(0, 2),
      label: group.label,
      route: group.route,
      group,
    })),
    ...NAV_SIMPLE.map((link) => ({
      key: link.key,
      sym: SIMPLE_SYMBOLS[link.key] ?? link.label.slice(0, 2),
      label: link.label,
      route: link.route,
    })),
    { key: 'espace', sym: 'Me', label: 'Mon espace', route: this.spaceLink() },
  ]);

  /** Les tuiles s'affichent deux par deux ; le panneau s'ouvre sous la rangée de la tuile touchée. */
  readonly tilePairs = computed(() => {
    const list = this.tiles();
    const pairs: Tile[][] = [];
    for (let i = 0; i < list.length; i += 2) {
      pairs.push(list.slice(i, i + 2));
    }
    return pairs;
  });

  openTile(pair: Tile[]): Tile | null {
    return pair.find((tile) => tile.group && this.mobileGroup() === tile.key) ?? null;
  }

  toggleGroup(key: string): void {
    this.mobileGroup.update((current) => (current === key ? null : key));
  }

  /** Déconnecte le patient, ferme le menu et ramène à la page de connexion. */
  logout(): void {
    this.closed.emit();
    const goToLogin = () => this.router.navigate(['/login']);
    this.auth.logout().subscribe({ next: goToLogin, error: goToLogin });
  }
}
