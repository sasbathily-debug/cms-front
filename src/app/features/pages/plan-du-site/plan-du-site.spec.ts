import { routes } from '../../../app.routes';
import { PLAN } from './plan-du-site';

describe('plan du site', () => {
  const chemins = routes.map((r) => r.path ?? '');

  /** Une adresse du plan correspond à une page déclarée (les pages de spécialité passent par `specialites/:slug`). */
  const existe = (route: string): boolean => {
    const chemin = route.replace(/^\//, '');
    return (
      chemins.includes(chemin) ||
      (chemin.startsWith('specialites/') && chemins.includes('specialites/:slug'))
    );
  };

  it('ne liste que des pages qui existent', () => {
    for (const group of PLAN) {
      for (const link of group.links) {
        expect(existe(link.route), `${link.label} -> ${link.route}`).toBe(true);
      }
    }
  });

  it("n'a pas deux fois la même adresse", () => {
    const adresses = PLAN.flatMap((g) => g.links.map((l) => l.route));
    expect(new Set(adresses).size).toBe(adresses.length);
  });

  it('présente les trois pages légales du pied de page', () => {
    const adresses = PLAN.flatMap((g) => g.links.map((l) => l.route));
    for (const route of ['/mentions-legales', '/politique-de-confidentialite', '/plan-du-site']) {
      expect(adresses).toContain(route);
    }
  });
});
