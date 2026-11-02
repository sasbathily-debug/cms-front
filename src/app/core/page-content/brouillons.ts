/**
 * Les textes d'origine du site contiennent des repères entre crochets (« [Diplôme] », « [À préciser] ») que la doctoresse
 * doit remplir depuis l'admin. Tant qu'ils ne le sont pas, le visiteur ne doit jamais les voir : ce module les retire des
 * textes affichés sur le site public (l'admin, lui, montre toujours le texte d'origine pour qu'on puisse le compléter).
 *
 *  - un repère placé après une vraie phrase disparaît, la phrase reste ;
 *  - un texte qui n'était qu'un repère devient vide ;
 *  - un élément d'une liste (un avis, une étape, une question) est retiré quand la moitié de ses champs, ou son champ
 *    principal (texte, réponse, nom…), n'étaient que des repères : pas de carte à moitié vide, pas de question sans réponse.
 */

const REPERE = /\s*\[[^\]]*\]/g;
const CHAMPS_PRINCIPAUX = new Set(['texte', 'text', 'reponse', 'answer', 'auteur', 'nom', 'question']);

/** Un texte ne gardant presque rien après le retrait des repères (« Depuis ») n'a plus de sens : il est vidé. */
const TROP_COURT = 8;

export function nettoyerTexte(texte: string): string {
  if (!/\[[^\]]*\]/.test(texte)) return texte;
  const reste = texte
    .replace(REPERE, '')
    .replace(/«\s*»/g, '')
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return reste.replace(/[\s.·,;:\-–—«»]/g, '').length < TROP_COURT ? '' : reste;
}

const estObjet = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Nettoie une valeur ; `retire` est vrai pour un élément de liste qui doit disparaître. */
function nettoyer(valeur: unknown): { valeur: unknown; retire: boolean } {
  if (typeof valeur === 'string') {
    const propre = nettoyerTexte(valeur);
    return { valeur: propre, retire: propre === '' && valeur !== '' };
  }
  if (Array.isArray(valeur)) {
    const items: unknown[] = [];
    for (const item of valeur) {
      const r = nettoyer(item);
      if (!r.retire) items.push(r.valeur);
    }
    return { valeur: items, retire: false };
  }
  if (estObjet(valeur)) {
    const sortie: Record<string, unknown> = {};
    let avant = 0;
    let touches = 0;
    let principalVide = false;
    for (const [cle, v] of Object.entries(valeur)) {
      if (typeof v === 'string' && v !== '') {
        avant += 1;
        const propre = nettoyerTexte(v);
        if (propre === '') {
          touches += 1;
          if (CHAMPS_PRINCIPAUX.has(cle)) principalVide = true;
        }
        sortie[cle] = propre;
      } else {
        sortie[cle] = nettoyer(v).valeur;
      }
    }
    const retire = avant > 0 && (touches / avant >= 0.5 || principalVide);
    return { valeur: sortie, retire };
  }
  return { valeur, retire: false };
}

/** Le contenu d'une page tel que le visiteur doit le voir : sans repère à compléter. */
export function masquerBrouillons<T>(contenu: T): T {
  return nettoyer(contenu).valeur as T;
}
