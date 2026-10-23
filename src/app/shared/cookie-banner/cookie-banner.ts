import { AfterViewChecked, Component, ElementRef, inject, viewChild } from '@angular/core';
import { Analytics } from '../../core/analytics';

/**
 * Fenêtre de consentement, centrée comme sur les grands sites : tout le détail est lisible sans rien déplier
 * (cookies nécessaires, mesure d'audience, ce qui est envoyé ou non), et « Refuser » pèse autant qu'« Accepter ».
 * Le texte défile si l'écran est petit ; les deux boutons restent toujours visibles.
 */
@Component({
  selector: 'app-cookie-banner',
  template: `
    @if (analytics.asking()) {
      <div
        class="fixed inset-0 z-[80] flex items-center justify-center bg-plum-950/65 p-3 backdrop-blur-[3px] sm:p-6"
      >
        <div
          #dialog
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-title"
          aria-describedby="cookie-intro"
          tabindex="-1"
          class="flex max-h-[92vh] w-full max-w-[660px] flex-col overflow-hidden rounded-[28px] border border-line bg-surface text-fg shadow-[0_40px_90px_rgba(0,0,0,0.45)] outline-none"
        >
          <div class="flex min-h-0 flex-col gap-5 overflow-y-auto px-6 pb-2 pt-7 sm:px-9 sm:pt-9">
            <div class="flex items-center gap-4">
              <span
                class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent-700"
                aria-hidden="true"
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 12.5A9 9 0 1 1 11.5 3a4 4 0 0 0 4.5 4.5 3.5 3.5 0 0 0 5 5z" />
                  <circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none" />
                  <circle cx="14.5" cy="15" r="0.9" fill="currentColor" stroke="none" />
                  <circle cx="8.5" cy="15.5" r="0.9" fill="currentColor" stroke="none" />
                </svg>
              </span>
              <div class="flex flex-col gap-0.5">
                <h2
                  id="cookie-title"
                  class="m-0 font-display text-[1.65rem] font-bold leading-tight tracking-[-0.02em]"
                >
                  Vos données, vos choix
                </h2>
                <p class="m-0 text-[15px] text-muted">Nous respectons votre vie privée.</p>
              </div>
            </div>

            <p id="cookie-intro" class="m-0 text-[15px] leading-[1.7] text-body">
              Ce site utilise des cookies. Ceux qui sont nécessaires à son fonctionnement sont
              toujours actifs. Les autres ne sont utilisés qu'avec votre accord, et refuser ne vous
              empêche en rien d'utiliser le site, de prendre rendez-vous ou de vous connecter.
            </p>

            <section class="flex flex-col gap-2 rounded-[18px] bg-sunken p-5">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <h3 class="m-0 font-display text-[16px] font-bold">Cookies nécessaires</h3>
                <span
                  class="rounded-full bg-success-soft px-3 py-1 text-[12px] font-semibold text-success"
                  >Toujours actifs</span
                >
              </div>
              <p class="m-0 text-[14px] leading-[1.65] text-body">
                Ils gardent votre connexion à votre espace patient ou professionnel ouverte et
                retiennent votre choix de thème (clair ou sombre) et votre réponse à cette fenêtre.
                Ils ne servent pas à vous suivre et ne demandent pas votre accord.
              </p>
            </section>

            <section class="flex flex-col gap-2 rounded-[18px] bg-sunken p-5">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <h3 class="m-0 font-display text-[16px] font-bold">
                  Mesure d'audience : Google Analytics
                </h3>
                <span
                  class="rounded-full bg-accent-soft px-3 py-1 text-[12px] font-semibold text-accent-800"
                  >Avec votre accord</span
                >
              </div>
              <p class="m-0 text-[14px] leading-[1.65] text-body">
                Pour améliorer le site, nous comptons les visites : les pages publiques consultées,
                la provenance approximative (moteur de recherche, réseau social, lien direct), le
                type d'appareil, et le nombre de rendez-vous réservés ou de messages envoyés, sans
                aucun détail.
              </p>
              <p class="m-0 text-[14px] leading-[1.65] text-body">
                Cookies déposés par Google :
                <strong class="font-semibold text-fg">_ga</strong> et
                <strong class="font-semibold text-fg">_ga_…</strong>, qui contiennent un identifiant
                aléatoire. Durée de vie du cookie : 2 ans. Les données associées sont conservées 2
                mois par Google, qui peut les traiter hors du Sénégal.
              </p>
              <p class="m-0 text-[14px] leading-[1.65] text-body">
                <strong class="font-semibold text-fg">Nous n'envoyons jamais</strong> votre nom,
                votre e-mail, votre téléphone ni aucune information de santé. Rien n'est mesuré dans
                votre espace patient, l'administration, la connexion ni la création de compte.
              </p>
            </section>

            <p class="m-0 pb-3 text-[13.5px] leading-[1.6] text-muted">
              Vous pouvez changer d'avis à tout moment avec le lien « Gérer les cookies » en bas de
              chaque page.
            </p>
          </div>

          <div
            class="flex shrink-0 flex-col gap-3 border-t border-line bg-surface px-6 py-5 sm:flex-row sm:px-9"
          >
            <button
              type="button"
              (click)="analytics.refuse()"
              class="flex-1 cursor-pointer rounded-full border-[1.5px] border-fg bg-transparent px-5 py-3.5 font-display text-[15px] font-semibold text-fg transition hover:bg-sunken"
            >
              Refuser les cookies
            </button>
            <button
              type="button"
              (click)="analytics.accept()"
              class="flex-1 cursor-pointer rounded-full border-[1.5px] border-fg bg-inverse px-5 py-3.5 font-display text-[15px] font-semibold text-inverse-fg transition hover:opacity-90"
            >
              Accepter les cookies
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class CookieBanner implements AfterViewChecked {
  protected readonly analytics = inject(Analytics);
  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');
  private focused = false;

  /** À l'ouverture, le focus va sur la fenêtre : un lecteur d'écran la lit tout de suite et le clavier y reste. */
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
