import { PageDef } from './fields';
import { A_PROPOS } from './defs/a-propos';
import { LE_CABINET } from './defs/le-cabinet';
import { PREMIERE_CONSULTATION } from './defs/premiere-consultation';
import { INFOS_PRATIQUES } from './defs/infos-pratiques';
import { CONTACT } from './defs/contact';
import { ACCUEIL } from './defs/accueil';

/** Toutes les pages dont le contenu se modifie depuis l'admin. Pour en ajouter une : sa définition, puis une ligne ici. */
export const PAGES = [
  A_PROPOS,
  LE_CABINET,
  PREMIERE_CONSULTATION,
  INFOS_PRATIQUES,
  CONTACT,
  ACCUEIL,
] as PageDef<object>[];

export function pageBySlug(slug: string): PageDef<object> | undefined {
  return PAGES.find((page) => page.slug === slug);
}
