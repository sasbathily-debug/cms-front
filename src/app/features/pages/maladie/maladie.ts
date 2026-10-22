import { Component, computed, inject } from '@angular/core';
import { SiteSettings } from '../../../core/services/site-settings';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PublicPage } from '../../../shared/public-page/public-page';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { MaladieArt } from '../../../shared/maladie-art/maladie-art';
import { AnneauVerre } from '../../../shared/anneau-verre/anneau-verre';
import { MaladieContent } from './maladies.data';
import { PageContent } from '../../../core/services/page-content';
import { MALADIE_DEFS } from '../../../core/page-content/defs/maladies';

/** Page d'une maladie (diabète, thyroïde, obésité) : textes d'origine dans `maladies.data.ts`, modifiables depuis l'admin. */
@Component({
  selector: 'app-maladie',
  imports: [RouterLink, PublicPage, PageHero, CtaBand, MaladieArt, AnneauVerre],
  templateUrl: './maladie.html',
})
export class Maladie {
  protected readonly site = inject(SiteSettings);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    {
      initialValue: '',
    },
  );

  /** Les textes de chaque maladie : ceux du site, remplacés par ce que l'admin a saisi. */
  private readonly contents = Object.fromEntries(
    Object.entries(MALADIE_DEFS).map(([slug, def]) => [slug, inject(PageContent).use(def)]),
  );

  readonly content = computed<MaladieContent | null>(() => this.contents[this.slug()]?.() ?? null);

  readonly crumbs = computed(() => [
    { label: 'Accueil', route: '/' },
    { label: 'Spécialités', route: '/specialites' },
    { label: this.content()?.crumb ?? '' },
  ]);

  readonly sommaire = computed(() => [
    { id: 'definition', label: this.content()?.definition.title ?? '' },
    { id: 'signes', label: 'Les signes qui doivent alerter' },
    { id: 'prise-en-charge', label: 'La prise en charge' },
    { id: 'quotidien', label: 'Le suivi au quotidien' },
    { id: 'questions', label: 'Questions fréquentes' },
  ]);

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
