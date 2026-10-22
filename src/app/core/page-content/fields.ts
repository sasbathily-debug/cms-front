/** Un champ modifiable d'une page : du texte, un paragraphe, une liste de textes, ou une liste de blocs. */
export type Field =
  | { key: string; label: string; type: 'text' | 'textarea' | 'image'; hint?: string }
  | { key: string; label: string; type: 'strings'; itemLabel: string; hint?: string }
  | {
      key: string;
      label: string;
      type: 'list';
      itemLabel: string;
      /** Champ dont le texte sert de titre à chaque bloc dans l'admin (par défaut, le premier champ texte). */
      titleKey?: string;
      /** Liste à nombre d'éléments fixe : on modifie les blocs, mais on ne peut ni en ajouter, ni en supprimer, ni les déplacer. */
      fixed?: boolean;
      fields: Field[];
      hint?: string;
    }
  | { key: string; label: string; type: 'group'; fields: Field[]; hint?: string };

/** Une page modifiable : ses champs pour l'admin et ses textes d'origine (ceux du site tant que rien n'est saisi). */
export interface PageDef<T extends object = Record<string, unknown>> {
  slug: string;
  /** Nom affiché dans l'admin. */
  title: string;
  /** Adresse de la page sur le site, pour le lien « Voir la page ». */
  route: string;
  fields: Field[];
  defaults: T;
}

type Json = unknown;

const isObject = (value: Json): value is Record<string, Json> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Textes de la page = textes d'origine, remplacés champ par champ par ce qui a été saisi dans l'admin.
 * Un champ vidé volontairement (« ») reste vide ; un champ absent retrouve son texte d'origine ;
 * une liste saisie remplace la liste d'origine en entier.
 */
export function mergeContent<T>(defaults: T, saved: Json): T {
  if (saved === null || saved === undefined) return defaults;
  if (isObject(defaults)) {
    if (!isObject(saved)) return defaults;
    const result: Record<string, Json> = { ...defaults };
    for (const key of Object.keys(saved)) {
      result[key] = key in defaults ? mergeContent(defaults[key], saved[key]) : saved[key];
    }
    return result as T;
  }
  if (Array.isArray(defaults)) {
    return (Array.isArray(saved) ? saved : defaults) as T;
  }
  return (typeof saved === typeof defaults ? saved : defaults) as T;
}

/** Copie de `root` où la valeur à l'adresse `path` est remplacée (sans modifier l'original). */
export function setIn<T>(root: T, path: readonly (string | number)[], value: Json): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const copy = [...root];
    copy[head as number] = setIn(copy[head as number], rest, value);
    return copy as T;
  }
  const source = (isObject(root) ? root : {}) as Record<string, Json>;
  return { ...source, [head]: setIn(source[head as string], rest, value) } as T;
}

/** La valeur à l'adresse `path`, ou `undefined`. */
export function getIn(root: Json, path: readonly (string | number)[]): Json {
  let current: Json = root;
  for (const step of path) {
    if (Array.isArray(current)) current = current[step as number];
    else if (isObject(current)) current = current[step as string];
    else return undefined;
  }
  return current;
}

/** Un bloc vide pour « Ajouter » dans une liste : chaque champ à vide. */
export function emptyItem(fields: Field[]): Record<string, Json> {
  const item: Record<string, Json> = {};
  for (const field of fields) {
    switch (field.type) {
      case 'list':
      case 'strings':
        item[field.key] = [];
        break;
      case 'group':
        item[field.key] = emptyItem(field.fields);
        break;
      default:
        item[field.key] = '';
    }
  }
  return item;
}

/** Déplace l'élément `from` d'un tableau à la place `to`. */
export function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return [...list];
  const copy = [...list];
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
}
