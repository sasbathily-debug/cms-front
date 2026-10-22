import { PageDef } from './fields';
import { A_PROPOS } from './defs/a-propos';
import { LE_CABINET } from './defs/le-cabinet';

/** Toutes les pages dont le contenu se modifie depuis l'admin. */
export const PAGES: PageDef<object>[] = [
  A_PROPOS as PageDef<object>,
  LE_CABINET as PageDef<object>,
];

export function pageBySlug(slug: string): PageDef<object> | undefined {
  return PAGES.find((page) => page.slug === slug);
}
