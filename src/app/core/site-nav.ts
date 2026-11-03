export interface NavLink {
  label: string;
  sym: string;
  route: string;
  hint?: string;
}

export const SPECIALTY_LINKS: NavLink[] = [
  { sym: 'Di', label: 'Diabète', route: '/specialites/diabete' },
  { sym: 'Th', label: 'Thyroïde', route: '/specialites/thyroide' },
  { sym: 'Ob', label: 'Obésité et nutrition', route: '/specialites/obesite' },
  { sym: 'Nu', label: 'Nutrition clinique', route: '/specialites/nutrition-clinique' },
  { sym: 'Ho', label: 'Troubles hormonaux', route: '/specialites/troubles-hormonaux' },
  { sym: 'Ch', label: 'Cholestérol', route: '/specialites/cholesterol' },
];

/**
 * « Je viens pour… » : chaque spécialité du menu est formulée à la première personne, comme le dirait un patient.
 * `motif` préremplit le motif de la réservation quand il existe tel quel dans le formulaire.
 */
export interface Intent {
  /** Clé de la spécialité (voir `SPECIALTIES`). */
  key: string;
  verbe: string;
  motif?: string;
}

export const INTENTS: Intent[] = [
  { key: 'di', verbe: 'mon diabète' },
  { key: 'th', verbe: 'ma thyroïde' },
  { key: 'ob', verbe: 'mon poids' },
  { key: 'nu', verbe: 'mon alimentation', motif: 'Nutrition' },
  { key: 'ho', verbe: 'mes cycles, mes hormones' },
  { key: 'ch', verbe: 'un résultat d’analyse', motif: "Résultats d'analyses" },
];

/** Adresse de la réservation préremplie pour une spécialité. */
export function bookingQuery(intent: Intent): Record<string, string> {
  return intent.motif ? { motif: intent.motif, sujet: intent.verbe } : { sujet: intent.verbe };
}
