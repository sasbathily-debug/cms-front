import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SPECIALTIES } from '../../core/specialties';

/**
 * La silhouette du logo avec les glandes qui s'allument tour à tour, à côté de la liste
 * des spécialités : survoler une ligne montre l'organe concerné.
 */
@Component({
  selector: 'app-silhouette-specialties',
  imports: [RouterLink],
  styleUrl: './silhouette-specialties.css',
  templateUrl: './silhouette-specialties.html',
})
export class SilhouetteSpecialties {
  readonly eyebrow = input('OÙ AGISSENT LES HORMONES ?');
  readonly title = input('Chaque spécialité a son organe');
  readonly intro = input('Passez la souris sur une ligne pour voir où se situe le problème dans le corps.');

  /** Affiche aussi la phrase de présentation et une flèche sur chaque ligne (version de l'accueil). */
  readonly detailed = input(false);

  readonly rows = SPECIALTIES;
}
