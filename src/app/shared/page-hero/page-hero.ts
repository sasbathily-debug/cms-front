import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Crumb {
  label: string;
  route?: string;
}

/**
 * Bandeau prune des pages intérieures : fil d'Ariane, titre, texte d'introduction,
 * et un panneau illustré optionnel à droite (contenu projeté avec l'attribut `aside`).
 * Il laisse de la place en bas pour la carte qui chevauche (voir la classe `overlap-card`).
 */
@Component({
  selector: 'app-page-hero',
  imports: [RouterLink],
  templateUrl: './page-hero.html',
})
export class PageHero {
  readonly crumbs = input<Crumb[]>([]);
  readonly title = input.required<string>();
  readonly lead = input<string>('');

  /** Espace insécable avant « ? ! : ; » pour ne pas casser la ligne devant la ponctuation. */
  protected readonly displayTitle = computed(() => this.title().replace(/ ([?!:;])/g, '\u00A0$1'));
}
