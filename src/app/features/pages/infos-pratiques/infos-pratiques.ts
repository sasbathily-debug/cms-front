import { Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { statusAt } from '../../../shared/open-now/open-now';
import { SiteSettings } from '../../../core/services/site-settings';
import { PageContent } from '../../../core/services/page-content';
import { INFOS_PRATIQUES } from '../../../core/page-content/defs/infos-pratiques';
import { OpeningHours } from '../../../core/services/opening-hours';

@Component({
  selector: 'app-infos-pratiques',
  imports: [RouterLink, PublicPage, CtaBand],
  templateUrl: './infos-pratiques.html',
})
export class InfosPratiques {
  protected readonly site = inject(SiteSettings);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);

  readonly mapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.google.com/maps?q=14.71259593963623,-17.46856689453125&z=17&output=embed',
  );
  protected readonly itineraire =
    'https://www.google.com/maps?q=14.71259593963623,-17.46856689453125';

  protected readonly openingHours = inject(OpeningHours);
  protected readonly c = inject(PageContent).use(INFOS_PRATIQUES);

  /** Le statut du cabinet, en direct à l'heure de Dakar : il se remet à jour chaque minute. */
  private readonly now = signal(Date.now());
  protected readonly status = computed(() => {
    this.now();
    return statusAt(new Date(), this.openingHours.days());
  });

  constructor() {
    afterNextRender(() => {
      const tick = setInterval(() => this.now.set(Date.now()), 60_000);
      this.destroyRef.onDestroy(() => clearInterval(tick));
    });
  }

  /** Une ligne de tarif avec un montant (chiffres) s'affiche en grand ; « Paiement : espèces, Wave… » reste une ligne de texte. */
  protected estMontant(prix: string): boolean {
    return /\d/.test(prix);
  }
}
