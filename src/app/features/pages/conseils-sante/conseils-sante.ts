import { RouterLink } from '@angular/router';
import { Component, computed, inject, signal } from '@angular/core';
import { SiteArticles } from '../../../core/services/site-articles';
import { PublicPage } from '../../../shared/public-page/public-page';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { Spotlight } from '../../../shared/spotlight';

@Component({
  selector: 'app-conseils-sante',
  imports: [RouterLink, PublicPage, CtaBand, Spotlight],
  templateUrl: './conseils-sante.html',
})
export class ConseilsSante {
  private readonly site = inject(SiteArticles);
  readonly categories = this.site.categories;
  readonly selected = signal('Tous');

  readonly articles = computed(() => {
    const category = this.selected();
    const all = this.site.items();
    return category === 'Tous' ? all : all.filter((a) => a.category === category);
  });
}
