import { Component, inject } from '@angular/core';
import { PwaUpdate } from '../../core/pwa-update';

/** Petit message qui n'apparaît que si une nouvelle version est prête pendant qu'un formulaire est en cours de saisie. */
@Component({
  selector: 'app-update-toast',
  template: `
    @if (update.prompt()) {
      <div
        role="status"
        class="fixed bottom-4 left-1/2 z-[90] flex w-[calc(100%-2rem)] max-w-[440px] -translate-x-1/2 items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-4 py-3 text-fg shadow-[0_16px_40px_rgba(0,0,0,0.3)]"
      >
        <span class="text-[14px] leading-snug">Une nouvelle version du site est disponible.</span>
        <button
          type="button"
          (click)="update.refreshNow()"
          class="shrink-0 cursor-pointer rounded-full border-0 bg-inverse px-4 py-2 font-display text-[13.5px] font-semibold text-inverse-fg"
        >
          Actualiser
        </button>
      </div>
    }
  `,
})
export class UpdateToast {
  protected readonly update = inject(PwaUpdate);
}
