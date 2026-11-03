import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Analytics } from '../../core/analytics';

/**
 * Barre de consentement : large, centrée en bas de l'écran, sans voile sur la page, un texte court et deux gros
 * boutons de même poids. Elle ne bloque pas la lecture du site.
 */
@Component({
  selector: 'app-cookie-banner',
  imports: [RouterLink],
  template: `
    @if (analytics.asking()) {
      <aside
        #dialog
        role="dialog"
        aria-labelledby="cookie-text"
        tabindex="-1"
        class="cookie-bar fixed bottom-3 left-1/2 z-[80] w-[calc(100%-1.5rem)] max-w-[1040px] -translate-x-1/2 rounded-md border border-white/15 bg-plum-950 px-5 py-6 text-cream-50 shadow-[0_18px_60px_rgba(0,0,0,0.45)] outline-none sm:bottom-6 sm:px-12 sm:py-8"
      >
        <p
          id="cookie-text"
          class="m-0 max-w-[930px] text-[14px] leading-[1.6] text-on-plum sm:text-[15px]"
        >
          Ce site utilise des cookies nécessaires à son fonctionnement et, avec votre accord, Google
          Analytics pour compter les visites. Nous n'envoyons à Google ni vos coordonnées ni aucune
          information de santé. Acceptez-vous ces cookies ?
          <a
            routerLink="/politique-de-confidentialite"
            class="whitespace-nowrap text-cream-50 underline underline-offset-[3px]"
            >En savoir plus</a
          >
        </p>

        <div class="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            (click)="analytics.accept()"
            class="cursor-pointer rounded-md border-[1.5px] border-cream-50 bg-cream-50 px-9 py-3.5 font-display text-[15px] font-bold uppercase tracking-[0.04em] text-plum-900 transition hover:bg-white"
          >
            Oui, j'accepte
          </button>
          <button
            type="button"
            (click)="analytics.refuse()"
            class="cursor-pointer rounded-md border-[1.5px] border-cream-50 bg-transparent px-9 py-3.5 font-display text-[15px] font-bold uppercase tracking-[0.04em] text-cream-50 transition hover:bg-white/10"
          >
            Non, je refuse
          </button>
        </div>

        <p class="m-0 mt-5 text-[13px] leading-[1.55] text-on-plum-subtle">
          Vous pouvez modifier votre choix à tout moment avec « Gérer les cookies », en bas de
          chaque page.
        </p>
      </aside>
    }
  `,
})
export class CookieBanner implements AfterViewChecked, OnDestroy {
  protected readonly analytics = inject(Analytics);
  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');
  private focused = false;
  private observer: ResizeObserver | null = null;
  private observed: HTMLElement | null = null;

  /** À l'ouverture, le focus va sur la barre : un lecteur d'écran la lit tout de suite et le clavier y reste. */
  ngAfterViewChecked(): void {
    const dialog = this.dialog()?.nativeElement ?? null;
    if (dialog && !this.focused) {
      this.focused = true;
      dialog.focus();
    } else if (!dialog) {
      this.focused = false;
    }
    this.followHeight(dialog);
  }

  ngOnDestroy(): void {
    this.followHeight(null);
  }

  /**
   * Sur ordinateur, la bulle de chat, le bouton WhatsApp et le bouton d'appel se posent au-dessus de la barre tant
   * qu'elle est affichée : sa hauteur est publiée dans `--cookie-offset` (0 sur téléphone, où la barre les recouvre).
   */
  private followHeight(dialog: HTMLElement | null): void {
    if (dialog === this.observed) return;
    this.observer?.disconnect();
    this.observed = dialog;
    const root = document.documentElement;
    if (!dialog || typeof ResizeObserver === 'undefined') {
      this.observer = null;
      root.style.removeProperty('--cookie-offset');
      return;
    }
    const publish = () => {
      const wide = window.matchMedia?.('(min-width: 640px)').matches ?? true;
      // hauteur de la barre + sa marge basse (24 px) + un petit espace
      root.style.setProperty(
        '--cookie-offset',
        wide ? `${dialog.offsetHeight + 24 + 12}px` : '0px',
      );
    };
    this.observer = new ResizeObserver(publish);
    this.observer.observe(dialog);
    publish();
  }
}
