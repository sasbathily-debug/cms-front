import { PageDef } from './fields';
import { A_PROPOS } from './defs/a-propos';
import { LE_CABINET } from './defs/le-cabinet';
import { PREMIERE_CONSULTATION } from './defs/premiere-consultation';
import { INFOS_PRATIQUES } from './defs/infos-pratiques';
import { CONTACT } from './defs/contact';
import { ACCUEIL } from './defs/accueil';
import { FAQ_PAGE } from './defs/faq';
import { CONSEILS_SANTE } from './defs/conseils-sante';
import { SPECIALITES } from './defs/specialites';
import { RENDEZ_VOUS } from './defs/rendez-vous';
import { PIED_DE_PAGE } from './defs/pied-de-page';
import {
  MALADIE_CHOLESTEROL,
  MALADIE_DIABETE,
  MALADIE_HORMONES,
  MALADIE_NUTRITION,
  MALADIE_OBESITE,
  MALADIE_THYROIDE,
} from './defs/maladies';

/**
 * Toutes les pages décrites, modifiables ou non. Une page ajoutée ici apparaît dans l'admin
 * sauf si sa définition porte `editable: false` (ses textes restent alors dans le code).
 */
export const ALL_PAGES = [
  ACCUEIL,
  A_PROPOS,
  LE_CABINET,
  PREMIERE_CONSULTATION,
  INFOS_PRATIQUES,
  CONTACT,
  PIED_DE_PAGE,
  SPECIALITES,
  MALADIE_DIABETE,
  MALADIE_THYROIDE,
  MALADIE_OBESITE,
  MALADIE_NUTRITION,
  MALADIE_HORMONES,
  MALADIE_CHOLESTEROL,
  FAQ_PAGE,
  CONSEILS_SANTE,
  RENDEZ_VOUS,
] as PageDef<object>[];

/** Les pages que la doctoresse peut modifier depuis l'admin. */
export const PAGES = ALL_PAGES.filter((page) => page.editable !== false);

export function pageBySlug(slug: string): PageDef<object> | undefined {
  return PAGES.find((page) => page.slug === slug);
}
