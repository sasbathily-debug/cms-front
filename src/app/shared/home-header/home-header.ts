import {
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  Router,
  RouterLink,
} from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth } from '../../core/services/auth';
import { MobileMenu } from '../mobile-menu/mobile-menu';
import { INTENTS, bookingQuery } from '../../core/site-nav';
import { NextSlot } from '../../core/services/next-slot';
import { OpeningHours } from '../../core/services/opening-hours';
import { PageContent } from '../../core/services/page-content';
import { SiteArticles } from '../../core/services/site-articles';
import { SiteSettings } from '../../core/services/site-settings';
import { Specialties } from '../../core/services/specialties';
import { CONSEILS_SANTE } from '../../core/page-content/defs/conseils-sante';
import { INFOS_PRATIQUES } from '../../core/page-content/defs/infos-pratiques';
import { PREMIERE_CONSULTATION } from '../../core/page-content/defs/premiere-consultation';
import { statusAt } from '../open-now/open-now';

/** Délai avant de refermer un panneau quand la souris quitte le menu. */
const CLOSE_DELAY_MS = 180;

export type TabKey = 'specialites' | 'cabinet' | 'visite' | 'conseils';

export const TABS: { key: TabKey; label: string }[] = [
  { key: 'specialites', label: 'Spécialités' },
  { key: 'cabinet', label: 'Le cabinet' },
  { key: 'visite', label: 'Votre visite' },
  { key: 'conseils', label: 'Conseils' },
];

/**
 * En-tête du site, commun à toutes les pages publiques : le menu se lit comme un dossier patient. L'onglet survolé
 * devient une languette crème soudée au panneau qui s'ouvre, comme un intercalaire qu'on tire.
 * `overlay` : posé sur la photo du haut de l'accueil ; `bar` : barre sombre fixe pour les autres pages.
 */
@Component({
  selector: 'app-home-header',
  imports: [RouterLink, MobileMenu],
  templateUrl: './home-header.html',
})
export class HomeHeader {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly site = inject(SiteSettings);
  protected readonly hours = inject(OpeningHours);
  protected readonly slot = inject(NextSlot);

  readonly tabs = TABS;
  readonly variant = input<'overlay' | 'bar'>('overlay');
  /** Menu de l'accueil qui réapparaît en barre fixe quand on remonte la page. */
  readonly stuck = signal(false);
  readonly currentUrl = signal(this.router.url);

  readonly openTab = signal<TabKey | null>(null);
  readonly mobileOpen = signal(false);

  // ---- Contenus des panneaux : ceux des pages, modifiables depuis l'admin ----
  private readonly specialties = inject(Specialties).list;
  protected readonly infos = inject(PageContent).use(INFOS_PRATIQUES);
  protected readonly visite = inject(PageContent).use(PREMIERE_CONSULTATION);
  protected readonly conseils = inject(PageContent).use(CONSEILS_SANTE);
  private readonly siteArticles = inject(SiteArticles);

  readonly intents = computed(() =>
    INTENTS.map((intent) => {
      const specialty = this.specialties().find((s) => s.key === intent.key);
      return { ...intent, specialty, query: bookingQuery(intent) };
    }).filter((i) => i.specialty),
  );
  readonly intentKey = signal(INTENTS[0].key);
  readonly intent = computed(
    () => this.intents().find((i) => i.key === this.intentKey()) ?? this.intents()[0],
  );

  readonly articles = computed(() => this.siteArticles.items().slice(0, 3));
  readonly tarifs = computed(() => this.infos().tarifs.lignes.slice(0, 4));
  readonly now = signal(Date.now());
  readonly status = computed(() => {
    this.now();
    return statusAt(new Date(), this.hours.days());
  });

  readonly spaceLink = computed(() => {
    if (!this.auth.isAuthenticated()) {
      return '/login';
    }
    return this.auth.currentUser()?.role === 'ADMIN' ? '/admin' : '/client';
  });

  private readonly bar = computed(() => this.variant() === 'bar' || this.stuck());

  readonly headerClass = computed(() => {
    if (this.variant() === 'bar') return 'sticky top-0 z-50 border-b border-white/10 bg-plum-900';
    return this.stuck()
      ? 'header-reveal fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-plum-900'
      : 'absolute inset-x-0 top-0 z-50';
  });

