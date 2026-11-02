import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';

/** Adresse inconnue : une page claire plutôt qu'un retour silencieux à l'accueil. */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink, PublicPage],
  template: `
    <app-public-page>
      <section class="bg-page px-4 pb-28 pt-16 sm:px-6 sm:pt-24 lg:px-10">
        <div class="mx-auto flex max-w-[760px] flex-col items-start gap-6">
          <span
            class="font-display text-[88px] font-bold leading-none tracking-[-0.04em] text-accent-500 sm:text-[120px]"
            >404</span
          >
          <h1
            class="m-0 font-display text-[2.2rem] font-bold leading-[1.05] tracking-[-0.03em] text-fg sm:text-5xl"
          >
            Cette page n'existe pas ou a été déplacée.
          </h1>
          <p class="m-0 max-w-[560px] text-lg leading-[1.6] text-body">
            Vérifiez l'adresse, ou repartez de l'une de ces pages.
          </p>
          <div class="flex flex-wrap gap-3">
            <a
              routerLink="/"
              class="btn-arrow rounded-full bg-accent-500 px-7 py-4 font-display text-[15px] font-semibold text-on-accent"
              ><span class="btn-label">Retour à l'accueil</span></a
            >
            <a
              routerLink="/rendez-vous"
              class="btn-arrow rounded-full border-[1.5px] border-fg px-[26px] py-[15px] font-display text-[15px] font-semibold text-fg"
              ><span class="btn-label">Prendre rendez-vous</span></a
            >
            <a
              routerLink="/contact"
              class="btn-arrow rounded-full border-[1.5px] border-fg px-[26px] py-[15px] font-display text-[15px] font-semibold text-fg"
              ><span class="btn-label">Nous contacter</span></a
            >
          </div>
        </div>
      </section>
    </app-public-page>
  `,
})
export class NotFound {}
