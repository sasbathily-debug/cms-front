import { describe, expect, it } from 'vitest';
import { masquerBrouillons, nettoyerTexte } from './brouillons';

describe('nettoyerTexte', () => {
  it('retire un repère après une vraie phrase', () => {
    expect(nettoyerTexte("Prise de sang selon votre situation. [À préciser]")).toBe('Prise de sang selon votre situation.');
  });
  it('vide un texte qui n’était qu’un repère', () => {
    expect(nettoyerTexte('[À confirmer par la doctoresse.]')).toBe('');
    expect(nettoyerTexte('[Diplôme]')).toBe('');
  });
  it('retire les guillemets qui entouraient un repère', () => {
    expect(nettoyerTexte('« [Un avis de patient] »')).toBe('');
  });
  it('vide « Depuis » une fois « [année] » retiré', () => {
    expect(nettoyerTexte('Depuis [année]')).toBe('');
  });
  it('vide une suite de repères séparés par des points médians', () => {
    expect(nettoyerTexte('[Ordre des médecins] · [Société] · [Autres]')).toBe('');
  });
  it('ne touche pas un texte sans repère', () => {
    expect(nettoyerTexte('Cité Keur Gorgui, Dakar')).toBe('Cité Keur Gorgui, Dakar');
  });
});

describe('masquerBrouillons', () => {
  it('retire les avis qui ne sont que des repères et garde les vrais', () => {
    const r = masquerBrouillons({
      avis: [
        { texte: '« [Un avis] »', auteur: '[Prénom], [ville]' },
        { texte: 'Très clair, merci.', auteur: 'Fatou, Dakar' },
      ],
    });
    expect(r.avis).toEqual([{ texte: 'Très clair, merci.', auteur: 'Fatou, Dakar' }]);
  });
  it('retire une question dont la réponse n’est qu’un repère', () => {
    const r = masquerBrouillons({ faq: [{ question: 'Combien ça coûte ?', reponse: '[À confirmer]' }, { question: 'Où ?', reponse: 'À Dakar.' }] });
    expect(r.faq.map((q) => q.question)).toEqual(['Où ?']);
  });
  it('retire les étapes d’un parcours dont dates et lieux sont des repères, garde la dernière', () => {
    const r = masquerBrouillons({
      items: [
        { periode: '[Années]', titre: 'Doctorat en médecine', lieu: '[Université, ville, pays]' },
        { periode: 'Depuis [année]', titre: "Cabinet d'endocrinologie", lieu: 'Cité Keur Gorgui, Dakar' },
      ],
    });
    expect(r.items).toEqual([{ periode: '', titre: "Cabinet d'endocrinologie", lieu: 'Cité Keur Gorgui, Dakar' }]);
  });
  it('retire une carte dont le texte principal n’est qu’un repère', () => {
    const r = masquerBrouillons({ cartes: [{ sym: 'Hy', titre: 'Hygiène', texte: "[Engagements d'hygiène : à compléter]" }] });
    expect(r.cartes).toEqual([]);
  });
  it('ne modifie pas l’objet d’origine', () => {
    const d = { a: 'Texte. [À préciser]' };
    masquerBrouillons(d);
    expect(d.a).toBe('Texte. [À préciser]');
  });
  it('laisse intacts les nombres, booléens et listes de chaînes sans repère', () => {
    expect(masquerBrouillons({ n: 3, b: true, l: ['a', 'b'] })).toEqual({ n: 3, b: true, l: ['a', 'b'] });
  });
});
