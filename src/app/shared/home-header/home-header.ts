import { Component, OnDestroy, afterNextRender, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { Auth } from '../../core/services/auth';
import { MobileMenu } from '../mobile-menu/mobile-menu';
import { NAV_GROUPS, NAV_SIMPLE, NavGroup, preloadNavImages } from '../../core/site-nav';

interface Tile {
  key: string;
  sym: string;
  count: string;
  label: string;
  route: string;
  group?: NavGroup;
}

const SYMBOLS: Record<string, string> = { specialites: 'Sp', cabinet: 'Lc', patients: 'Pa' };

/** En-tête de l'accueil : des tuiles (comme un tableau périodique) posées sur la photo. */
@Component({
  selector: 'app-home-header',
  imports: [RouterLink, MobileMenu],
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
      sym: SYMBOLS[group.key] ?? group.label.slice(0, 2),
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

  /** Le menu mobile affiche les tuiles deux par deux ; un panneau s'ouvre sous la rangée de la tuile touchée. */
  readonly tilePairs = computed(() => {
    const list = this.tiles();
    const pairs: Tile[][] = [];
    for (let i = 0; i < list.length; i += 2) {
      pairs.push(list.slice(i, i + 2));
    }
    return pairs;
  });

  openMobileTile(pair: Tile[]): Tile | null {
    return pair.find((tile) => tile.group && this.mobileGroup() === tile.key) ?? null;
  }

  constructor() {
    afterNextRender(() => preloadNavImages());
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

  private lastPointerType = 'mouse';
  private tileWasOpen = false;

  tilePointerDown(event: PointerEvent, key: string): void {
    this.lastPointerType = event.pointerType;
    this.tileWasOpen = this.openGroup() === key;
  }

  /** Souris : le clic ouvre la page de la tuile. Tactile : un premier toucher ouvre le panneau, un second la page. */
  tileClick(event: Event, tile: Tile): void {
    const touch = this.lastPointerType === 'touch' || this.lastPointerType === 'pen';
    if (tile.group && touch && !this.tileWasOpen) {
      event.preventDefault();
      this.openGroup.set(tile.key);
      return;
    }
    this.openGroup.set(null);
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
