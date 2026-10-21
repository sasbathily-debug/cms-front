import { Component, computed, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { SiteSettings } from '../../../core/services/site-settings';

@Component({
  selector: 'app-infos-pratiques',
  imports: [RouterLink, PublicPage, CtaBand],
  templateUrl: './infos-pratiques.html',
})
export class InfosPratiques {
  protected readonly site = inject(SiteSettings);
  private readonly sanitizer = inject(DomSanitizer);

  readonly mapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.google.com/maps?q=14.71259593963623,-17.46856689453125&z=17&output=embed',
  );

  readonly hours = computed(() =>
    this.site
      .openingHours()
      .split('\n')
      .map((line) => {
        const [jour, ...rest] = line.split(':');
        return { jour: jour.trim(), heures: rest.join(':').trim() };
      }),
  );

  /** Texte d'exemple : les passages entre crochets sont à confirmer par la doctoresse. */
  readonly tarifs = [
    { acte: 'Première consultation', prix: '[tarif] FCFA' },
    { acte: 'Consultation de suivi', prix: '[tarif] FCFA' },
    { acte: 'Bilan nutritionnel', prix: '[tarif] FCFA' },
    { acte: 'Paiement', prix: '[espèces, Wave, Orange Money…]' },
  ];

  readonly blocs = [
    { titre: 'Accès', texte: '[Repères pour trouver le cabinet : lieu connu, étage, entrée. Taxis ou bus à proximité.]' },
    { titre: 'Stationnement et accessibilité', texte: '[Parking ? Accès pour personnes à mobilité réduite ? Ascenseur ?]' },
    { titre: 'Assurances et mutuelles', texte: '[Liste des assurances et mutuelles acceptées, démarches de remboursement.]' },
  ];
}
