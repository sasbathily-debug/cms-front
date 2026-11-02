import { MALADIE_DEFS } from '../../../core/page-content/defs/maladies';
import { SPECIALTIES } from '../../../core/specialties';
import { SPECIALTY_LINKS } from '../../../core/site-nav';
import { MALADIES } from './maladies.data';

describe('pages de spécialités', () => {
  const slugs = Object.keys(MALADIES);

  it('chaque contenu a sa définition de page, avec le même identifiant', () => {
    expect(Object.keys(MALADIE_DEFS).sort()).toEqual([...slugs].sort());
    for (const slug of slugs) {
      expect(MALADIES[slug].slug).toBe(slug);
      expect(MALADIE_DEFS[slug].route).toBe(`/specialites/${slug}`);
    }
  });

  it("chaque page a une illustration d'en-tête ou, à défaut, des repères à afficher à la place", () => {
    for (const slug of slugs) {
      const c = MALADIES[slug];
      expect(!!c.heroArt || (c.heroPoints?.length ?? 0) > 0).toBe(true);
    }
  });

  it('chaque page est complète : signes, examens, conseils, questions', () => {
    for (const slug of slugs) {
      const c = MALADIES[slug];
      expect(c.definition.cards.length).toBeGreaterThan(0);
      expect(c.signes.items.length).toBeGreaterThan(0);
      expect(c.priseEnCharge.examens.length).toBeGreaterThan(0);
      expect(c.quotidien.length).toBeGreaterThan(0);
      expect(c.faq.length).toBeGreaterThan(0);
      expect(c.urgence.trim().length).toBeGreaterThan(0);
    }
  });

  it('les six spécialités et le menu pointent chacune vers une page qui existe', () => {
    const routes = [...SPECIALTIES.map((s) => s.route), ...SPECIALTY_LINKS.map((l) => l.route)];
    expect(routes).toHaveLength(12);
    for (const route of routes) {
      expect(slugs).toContain(route.replace('/specialites/', ''));
    }
  });

  it('la page nutrition affiche les deux formules avec leurs tarifs officiels', () => {
    const offres = MALADIES['nutrition-clinique'].offres;
    expect(offres?.items.map((o) => o.nom)).toEqual([
      'Consultation nutritionnelle',
      'Accompagnement nutritionnel',
    ]);
    expect(offres?.items.map((o) => o.prix.replace(/\u00a0/g, ' '))).toEqual([
      '35 000 FCFA',
      '90 000 FCFA',
    ]);
    for (const o of offres?.items ?? []) {
      expect(o.paragraphes.length).toBeGreaterThan(0);
      expect(o.inclus.length).toBeGreaterThan(0);
    }
  });
});
