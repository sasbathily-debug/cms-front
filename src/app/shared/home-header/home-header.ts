import {
  Component,
  OnDestroy,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
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

/**
 * En-tête à tuiles (comme un tableau périodique), commun à toutes les pages publiques.
 * `overlay` : posé sur la photo du haut de l'accueil ; `bar` : barre sombre fixe, un peu plus compacte,
 * pour les autres pages (la tuile de la section en cours est mise en évidence).
 */
@Component({
  selector: 'app-home-header',
  imports: [RouterLink, MobileMenu],
  templateUrl: './home-header.html',
})
export class HomeHeader implements OnDestroy {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly navSub: Subscription;

  readonly variant = input<'overlay' | 'bar'>('overlay');
  private readonly bar = computed(() => this.variant() === 'bar');
  readonly currentUrl = signal(this.router.url);

  readonly headerClass = computed(() =>
    this.bar()
      ? 'sticky top-0 z-50 border-b border-white/10 bg-forest-900'
      : 'absolute inset-x-0 top-0 z-50',
  );
  readonly innerClass = computed(
    () =>
      'mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10 ' +
      (this.bar() ? 'py-3' : 'py-4 lg:py-6'),
  );
  readonly symClass = computed(
    () => 'font-display font-bold leading-none ' + (this.bar() ? 'text-[18px]' : 'text-[22px]'),
  );
  readonly labelClass = computed(
    () => (this.bar() ? 'whitespace-nowrap text-[11px]' : 'text-[12.5px]') + ' font-medium',
  );
  readonly ctaClass = computed(
    () =>
      'flex items-center whitespace-nowrap rounded-[14px] bg-accent-500 px-6 font-display text-[15px] font-bold text-[#140B19] transition hover:bg-accent-600 ' +
      (this.bar() ? 'h-[60px]' : 'h-[74px]'),
  );
  readonly panelClass = computed(
    () =>
      'absolute left-1/2 top-full z-50 w-[min(700px,calc(100vw-48px))] -translate-x-1/2 ' +
      (this.bar() ? '-mt-3 pt-3' : '-mt-7 pt-7'),
  );

  tileClass(tile: Tile): string {
    const size = this.bar() ? 'h-[60px] w-[96px] px-2 py-2' : 'h-[74px] w-24 px-3 py-2.5';
    const state = this.isActive(tile)
      ? 'border-accent-500 bg-[rgba(20,11,25,0.85)]'
      : 'border-white/35 bg-[rgba(20,11,25,0.55)]';
    return `flex flex-col justify-between rounded-xl border ${size} ${state} text-white backdrop-blur-sm transition hover:border-accent-500 hover:bg-[rgba(20,11,25,0.8)]`;
  }

  /** La tuile de la section où l'on se trouve. */
  isActive(tile: Tile): boolean {
    const url = this.currentUrl().split(/[?#]/)[0];
    if (tile.group) {
      return tile.group.links.some((l) => url === l.route || url.startsWith(l.route + '/'));
    }
    return url === tile.route;
  }

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
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
        this.closeAll();
      });
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
