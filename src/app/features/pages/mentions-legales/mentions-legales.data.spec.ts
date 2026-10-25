import { MENTIONS, MENTIONS_RESUME } from './mentions-legales.data';

describe('mentions légales', () => {
  it('a des sections avec un identifiant unique et un contenu', () => {
    const ids = MENTIONS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of MENTIONS) {
      const contenu = (s.intro?.length ?? 0) + (s.lignes?.length ?? 0) + (s.points?.length ?? 0);
      expect(contenu, s.id).toBeGreaterThan(0);
    }
    expect(MENTIONS_RESUME.length).toBe(4);
  });

  it('couvre ce que la loi demande d’afficher : éditeur, hébergeur, propriété, responsabilité', () => {
    const ids = MENTIONS.map((s) => s.id);
    for (const attendu of ['editeur', 'hebergement', 'propriete', 'responsabilite', 'droit']) {
      expect(ids).toContain(attendu);
    }
  });
});
