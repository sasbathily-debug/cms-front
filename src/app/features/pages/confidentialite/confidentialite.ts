import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LegalPage } from '../../../shared/legal-page/legal-page';
import {
  POLITIQUE,
  POLITIQUE_EN_BREF,
  POLITIQUE_LEAD,
  POLITIQUE_MISE_A_JOUR,
  POLITIQUE_TITRE,
} from './confidentialite.data';

/** Politique de confidentialité : texte provisoire dans `confidentialite.data.ts`, les passages entre crochets restent à confirmer. */
@Component({
  selector: 'app-confidentialite',
  imports: [RouterLink, LegalPage],
  templateUrl: './confidentialite.html',
})
export class Confidentialite {
  protected readonly titre = POLITIQUE_TITRE;
  protected readonly lead = POLITIQUE_LEAD;
  protected readonly miseAJour = POLITIQUE_MISE_A_JOUR;
  protected readonly enBref = POLITIQUE_EN_BREF;
  protected readonly sections = POLITIQUE;

  protected readonly crumbs = [{ label: 'Accueil', route: '/' }, { label: POLITIQUE_TITRE }];
}
