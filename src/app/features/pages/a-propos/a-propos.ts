import { Parallax } from '../../../shared/parallax';
import { Component, inject } from '@angular/core';
import { PageContent } from '../../../core/services/page-content';
import { A_PROPOS } from '../../../core/page-content/defs/a-propos';
import { InView } from '../../../shared/in-view';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { OptimizedImagePipe } from '../../../shared/optimized-image.pipe';
import { SrcsetPipe } from '../../../core/page-content/images';
import { MotsLumineux } from '../../../shared/mots-lumineux/mots-lumineux';

@Component({
  selector: 'app-a-propos',
  imports: [
    RouterLink,
    PublicPage,
    CtaBand,
    Parallax,
    InView,
    OptimizedImagePipe,
    SrcsetPipe,
    MotsLumineux,
  ],
  templateUrl: './a-propos.html',
})
export class APropos {
  protected readonly c = inject(PageContent).use(A_PROPOS);
}
