import { DestroyRef, Service, afterNextRender, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/** Délai entre deux éléments qui apparaissent en même temps (en ms). */
const STAGGER = 70;
const MAX_DELAY = 280;

/**
 * Apparition douce des blocs des pages publiques au défilement.
 *
 * Règle de sécurité : on ne cache que les blocs encore sous la ligne de flottaison au moment où ils
 * sont repérés. Tout ce qui est déjà visible à l'arrivée reste visible, et rien n'est caché pour
 * les visiteurs qui demandent moins de mouvement. Les classes sont retirées une fois l'animation finie.
 */
@Service()
export class Reveal {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly seen = new WeakSet<Element>();

  constructor() {
    afterNextRender(() => this.start());
  }

  private start(): void {
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let index = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          el.style.animationDelay = `${Math.min(MAX_DELAY, index * STAGGER)}ms`;
          index++;
          el.classList.remove('reveal-pending');
          el.classList.add('reveal-in');
          el.addEventListener(
            'animationend',
            () => {
              el.classList.remove('reveal-in');
              el.style.animationDelay = '';
            },
            { once: true },
          );
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.04 },
    );

    const scan = (): void => {
      const targets = document.querySelectorAll<HTMLElement>('main section > *, [data-reveal]');
      for (const el of Array.from(targets)) {
        if (this.seen.has(el)) continue;
        this.seen.add(el);
        if (el.hasAttribute('data-no-reveal') || el.closest('[data-no-reveal]')) continue;
        const position = getComputedStyle(el).position;
        if (position === 'absolute' || position === 'fixed') continue;
        const rect = el.getBoundingClientRect();
        // Déjà à l'écran (ou au-dessus) : on n'y touche pas.
        if (rect.height === 0 || rect.top < window.innerHeight * 0.92) continue;
        el.classList.add('reveal-pending');
        observer.observe(el);
      }
    };

    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = (): void => {
      clearTimeout(timer);
      timer = setTimeout(scan, 120);
    };

    // Le contenu arrive parfois après le chargement (liste de questions, etc.) : on repasse à chaque ajout.
    const mutations = new MutationObserver(schedule);
    mutations.observe(document.body, { childList: true, subtree: true });
    const navigation = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(schedule);
    schedule();

    this.destroyRef.onDestroy(() => {
      clearTimeout(timer);
      observer.disconnect();
      mutations.disconnect();
      navigation.unsubscribe();
    });
  }
}
