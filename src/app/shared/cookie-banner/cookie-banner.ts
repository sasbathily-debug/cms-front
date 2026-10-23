import { Component, inject, signal } from '@angular/core';
import { Analytics } from '../../core/analytics';

/**
 * Bandeau de consentement. Première couche courte avec « Refuser » et « Accepter » de même poids, puis le détail
 * (cookies nécessaires, mesure d'audience, ce qui est envoyé ou non) derrière « En savoir plus ».
 */
@Component({
  selector: 'app-cookie-banner',
  template: `
    @if (analytics.asking()) {
      <div
        role="dialog"
        aria-labelledby="cookie-title"
        aria-describedby="cookie-text"
        class="fixed inset-x-3 bottom-3 z-[80] flex max-h-[88vh] flex-col gap-4 overflow-hidden rounded-[22px] border border-line bg-surface p-5 text-fg shadow-[0_24px_60px_rgba(31,18,38,0.28)] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[460px]"
      >
        <div class="flex min-h-0 flex-col gap-4 overflow-y-auto">
          <div class="flex flex-col gap-2">
            <h2 id="cookie-title" class="m-0 font-display text-lg font-bold">
              Ce site utilise des cookies
            </h2>
            <p id="cookie-text" class="m-0 text-[14px] leading-[1.6] text-body">
              Les cookies nécessaires au fonctionnement du site (votre connexion, le thème clair ou
              sombre et la mémorisation de vos choix) sont toujours actifs. Avec votre accord, nous
              utilisons aussi Google Analytics pour compter les visites et améliorer le site. Nous
              n'envoyons à Google ni vos coordonnées ni aucune information de santé, et rien n'est
              mesuré dans votre espace patient.
            </p>
            <button
              type="button"
              (click)="details.set(!details())"
              [attr.aria-expanded]="details()"
              aria-controls="cookie-details"
              class="w-fit cursor-pointer border-0 bg-transparent p-0 text-left text-[14px] font-semibold text-accent-800 underline underline-offset-[3px]"
            >
              {{ details() ? 'Masquer le détail' : 'En savoir plus' }}
            </button>
          </div>

          @if (details()) {
            <div
              id="cookie-details"
              class="flex flex-col gap-4 border-t border-line pt-4 text-[13.5px] leading-[1.6] text-body"
            >
              <section class="flex flex-col gap-1">
                <h3 class="m-0 text-[14px] font-bold text-fg">
                  Cookies nécessaires
                  <span class="ml-1 font-medium text-muted">(toujours actifs)</span>
                </h3>
                <p class="m-0">
                  Ils gardent votre connexion à votre espace patient ou professionnel ouverte et
                  retiennent votre choix de thème et de cookies. Ils ne servent pas à vous suivre et
                  n'ont pas besoin de votre accord.
                </p>
              </section>

              <section class="flex flex-col gap-1">
                <h3 class="m-0 text-[14px] font-bold text-fg">
                  Mesure d'audience : Google Analytics
                  <span class="ml-1 font-medium text-muted">(avec votre accord)</span>
                </h3>
                <p class="m-0">
                  Ce que nous mesurons : les pages publiques consultées, la provenance approximative
                  des visites (moteur de recherche, réseau social, lien direct), le type d'appareil,
                  et le nombre de rendez-vous réservés ou de messages envoyés, sans aucun détail.
                </p>
                <p class="m-0">
                  Cookies déposés : <strong class="font-semibold text-fg">_ga</strong> et
                  <strong class="font-semibold text-fg">_ga_…</strong>, qui contiennent un
                  identifiant aléatoire. Durée de vie du cookie : 2 ans. Les données associées sont
                  conservées 2 mois par Google.
                </p>
                <p class="m-0">
                  Ce que nous n'envoyons jamais : votre nom, votre e-mail, votre téléphone, ni
                  aucune information de santé. Rien n'est mesuré dans l'espace patient,
                  l'administration, la connexion ni la création de compte. Google peut traiter ces
                  données hors du Sénégal.
                </p>
              </section>

              <section class="flex flex-col gap-1">
                <h3 class="m-0 text-[14px] font-bold text-fg">Votre choix</h3>
                <p class="m-0">
                  Refuser ne vous empêche pas d'utiliser le site. Vous pouvez changer d'avis à tout
                  moment avec le lien « Gérer les cookies » en bas de chaque page.
                </p>
              </section>
            </div>
          }
        </div>

        <div class="flex shrink-0 gap-2.5">
          <button
            type="button"
            (click)="analytics.refuse()"
            class="flex-1 rounded-full border-[1.5px] border-fg px-4 py-2.5 font-display text-sm font-semibold text-fg transition hover:bg-sunken"
          >
            Refuser les cookies
          </button>
          <button
            type="button"
            (click)="analytics.accept()"
            class="flex-1 rounded-full border-[1.5px] border-fg bg-inverse px-4 py-2.5 font-display text-sm font-semibold text-inverse-fg transition hover:opacity-90"
          >
            Accepter les cookies
          </button>
        </div>
      </div>
    }
  `,
})
export class CookieBanner {
  protected readonly analytics = inject(Analytics);
  protected readonly details = signal(false);
}
