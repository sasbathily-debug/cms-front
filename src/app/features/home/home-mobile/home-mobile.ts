import {
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InView } from '../../../shared/in-view';
import { RouterLink } from '@angular/router';
import { ChatIcon } from '../../../shared/chat-widget/chat-icon';
import { ChatState } from '../../../core/chat-state';
import { SiteArticles } from '../../../core/services/site-articles';
import { SiteFaq } from '../../../core/services/site-faq';
import { PageContent } from '../../../core/services/page-content';
import { ACCUEIL } from '../../../core/page-content/defs/accueil';
import { OpeningHours } from '../../../core/services/opening-hours';
import { OpenNow } from '../../../shared/open-now/open-now';
import { OrangeThread } from '../../../shared/orange-thread/orange-thread';
import { Parallax } from '../../../shared/parallax';
import { AvailabilityService } from '../../../core/services/availability';
import { SiteSettings } from '../../../core/services/site-settings';
import { Specialties } from '../../../core/services/specialties';

/** L'accueil sur téléphone : une mise en page à part, comme sur les écrans mobiles de la maquette. */
@Component({
  selector: 'app-home-mobile',
  imports: [RouterLink, InView, ChatIcon, OpenNow, OrangeThread, Parallax],
  styleUrl: './home-mobile.css',
  templateUrl: './home-mobile.html',
})
export class HomeMobile implements OnInit {
  private readonly availability = inject(AvailabilityService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly site = inject(SiteSettings);
  protected readonly chat = inject(ChatState);
  protected readonly hours = inject(OpeningHours);

  private readonly heroCta = viewChild<ElementRef<HTMLElement>>('heroCta');
  /** Barre de réservation collée en bas : visible une fois le bouton du haut dépassé. */
  readonly showBar = signal(false);

  readonly nextSlot = signal<string | null>(null);
  private readonly siteFaq = inject(SiteFaq);
  private readonly openFaq = signal<ReadonlySet<number>>(new Set([0]));
  readonly faq = computed(() =>
    this.siteFaq.homeItems().map((item, i) => ({ ...item, open: this.openFaq().has(i) })),
  );
  readonly rows = inject(Specialties).list;

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

  readonly slotLabel = computed(() => this.nextSlot());

  constructor() {
    // La barre fixe de cette page porte déjà le bouton de chat : la bulle flottante se retire.
    this.chat.onBar.set(true);
    this.destroyRef.onDestroy(() => this.chat.onBar.set(false));
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

  ngOnInit(): void {
    const from = new Date();
    const to = new Date();
    to.setDate(to.getDate() + 45);
    this.availability
      .getAvailableSlots(from.toISOString().slice(0, 10), to.toISOString().slice(0, 10))
      .subscribe({
        next: (slots) => {
          const slot = slots[0];
          if (!slot) {
            return;
          }
          const d = new Date(`${slot.date}T${slot.time}`);
          const weekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(d);
          this.nextSlot.set(`${weekday} ${slot.time.slice(0, 2)}h`);
        },
        error: () => undefined,
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
