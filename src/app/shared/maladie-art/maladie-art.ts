import { Component, input } from '@angular/core';

export type MaladieArtKind =
  | 'diabete-hero'
  | 'diabete-ok'
  | 'diabete-type1'
  | 'diabete-type2'
  | 'diabete-gest'
  | 'thyroide-hero'
  | 'thyroide-low'
  | 'thyroide-ok'
  | 'thyroide-high'
  | 'thyroide-nodule'
  | 'obesite-hero'
  | 'obesite-balance'
  | 'obesite-sleep'
  | 'obesite-hormones'
  | 'obesite-steps';

/** Illustrations animées des pages de maladies (schémas simplifiés, en SVG et CSS). */
@Component({
  selector: 'app-maladie-art',
  styleUrl: './maladie-art.css',
  templateUrl: './maladie-art.html',
})
export class MaladieArt {
  readonly kind = input.required<MaladieArtKind>();
}
