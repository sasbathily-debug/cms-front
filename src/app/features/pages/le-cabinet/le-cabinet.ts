import { Component, inject } from '@angular/core';
import { PageContent } from '../../../core/services/page-content';
import { LE_CABINET } from '../../../core/page-content/defs/le-cabinet';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { OptimizedImagePipe } from '../../../shared/optimized-image.pipe';

/** Texte d'exemple : les passages entre crochets sont à compléter avec la doctoresse. */
@Component({
  selector: 'app-le-cabinet',
  imports: [RouterLink, PublicPage, PageHero, CtaBand, OptimizedImagePipe],
  styleUrl: './le-cabinet.css',
  templateUrl: './le-cabinet.html',
})
export class LeCabinet {
  readonly crumbs = [{ label: 'Accueil', route: '/' }, { label: 'Le cabinet' }];
  protected readonly c = inject(PageContent).use(LE_CABINET);
}
