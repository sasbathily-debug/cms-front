import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Analytics } from '../../core/analytics';
import { SiteSettings } from '../../core/services/site-settings';
import { PageContent } from '../../core/services/page-content';
import { PIED_DE_PAGE } from '../../core/page-content/defs/pied-de-page';
import { OpeningHours } from '../../core/services/opening-hours';
import { SPECIALTY_LINKS } from '../../core/site-nav';
import { OpenNow } from '../open-now/open-now';
import { InstallButton } from '../install-button/install-button';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, OpenNow, InstallButton],
  styleUrl: './app-footer.css',
  templateUrl: './app-footer.html',
})
export class AppFooter {
  protected readonly site = inject(SiteSettings);
  protected readonly analytics = inject(Analytics);

  readonly year = new Date().getFullYear();
  readonly instagramUrl = 'https://www.instagram.com/dr_aissatou.m/';
  readonly specialties = [
    SPECIALTY_LINKS[0],
    SPECIALTY_LINKS[1],
    SPECIALTY_LINKS[2],
    SPECIALTY_LINKS[4],
  ];
  readonly mapsUrl = 'https://www.google.com/maps?q=14.71259593963623,-17.46856689453125';

  protected readonly addressLines = computed(() => [
    this.site.street(),
    `${this.site.address()}, Sénégal`,
  ]);
  protected readonly hours = inject(OpeningHours);
  protected readonly c = inject(PageContent).use(PIED_DE_PAGE);

  /** « Mentions légales · Politique de confidentialité · Plan du site » : seule la politique a sa page pour l'instant. */
  protected readonly bottomLinks = computed(() =>
    this.c()
      .bas.liens.split('·')
      .map((label) => label.trim())
      .filter(Boolean)
      .map((label) => ({
        label,
        route: /confidentialit/i.test(label) ? '/politique-de-confidentialite' : null,
      })),
  );
}
