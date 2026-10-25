import { Component } from '@angular/core';

/**
 * Bouton « Remonter » posé sur un tracé de cardiogramme, au bas du pied de page : le visiteur qui est allé
 * jusqu'au bout de la page remonte d'un geste. Il n'apparaît qu'en fin de page, sans bouton flottant de plus.
 */
@Component({
  selector: 'app-back-to-top',
  template: `
    <div class="flex items-center">
      <span aria-hidden="true" class="h-[2px] flex-1 bg-accent-500"></span>
      <svg
        aria-hidden="true"
        viewBox="0 -20 110 40"
        class="h-10 w-[110px] shrink-0 sm:w-[140px]"
        preserveAspectRatio="none"
        fill="none"
        stroke="var(--color-accent-500)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          vector-effect="non-scaling-stroke"
          d="M0 0H16l5-4 5 4H40l3 3 6-19 6 24 3-8H70l6-6 6 6H110"
        />
      </svg>
      <button
        type="button"
        (click)="backToTop()"
        aria-label="Remonter en haut de la page"
        class="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-accent-500 text-on-accent shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
      <span aria-hidden="true" class="h-[2px] flex-1 bg-accent-500"></span>
    </div>
  `,
})
export class BackToTop {
  protected backToTop(): void {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }
}
