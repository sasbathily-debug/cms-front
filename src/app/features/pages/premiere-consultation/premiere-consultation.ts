import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { CtaBand } from '../../../shared/cta-band/cta-band';

@Component({
  selector: 'app-premiere-consultation',
  imports: [RouterLink, PublicPage, CtaBand],
  styleUrl: './premiere-consultation.css',
  templateUrl: './premiere-consultation.html',
})
export class PremiereConsultation {
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
    return p === null ? 1 : Math.max(0, Math.min(1, p * this.etapes.length - i));
  }

  readonly etapes = [
    {
      n: '01',
      moment: 'AVANT',
      titre: 'Vous réservez en ligne',
      texte:
        'Choisissez un jour et une heure, laissez vos coordonnées. Confirmation par e-mail et rappel la veille.',
    },
    {
      n: '02',
      moment: "À L'ARRIVÉE",
      titre: 'Un accueil sans attente inutile',
      texte:
        "Présentez-vous quelques minutes avant l'heure. Nous ouvrons votre dossier et vous demandons vos antécédents.",
    },
    {
      n: '03',
      moment: 'PENDANT',
      titre: 'Une vraie conversation',
      texte:
        "La doctoresse vous écoute, vous examine, mesure poids, tension et glycémie si besoin, puis vous explique ce qu'elle constate.",
    },
    {
      n: '04',
      moment: 'APRÈS',
      titre: 'Un plan clair, par écrit',
      texte:
        'Vous repartez avec une ordonnance, la liste des examens à faire et la date du prochain rendez-vous.',
    },
  ];

  readonly apporter = [
    "Une pièce d'identité",
    'Vos analyses et comptes rendus récents',
    'Vos ordonnances en cours ou la liste de vos médicaments',
    'Votre carnet de glycémie, si vous en avez un',
    'Vos radiographies ou échographies, si vous en avez',
    "Vos questions, notées à l'avance",
  ];
}
