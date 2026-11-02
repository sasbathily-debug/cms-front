import { describe, expect, it } from 'vitest';
import { ART, CREW, CREW_404, DOODLES, DOODLE_KINDS, DOODLE_KINDS_404 } from './doodle-footer.art';
import {
  Floater,
  clamp,
  hash,
  layoutWord,
  lookAt,
  seatPoint,
  stepFloater,
  timeline,
} from './doodle-footer.logic';

const floater = (over: Partial<Floater> = {}): Floater => ({
  x: 100,
  y: 100,
  vx: 0,
  vy: 0,
  rot: 0,
  vr: 0,
  fall: 20,
  phase: 0,
  pop: 0,
  ...over,
});

describe('doodle-footer / disposition du mot', () => {
  it('place chaque lettre après la précédente, avec l’interlettrage', () => {
    const l = layoutWord([100, 50, 80], -0.1, 200);
    expect(l.x).toEqual([0, 80, 110]);
    expect(l.w).toEqual([100, 50, 80]);
    expect(l.width).toBe(190);
  });

  it('une largeur négative ou non finie compte pour zéro', () => {
    const l = layoutWord([100, NaN, -5, 40], 0, 200);
    expect(l.w).toEqual([100, 0, 0, 40]);
    expect(l.width).toBe(140);
  });

  it('un mot vide ne casse rien', () => {
    expect(layoutWord([], 0, 200)).toEqual({ x: [], w: [], width: 0 });
  });
});

describe('doodle-footer / places des personnages', () => {
  it('debout devant la lettre, au sol', () => {
    expect(seatPoint('front', 100, 80, 140, 0, 1)).toEqual({ x: 140, y: 0 });
  });

  it('assis sur le bord haut de la lettre', () => {
    expect(seatPoint('top', 100, 80, 140, 0.25, 1)).toEqual({ x: 160, y: -140 });
  });

  it('derrière la lettre : seul le haut dépasse', () => {
    const p = seatPoint('behind', 0, 100, 140, 0, 2);
    expect(p.y).toBe(-140 + 60);
  });

  it('un décalage non fini est ignoré', () => {
    expect(seatPoint('front', 0, 100, 140, NaN, 1).x).toBe(50);
  });

  it('chaque personnage a un dessin et des yeux dont la pupille tient dans le blanc', () => {
    for (const m of [...CREW, ...CREW_404]) {
      const art = ART[m.kind];
      expect(art, m.kind).toBeTruthy();
      expect(art.body.length).toBeGreaterThan(50);
      for (const eye of art.eyes) {
        if (eye.r > 0) expect(eye.pupil + eye.max).toBeLessThanOrEqual(eye.r + 0.01);
      }
    }
  });

  it('aucune phrase ne donne de conseil médical (mots interdits)', () => {
    const interdits = /(traitement|médicament|dose|guérir|diagnostic|insuline)/i;
    for (const m of [...CREW, ...CREW_404]) expect(m.says).not.toMatch(interdits);
  });

  it('les petits dessins demandés existent tous', () => {
    for (const k of [...DOODLE_KINDS, ...DOODLE_KINDS_404]) expect(DOODLES[k], k).toBeTruthy();
  });

  it('les personnages de la 404 se posent sur les trois chiffres', () => {
    for (const m of CREW_404) expect(m.letter).toBeLessThanOrEqual(2);
  });
});

describe('doodle-footer / regard', () => {
  it('la pupille se tourne vers la cible sans dépasser le maximum', () => {
    const p = lookAt(0, 0, 1000, 0, 4, 220);
    expect(p.x).toBeCloseTo(4);
    expect(p.y).toBeCloseTo(0);
  });

  it('elle s’adoucit quand la cible est proche', () => {
    const near = lookAt(0, 0, 10, 0, 4, 220);
    expect(near.x).toBeGreaterThan(0);
    expect(near.x).toBeLessThan(0.5);
  });

  it('cible au centre ou maximum nul : la pupille reste au centre', () => {
    expect(lookAt(5, 5, 5, 5, 4, 220)).toEqual({ x: 0, y: 0 });
    expect(lookAt(0, 0, 10, 10, 0, 220)).toEqual({ x: 0, y: 0 });
  });
});

describe('doodle-footer / chute des petits dessins', () => {
  const rand = () => 0.5;

  it('tombe à sa vitesse', () => {
    const f = floater({ vy: 20 });
    stepFloater(f, 0.05, 0, 1000, 500, NaN, NaN, 0, rand);
    expect(f.y).toBeGreaterThan(100);
  });

  it('est repoussé par le curseur', () => {
    const f = floater();
    stepFloater(f, 0.05, 0, 1000, 500, 90, 100, 110, rand);
    expect(f.vx).toBeGreaterThan(0);
  });

  it('revient par le haut quand il sort par le bas', () => {
    const f = floater({ y: 700 });
    stepFloater(f, 0.05, 0, 1000, 500, NaN, NaN, 0, rand);
    expect(f.y).toBe(-40);
    expect(f.x).toBe(500);
  });

  it('éclaté, il attend puis rentre par le haut', () => {
    const f = floater({ pop: 0.04 });
    stepFloater(f, 0.05, 0, 1000, 500, NaN, NaN, 0, rand);
    expect(f.pop).toBe(0);
    expect(f.y).toBe(-40);
  });

  it('un pas de temps absurde est borné', () => {
    const f = floater({ vy: 20 });
    stepFloater(f, 5, 0, 1000, 500, NaN, NaN, 0, rand);
    expect(f.y).toBeLessThan(110);
  });
});

describe('doodle-footer / déroulé', () => {
  it('les lettres se tamponnent de gauche à droite, puis arrivent les personnages, puis les dessins', () => {
    const t = timeline(7, 4);
    expect(t.letter(1)).toBeGreaterThan(t.letter(0));
    expect(t.crewStart).toBeGreaterThan(t.letter(6));
    expect(t.member(1)).toBeGreaterThan(t.member(0));
    expect(t.doodles).toBeGreaterThan(t.crewStart);
  });

  it('zéro lettre ou zéro personnage ne casse rien', () => {
    const t = timeline(0, 0);
    expect(Number.isFinite(t.crewStart)).toBe(true);
    expect(Number.isFinite(t.doodles)).toBe(true);
  });
});

describe('doodle-footer / outils', () => {
  it('hash reste dans [0, 1) et est stable', () => {
    for (let i = 0; i < 50; i++) {
      const h = hash(i);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThan(1);
      expect(hash(i)).toBe(h);
    }
  });

  it('clamp borne', () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-1, 0, 3)).toBe(0);
    expect(clamp(2, 0, 3)).toBe(2);
  });
});
