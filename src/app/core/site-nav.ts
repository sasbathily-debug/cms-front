export interface NavLink {
  label: string;
  sym: string;
  route: string;
  hint?: string;
}

export interface NavGroup {
  key: string;
  label: string;
  route: string;
  links: NavLink[];
  allLabel?: string;
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
  },
  {
    key: 'cabinet',
    label: 'Le cabinet',
    route: '/le-cabinet',
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
