import { Component, input } from '@angular/core';

export type MaladieArtKind = 'diabete-hero' | 'thyroide-hero' | 'obesite-hero';

/** Illustrations animées des pages de maladies (schémas simplifiés, en SVG et CSS). */
@Component({
  selector: 'app-maladie-art',
  styleUrl: './maladie-art.css',
  templateUrl: './maladie-art.html',
})
export class MaladieArt {
  readonly kind = input.required<MaladieArtKind>();
}
