import { RouterLink } from '@angular/router';
import { Component, computed, inject, signal } from '@angular/core';
import { PageContent } from '../../../core/services/page-content';
import { CONSEILS_SANTE } from '../../../core/page-content/defs/conseils-sante';
import { SiteArticles } from '../../../core/services/site-articles';
import { PublicPage } from '../../../shared/public-page/public-page';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { Spotlight } from '../../../shared/spotlight';
import { OptimizedImagePipe } from '../../../shared/optimized-image.pipe';
import { SrcsetPipe } from '../../../core/page-content/images';

@Component({
  selector: 'app-conseils-sante',
  imports: [RouterLink, PublicPage, CtaBand, Spotlight, OptimizedImagePipe, SrcsetPipe],
  templateUrl: './conseils-sante.html',
})
export class ConseilsSante {
  protected readonly c = inject(PageContent).use(CONSEILS_SANTE);
  private readonly site = inject(SiteArticles);
  readonly categories = this.site.categories;
  readonly selected = signal('Tous');

  readonly articles = computed(() => {
    const category = this.selected();
    const all = this.site.items();
    return category === 'Tous' ? all : all.filter((a) => a.category === category);
  });
}
