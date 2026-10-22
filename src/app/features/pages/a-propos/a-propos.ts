import { Parallax } from '../../../shared/parallax';
import { Component, inject } from '@angular/core';
import { PageContent } from '../../../core/services/page-content';
import { A_PROPOS } from '../../../core/page-content/defs/a-propos';
import { InView } from '../../../shared/in-view';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { CtaBand } from '../../../shared/cta-band/cta-band';

@Component({
  selector: 'app-a-propos',
  imports: [RouterLink, PublicPage, CtaBand, Parallax, InView],
  templateUrl: './a-propos.html',
})
export class APropos {
  protected readonly c = inject(PageContent).use(A_PROPOS);
}
