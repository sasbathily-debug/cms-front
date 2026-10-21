import { Component, computed, inject, signal } from '@angular/core';
import { PublicPage } from '../../../shared/public-page/public-page';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { HealthIcon } from '../../../shared/health-icon/health-icon';
import { SiteContentService } from '../../../core/services/site-content';
import { HealthTipDto } from '../../../core/models/site-content.models';

interface Article {
  category: string;
  duration: string;
  title: string;
  text: string;
  tone: string;
}

const CATEGORIES = ['Tous', 'Diabète', 'Thyroïde', 'Nutrition'];

/** Articles d'exemple : à écrire ou à valider avec la doctoresse avant la mise en ligne. */
const ARTICLES: Article[] = [
  {
    category: 'Diabète',
    duration: '5 min',
    title: 'Comprendre son HbA1c',
    text: 'Ce que mesure ce chiffre, à quelle fréquence le contrôler et comment le lire avec votre médecin.',
    tone: 'from-[#3A2418] to-[#1F1226]',
  },
  {
    category: 'Diabète',
    duration: '4 min',
    title: 'Surveiller sa glycémie à la maison',
    text: 'Quand mesurer, comment noter ses résultats et quelles valeurs doivent vous faire réagir.',
    tone: 'from-[#34203C] to-[#1F1226]',
  },
  {
    category: 'Thyroïde',
    duration: '5 min',
    title: "Hypothyroïdie : les signes qu'on ne remarque pas",
    text: 'Fatigue, frilosité, prise de poids : quand ces signaux justifient un bilan thyroïdien.',
    tone: 'from-[#4A2E1A] to-[#2A1930]',
  },
  {
    category: 'Nutrition',
    duration: '6 min',
    title: 'Manger équilibré avec la cuisine sénégalaise',
    text: 'Thiéboudienne, mafé, yassa : adapter les portions et les accompagnements sans renoncer à ses plats.',
    tone: 'from-[#3A2418] to-[#34203C]',
  },
  {
    category: 'Nutrition',
    duration: '4 min',
    title: 'Les boissons sucrées, un piège du quotidien',
    text: 'Jus, sodas, thé sucré : combien de sucre cachent-ils et par quoi les remplacer.',
    tone: 'from-[#2A1930] to-[#3A2418]',
  },
  {
    category: 'Diabète',
    duration: '5 min',
    title: 'Prendre soin de ses pieds quand on est diabétique',
    text: 'Les gestes simples à faire chaque jour pour éviter les plaies et les infections.',
    tone: 'from-[#34203C] to-[#3A2418]',
  },
];

@Component({
  selector: 'app-conseils-sante',
  imports: [PublicPage, CtaBand, HealthIcon],
  templateUrl: './conseils-sante.html',
})
export class ConseilsSante {
  private readonly content = inject(SiteContentService);

  readonly categories = CATEGORIES;
  readonly selected = signal('Tous');
  readonly tips = signal<HealthTipDto[]>([]);

  readonly articles = computed(() => {
    const category = this.selected();
    return category === 'Tous' ? ARTICLES : ARTICLES.filter((a) => a.category === category);
  });

  constructor() {
    this.content
      .getHealthTips()
      .subscribe({ next: (tips) => this.tips.set(tips), error: () => undefined });
  }
}
