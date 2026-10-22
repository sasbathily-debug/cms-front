import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import type { Body3D } from './silhouette-tour-3d';
import { CX, TABLES, WAIST, WAIST_Y } from './silhouette-tour.data';

const VIEWS = [
  { id: 'face', label: 'Face', full: 'Vue de face', angle: 0 },
  { id: 'profil', label: 'Profil', full: 'Vue de profil', angle: 90 },
  { id: 'dos', label: 'Dos', full: 'Vue de dos', angle: 180 },
] as const;

/**
 * Silhouette qu'on fait tourner (glisser, flèches ou boutons Face / Profil / Dos), avec le repère du
 * tour de taille. Le corps est une pile de coupes elliptiques (largeur de face, épaisseur de profil).
 * Version de base : projection en SVG (aucune librairie). Dès que la silhouette est visible et que le
 * navigateur sait faire de la 3D, la vraie scène three.js est chargée à la demande et prend le relais.
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

  /** « svg » tant que la 3D n'est pas chargée (ou impossible), puis « 3d ». */
  readonly mode = signal<'svg' | '3d'>('svg');
  /** Hauteur de l'étiquette « Tour de taille » (unités du dessin). */
  readonly labelY = signal(WAIST_Y);

  private readonly stage = viewChild<ElementRef<HTMLCanvasElement>>('stage');
  private engine: Body3D | null = null;
  private loading3d = false;

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
        if (this.visible) void this.load3d();
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
        this.engine?.dispose();
        this.engine = null;
      });
    });

    effect(() => {
      const a = this.angle();
      this.engine?.setAngle(a);
    });
  }

  /** Charge la scène 3D à la demande (module séparé, jamais dans le premier chargement du site). */
  private async load3d(): Promise<void> {
    const canvas = this.stage()?.nativeElement;
    if (this.loading3d || this.engine || !canvas) return;
    this.loading3d = true;
    try {
      const { createBody3D } = await import('./silhouette-tour-3d');
      const engine = createBody3D(canvas);
      if (!engine) return;
      this.engine = engine;
      engine.setAngle(this.angle());
      this.labelY.set(engine.waistScreenY);
      this.mode.set('3d');
    } catch {
      // Pas de 3D (navigateur ou réseau) : la version SVG reste affichée.
    }
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
