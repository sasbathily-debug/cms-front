import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { SilhouetteSpecialties } from '../../../shared/silhouette-specialties/silhouette-specialties';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { OptimizedImagePipe } from '../../../shared/optimized-image.pipe';
import { SiteContentService } from '../../../core/services/site-content';
import { AvailabilityService } from '../../../core/services/availability';
import { SiteSettings } from '../../../core/services/site-settings';
import { FaqItemDto, HeroImageDto } from '../../../core/models/site-content.models';
import { AvailableSlotDto } from '../../../core/models/availability.models';

interface FaqView {
  question: string;
  answer: string;
  open: boolean;
}

const DEFAULT_TITLE = 'Comprendre votre corps, retrouver votre équilibre.';
const DEFAULT_SUBTITLE =
  "Diabète, thyroïde, poids, nutrition : une consultation qui prend le temps d'expliquer, et un suivi que vous pouvez gérer en ligne.";

/** Texte d'exemple : les passages entre crochets sont à compléter avec la doctoresse. */
const STATIC_FAQ: Omit<FaqView, 'open'>[] = [
  {
    question: 'Comment réserver un rendez-vous ?',
    answer:
      "En ligne (création du compte en une minute, puis choix d'un créneau), ou par téléphone et WhatsApp. Vous recevez une confirmation et un rappel avant le rendez-vous.",
  },
  {
    question: 'Que dois-je apporter ?',
    answer:
      'Vos analyses récentes, vos ordonnances, la liste de vos médicaments et votre carnet de glycémie si vous en avez un.',
  },
  {
    question: 'Faut-il une ordonnance pour consulter ?',
    answer: '[À confirmer par la doctoresse.]',
  },
  {
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer: '[Espèces, Wave, Orange Money, assurances : à confirmer.]',
  },
  {
    question: 'Comment annuler ou déplacer un rendez-vous ?',
    answer: "Par téléphone, au moins [24 heures] à l'avance. [À confirmer]",
  },
  {
    question: "Que faire en cas d'urgence ?",
    answer:
      'Le cabinet ne gère pas les urgences. Rendez-vous aux urgences les plus proches. [Numéro à indiquer.]',
  },
];

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
  imports: [RouterLink, PublicPage, SilhouetteSpecialties, CtaBand, OptimizedImagePipe],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit, OnDestroy {
  private readonly content = inject(SiteContentService);
  private readonly availability = inject(AvailabilityService);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly site = inject(SiteSettings);

  private heroTimer: ReturnType<typeof setInterval> | null = null;

  readonly heroImages = signal<HeroImageDto[]>([]);
  readonly activeHero = signal(0);
  readonly nextSlot = signal<string | null>(null);
  readonly faq = signal<FaqView[]>(STATIC_FAQ.map((item, i) => ({ ...item, open: i === 0 })));

  readonly mapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.google.com/maps?q=14.71259593963623,-17.46856689453125&z=17&output=embed',
  );

  readonly heroWords = computed(() => {
    const title = this.site.settings()?.heroTitle?.trim() || DEFAULT_TITLE;
    const words = title.split(/\s+/);
    // Les trois derniers mots sont soulignés d'un trait orange qui se dessine.
    const split = Math.max(words.length - 3, 0);
    return words.map((word, index) => ({ word, delay: index * 0.22, underlined: index >= split }));
  });
  readonly heroSubtitle = computed(
    () => this.site.settings()?.heroSubtitle?.trim() || DEFAULT_SUBTITLE,
  );
  readonly aboutImage = computed(() => this.site.settings()?.aboutImageUrl || null);
  readonly hoursLines = computed(() => this.site.openingHours().split('\n'));

  readonly etapes = [
    {
      n: '01',
      titre: 'Vous réservez en ligne',
      texte:
        'Créez votre compte en une minute, puis choisissez un créneau libre. Confirmation immédiate, rappel avant le rendez-vous.',
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

  readonly articles = [
    { categorie: 'DIABÈTE', titre: 'Comprendre son HbA1c', tone: 'from-[#3A2418] to-[#1F1226]' },
    {
      categorie: 'NUTRITION',
      titre: 'Manger équilibré avec la cuisine sénégalaise',
      tone: 'from-[#34203C] to-[#3A2418]',
    },
    {
      categorie: 'THYROÏDE',
      titre: "Hypothyroïdie : les signes qu'on ne remarque pas",
      tone: 'from-[#4A2E1A] to-[#2A1930]',
    },
  ];

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
    this.content.getHeroImages().subscribe({
      next: (images) => {
        this.heroImages.set(images);
        if (images.length > 1) {
          this.heroTimer = setInterval(
            () => this.activeHero.update((i) => (i + 1) % images.length),
            6000,
          );
        }
      },
      error: () => undefined,
    });

    const from = new Date();
    const to = new Date();
    to.setDate(to.getDate() + 45);
    this.availability
      .getAvailableSlots(from.toISOString().slice(0, 10), to.toISOString().slice(0, 10))
      .subscribe({
        next: (slots) => this.nextSlot.set(slots[0] ? formatNextSlot(slots[0]) : null),
        error: () => undefined,
      });

    // Les questions gérées par la doctoresse (espace admin) remplacent les exemples dès qu'il y en a.
    this.content.getFaq().subscribe({
      next: (items: FaqItemDto[]) => {
        if (items.length) {
          this.faq.set(
            items.map((item, i) => ({
              question: item.question,
              answer: item.answer,
              open: i === 0,
            })),
          );
        }
      },
      error: () => undefined,
    });
  }

  ngOnDestroy(): void {
    if (this.heroTimer !== null) {
      clearInterval(this.heroTimer);
    }
  }

  toggleFaq(index: number): void {
    this.faq.update((list) =>
      list.map((item, i) => (i === index ? { ...item, open: !item.open } : item)),
    );
  }
}
