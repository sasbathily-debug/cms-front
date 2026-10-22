import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';

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

const CX = 120;
const WAIST_Y = 190;
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

interface Sample {
  y: number;
  a: number;
  b: number;
  z: number;
  c: number;
}

const TABLES: { side: -1 | 0 | 1; samples: Sample[] }[] = PARTS.map((part) => {
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

const WAIST = {
  a: interpolate(TORSO, WAIST_Y, 'a'),
  b: interpolate(TORSO, WAIST_Y, 'b'),
  z: interpolate(TORSO, WAIST_Y, 'z'),
};

const VIEWS = [
  { id: 'face', label: 'Face', full: 'Vue de face', angle: 0 },
  { id: 'profil', label: 'Profil', full: 'Vue de profil', angle: 90 },
  { id: 'dos', label: 'Dos', full: 'Vue de dos', angle: 180 },
] as const;

/**
 * Silhouette qu'on fait tourner (glisser, flèches ou boutons Face / Profil / Dos), avec le repère du
 * tour de taille. Pseudo-3D : le corps est une pile de coupes elliptiques (largeur de face, épaisseur
 * de profil) projetées selon l'angle ; aucune librairie ni modèle 3D, donc très léger.
 */
@Component({
  selector: 'app-silhouette-tour',
  templateUrl: './silhouette-tour.html',
})
export class SilhouetteTour {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly views = VIEWS;
  readonly cx = CX;
  readonly waistY = WAIST_Y;

  /** Angle de rotation en degrés : 0 = de face, 90 = de profil, 180 = de dos. */
  readonly angle = signal(20);
  readonly hintVisible = signal(true);

  private dragging = false;
  private lastX = 0;
  private auto = true;
  private visible = false;
  private reduceMotion = false;
  private tween: { from: number; to: number; start: number } | null = null;

  readonly view = computed(() => {
    const a = this.angle();
    if (a < 45 || a >= 315) return VIEWS[0];
    if (a < 135 || a >= 225) return VIEWS[1];
    return VIEWS[2];
  });

  readonly body = computed(() => {
    const rad = (this.angle() * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    let d = '';
    for (const table of TABLES) {
      const left: string[] = [];
      const right: string[] = [];
      for (const s of table.samples) {
        const centre = CX + table.side * s.c * cos + s.z * sin;
        const half = Math.hypot(s.a * cos, s.b * sin);
        left.push(`${(centre - half).toFixed(1)} ${s.y}`);
        right.push(`${(centre + half).toFixed(1)} ${s.y}`);
      }
      d += `M${left.join('L')}L${right.reverse().join('L')}Z`;
    }
    return d;
  });

  /** Anneau du tour de taille : demi-ellipse avant pleine, demi-ellipse arrière en pointillés. */
  readonly ring = computed(() => {
    const rad = (this.angle() * Math.PI) / 180;
    const x = CX + WAIST.z * Math.sin(rad);
    const rx = Math.hypot(WAIST.a * Math.cos(rad), WAIST.b * Math.sin(rad)) + 3;
    const ry = 7;
    return {
      front: `M${(x - rx).toFixed(1)} ${WAIST_Y}A${rx.toFixed(1)} ${ry} 0 0 0 ${(x + rx).toFixed(1)} ${WAIST_Y}`,
      back: `M${(x - rx).toFixed(1)} ${WAIST_Y}A${rx.toFixed(1)} ${ry} 0 0 1 ${(x + rx).toFixed(1)} ${WAIST_Y}`,
      right: x + rx,
    };
  });

  /** Les repères du plateau défilent avec la rotation. */
  readonly baseOffset = computed(() => -this.angle() * 0.9);

  constructor() {
    afterNextRender(() => {
      this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.auto = !this.reduceMotion;

      const observer = new IntersectionObserver(([entry]) => {
        this.visible = entry.isIntersecting;
      });
      observer.observe(this.host.nativeElement);

      let frame = 0;
      let previous = performance.now();
      const loop = (now: number): void => {
        const dt = Math.min(64, now - previous);
        previous = now;
        if (this.visible) {
          if (this.tween) {
            const t = Math.min(1, (now - this.tween.start) / 650);
            const eased = 1 - Math.pow(1 - t, 3);
            this.setAngle(this.tween.from + (this.tween.to - this.tween.from) * eased);
            if (t >= 1) this.tween = null;
          } else if (this.auto && !this.dragging) {
            this.setAngle(this.angle() + dt * 0.022);
          }
        }
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);

      this.destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame);
        observer.disconnect();
      });
    });
  }

  private setAngle(value: number): void {
    this.angle.set(((value % 360) + 360) % 360);
  }

  private takeControl(): void {
    this.auto = false;
    this.hintVisible.set(false);
  }

  pointerDown(event: PointerEvent): void {
    this.takeControl();
    this.tween = null;
    this.dragging = true;
    this.lastX = event.clientX;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  pointerMove(event: PointerEvent): void {
    if (!this.dragging) return;
    this.setAngle(this.angle() - (event.clientX - this.lastX) * 0.7);
    this.lastX = event.clientX;
  }

  pointerUp(): void {
    this.dragging = false;
  }

  /** Tourne d'un cran (flèches du clavier ou boutons). */
  nudge(delta: number): void {
    this.takeControl();
    this.turnTo(this.angle() + delta);
  }

  /** Va vers une vue précise par le chemin le plus court. */
  show(target: number): void {
    this.takeControl();
    const current = this.angle();
    const diff = ((((target - current) % 360) + 540) % 360) - 180;
    this.turnTo(current + diff);
  }

  private turnTo(target: number): void {
    if (this.reduceMotion) {
      this.setAngle(target);
      return;
    }
    this.tween = { from: this.angle(), to: target, start: performance.now() };
  }

  onKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.nudge(-45);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.nudge(45);
    }
  }
}
