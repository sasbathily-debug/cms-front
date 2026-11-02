import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { DoodleFooter } from '../../../shared/doodle-footer/doodle-footer';
import { CREW_404, DOODLE_KINDS_404 } from '../../../shared/doodle-footer/doodle-footer.art';

/** Adresse inconnue : une page claire plutôt qu'un retour silencieux à l'accueil. */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink, PublicPage, DoodleFooter],
  template: `
    <app-public-page>
      <section class="bg-page px-4 pb-28 pt-8 sm:px-6 sm:pt-12 lg:px-10">
        <div class="mx-auto flex max-w-[760px] flex-col items-start gap-6">
          <!-- Le « 404 » tamponné, avec les personnages du pied de page qui se sont perdus dessus. -->
          <app-doodle-footer
            class="w-full"
            wordmark="404"
            tone="light"
            [crew]="crew"
            [doodleKinds]="doodleKinds"
            [doodles]="9"
            [followPage]="true"
            label="la goutte et ses amis se sont perdus"
          />
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
              class="rounded-full bg-accent-500 px-7 py-4 font-display text-[15px] font-semibold text-on-accent"
              >Retour à l'accueil</a
            >
            <a
              routerLink="/rendez-vous"
              class="rounded-full border-[1.5px] border-fg px-[26px] py-[15px] font-display text-[15px] font-semibold text-fg"
              >Prendre rendez-vous</a
            >
            <a
              routerLink="/contact"
              class="rounded-full border-[1.5px] border-fg px-[26px] py-[15px] font-display text-[15px] font-semibold text-fg"
              >Nous contacter</a
            >
          </div>
        </div>
      </section>
    </app-public-page>
  `,
})
export class NotFound {
  protected readonly crew = CREW_404;
  protected readonly doodleKinds = DOODLE_KINDS_404;
}
