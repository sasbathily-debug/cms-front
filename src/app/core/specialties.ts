export interface Specialty {
  key: string;
  sym: string;
  n: string;
  title: string;
  /** Organe mis en avant sur la silhouette ; vide quand la spécialité ne se résume pas à un organe. */
  organ: string;
  route: string;
  text: string;
  signs: string;
  /** Phrase affichée sur les lignes de l'accueil (différente de celle de la page Spécialités). */
  homeText: string;
}

/** Les six spécialités du cabinet. Chacune a sa page dédiée. */
export const SPECIALTIES: Specialty[] = [
  {
    key: 'di',
    sym: 'Di',
    n: '01',
    title: 'Diabète',
    organ: "Le pancréas, qui fabrique l'insuline",
    route: '/specialites/diabete',
    text: 'Diabète de type 1, de type 2 ou gestationnel : un suivi pour garder une glycémie stable et prévenir les complications.',
    signs:
      "soif intense, urines fréquentes, grande fatigue, ou une glycémie élevée découverte lors d'un bilan.",
    homeText:
      'Type 1, type 2 ou gestationnel : garder une glycémie stable et prévenir les complications.',
  },
  {
    key: 'th',
    sym: 'Th',
    n: '02',
    title: 'Thyroïde',
    organ: "La glande du cou, qui règle l'énergie",
    route: '/specialites/thyroide',
    text: 'Hypothyroïdie, hyperthyroïdie, nodules : un bilan clair, des explications et un traitement ajusté.',
    signs: 'fatigue inhabituelle, variations de poids, palpitations, gonflement du cou.',
    homeText: 'Hypothyroïdie, hyperthyroïdie, nodules : un bilan clair et un traitement ajusté.',
  },
  {
    key: 'ob',
    sym: 'Ob',
    n: '03',
    title: 'Obésité et surpoids',
    organ: '',
    route: '/specialites/obesite',
    text: 'Un accompagnement progressif et réaliste, fondé sur vos habitudes, sans régime miracle.',
    signs: 'vous avez du mal à stabiliser votre poids malgré vos efforts.',
    homeText: 'Un accompagnement progressif et réaliste, sans régime miracle.',
  },
  {
    key: 'nu',
    sym: 'Nu',
    n: '04',
    title: 'Nutrition clinique',
    organ: '',
    route: '/specialites/nutrition-clinique',
    text: 'Un plan alimentaire adapté à votre maladie, votre âge et votre mode de vie.',
    signs: 'vous souhaitez adapter votre alimentation à une maladie ou à un traitement.',
    homeText: 'Un plan alimentaire adapté à votre maladie et à votre mode de vie.',
  },
  {
    key: 'ho',
    sym: 'Ho',
    n: '05',
    title: 'Troubles hormonaux',
    organ: "Les ovaires et l'hypophyse",
    route: '/specialites/troubles-hormonaux',
    text: 'Cycles irréguliers, syndrome des ovaires polykystiques, ménopause, puberté précoce ou tardive.',
    signs: 'des cycles irréguliers, une pilosité ou une prise de poids inexpliquées.',
    homeText: 'Cycles irréguliers, ovaires polykystiques, ménopause, puberté.',
  },
  {
    key: 'ch',
    sym: 'Ch',
    n: '06',
    title: 'Cholestérol et métabolisme',
    organ: '',
    route: '/specialites/cholesterol',
    text: "Cholestérol, triglycérides, acide urique : comprendre un résultat d'analyse et agir en conséquence.",
    signs: 'un bilan sanguin montre des valeurs hors normes.',
    homeText: "Comprendre un résultat d'analyse et agir en conséquence.",
  },
];
