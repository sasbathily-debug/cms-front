// Calculs purs du mot animé du pied de page : disposition des lettres, places des personnages, regard,
// chute des petits dessins et déroulé de l'animation. Sans DOM, donc testés tels quels (voir le .spec).

/** Petit hasard déterministe dans [0, 1) : la scène est la même à chaque affichage. */
export const hash = (n: number): number => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export const clamp = (v: number, lo: number, hi: number): number => (v < lo ? lo : v > hi ? hi : v);

/**
 * Dispose le mot à partir de la largeur de chaque lettre (en unités de police) : bord gauche de chaque lettre,
 * avec l'interlettrage `tracking` (en em) entre elles, et largeur totale. Une valeur négative ou non finie compte
 * pour zéro : un seul caractère défaillant ne décale pas tout le mot.
 */
export const layoutWord = (
  advances: number[],
  tracking: number,
  fontSize: number,
): { x: number[]; w: number[]; width: number } => {
  const x: number[] = [];
  const w: number[] = [];
  let at = 0;
  const gap = (Number.isFinite(tracking) ? tracking : 0) * fontSize;
  for (let i = 0; i < advances.length; i++) {
    const a = Number.isFinite(advances[i]) && advances[i] > 0 ? advances[i] : 0;
    x.push(at);
    w.push(a);
    at += a + (i < advances.length - 1 ? gap : 0);
  }
  return { x, w, width: Math.max(0, at) };
};

export type Seat = 'front' | 'top' | 'behind';

/**
 * Où se tient un personnage, en unités du mot (ligne de base à y = 0, le haut est négatif).
 * `front` : debout au sol devant la lettre ; `top` : assis sur le bord haut de la lettre ;
 * `behind` : monte derrière la lettre, seul le haut dépasse. `offset` le décale le long de la lettre (en largeurs de lettre).
 */
export const seatPoint = (
  seat: Seat,
  letterX: number,
  letterW: number,
  cap: number,
  offset: number,
  scale: number,
): { x: number; y: number } => {
  const x = letterX + letterW * (0.5 + (Number.isFinite(offset) ? offset : 0));
  if (seat === 'top') return { x, y: -cap };
  if (seat === 'behind') return { x, y: -cap + 30 * scale };
  return { x, y: 0 };
};

/**
 * Où se place la pupille dans l'œil : tournée vers la cible, jamais à plus de `max` du centre, et qui s'adoucit
 * quand la cible est proche (l'œil ne saute pas quand le curseur est sur le visage).
 */
export const lookAt = (
  ex: number,
  ey: number,
  tx: number,
  ty: number,
  max: number,
  reach: number,
): { x: number; y: number } => {
  const dx = tx - ex;
  const dy = ty - ey;
  const d = Math.hypot(dx, dy);
  if (!Number.isFinite(d) || d < 1e-6 || max <= 0) return { x: 0, y: 0 };
  const k = (max * Math.min(1, d / Math.max(1e-6, reach))) / d;
  return { x: dx * k, y: dy * k };
};

export interface Floater {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  fall: number;
  phase: number;
  /** Secondes restantes d'un éclatement ; 0 = le dessin est en vie. */
  pop: number;
}

/**
 * Un pas de la chute d'un petit dessin : il tombe à sa vitesse et se balance, le curseur le repousse dans un rayon
 * `radius`, il reprend sa dérive quand on le lâche, et il revient par le haut quand il sort du cadre. Un dessin éclaté
 * attend la fin de son délai puis rentre par le haut. `rand` fournit le nouvel x à chaque retour.
 */
export const stepFloater = (
  f: Floater,
  dt: number,
  t: number,
  w: number,
  h: number,
  px: number,
  py: number,
  radius: number,
  rand: () => number,
): Floater => {
  const step = clamp(Number.isFinite(dt) ? dt : 0, 0, 0.05);
  const m = 40;
  if (f.pop > 0) {
    f.pop -= step;
    if (f.pop <= 0) {
      f.pop = 0;
      f.x = rand() * w;
      f.y = -m;
      f.vx = 0;
      f.vy = f.fall;
    }
    return f;
  }
  const sway = Math.sin(t * 0.7 + f.phase) * 14;
  if (Number.isFinite(px) && Number.isFinite(py) && radius > 0) {
    const dx = f.x - px;
    const dy = f.y - py;
    const d = Math.hypot(dx, dy);
    if (d < radius && d > 0.01) {
      const k = (1 - d / radius) * (1 - d / radius) * 2400;
      f.vx += (dx / d) * k * step;
      f.vy += (dy / d) * k * step;
      f.vr += (dx > 0 ? 1 : -1) * k * 0.004 * step;
    }
  }
  const ease = Math.min(1, step * 2.4);
  f.vx += (sway - f.vx) * ease;
  f.vy += (f.fall - f.vy) * ease;
  f.vr += (Math.sin(f.phase * 3) * 18 - f.vr) * Math.min(1, step * 0.8);
  f.x += f.vx * step;
  f.y += f.vy * step;
  f.rot = (f.rot + f.vr * step) % 360;
  if (f.y > h + m) {
    f.y = -m;
    f.x = rand() * w;
  } else if (f.y < -m * 3) {
    f.y = h + m;
  }
  if (f.x < -m) f.x = w + m;
  else if (f.x > w + m) f.x = -m;
  return f;
};

/**
 * Le déroulé, en ms depuis l'arrivée du pied de page à l'écran : la ligne de sol se dessine, les lettres se
 * tamponnent de gauche à droite, les personnages arrivent une fois le mot posé, puis les petits dessins.
 */
export const timeline = (letters: number, crew: number) => {
  const L = Math.max(0, Math.floor(letters) || 0);
  const C = Math.max(0, Math.floor(crew) || 0);
  const letter = (i: number) => 160 + i * 80;
  const crewStart = letter(Math.max(0, L - 1)) + 420;
  const member = (j: number) => crewStart + j * 130;
  const doodles = crewStart + Math.max(0, C - 1) * 130 * 0.5;
  return { ground: 60, letter, crewStart, member, doodles };
};
