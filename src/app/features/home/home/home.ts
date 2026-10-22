import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { InView } from '../../../shared/in-view';
import { PublicPage } from '../../../shared/public-page/public-page';
import { OpenNow } from '../../../shared/open-now/open-now';
import { SilhouetteSpecialties } from '../../../shared/silhouette-specialties/silhouette-specialties';
import { OrangeThread } from '../../../shared/orange-thread/orange-thread';
import { Parallax } from '../../../shared/parallax';
import { HomeMobile } from '../home-mobile/home-mobile';
import { AvailabilityService } from '../../../core/services/availability';
import { ADDRESS_STREET, SiteSettings } from '../../../core/services/site-settings';
import { SiteArticles } from '../../../core/services/site-articles';
import { SiteFaq } from '../../../core/services/site-faq';
import { OpeningHours } from '../../../core/services/opening-hours';
import { AvailableSlotDto } from '../../../core/models/availability.models';

const HERO_TITLE = 'Suivre votre santé hormonale, simplement et dans la durée.';
const HERO_SUBTITLE =
  "Diabète, thyroïde, poids, nutrition : une consultation qui prend le temps d'expliquer, et un suivi que vous pouvez gérer en ligne.";

function formatNextSlot(slot: AvailableSlotDto): string {
  const d = new Date(`${slot.date}T${slot.time}`);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const weekday = sameDay
    ? "aujourd'hui"
    : new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(d);
  return `${weekday} ${slot.time.slice(0, 5).replace(':', 'h')}`;
}

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
  ],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
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

  private readonly availability = inject(AvailabilityService);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly site = inject(SiteSettings);

  readonly nextSlot = signal<string | null>(null);
  private readonly siteFaq = inject(SiteFaq);
  private readonly openFaq = signal<ReadonlySet<number>>(new Set([0]));
  readonly faq = computed(() =>
    this.siteFaq.homeItems().map((item, i) => ({ ...item, open: this.openFaq().has(i) })),
  );

  readonly mapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.google.com/maps?q=14.71259593963623,-17.46856689453125&z=17&output=embed',
  );

  /** Titre de la maquette : les mots arrivent un par un, les trois derniers sont soulignés. */
  readonly heroWords = HERO_TITLE.split(' ').map((word, index, words) => ({
    word,
    delay: index * 0.22,
    underlined: index >= words.length - 3,
  }));
  readonly heroSubtitle = HERO_SUBTITLE;
  protected readonly hours = inject(OpeningHours);
  readonly points = [
    'Des explications avec des mots simples, autant de fois que nécessaire',
    'Un plan écrit, adapté à votre alimentation et à votre quotidien',
    'Un suivi régulier, avec rappel de rendez-vous la veille',
  ];
  readonly stats = [
    { big: '[XX] ans', small: "d'expérience" },
    { big: '[XXXX]', small: 'patients suivis' },
    { big: '[Diplôme]', small: '[Université, pays]' },
    { big: '[Société]', small: '[Affiliation professionnelle]' },
  ];
  readonly addressStreet = ADDRESS_STREET;

  readonly etapes = [
    {
      n: '01',
      titre: 'Vous réservez en ligne',
      texte:
        'Créez votre compte en une minute, puis choisissez un créneau libre. Confirmation immédiate, rappel la veille.',
    },
    {
      n: '02',
      titre: 'Vous êtes écouté',
      texte:
        'Une vraie conversation, un examen complet, et des explications avec des mots simples.',
    },
    {
      n: '03',
      titre: 'Vous repartez avec un plan',
      texte: 'Ordonnance, examens à faire et prochain rendez-vous, noirs sur blanc.',
    },
  ];

  private readonly siteArticles = inject(SiteArticles);
  readonly articles = computed(() =>
    this.siteArticles
      .items()
      .slice(0, 3)
      .map((a) => ({ categorie: a.category.toUpperCase(), titre: a.title, photo: a.photo })),
  );

  readonly avis = [
    {
      texte: "« [Un avis de patient, avec son accord : ce qui l'a marqué dans la consultation.] »",
      auteur: '[Prénom], [ville ou quartier]',
    },
    {
      texte: '« [Un autre avis : la clarté des explications, le suivi.] »',
      auteur: '[Prénom], [ville ou quartier]',
    },
    {
      texte: '« [Un troisième avis, idéalement sur la première consultation.] »',
      auteur: '[Prénom], [ville ou quartier]',
    },
  ];

  ngOnInit(): void {
    const from = new Date();
    const to = new Date();
    to.setDate(to.getDate() + 45);
    this.availability
      .getAvailableSlots(from.toISOString().slice(0, 10), to.toISOString().slice(0, 10))
      .subscribe({
        next: (slots) => this.nextSlot.set(slots[0] ? formatNextSlot(slots[0]) : null),
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
