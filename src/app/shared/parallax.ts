import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/**
 * Effet de parallaxe : l'élément (une photo) défile un peu moins vite que la page.
 *
 * - `mode="top"` : décalage proportionnel au défilement depuis le haut de la page (photo d'en-tête) ;
 * - `mode="center"` (défaut) : décalage selon la distance au centre de l'écran (photo au milieu de la page).
 *
 * Le décalage est borné par `parallaxMax` (px) pour ne jamais laisser de vide autour de la photo.
 * Rien ne bouge pour les visiteurs qui demandent moins de mouvement ; l'écoute du défilement n'est active
 * que tant que l'élément est à l'écran.
 */
@Directive({ selector: '[appParallax]' })
export class Parallax {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  /** Part du défilement qui est « rattrapée » (0 = fixe par rapport à la page, 1 = immobile à l'écran). */
  readonly appParallax = input(0.15);
  readonly parallaxMode = input<'top' | 'center'>('center');
  readonly parallaxMax = input(40);

  constructor() {
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const node = this.el.nativeElement;
      let frame = 0;
      let visible = false;

      const update = (): void => {
        frame = 0;
        const factor = this.appParallax();
        const max = this.parallaxMax();
        let shift: number;
        if (this.parallaxMode() === 'top') {
          shift = window.scrollY * factor;
        } else {
          const rect = node.getBoundingClientRect();
          const distance = rect.top + rect.height / 2 - window.innerHeight / 2;
          shift = -distance * factor;
        }
        shift = Math.max(-max, Math.min(max, shift));
        node.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
      };
      const request = (): void => {
        if (visible && !frame) frame = requestAnimationFrame(update);
      };

      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        request();
      });
      observer.observe(node.parentElement ?? node);
      window.addEventListener('scroll', request, { passive: true });
      window.addEventListener('resize', request, { passive: true });
      update();

      this.destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        window.removeEventListener('scroll', request);
        window.removeEventListener('resize', request);
      });
    });
  }
}
