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
import { MALADIE_DIABETE, MALADIE_OBESITE, MALADIE_THYROIDE } from './defs/maladies';

/** Toutes les pages dont le contenu se modifie depuis l'admin. Pour en ajouter une : sa définition, puis une ligne ici. */
export const PAGES = [
  A_PROPOS,
  LE_CABINET,
  PREMIERE_CONSULTATION,
  INFOS_PRATIQUES,
  CONTACT,
  ACCUEIL,
  FAQ_PAGE,
  CONSEILS_SANTE,
  SPECIALITES,
  MALADIE_DIABETE,
  MALADIE_THYROIDE,
  MALADIE_OBESITE,
  RENDEZ_VOUS,
  PIED_DE_PAGE,
] as PageDef<object>[];

export function pageBySlug(slug: string): PageDef<object> | undefined {
  return PAGES.find((page) => page.slug === slug);
}
