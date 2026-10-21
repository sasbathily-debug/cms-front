import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Bandeau orange de fin de page avec un grand titre et un bouton. */
@Component({
  selector: 'app-cta-band',
  imports: [RouterLink],
  template: `
    <section class="bg-cream-50 px-3 pb-6 sm:px-6">
      <div
        class="mx-auto flex max-w-[1232px] flex-wrap items-center justify-between gap-8 rounded-[32px] bg-accent-500 px-6 py-12 sm:rounded-[48px] sm:px-12 sm:py-[72px] lg:px-16"
      >
        <h2 class="m-0 max-w-[700px] text-balance font-display text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] text-forest-900 sm:text-5xl lg:text-[52px]">
          {{ title() }}
        </h2>
        <a
          [routerLink]="route()"
          class="rounded-full bg-forest-900 px-8 py-4 font-display text-[17px] font-semibold text-white transition hover:bg-forest-800 sm:px-10 sm:py-5"
          >{{ label() }}</a
        >
      </div>
    </section>
  `,
})
export class CtaBand {
  readonly title = input.required<string>();
  readonly label = input('Prendre rendez-vous');
  readonly route = input('/rendez-vous');
}
