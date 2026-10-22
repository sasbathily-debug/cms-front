import { emptyItem, getIn, mergeContent, moveItem, setIn, Field } from './fields';

describe('mergeContent', () => {
  const defaults = {
    titre: 'Titre',
    texte: 'Texte',
    groupe: { a: 'A', b: 'B' },
    liste: [{ nom: 'un' }, { nom: 'deux' }],
  };

  it('garde les textes d’origine quand rien n’est saisi', () => {
    expect(mergeContent(defaults, null)).toEqual(defaults);
    expect(mergeContent(defaults, undefined)).toEqual(defaults);
    expect(mergeContent(defaults, {})).toEqual(defaults);
  });

  it('remplace seulement les champs saisis', () => {
    const merged = mergeContent(defaults, { titre: 'Nouveau', groupe: { a: 'Autre' } });
    expect(merged.titre).toBe('Nouveau');
    expect(merged.texte).toBe('Texte');
    expect(merged.groupe).toEqual({ a: 'Autre', b: 'B' });
  });

  it('laisse vide un champ vidé volontairement', () => {
    expect(mergeContent(defaults, { texte: '' }).texte).toBe('');
  });

  it('remplace une liste en entier', () => {
    const merged = mergeContent(defaults, { liste: [{ nom: 'seul' }] });
    expect(merged.liste).toEqual([{ nom: 'seul' }]);
    expect(mergeContent(defaults, { liste: [] }).liste).toEqual([]);
  });

  it('ignore une valeur d’un autre type', () => {
    expect(mergeContent(defaults, { titre: 12, liste: 'oups', groupe: 'non' })).toEqual(defaults);
  });

  it('ne modifie jamais les textes d’origine', () => {
    const copy = JSON.parse(JSON.stringify(defaults));
    mergeContent(defaults, { titre: 'X', liste: [] });
    expect(defaults).toEqual(copy);
  });
});

describe('setIn / getIn', () => {
  const root = { a: { b: [{ c: 1 }, { c: 2 }] } };

  it('remplace une valeur imbriquée sans toucher à l’original', () => {
    const next = setIn(root, ['a', 'b', 1, 'c'], 9);
    expect(getIn(next, ['a', 'b', 1, 'c'])).toBe(9);
    expect(getIn(root, ['a', 'b', 1, 'c'])).toBe(2);
    expect(next.a.b[0]).toBe(root.a.b[0]);
  });

  it('crée les niveaux manquants', () => {
    expect(getIn(setIn({}, ['x', 'y'], 'z'), ['x', 'y'])).toBe('z');
  });

  it('lit undefined quand l’adresse n’existe pas', () => {
    expect(getIn(root, ['a', 'zz', 0])).toBeUndefined();
  });
});

describe('emptyItem / moveItem', () => {
  it('prépare un bloc vide avec tous ses champs', () => {
    const fields: Field[] = [
      { key: 'titre', label: 'Titre', type: 'text' },
      { key: 'lignes', label: 'Lignes', type: 'strings', itemLabel: 'ligne' },
      {
        key: 'sous',
        label: 'Sous',
        type: 'group',
        fields: [{ key: 'a', label: 'A', type: 'text' }],
      },
    ];
    expect(emptyItem(fields)).toEqual({ titre: '', lignes: [], sous: { a: '' } });
  });

  it('déplace un élément et reste dans les bornes', () => {
    expect(moveItem([1, 2, 3], 0, 1)).toEqual([2, 1, 3]);
    expect(moveItem([1, 2, 3], 2, 0)).toEqual([3, 1, 2]);
    expect(moveItem([1, 2, 3], 0, -1)).toEqual([1, 2, 3]);
    expect(moveItem([1, 2, 3], 2, 3)).toEqual([1, 2, 3]);
  });
});
