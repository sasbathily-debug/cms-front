import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DoodleFooter } from '../../../shared/doodle-footer/doodle-footer';
import { CREW_404, DOODLE_KINDS_404 } from '../../../shared/doodle-footer/doodle-footer.art';

/**
 * Adresse inconnue : une page claire plutôt qu'un retour silencieux à l'accueil. Une 404 n'a ni en-tête ni pied de page :
 * elle tient seule sur l'écran, avec les trois chemins pour repartir.
 */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink, DoodleFooter],
  template: `
    <main
      class="grid min-h-svh place-items-center bg-page px-4 py-10 font-body text-fg sm:px-6 lg:px-10"
    >
      <div class="mx-auto flex w-full max-w-[760px] flex-col items-center gap-6 text-center">
        <!-- Le « 404 » tamponné, avec les personnages du pied de page qui se sont perdus dessus. -->
        <app-doodle-footer
          class="w-full max-w-[max(280px,min(760px,calc((100svh_-_360px)*1.45)))]"
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
        <div class="flex flex-wrap justify-center gap-3">
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
    </main>
  `,
})
export class NotFound {
  protected readonly crew = CREW_404;
  protected readonly doodleKinds = DOODLE_KINDS_404;
}