  /** L'onglet de la section où l'on se trouve est souligné quand aucun panneau n'est ouvert. */
  isCurrent(key: TabKey): boolean {
    const url = this.currentUrl().split(/[?#]/)[0];
    const starts = (...routes: string[]) =>
      routes.some((r) => url === r || url.startsWith(r + '/'));
    switch (key) {
      case 'specialites':
        return starts('/specialites');
      case 'cabinet':
        return starts('/le-cabinet', '/a-propos', '/infos-pratiques', '/contact');
      case 'visite':
        return starts('/premiere-consultation', '/faq', '/rendez-vous');
      case 'conseils':
        return starts('/conseils-sante');
    }
  }

  tabClass(key: TabKey): string {
    const open = this.openTab() === key;
    const state = open
      ? 'bg-page text-fg'
      : 'text-cream-50 hover:bg-white/10' +
        (this.isCurrent(key) ? ' shadow-[inset_0_-3px_0_var(--color-accent-500)]' : '');
    return `flex h-full items-center whitespace-nowrap rounded-t-2xl px-4 font-display text-base font-medium 2xl:px-6 2xl:text-lg tracking-[-0.01em] transition-colors duration-200 motion-reduce:transition-none ${state}`;
  }

  setIntent(key: string): void {
    this.intentKey.set(key);
  }

  // ---- Ouverture et fermeture ----
  private closeTimer: ReturnType<typeof setTimeout> | undefined;
  private lastPointerType = 'mouse';

  hover(key: TabKey): void {
    clearTimeout(this.closeTimer);
    this.openTab.set(key);
  }

  scheduleClose(): void {
    clearTimeout(this.closeTimer);
    this.closeTimer = setTimeout(() => this.openTab.set(null), CLOSE_DELAY_MS);
  }

  cancelClose(): void {
    clearTimeout(this.closeTimer);
  }

  tabPointerDown(event: PointerEvent): void {
    this.lastPointerType = event.pointerType;
  }

  /** Souris : le survol a déjà ouvert le panneau, le clic le garde ouvert. Tactile et clavier : le clic ouvre ou ferme. */
  tabClick(key: TabKey): void {
    clearTimeout(this.closeTimer);
    const mouse = this.lastPointerType === 'mouse';
    this.lastPointerType = 'keyboard';
    this.openTab.update((open) => (open === key && !mouse ? null : key));
  }

  toggleMobile(): void {
    this.mobileOpen.update((open) => !open);
  }

  closeAll(): void {
    clearTimeout(this.closeTimer);
    this.openTab.set(null);
    this.mobileOpen.set(false);
  }

  constructor() {
    afterNextRender(() => {
      this.watchScroll();
      const tick = setInterval(() => this.now.set(Date.now()), 60_000);
      this.destroyRef.onDestroy(() => clearInterval(tick));
    });
    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd ||
            event instanceof NavigationError ||
            event instanceof NavigationCancel,
        ),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentUrl.set(event.urlAfterRedirects);
        }
        this.closeAll();
      });
    // Le menu mobile ouvert fige la page derrière (voir `html.menu-ouvert` dans styles.css).
    effect(() => document.documentElement.classList.toggle('menu-ouvert', this.mobileOpen()));
    this.destroyRef.onDestroy(() => document.documentElement.classList.remove('menu-ouvert'));
  }

  /**
   * Sur l'accueil, l'en-tête est posé sur la photo et défile avec la page. Dès qu'on remonte un peu
   * (de n'importe quelle hauteur), il revient en barre fixe ; il repart quand on redescend.
   */
  private watchScroll(): void {
    if (this.variant() === 'bar') return;
    const REVEAL_AFTER = 80;
    const DISTANCE = 24;
    let anchor = window.scrollY;
    let frame = 0;

    const update = (): void => {
      frame = 0;
      const y = window.scrollY;
      if (y <= REVEAL_AFTER) {
        anchor = y;
        this.stuck.set(false);
        return;
      }
      if (this.stuck()) {
        anchor = Math.min(anchor, y);
        if (y - anchor > DISTANCE && !this.openTab() && !this.mobileOpen()) {
          this.stuck.set(false);
          anchor = y;
        }
      } else {
        anchor = Math.max(anchor, y);
        if (anchor - y > DISTANCE) {
          this.stuck.set(true);
          anchor = y;
        }
      }
    };
    const onScroll = (): void => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    });
  }
}
