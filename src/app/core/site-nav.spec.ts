import { NAV_GROUPS } from './site-nav';

describe('menu du site', () => {
  it('chaque panneau a un lien au bas et au moins une carte', () => {
    for (const group of NAV_GROUPS) {
      expect(group.foot?.label, group.key).toBeTruthy();
      expect(group.foot?.route.startsWith('/'), group.key).toBe(true);
      expect(group.cards?.length, group.key).toBeGreaterThan(0);
    }
  });

  it("n'a pas de carte qui fait doublon avec le bouton « Prendre rendez-vous » du bas du panneau", () => {
    for (const group of NAV_GROUPS) {
      for (const card of group.cards ?? []) {
        expect(card.route, `${group.key} / ${card.title}`).not.toBe('/rendez-vous');
      }
    }
  });
});
