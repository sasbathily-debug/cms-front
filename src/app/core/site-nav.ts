export interface NavLink {
  label: string;
  sym: string;
  route: string;
  hint?: string;
}

/** Carte photo affichée à côté de la liste dans le sous-menu (photos de la maquette, à remplacer par celles validées). */
export interface NavCard {
  title: string;
  hint: string;
  route: string;
  image: string;
}

export interface NavGroup {
  key: string;
  label: string;
  route: string;
  links: NavLink[];
  allLabel?: string;
  cards?: NavCard[];
}

export const SPECIALTY_LINKS: NavLink[] = [
  { sym: 'Di', label: 'Diabète', route: '/specialites/diabete' },
  { sym: 'Th', label: 'Thyroïde', route: '/specialites/thyroide' },
  { sym: 'Ob', label: 'Obésité et nutrition', route: '/specialites/obesite' },
  { sym: 'Nu', label: 'Nutrition clinique', route: '/specialites' },
  { sym: 'Ho', label: 'Troubles hormonaux', route: '/specialites' },
  { sym: 'Ch', label: 'Cholestérol', route: '/specialites' },
];

export const NAV_GROUPS: NavGroup[] = [
  {
    key: 'specialites',
    label: 'Spécialités',
    route: '/specialites',
    links: SPECIALTY_LINKS,
    allLabel: 'Toutes les spécialités',
    cards: [
      {
        title: 'Nos spécialités',
        hint: 'Diabète, thyroïde, poids…',
        route: '/specialites',
        image: '/img/photo-3.jpg',
      },
    ],
  },
  {
    key: 'cabinet',
    label: 'Le cabinet',
    route: '/le-cabinet',
    cards: [
      {
        title: 'Le cabinet',
        hint: 'Le lieu et ceux qui vous accueillent',
        route: '/le-cabinet',
        image: '/img/photo-1.jpg',
      },
    ],
    links: [
      {
        sym: 'Ap',
        label: 'À propos',
        route: '/a-propos',
        hint: 'Parcours et valeurs de la doctoresse',
      },
      {
        sym: 'Éq',
        label: "L'équipe",
        route: '/le-cabinet',
        hint: 'Les personnes qui vous accueillent',
      },
      {
        sym: 'In',
        label: 'Infos pratiques et accès',
        route: '/infos-pratiques',
        hint: 'Adresse, horaires, plan',
      },
    ],
  },
  {
    key: 'patients',
    label: 'Patients',
    route: '/premiere-consultation',
    cards: [
      {
        title: 'Prendre rendez-vous',
        hint: 'Choisissez un créneau en ligne',
        route: '/rendez-vous',
        image: '/img/photo-2.jpg',
      },
    ],
    links: [
      {
        sym: 'Pv',
        label: 'Première visite',
        route: '/premiere-consultation',
        hint: 'Déroulé et documents à apporter',
      },
      {
        sym: 'Ta',
        label: 'Tarifs et assurances',
        route: '/infos-pratiques',
        hint: 'Prix et modes de paiement',
      },
      { sym: 'Fq', label: 'Questions fréquentes', route: '/faq', hint: 'Les réponses courtes' },
      { sym: 'Me', label: 'Mon espace', route: '/client', hint: 'Rendez-vous et documents' },
    ],
  },
];

export const NAV_SIMPLE: { key: string; label: string; route: string }[] = [
  { key: 'conseils', label: 'Conseils santé', route: '/conseils-sante' },
  { key: 'contact', label: 'Contact', route: '/contact' },
];

/** Charge en douce les photos des sous-menus quand le navigateur est au repos, pour qu'elles soient là à la première ouverture. */
export function preloadNavImages(): void {
  const preload = (): void => {
    for (const group of NAV_GROUPS) {
      for (const card of group.cards ?? []) new Image().src = card.image;
    }
  };
  if ('requestIdleCallback' in window) requestIdleCallback(preload);
  else setTimeout(preload, 1500);
}
