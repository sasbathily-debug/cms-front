import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InView } from '../../../shared/in-view';
import { RouterLink } from '@angular/router';
import { SiteArticles } from '../../../core/services/site-articles';
import { SiteFaq } from '../../../core/services/site-faq';
import { PageContent } from '../../../core/services/page-content';
import { ACCUEIL } from '../../../core/page-content/defs/accueil';
import { OpeningHours } from '../../../core/services/opening-hours';
import { OpenNow } from '../../../shared/open-now/open-now';
import { OrangeThread } from '../../../shared/orange-thread/orange-thread';
import { Parallax } from '../../../shared/parallax';
import { NextSlot } from '../../../core/services/next-slot';
import { SlotTicket } from '../../../shared/slot-ticket/slot-ticket';
import { SiteSettings } from '../../../core/services/site-settings';
import { SilhouetteSpecialties } from '../../../shared/silhouette-specialties/silhouette-specialties';
import { OptimizedImagePipe } from '../../../shared/optimized-image.pipe';
import { ChiffrePipe } from '../../../shared/chiffre.pipe';
import { SrcsetPipe } from '../../../core/page-content/images';

/** L'accueil sur téléphone : une mise en page à part, comme sur les écrans mobiles de la maquette. */
@Component({
  selector: 'app-home-mobile',
  imports: [
    SilhouetteSpecialties,
    RouterLink,
    InView,
    OpenNow,
    OrangeThread,
    Parallax,
    OptimizedImagePipe,
    ChiffrePipe,
    SrcsetPipe,
    SlotTicket,
  ],
  styleUrl: './home-mobile.css',
  templateUrl: './home-mobile.html',
})
export class HomeMobile {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly site = inject(SiteSettings);
  protected readonly hours = inject(OpeningHours);

  private readonly heroCta = viewChild<ElementRef<HTMLElement>>('heroCta');
  /** Barre de réservation collée en bas : visible une fois le bouton du haut dépassé. */
  readonly showBar = signal(false);

  private readonly siteFaq = inject(SiteFaq);
  private readonly openFaq = signal<ReadonlySet<number>>(new Set([0]));
  readonly faq = computed(() =>
    this.siteFaq.homeItems().map((item, i) => ({ ...item, open: this.openFaq().has(i) })),
  );

  protected readonly c = inject(PageContent).use(ACCUEIL);
  readonly heroWords = computed(() =>
    this.c()
      .hero.titre.split(' ')
      .map((word, index, words) => ({
        word,
        delay: index * 0.22,
        underlined: index >= words.length - 3,
      })),
  );

  private readonly siteArticles = inject(SiteArticles);
  readonly articles = computed(() =>
    this.siteArticles
      .items()
      .slice(0, 3)
      .map((a) => ({ categorie: a.category.toUpperCase(), titre: a.title, photo: a.photo })),
  );

  readonly mapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.google.com/maps?q=14.71259593963623,-17.46856689453125&z=17&output=embed',
  );

  private readonly slots = inject(NextSlot);
  /** Teinte de chaque fiche du parcours : de plus en plus claire, pour qu'on voie la pile se former. */
  protected readonly fiches = ['#2a1930', '#33203a', '#3d2845'];

  /** Un créneau est libre : l'étiquette s'affiche (voir NextSlot, tenu à jour tant que la page est ouverte). */
  readonly hasSlot = computed(() => this.slots.ticket() !== null);

  constructor() {
    afterNextRender(() => {
      const cta = this.heroCta()?.nativeElement;
      if (!cta || typeof IntersectionObserver === 'undefined') return;
      let ctaPassed = false;
      let footerVisible = false;
      const update = (): void => this.showBar.set(ctaPassed && !footerVisible);

      const ctaObserver = new IntersectionObserver(([entry]) => {
        ctaPassed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        update();
      });
      ctaObserver.observe(cta);

      const footer = document.querySelector('app-footer');
      const footerObserver = new IntersectionObserver(([entry]) => {
        footerVisible = entry.isIntersecting;
        update();
      });
      if (footer) footerObserver.observe(footer);

      this.destroyRef.onDestroy(() => {
        ctaObserver.disconnect();
        footerObserver.disconnect();
      });
    });
  }

  toggleFaq(index: number): void {
    this.openFaq.update((open) => {
      const next = new Set(open);
      if (!next.delete(index)) next.add(index);
      return next;
    });
  }
}
