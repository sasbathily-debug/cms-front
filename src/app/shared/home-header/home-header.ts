import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { Auth } from '../../core/services/auth';
import { NAV_GROUPS, NAV_SIMPLE, NavGroup } from '../../core/site-nav';

interface Tile {
  key: string;
  sym: string;
  count: string;
  label: string;
  route: string;
  group?: NavGroup;
}

/** En-tête de l'accueil : des tuiles (comme un tableau périodique) posées sur la photo. */
@Component({
  selector: 'app-home-header',
  imports: [RouterLink],
  templateUrl: './home-header.html',
})
export class HomeHeader implements OnDestroy {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly navSub: Subscription;

  readonly openGroup = signal<string | null>(null);
  readonly mobileOpen = signal(false);
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
      sym: group.label.slice(0, 2),
      count: String(group.links.length),
      label: group.label + ' ▾',
      route: group.route,
      group,
    })),
    { key: 'conseils', sym: 'Cs', count: '', label: 'Conseils santé', route: '/conseils-sante' },
    { key: 'contact', sym: 'Co', count: '', label: 'Contact', route: '/contact' },
    { key: 'espace', sym: 'Me', count: '', label: 'Mon espace', route: this.spaceLink() },
  ]);

  readonly simpleLinks = NAV_SIMPLE;

  constructor() {
    this.navSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.closeAll());
  }

  ngOnDestroy(): void {
    this.navSub.unsubscribe();
  }

  hover(key: string): void {
    this.openGroup.set(key);
  }

  leave(): void {
    this.openGroup.set(null);
  }

  toggleGroup(key: string): void {
    this.openGroup.update((current) => (current === key ? null : key));
  }

  toggleMobile(): void {
    this.mobileOpen.update((open) => !open);
  }

  toggleMobileGroup(key: string): void {
    this.mobileGroup.update((current) => (current === key ? null : key));
  }

  closeAll(): void {
    this.openGroup.set(null);
    this.mobileOpen.set(false);
    this.mobileGroup.set(null);
  }
}
