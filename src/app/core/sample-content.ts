/** Textes d'exemple de la maquette : ils servent tant que le contenu de l'admin n'est pas validé (voir `sampleContent`). */

export interface ArticleView {
  category: string;
  duration: string;
  title: string;
  text: string;
  photo: string;
}

/** Articles d'exemple : à écrire ou à valider avec la doctoresse avant la mise en ligne. */
export const SAMPLE_ARTICLES: ArticleView[] = [
  {
    category: 'Diabète',
    duration: '5 min',
    title: 'Comprendre son HbA1c',
    text: 'Ce que mesure ce chiffre, à quelle fréquence le contrôler et comment le lire avec votre médecin.',
    photo: '/img/photo-3.jpg',
  },
  {
    category: 'Diabète',
    duration: '4 min',
    title: 'Surveiller sa glycémie à la maison',
    text: 'Quand mesurer, comment noter ses résultats et quelles valeurs doivent vous faire réagir.',
    photo: '/img/photo-1.jpg',
  },
  {
    category: 'Thyroïde',
    duration: '5 min',
    title: "Hypothyroïdie : les signes qu'on ne remarque pas",
    text: 'Fatigue, frilosité, prise de poids : quand ces signaux justifient un bilan thyroïdien.',
    photo: '/img/photo-3.jpg',
  },
  {
    category: 'Nutrition',
    duration: '6 min',
    title: 'Manger équilibré avec la cuisine sénégalaise',
    text: 'Thiéboudienne, mafé, yassa : adapter les portions et les accompagnements sans renoncer à ses plats.',
    photo: '/img/photo-2.jpg',
  },
  {
    category: 'Nutrition',
    duration: '4 min',
    title: 'Les boissons sucrées, un piège du quotidien',
    text: 'Jus, sodas, thé sucré : combien de sucre cachent-ils et par quoi les remplacer.',
    photo: '/img/photo-1.jpg',
  },
  {
    category: 'Diabète',
    duration: '5 min',
    title: 'Prendre soin de ses pieds quand on est diabétique',
    text: 'Les gestes simples à faire chaque jour pour éviter les plaies et les infections.',
    photo: '/img/photo-2.jpg',
  },
];

export interface FaqEntry {
  question: string;
  answer: string;
}

/** Questions de l'accueil. */
export const SAMPLE_HOME_FAQ: FaqEntry[] = [
  {
    question: 'Comment réserver un rendez-vous ?',
    answer:
      "En ligne (création du compte en une minute, puis choix d'un créneau), ou par téléphone et WhatsApp au +221 77 226 39 06. Vous recevez une confirmation par e-mail et un rappel la veille.",
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
    answer: 'Espèces, Wave et Orange Money.',
  },
  {
    question: 'Comment annuler ou déplacer un rendez-vous ?',
    answer: "Depuis votre espace patient ou par téléphone, au moins [24 heures] à l'avance.",
  },
  {
    question: "Que faire en cas d'urgence ?",
    answer:
      'Le cabinet ne gère pas les urgences. Rendez-vous aux urgences les plus proches. [Numéro à indiquer.]',
  },
];
