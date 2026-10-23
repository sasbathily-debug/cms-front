import { AfterViewChecked, Component, ElementRef, inject, viewChild } from '@angular/core';
import { Analytics } from '../../core/analytics';

/**
 * Petit panneau de consentement qui glisse depuis le bord gauche de l'écran (depuis le bas sur téléphone).
 * L'essentiel est lisible sans rien déplier : ce qui est toujours actif, ce que mesure Google Analytics, ce qui
 * n'est jamais envoyé. « Refuser » pèse autant qu'« Accepter ». Il ne bloque pas la page.
 */
@Component({
  selector: 'app-cookie-banner',
  template: `
    @if (analytics.asking()) {
      <aside
        #dialog
        role="dialog"
        aria-labelledby="cookie-title"
        aria-describedby="cookie-intro"
        tabindex="-1"
        class="cookie-panel fixed inset-x-3 bottom-3 z-[80] flex max-h-[85vh] flex-col overflow-hidden rounded-[22px] border border-line bg-surface text-fg shadow-[0_18px_50px_rgba(0,0,0,0.3)] outline-none sm:inset-x-auto sm:bottom-6 sm:left-0 sm:w-[370px] sm:rounded-l-none sm:border-l-0"
      >
        <div class="flex min-h-0 flex-col gap-3 overflow-y-auto px-5 pb-1 pt-5">
          <div class="flex items-center gap-3">
            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-700"
              aria-hidden="true"
            >
              <svg
                width="22"
                height="22"
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
            <h2 id="cookie-title" class="m-0 font-display text-[1.1rem] font-bold leading-tight">
              Vos données, vos choix
            </h2>
          </div>

          <p id="cookie-intro" class="m-0 text-[13.5px] leading-[1.55] text-body">
            Les cookies nécessaires au site sont toujours actifs. Nous ne mesurons les visites
            qu'avec votre accord.
          </p>

          <ul class="m-0 flex list-none flex-col gap-2.5 p-0">
            <li class="flex flex-col gap-0.5 rounded-xl bg-sunken px-3.5 py-3">
              <span class="text-[13px] font-bold text-fg">
                Nécessaires
                <span class="font-semibold text-success">· toujours actifs</span>
              </span>
              <span class="text-[12.5px] leading-[1.5] text-body">
                Votre connexion, le thème clair ou sombre et ce choix. Aucun suivi.
              </span>
            </li>
            <li class="flex flex-col gap-0.5 rounded-xl bg-sunken px-3.5 py-3">
              <span class="text-[13px] font-bold text-fg">
                Google Analytics
                <span class="font-semibold text-accent-800">· avec votre accord</span>
              </span>
              <span class="text-[12.5px] leading-[1.5] text-body">
                Compte les pages vues, la provenance et le type d'appareil (cookies _ga, 2 ans ;
                données gardées 2 mois). Nous n'envoyons ni nom, ni e-mail, ni téléphone, ni donnée
                de santé, et rien n'est mesuré dans l'espace patient.
              </span>
            </li>
          </ul>

          <p class="m-0 text-[12px] leading-[1.5] text-muted">
            Modifiable à tout moment : « Gérer les cookies » en bas de page.
          </p>
        </div>

        <div class="flex shrink-0 gap-2.5 px-5 pb-5 pt-3">
          <button
            type="button"
            (click)="analytics.refuse()"
            class="flex-1 cursor-pointer rounded-full border-[1.5px] border-fg bg-transparent px-3 py-2.5 font-display text-[13.5px] font-semibold text-fg transition hover:bg-sunken"
          >
            Refuser
          </button>
          <button
            type="button"
            (click)="analytics.accept()"
            class="flex-1 cursor-pointer rounded-full border-[1.5px] border-fg bg-inverse px-3 py-2.5 font-display text-[13.5px] font-semibold text-inverse-fg transition hover:opacity-90"
          >
            Accepter les cookies
          </button>
        </div>
      </aside>
    }
  `,
})
export class CookieBanner implements AfterViewChecked {
  protected readonly analytics = inject(Analytics);
  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');
  private focused = false;

  /** À l'ouverture, le focus va sur le panneau : un lecteur d'écran le lit tout de suite et le clavier y reste. */
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
