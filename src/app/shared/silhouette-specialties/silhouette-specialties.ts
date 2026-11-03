import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Spotlight } from '../spotlight';
import { Specialties } from '../../core/services/specialties';

/**
 * La silhouette du logo avec les glandes qui s'allument tour à tour, à côté de la liste
 * des spécialités : survoler une ligne montre l'organe concerné.
 */
@Component({
  selector: 'app-silhouette-specialties',
  imports: [RouterLink, Spotlight],
  styleUrl: './silhouette-specialties.css',
  templateUrl: './silhouette-specialties.html',
})
export class SilhouetteSpecialties {
  readonly eyebrow = input('OÙ AGISSENT LES HORMONES ?');
  readonly title = input('Là où agissent les hormones');
  readonly intro = input(
    'Passez la souris sur le diabète, la thyroïde ou les troubles hormonaux : la glande concernée s’allume.',
  );

  /** « dark » : version de l'accueil (fond prune, phrase de présentation et flèche sur chaque ligne). */
  readonly variant = input<'light' | 'dark'>('light');

  readonly rows = inject(Specialties).list;
}
