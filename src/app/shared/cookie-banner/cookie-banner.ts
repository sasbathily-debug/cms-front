import { Component, inject } from '@angular/core';
import { Analytics } from '../../core/analytics';

/** Bandeau de consentement : « Refuser » et « Accepter » ont le même poids, et refuser est aussi simple qu'accepter. */
@Component({
  selector: 'app-cookie-banner',
  template: `
    @if (analytics.asking()) {
      <div
        role="dialog"
        aria-labelledby="cookie-title"
        aria-describedby="cookie-text"
        class="fixed inset-x-3 bottom-3 z-[80] flex flex-col gap-4 rounded-[22px] border border-line bg-surface p-5 text-fg shadow-[0_24px_60px_rgba(31,18,38,0.28)] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[410px]"
      >
        <div class="flex flex-col gap-1.5">
          <h2 id="cookie-title" class="m-0 font-display text-base font-bold">Mesure d'audience</h2>
          <p id="cookie-text" class="m-0 text-[14px] leading-[1.55] text-body">
            Avec votre accord, nous comptons les visites avec Google Analytics pour améliorer le
            site. Nous n'envoyons à Google ni vos coordonnées ni aucune information de santé, et
            rien n'est mesuré dans votre espace patient. Vous pouvez changer d'avis à tout moment.
          </p>
        </div>
        <div class="flex gap-2.5">
          <button
            type="button"
            (click)="analytics.refuse()"
            class="flex-1 rounded-full border-[1.5px] border-fg px-4 py-2.5 font-display text-sm font-semibold text-fg transition hover:bg-sunken"
          >
            Refuser
          </button>
          <button
            type="button"
            (click)="analytics.accept()"
            class="flex-1 rounded-full border-[1.5px] border-fg bg-inverse px-4 py-2.5 font-display text-sm font-semibold text-inverse-fg transition hover:opacity-90"
          >
            Accepter
          </button>
        </div>
      </div>
    }
  `,
})
export class CookieBanner {
  protected readonly analytics = inject(Analytics);
}
