export interface Specialty {
  key: string;
  sym: string;
  n: string;
  title: string;
  organ: string;
  route: string;
  text: string;
  signs: string;
}

/** Les six spécialités du cabinet. Les pages dédiées existent pour le diabète, la thyroïde et l'obésité. */
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
  },
  {
    key: 'ob',
    sym: 'Ob',
    n: '03',
    title: 'Obésité et surpoids',
    organ: "L'hypophyse et les surrénales, liées à l'appétit et au stress",
    route: '/specialites/obesite',
    text: 'Un accompagnement progressif et réaliste, fondé sur vos habitudes, sans régime miracle.',
    signs: 'vous avez du mal à stabiliser votre poids malgré vos efforts.',
  },
  {
    key: 'nu',
    sym: 'Nu',
    n: '04',
    title: 'Nutrition clinique',
    organ: 'Tout le métabolisme, du cerveau au pancréas',
    route: '/specialites',
    text: 'Un plan alimentaire adapté à votre maladie, votre âge et votre mode de vie.',
    signs: 'vous souhaitez adapter votre alimentation à une maladie ou à un traitement.',
  },
  {
    key: 'ho',
    sym: 'Ho',
    n: '05',
    title: 'Troubles hormonaux',
    organ: "Les ovaires, les surrénales et l'hypophyse",
    route: '/specialites',
    text: 'Cycles irréguliers, syndrome des ovaires polykystiques, ménopause, puberté précoce ou tardive.',
    signs: 'des cycles irréguliers, une pilosité ou une prise de poids inexpliquées.',
  },
  {
    key: 'ch',
    sym: 'Ch',
    n: '06',
    title: 'Cholestérol et métabolisme',
    organ: 'Le foie et les surrénales',
    route: '/specialites',
    text: "Cholestérol, triglycérides, acide urique : comprendre un résultat d'analyse et agir en conséquence.",
    signs: 'un bilan sanguin montre des valeurs hors normes.',
  },
];
