import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Bandeau orange de fin de page avec un grand titre et un bouton. */
@Component({
  selector: 'app-cta-band',
  imports: [RouterLink],
  template: `
    <section class="bg-page px-3 pb-6 sm:px-6">
      <div
        class="mx-auto flex max-w-[1232px] flex-wrap items-center justify-between gap-8 rounded-[32px] bg-accent-500 px-6 py-12 sm:rounded-[48px] sm:px-12 sm:py-[72px] lg:px-16"
      >
        <div class="flex max-w-[700px] flex-col gap-4">
          <h2
            class="m-0 text-balance font-display text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] text-on-accent sm:text-5xl lg:text-[52px]"
          >
            {{ title() }}
          </h2>
          @if (subtitle()) {
            <p class="m-0 text-lg leading-relaxed text-plum-brown">{{ subtitle() }}</p>
          }
        </div>
        <div class="flex flex-col gap-3">
          <a
            [routerLink]="route()"
            class="btn-arrow rounded-full bg-plum-900 px-8 py-4 text-center font-display text-[17px] font-semibold text-white transition hover:bg-plum-800 sm:px-10 sm:py-5"
            ><span class="btn-label">{{ label() }}</span></a
          >
          @if (secondaryLabel() && secondaryHref()) {
            <a
              [href]="secondaryHref()"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-arrow rounded-full border-[1.5px] border-plum-900 px-8 py-[14px] text-center font-display text-[17px] font-semibold text-on-accent sm:px-10 sm:py-[18px]"
              ><span class="btn-label">{{ secondaryLabel() }}</span></a
            >
          }
        </div>
      </div>
    </section>
  `,
})
export class CtaBand {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly label = input('Prendre rendez-vous');
  readonly route = input('/rendez-vous');
  /** Second bouton facultatif (lien externe), par exemple WhatsApp. */
  readonly secondaryLabel = input('');
  readonly secondaryHref = input('');
}
