import { AfterViewChecked, Component, ElementRef, inject, viewChild } from '@angular/core';
import { Analytics } from '../../core/analytics';

/**
 * Barre de consentement : large, centrée en bas de l'écran, sans voile sur la page, un texte court et deux gros
 * boutons de même poids. Elle ne bloque pas la lecture du site.
 */
@Component({
  selector: 'app-cookie-banner',
  template: `
    @if (analytics.asking()) {
      <aside
        #dialog
        role="dialog"
        aria-labelledby="cookie-text"
        tabindex="-1"
        class="cookie-bar fixed bottom-3 left-1/2 z-[80] w-[calc(100%-1.5rem)] max-w-[1040px] -translate-x-1/2 rounded-[10px] border border-white/15 bg-plum-950 px-5 py-6 text-cream-50 shadow-[0_18px_60px_rgba(0,0,0,0.45)] outline-none sm:bottom-6 sm:px-12 sm:py-8"
      >
        <p
          id="cookie-text"
          class="m-0 max-w-[930px] text-[14px] leading-[1.6] text-on-plum sm:text-[15px]"
        >
          Ce site utilise des cookies nécessaires à son fonctionnement et, avec votre accord, Google
          Analytics pour compter les visites. Nous n'envoyons à Google ni vos coordonnées ni aucune
          information de santé. Acceptez-vous ces cookies ?
        </p>

        <div class="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            (click)="analytics.accept()"
            class="cursor-pointer rounded-full border-[1.5px] border-cream-50 bg-cream-50 px-9 py-3.5 font-display text-[15px] font-bold uppercase tracking-[0.04em] text-plum-900 transition hover:bg-white"
          >
            Oui, j'accepte
          </button>
          <button
            type="button"
            (click)="analytics.refuse()"
            class="cursor-pointer rounded-full border-[1.5px] border-cream-50 bg-transparent px-9 py-3.5 font-display text-[15px] font-bold uppercase tracking-[0.04em] text-cream-50 transition hover:bg-white/10"
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
export class CookieBanner implements AfterViewChecked {
  protected readonly analytics = inject(Analytics);
  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');
  private focused = false;

  /** À l'ouverture, le focus va sur la barre : un lecteur d'écran la lit tout de suite et le clavier y reste. */
  ngAfterViewChecked(): void {
    const dialog = this.dialog()?.nativeElement;
    if (dialog && !this.focused) {
      this.focused = true;
      dialog.focus();
    } else if (!dialog) {
      this.focused = false;
    }
  }
}
