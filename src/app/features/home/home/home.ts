import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { InView } from '../../../shared/in-view';
import { PublicPage } from '../../../shared/public-page/public-page';
import { OpenNow } from '../../../shared/open-now/open-now';
import { SilhouetteSpecialties } from '../../../shared/silhouette-specialties/silhouette-specialties';
import { OrangeThread } from '../../../shared/orange-thread/orange-thread';
import { Parallax } from '../../../shared/parallax';
import { HomeMobile } from '../home-mobile/home-mobile';
import { NextSlot } from '../../../core/services/next-slot';
import { SiteSettings } from '../../../core/services/site-settings';
import { SiteArticles } from '../../../core/services/site-articles';
import { SiteFaq } from '../../../core/services/site-faq';
import { OpeningHours } from '../../../core/services/opening-hours';
import { PageContent } from '../../../core/services/page-content';
import { ACCUEIL } from '../../../core/page-content/defs/accueil';
import { OptimizedImagePipe } from '../../../shared/optimized-image.pipe';
import { ChiffrePipe } from '../../../shared/chiffre.pipe';
import { SrcsetPipe } from '../../../core/page-content/images';

@Component({
  selector: 'app-home',
  imports: [
    InView,
    RouterLink,
    OpenNow,
    PublicPage,
    SilhouetteSpecialties,
    OrangeThread,
    HomeMobile,
    Parallax,
    OptimizedImagePipe,
    ChiffrePipe,
    SrcsetPipe,
  ],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  /**
   * Une seule version de l'accueil est construite (bureau ou téléphone) : un seul titre principal dans la page
   * et aucune image téléchargée pour la version qu'on ne voit pas.
   */
  readonly desktop = signal(true);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    const query = window.matchMedia('(min-width: 1024px)');
    this.desktop.set(query.matches);
    const onChange = (event: MediaQueryListEvent): void => this.desktop.set(event.matches);
    query.addEventListener('change', onChange);
    this.destroyRef.onDestroy(() => query.removeEventListener('change', onChange));
  }

  private readonly slots = inject(NextSlot);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly site = inject(SiteSettings);

  /** Un créneau est libre : l'étiquette s'affiche (voir NextSlot, tenu à jour tant que la page est ouverte). */
  readonly hasSlot = computed(() => this.slots.ticket() !== null);
  /** Le prochain créneau (jour, numéro, phrase) pour la carte de rendez-vous du bandeau. */
  protected readonly slotTicket = this.slots.ticket;
  private readonly siteFaq = inject(SiteFaq);
  private readonly openFaq = signal<ReadonlySet<number>>(new Set([0]));
  readonly faq = computed(() =>
    this.siteFaq.homeItems().map((item, i) => ({ ...item, open: this.openFaq().has(i) })),
  );

  readonly mapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.google.com/maps?q=14.71259593963623,-17.46856689453125&z=17&output=embed',
  );

  protected readonly c = inject(PageContent).use(ACCUEIL);

  /** Titre de la maquette : les mots arrivent un par un, les trois derniers sont soulignés. */
  readonly heroWords = computed(() =>
    this.c()
      .hero.titre.split(' ')
      .map((word, index, words) => ({
        word,
        delay: index * 0.22,
        underlined: index >= words.length - 3,
      })),
  );
  protected readonly hours = inject(OpeningHours);

  private readonly siteArticles = inject(SiteArticles);
  readonly articles = computed(() =>
    this.siteArticles
      .items()
      .slice(0, 3)
      .map((a) => ({ categorie: a.category.toUpperCase(), titre: a.title, photo: a.photo })),
  );

  toggleFaq(index: number): void {
    this.openFaq.update((open) => {
      const next = new Set(open);
      if (!next.delete(index)) next.add(index);
      return next;
    });
  }
}
