import { Component, computed, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { SiteSettings } from '../../../core/services/site-settings';
import { PageContent } from '../../../core/services/page-content';
import { INFOS_PRATIQUES } from '../../../core/page-content/defs/infos-pratiques';
import { OpeningHours } from '../../../core/services/opening-hours';

@Component({
  selector: 'app-infos-pratiques',
  imports: [RouterLink, PublicPage, CtaBand],
  templateUrl: './infos-pratiques.html',
})
export class InfosPratiques {
  protected readonly site = inject(SiteSettings);
  private readonly sanitizer = inject(DomSanitizer);

  readonly mapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.google.com/maps?q=14.71259593963623,-17.46856689453125&z=17&output=embed',
  );

  protected readonly openingHours = inject(OpeningHours);
  protected readonly c = inject(PageContent).use(INFOS_PRATIQUES);
}
