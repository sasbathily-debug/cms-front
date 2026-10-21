import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { OrangeThread } from '../../../shared/orange-thread/orange-thread';
import { AvailabilityService } from '../../../core/services/availability';
import { SiteSettings } from '../../../core/services/site-settings';
import { SPECIALTIES } from '../../../core/specialties';

const HERO_TITLE = 'Suivre votre santé hormonale, simplement et dans la durée.';

/** Texte d'exemple : les passages entre crochets sont à compléter avec la doctoresse. */
const FAQ = [
  {
    question: 'Comment réserver un rendez-vous ?',
    answer:
      "En ligne (création du compte en une minute, puis choix d'un créneau), ou par téléphone et WhatsApp au +221 77 226 39 06.",
  },
  {
    question: 'Que dois-je apporter ?',
    answer: 'Vos analyses, ordonnances et votre carnet de glycémie.',
  },
  { question: 'Faut-il une ordonnance ?', answer: '[À confirmer.]' },
  { question: 'Quels moyens de paiement ?', answer: '[À confirmer.]' },
  { question: 'Comment annuler ?', answer: 'Depuis votre espace ou par téléphone.' },
  { question: "Que faire en cas d'urgence ?", answer: '[Numéro à indiquer.]' },
];

/** L'accueil sur téléphone : une mise en page à part, comme sur les écrans mobiles de la maquette. */
@Component({
  selector: 'app-home-mobile',
  imports: [RouterLink, OrangeThread],
  styleUrl: './home-mobile.css',
  templateUrl: './home-mobile.html',
})
export class HomeMobile implements OnInit {
  private readonly availability = inject(AvailabilityService);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly site = inject(SiteSettings);

  readonly nextSlot = signal<string | null>(null);
  readonly faq = signal(FAQ.map((item, i) => ({ ...item, open: i === 0 })));
  readonly rows = SPECIALTIES;

  readonly heroWords = HERO_TITLE.split(' ').map((word, index, words) => ({
    word,
    delay: index * 0.22,
    underlined: index >= words.length - 3,
  }));

  readonly etapes = [
    {
      n: '01',
      titre: 'Vous réservez en ligne',
      texte:
        'Créez votre compte en une minute, puis choisissez un créneau. Confirmation immédiate, rappel la veille.',
    },
    {
      n: '02',
      titre: 'Vous êtes écouté',
      texte: 'Une vraie conversation, un examen complet, des explications avec des mots simples.',
    },
    {
      n: '03',
      titre: 'Vous repartez avec un plan',
      texte: 'Ordonnance, examens à faire et prochain rendez-vous, noirs sur blanc.',
    },
  ];

  readonly stats = [
    { big: '[XX] ans', small: "d'expérience" },
    { big: '[XXXX]', small: 'patients suivis' },
    { big: '[Diplôme]', small: '[Université]' },
    { big: '[Société]', small: '[Affiliation]' },
  ];

  readonly avis = [
    { texte: '« [Un avis de patient, avec son accord.] »', auteur: '[Prénom], [quartier]' },
    {
      texte: '« [Un autre avis : clarté des explications, suivi.] »',
      auteur: '[Prénom], [quartier]',
    },
  ];

  readonly articles = [
    {
      categorie: 'RAMADAN',
      titre: 'Ramadan et diabète : bien se préparer',
      photo: '/img/photo-3.jpg',
    },
    { categorie: 'DIABÈTE', titre: 'Comprendre son HbA1c', photo: '/img/photo-1.jpg' },
    {
      categorie: 'NUTRITION',
      titre: 'Manger équilibré avec la cuisine sénégalaise',
      photo: '/img/photo-2.jpg',
    },
  ];

  readonly mapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.google.com/maps?q=14.71259593963623,-17.46856689453125&z=17&output=embed',
  );

  readonly slotLabel = computed(() => this.nextSlot());

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
    this.faq.update((list) =>
      list.map((item, i) => (i === index ? { ...item, open: !item.open } : item)),
    );
  }
}
