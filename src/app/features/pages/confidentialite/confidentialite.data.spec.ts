import { POLITIQUE, POLITIQUE_EN_BREF } from './confidentialite.data';

describe('politique de confidentialité', () => {
  it('a des sections avec un identifiant unique et un contenu', () => {
    const ids = POLITIQUE.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of POLITIQUE) {
      expect(s.titre.length).toBeGreaterThan(0);
      const contenu = (s.intro?.length ?? 0) + (s.lignes?.length ?? 0) + (s.points?.length ?? 0);
      expect(contenu).toBeGreaterThan(0);
    }
  });

  it('couvre ce que le site fait : rendez-vous, compte, documents, cookies, prestataires, droits', () => {
    const ids = POLITIQUE.map((s) => s.id);
    for (const attendu of [
      'donnees',
      'sante',
      'cookies',
      'destinataires',
      'duree',
      'droits',
      'securite',
    ]) {
      expect(ids).toContain(attendu);
    }
    expect(POLITIQUE_EN_BREF.length).toBe(4);
  });

  it('nomme chaque cookie ou stockage que le site utilise', () => {
    const cookies = POLITIQUE.find((s) => s.id === 'cookies')!;
    const texte = cookies.lignes!.map((l) => l.nom).join(' ');
    for (const nom of [
      'access_token',
      'refresh_token',
      'XSRF-TOKEN',
      'analytics-consent',
      'theme',
      '_ga',
    ]) {
      expect(texte).toContain(nom);
    }
  });
});
