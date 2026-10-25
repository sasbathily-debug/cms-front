import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LegalPage } from '../../../shared/legal-page/legal-page';
import {
  MENTIONS,
  MENTIONS_LEAD,
  MENTIONS_MISE_A_JOUR,
  MENTIONS_RESUME,
  MENTIONS_TITRE,
} from './mentions-legales.data';

/** Mentions légales : texte provisoire dans `mentions-legales.data.ts`, les passages entre crochets restent à confirmer. */
@Component({
  selector: 'app-mentions-legales',
  imports: [RouterLink, LegalPage],
  template: `
    <app-legal-page
      [titre]="titre"
      [lead]="lead"
      [crumbs]="crumbs"
      [miseAJour]="miseAJour"
      resumeTitre="L'ESSENTIEL EN 4 POINTS"
      [resume]="resume"
      [sections]="sections"
      avertissement="Version provisoire : ces mentions sont à relire et à compléter par la doctoresse (passages entre crochets) avant publication."
      contactIntro="Pour toute question sur ce site :"
    >
      <div aside class="flex flex-col gap-2.5 rounded-[22px] bg-sunken p-[26px]">
        <h2 class="m-0 font-display text-lg font-bold text-fg">Vos données</h2>
        <span class="text-[14.5px] leading-relaxed text-body"
          >Ce que le site recueille et vos droits sont expliqués dans la politique de
          confidentialité.</span
        >
        <a
          routerLink="/politique-de-confidentialite"
          class="text-[14.5px] font-semibold text-accent-800"
          >Lire la politique de confidentialité</a
        >
      </div>
    </app-legal-page>
  `,
})
export class MentionsLegales {
  protected readonly titre = MENTIONS_TITRE;
  protected readonly lead = MENTIONS_LEAD;
  protected readonly miseAJour = MENTIONS_MISE_A_JOUR;
  protected readonly resume = MENTIONS_RESUME;
  protected readonly sections = MENTIONS;

  protected readonly crumbs = [{ label: 'Accueil', route: '/' }, { label: MENTIONS_TITRE }];
}
