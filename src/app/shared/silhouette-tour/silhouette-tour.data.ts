/** Données du corps : coupes elliptiques (largeur de face, épaisseur de profil) du haut vers le bas. */
interface Key {
  /** Hauteur (px dans le dessin). */
  y: number;
  /** Demi-largeur vue de face. */
  a: number;
  /** Demi-épaisseur vue de profil. */
  b: number;
  /** Décalage vers l'avant (positif) ou l'arrière du centre de la coupe. */
  z: number;
  /** Écart latéral du centre de la coupe (bras et jambes), vue de face. */
  c?: number;
}

interface Part {
  keys: Key[];
  /** 0 : pièce centrale ; ±1 : pièce à gauche ou à droite (jambe, bras). */
  side: -1 | 0 | 1;
}

const TORSO: Key[] = [
  { y: 14, a: 0, b: 0, z: 0 },
  { y: 22, a: 14, b: 16, z: 1 },
  { y: 38, a: 18, b: 21, z: 1 },
  { y: 54, a: 15, b: 18, z: 2 },
  { y: 64, a: 9, b: 11, z: 3 },
  { y: 70, a: 7, b: 8, z: 0 },
  { y: 84, a: 8, b: 9, z: 0 },
  { y: 94, a: 26, b: 12, z: 0 },
  { y: 104, a: 44, b: 16, z: 0 },
  { y: 118, a: 37, b: 19, z: 1 },
  { y: 140, a: 34, b: 21, z: 3 },
  { y: 165, a: 30, b: 20, z: 2 },
  { y: 190, a: 29, b: 21, z: 5 },
  { y: 215, a: 33, b: 22, z: 3 },
  { y: 240, a: 38, b: 24, z: -1 },
  { y: 262, a: 36, b: 24, z: -3 },
  { y: 280, a: 20, b: 20, z: -1 },
  { y: 288, a: 0, b: 0, z: 0 },
];

const NOSE: Key[] = [
  { y: 38, a: 0, b: 0, z: 0 },
  { y: 44, a: 1.5, b: 4, z: 23 },
  { y: 50, a: 0, b: 0, z: 0 },
];

const LEG: Key[] = [
  { y: 262, a: 0, b: 0, z: -1, c: 15 },
  { y: 268, a: 17, b: 20, z: -1, c: 15 },
  { y: 300, a: 16, b: 18, z: 0, c: 15 },
  { y: 340, a: 13, b: 15, z: 0, c: 14 },
  { y: 360, a: 10, b: 12, z: 0, c: 13 },
  { y: 380, a: 9, b: 12, z: -2, c: 13 },
  { y: 410, a: 7, b: 9, z: -1, c: 13 },
  { y: 432, a: 6, b: 8, z: 0, c: 13 },
  { y: 440, a: 7, b: 13, z: 6, c: 13 },
  { y: 447, a: 0, b: 0, z: 6, c: 13 },
];

const ARM: Key[] = [
  { y: 98, a: 0, b: 0, z: 0, c: 42 },
  { y: 104, a: 10, b: 11, z: 0, c: 42 },
  { y: 122, a: 9, b: 10, z: 0, c: 44 },
  { y: 150, a: 8, b: 9, z: 0, c: 46 },
  { y: 175, a: 7, b: 8, z: 0, c: 47 },
  { y: 205, a: 7, b: 8, z: 0, c: 48 },
  { y: 232, a: 6, b: 7, z: 0, c: 48 },
  { y: 252, a: 6, b: 8, z: 1, c: 48 },
  { y: 262, a: 0, b: 0, z: 1, c: 48 },
];

const PARTS: Part[] = [
  { keys: TORSO, side: 0 },
  { keys: NOSE, side: 0 },
  { keys: LEG, side: -1 },
  { keys: LEG, side: 1 },
  { keys: ARM, side: -1 },
  { keys: ARM, side: 1 },
];

export const CX = 120;
export const WAIST_Y = 190;
const STEP = 2;

type Field = 'a' | 'b' | 'z' | 'c';

/** Interpolation cubique entre deux repères (tangentes calculées sur les voisins). */
function interpolate(keys: Key[], y: number, field: Field): number {
  const value = (k: Key): number => k[field] ?? 0;
  let i = 0;
  while (i < keys.length - 2 && y > keys[i + 1].y) i++;
  const k0 = keys[i];
  const k1 = keys[i + 1];
  const h = k1.y - k0.y;
  const t = Math.min(1, Math.max(0, (y - k0.y) / h));
  const slope = (j: number): number => {
    const prev = keys[Math.max(0, j - 1)];
    const next = keys[Math.min(keys.length - 1, j + 1)];
    return (value(next) - value(prev)) / (next.y - prev.y);
  };
  const t2 = t * t;
  const t3 = t2 * t;
  const out =
    (2 * t3 - 3 * t2 + 1) * value(k0) +
    (t3 - 2 * t2 + t) * h * slope(i) +
    (-2 * t3 + 3 * t2) * value(k1) +
    (t3 - t2) * h * slope(i + 1);
  return field === 'a' || field === 'b' ? Math.max(0, out) : out;
}

export interface Sample {
  y: number;
  a: number;
  b: number;
  z: number;
  c: number;
}

export const TABLES: { side: -1 | 0 | 1; samples: Sample[] }[] = PARTS.map((part) => {
  const first = part.keys[0].y;
  const last = part.keys[part.keys.length - 1].y;
  const samples: Sample[] = [];
  for (let y = first; y <= last; y += STEP) {
    samples.push({
      y,
      a: interpolate(part.keys, y, 'a'),
      b: interpolate(part.keys, y, 'b'),
      z: interpolate(part.keys, y, 'z'),
      c: interpolate(part.keys, y, 'c'),
    });
  }
  return { side: part.side, samples };
});

export const WAIST = {
  a: interpolate(TORSO, WAIST_Y, 'a'),
  b: interpolate(TORSO, WAIST_Y, 'b'),
  z: interpolate(TORSO, WAIST_Y, 'z'),
};
