import { Component, inject, input } from '@angular/core';
import { SiteSettings } from '../../core/services/site-settings';
import { PublicPage } from '../public-page/public-page';
import { Crumb, PageHero } from '../page-hero/page-hero';

/** Un bloc d'un texte juridique : paragraphes, lignes « nom : explication » et/ou liste à puces. */
export interface LegalSection {
  id: string;
  titre: string;
  intro?: string[];
  /** Lignes « nom : explication », présentées en tableau. */
  lignes?: { nom: string; texte: string }[];
  points?: string[];
  fin?: string[];
}

/**
 * Mise en page commune aux textes juridiques (politique de confidentialité, mentions légales) : résumé en tête,
 * sections, sommaire à droite et coordonnées du cabinet en bas. Un encadré de plus peut être placé dans le
 * sommaire avec le contenu projeté `[aside]`.
 */
@Component({
  selector: 'app-legal-page',
  imports: [PublicPage, PageHero],
  templateUrl: './legal-page.html',
})
export class LegalPage {
  protected readonly site = inject(SiteSettings);

  readonly titre = input.required<string>();
  readonly lead = input.required<string>();
  readonly crumbs = input.required<Crumb[]>();
  readonly miseAJour = input.required<string>();
  readonly resumeTitre = input.required<string>();
  readonly resume = input.required<string[]>();
  readonly sections = input.required<LegalSection[]>();
  readonly avertissement = input.required<string>();
  readonly contactIntro = input.required<string>();

  protected scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
