import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteSettings } from '../../../core/services/site-settings';
import { PublicPage } from '../../../shared/public-page/public-page';
import { PageHero } from '../../../shared/page-hero/page-hero';
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
  imports: [RouterLink, PublicPage, PageHero],
  templateUrl: './confidentialite.html',
})
export class Confidentialite {
  protected readonly site = inject(SiteSettings);

  protected readonly titre = POLITIQUE_TITRE;
  protected readonly lead = POLITIQUE_LEAD;
  protected readonly miseAJour = POLITIQUE_MISE_A_JOUR;
  protected readonly enBref = POLITIQUE_EN_BREF;
  protected readonly sections = POLITIQUE;

  readonly crumbs = [{ label: 'Accueil', route: '/' }, { label: POLITIQUE_TITRE }];

  protected scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
