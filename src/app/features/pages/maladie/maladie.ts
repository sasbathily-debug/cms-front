import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PublicPage } from '../../../shared/public-page/public-page';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { MaladieArt } from '../../../shared/maladie-art/maladie-art';
import { MALADIES, MaladieContent } from './maladies.data';

/** Page d'une maladie (diabète, thyroïde, obésité) : le contenu vient de `maladies.data.ts`. */
@Component({
  selector: 'app-maladie',
  imports: [RouterLink, PublicPage, PageHero, CtaBand, MaladieArt],
  templateUrl: './maladie.html',
})
export class Maladie {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')), {
    initialValue: '',
  });

  readonly content = computed<MaladieContent | null>(() => MALADIES[this.slug()] ?? null);

  readonly crumbs = computed(() => [
    { label: 'Accueil', route: '/' },
    { label: 'Spécialités', route: '/specialites' },
    { label: this.content()?.crumb ?? '' },
  ]);

  readonly sommaire = [
    { id: 'definition', label: 'À quoi cela correspond' },
    { id: 'signes', label: 'Les signes qui doivent alerter' },
    { id: 'prise-en-charge', label: 'La prise en charge' },
    { id: 'quotidien', label: 'Le suivi au quotidien' },
    { id: 'questions', label: 'Questions fréquentes' },
  ];

  constructor() {
    // Une adresse inconnue (ex. /specialites/xyz) renvoie vers la liste des spécialités.
    queueMicrotask(() => {
      if (!this.content()) {
        void this.router.navigate(['/specialites'], { replaceUrl: true });
      }
    });
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
