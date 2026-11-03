import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Analytics } from '../../core/analytics';
import { SiteSettings } from '../../core/services/site-settings';
import { PageContent } from '../../core/services/page-content';
import { PIED_DE_PAGE } from '../../core/page-content/defs/pied-de-page';
import { OpeningHours } from '../../core/services/opening-hours';
import { SPECIALTY_LINKS } from '../../core/site-nav';
import { OpenNow } from '../open-now/open-now';
import { InstallButton } from '../install-button/install-button';
import { BackToTop } from '../back-to-top/back-to-top';
import { DoodleFooter } from '../doodle-footer/doodle-footer';

/** Les trois liens du bas de page : reconnus par leur libellé, qui reste modifiable depuis l'admin. */
const LEGAL_ROUTES: [RegExp, string][] = [
  [/mentions/i, '/mentions-legales'],
  [/confidentialit/i, '/politique-de-confidentialite'],
  [/plan du site/i, '/plan-du-site'],
];

@Component({
  selector: 'app-footer',
  imports: [RouterLink, OpenNow, InstallButton, BackToTop, DoodleFooter],
  styleUrl: './app-footer.css',
  templateUrl: './app-footer.html',
})
export class AppFooter {
  protected readonly site = inject(SiteSettings);
  protected readonly analytics = inject(Analytics);

  /** La scène « DR FALL » est réservée à l'accueil, à la 404 et à la page des conseils : ailleurs, le pied de page reste sobre. */
  readonly scene = input(false);

  readonly year = new Date().getFullYear();
  readonly instagramUrl = 'https://www.instagram.com/dr_aissatou.m/';
  readonly specialties = [
    SPECIALTY_LINKS[0],
    SPECIALTY_LINKS[1],
    SPECIALTY_LINKS[2],
    SPECIALTY_LINKS[4],
  ];
  readonly mapsUrl = 'https://www.google.com/maps?q=14.71259593963623,-17.46856689453125';

  protected readonly addressLines = computed(() =>
    [this.site.street(), `${this.site.address()}, Sénégal`].filter(Boolean),
  );
  protected readonly hours = inject(OpeningHours);
  protected readonly c = inject(PageContent).use(PIED_DE_PAGE);

  /** « Mentions légales · Politique de confidentialité · Plan du site » : chacun renvoie vers sa page. */
  protected readonly bottomLinks = computed(() =>
    this.c()
      .bas.liens.split('·')
      .map((label) => label.trim())
      .filter(Boolean)
      .map((label) => ({ label, route: LEGAL_ROUTES.find(([re]) => re.test(label))?.[1] ?? null })),
  );
}
