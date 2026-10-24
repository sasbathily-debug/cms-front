import { Component, inject } from '@angular/core';
import { PwaInstall } from '../../core/pwa-install';

/** Lien « Installer l'application », pour les surfaces sombres (pied de page, menu du téléphone). */
@Component({
  selector: 'app-install-button',
  template: `
    @if (pwa.available()) {
      <div class="flex flex-col items-start gap-2">
        <button
          type="button"
          (click)="pwa.install()"
          class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/40 bg-transparent px-4 py-2.5 font-display text-[14px] font-semibold text-white transition hover:bg-white/10"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3v12M7 10l5 5 5-5M5 20h14" />
          </svg>
          Installer l'application
        </button>
        @if (pwa.iosHelp()) {
          <p class="m-0 max-w-[320px] text-[13px] leading-[1.55] text-on-plum-muted" role="status">
            Dans Safari, touchez le bouton
            <strong class="font-semibold text-white">Partager</strong>
            (le carré avec une flèche), puis
            <strong class="font-semibold text-white">« Sur l'écran d'accueil »</strong>.
          </p>
        }
      </div>
    }
  `,
})
export class InstallButton {
  protected readonly pwa = inject(PwaInstall);
}
