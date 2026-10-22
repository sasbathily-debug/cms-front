import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { PageContent } from '../../../core/services/page-content';
import { PREMIERE_CONSULTATION } from '../../../core/page-content/defs/premiere-consultation';
import { SiteSettings } from '../../../core/services/site-settings';
import { RouterLink } from '@angular/router';
import { InView } from '../../../shared/in-view';
import { PublicPage } from '../../../shared/public-page/public-page';
import { CtaBand } from '../../../shared/cta-band/cta-band';

@Component({
  selector: 'app-premiere-consultation',
  imports: [RouterLink, InView, PublicPage, CtaBand],
  styleUrl: './premiere-consultation.css',
  templateUrl: './premiere-consultation.html',
})
export class PremiereConsultation {
  protected readonly site = inject(SiteSettings);
  protected readonly c = inject(PageContent).use(PREMIERE_CONSULTATION);
  private readonly destroyRef = inject(DestroyRef);
  private readonly grid = viewChild<ElementRef<HTMLElement>>('grid');

  /** Avancement du défilement dans le déroulé, de 0 à 1. `null` : tout est allumé (pas encore mesuré, ou mouvement réduit). */
  protected readonly progress = signal<number | null>(null);

  constructor() {
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      let frame = 0;
      const update = (): void => {
        frame = 0;
        const el = this.grid()?.nativeElement;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const range = Math.max(rect.height, window.innerHeight * 0.5);
        const value = (window.innerHeight * 0.78 - rect.top) / range;
        this.progress.set(Math.max(0, Math.min(1, value)));
      };
      const request = (): void => {
        if (!frame) frame = requestAnimationFrame(update);
      };
      update();
      window.addEventListener('scroll', request, { passive: true });
      window.addEventListener('resize', request, { passive: true });
      this.destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame);
        window.removeEventListener('scroll', request);
        window.removeEventListener('resize', request);
      });
    });
  }

  /** Part remplie (0 à 1) du trait au-dessus de l'étape `i`. */
  protected fill(i: number): number {
    const p = this.progress();
    return p === null ? 1 : Math.max(0, Math.min(1, p * this.c().deroule.items.length - i));
  }
}
