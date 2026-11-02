import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  ViewEncapsulation,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChildren,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ART, Art, CREW, CrewKind, CrewMember, DOODLES, DOODLE_KINDS } from './doodle-footer.art';
import {
  Floater,
  Seat,
  clamp,
  hash,
  layoutWord,
  lookAt,
  seatPoint,
  stepFloater,
  timeline,
} from './doodle-footer.logic';

const FONT_FAMILY = 'Outfit, sans-serif';
const FONT_WEIGHT = 700;
const FONT_SIZE = 200;
const TRACKING = -0.02;

interface Metrics {
  advances: number[];
  cap: number;
}

interface Placed {
  i: number;
  m: CrewMember;
  art: Art;
  seat: Seat;
  scale: number;
  x: number;
  y: number;
  flip: number;
  transform: string;
  body: SafeHtml;
  front: SafeHtml | null;
  hit: { x: number; y: number; w: number; h: number };
}

interface Gaze {
  tx: number;
  ty: number;
  next: number;
  blinkAt: number;
  blink: number;
  o: { x: number; y: number }[];
}

/** Estimation avant que la vraie police soit mesurée (le mot est remesuré dès que la police est là). */
const estimate = (word: string): Metrics => ({
  advances: Array.from(word).map(
    (c) => (c === ' ' ? 0.42 : /[IJ1]/.test(c) ? 0.42 : /[MW]/.test(c) ? 0.98 : 0.66) * FONT_SIZE,
  ),
  cap: 0.7 * FONT_SIZE,
});

const measure = (word: string): Metrics | null => {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return null;
  ctx.font = `${FONT_WEIGHT} ${FONT_SIZE}px ${FONT_FAMILY}`;
  const chars = Array.from(word);
  const advances: number[] = [];
  let prev = 0;
  for (let i = 0; i < chars.length; i++) {
    const now = ctx.measureText(chars.slice(0, i + 1).join('')).width;
    advances.push(chars[i] === ' ' ? Math.max(now - prev, 0.42 * FONT_SIZE) : now - prev);
    prev = now;
  }
  const box = ctx.measureText(word.replace(/\s/g, '') || 'H');
  return { advances, cap: box.actualBoundingBoxAscent > 0 ? box.actualBoundingBoxAscent : 0.7 * FONT_SIZE };
};

/**
 * Le mot « DR FALL » en grand, au bas du pied de page, comme la dernière page d'un carnet de croquis : il se tamponne
 * lettre par lettre quand le pied de page arrive à l'écran, quatre personnages (pomme, goutte, thyroïde, cœur) s'installent
 * sur les lettres, et de petits dessins tombent en les entourant. Ensuite la scène reste vivante : les yeux suivent le
 * curseur et clignent, une lettre se trémousse au survol, un personnage saute et parle quand on le touche, les dessins
 * éclatent quand on les attrape.
 *
 * Tout est dessiné en SVG, aucune image n'est chargée. Le composant est chargé à la demande (voir `@defer` dans le pied
 * de page). La boucle d'animation ne tourne que lorsque la scène est à l'écran, et rien ne bouge pour les visiteurs qui
 * demandent moins de mouvement.
 */
@Component({
  selector: 'app-doodle-footer',
  imports: [NgTemplateOutlet],
  templateUrl: './doodle-footer.html',
  styleUrl: './doodle-footer.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'dcf',
    '[attr.data-play]': 'play() ? "1" : "0"',
    '(pointermove)': 'track($event)',
    '(pointerdown)': 'track($event)',
    '(pointerleave)': 'sim.inside = false',
  },
})
export class DoodleFooter {
  readonly wordmark = input('DR FALL');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly sanitizer = inject(DomSanitizer);

  /** Dessins des personnages : du contenu écrit dans le dépôt, jamais une donnée externe, donc de confiance. */
  protected readonly bodies = Object.fromEntries(
    (Object.keys(ART) as CrewKind[]).map((k) => [
      k,
      {
        body: this.sanitizer.bypassSecurityTrustHtml(ART[k].body),
        front: ART[k].front ? this.sanitizer.bypassSecurityTrustHtml(ART[k].front as string) : null,
      },
    ]),
  ) as Record<CrewKind, { body: SafeHtml; front: SafeHtml | null }>;
  protected readonly doodleArt = Object.fromEntries(
    Object.entries(DOODLES).map(([k, v]) => [k, this.sanitizer.bypassSecurityTrustHtml(v)]),
  ) as Record<string, SafeHtml>;

  protected readonly play = signal(false);
  protected readonly talking = signal(-1);
  protected readonly hopping = signal(-1);

  private readonly metrics = signal<Metrics>(estimate(this.wordmark()));
  private readonly small = typeof matchMedia !== 'undefined' && matchMedia('(max-width: 700px)').matches;
  private readonly reduced =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  private readonly doodleCount = this.small ? 6 : 10;

  private readonly chars = computed(() => Array.from(this.wordmark().toUpperCase()));
  private readonly layout = computed(() => layoutWord(this.metrics().advances, TRACKING, FONT_SIZE));

  protected readonly placed = computed<Placed[]>(() => {
    const cap = this.metrics().cap;
    const layout = this.layout();
    const count = this.chars().length;
    return CREW.map((m, i) => {
      const art = ART[m.kind];
      const li = clamp(m.letter, 0, count - 1);
      const scale = (cap / 144) * art.k;
      const p = seatPoint(m.seat, layout.x[li], layout.w[li], cap, m.offset, scale);
      const flip = 1;
      const bottom = m.seat === 'behind' ? -30 : art.box.b;
      return {
        i,
        m,
        art,
        seat: m.seat,
        scale,
        x: p.x,
        y: p.y,
        flip,
        body: this.bodies[m.kind].body,
        front: this.bodies[m.kind].front,
        transform: `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) scale(${(scale * flip).toFixed(4)} ${scale.toFixed(4)})`,
        hit: {
          x: p.x + art.box.l * scale,
          y: p.y + art.box.t * scale,
          w: (art.box.r - art.box.l) * scale,
          h: (bottom - art.box.t) * scale,
        },
      };
    });
  });
  protected readonly behind = computed(() => this.placed().filter((p) => p.seat === 'behind'));
  protected readonly others = computed(() => this.placed().filter((p) => p.seat !== 'behind'));

  private readonly view = computed(() => {
    const cap = this.metrics().cap;
    let l = 0;
    let r = this.layout().width;
    let t = -cap;
    let b = 30;
    for (const p of this.placed()) {
      l = Math.min(l, p.x + p.art.box.l * p.scale);
      r = Math.max(r, p.x + p.art.box.r * p.scale);
      t = Math.min(t, p.y + p.art.box.t * p.scale);
      b = Math.max(b, p.y + p.art.box.b * p.scale);
    }
    const pad = 24;
    return { x: l - pad, y: t - pad, w: r - l + pad * 2, h: b - t + pad * 2 };
  });
  protected readonly viewBox = computed(() => {
    const v = this.view();
    return [v.x, v.y, v.w, v.h].map((n) => n.toFixed(1)).join(' ');
  });

  protected readonly tl = computed(() => timeline(this.chars().length, this.placed().length));

  protected readonly letters = computed(() => {
    const layout = this.layout();
    const tl = this.tl();
    return this.chars()
      .map((c, i) => ({
        c,
        i,
        x: layout.x[i],
        delay: tl.letter(i),
        tilt: ((hash(i * 2.3) - 0.5) * 9).toFixed(2) + 'deg',
        dust: `M${layout.x[i] - 6} -6 l-16 -6 M${layout.x[i] - 4} -16 l-12 -12 M${layout.x[i] + layout.w[i] + 6} -6 l16 -6 M${layout.x[i] + layout.w[i] + 4} -16 l12 -12`,
      }))
      .filter((l) => l.c !== ' ');
  });

  /** Ligne de sol tracée à la main, touffes d'herbe et cailloux. */
  protected readonly ground = computed(() => {
    const v = this.view();
    const x0 = v.x + 6;
    const x1 = v.x + v.w - 6;
    let d = 'M' + x0.toFixed(1) + ' 6';
    const n = 14;
    for (let k = 1; k <= n; k++) {
      const x = x0 + ((x1 - x0) * k) / n;
      d +=
        ' Q' + (x - (x1 - x0) / n / 2).toFixed(1) + ' ' + (6 + (hash(k * 3.1) - 0.5) * 5).toFixed(1) + ' ' +
        x.toFixed(1) + ' ' + (6 + (hash(k * 7.7) - 0.5) * 2).toFixed(1);
    }
    let tufts = '';
    for (let k = 0; k < 18; k++) {
      const x = x0 + 20 + hash(k * 11.3) * (x1 - x0 - 40);
      const s = 0.7 + hash(k * 5.9) * 0.6;
      tufts +=
        `M${x.toFixed(1)} 6 l${(2 * s).toFixed(1)} ${(-9 * s).toFixed(1)} ` +
        `M${(x + 3 * s).toFixed(1)} 6 l${(1 * s).toFixed(1)} ${(-12 * s).toFixed(1)} ` +
        `M${(x + 6 * s).toFixed(1)} 6 l${(-1 * s).toFixed(1)} ${(-7 * s).toFixed(1)} `;
    }
    const pebbles = Array.from({ length: 7 }, (_, k) => {
      const r = 2 + hash(k * 9.4) * 2.6;
      return {
        x: x0 + 40 + hash(k * 17.1) * (x1 - x0 - 80),
        y: 14 + hash(k * 2.3) * 8,
        rx: r * 1.5,
        ry: r,
      };
    });
    return { d, tufts, pebbles };
  });

  protected readonly doodleList = computed(() =>
    Array.from({ length: this.doodleCount }, (_, k) => ({
      k,
      kind: DOODLE_KINDS[k % DOODLE_KINDS.length],
      size: 22 + hash(k * 4.7) * 14,
      delay: this.tl().doodles + k * 70,
    })),
  );

  private readonly doodleEls = viewChildren<ElementRef<HTMLElement>>('doodle');

  /** État de la boucle d'animation : modifié à chaque image, hors du cycle de détection de changements. */
  protected readonly sim = {
    floaters: [] as Floater[],
    w: 0,
    h: 0,
    px: NaN,
    py: NaN,
    inside: false,
    visible: false,
    gaze: [] as Gaze[],
    seed: 1,
    start: 0,
  };
  private talkTimer = 0;

  constructor() {
    afterNextRender(() => this.start());
    this.destroyRef.onDestroy(() => window.clearTimeout(this.talkTimer));
  }

  protected track(event: PointerEvent): void {
    this.sim.px = event.clientX;
    this.sim.py = event.clientY;
    this.sim.inside = true;
  }

  protected poke(i: number): void {
    this.talking.set(i);
    this.hopping.set(-1);
    requestAnimationFrame(() => this.hopping.set(i));
    window.clearTimeout(this.talkTimer);
    this.talkTimer = window.setTimeout(() => {
      this.talking.set(-1);
      this.hopping.set(-1);
    }, 2600);
  }

  protected pop(k: number): void {
    const f = this.sim.floaters[k];
    if (f && f.pop <= 0) {
      f.pop = 1.4;
      this.paintDoodles();
    }
  }

  /** Position de la bulle, en pourcentage de la scène. */
  protected bubble(p: Placed): { left: string; top: string; leftSide: boolean } {
    const v = this.view();
    return {
      left: (((p.x - v.x) / v.w) * 100).toFixed(3) + '%',
      top: (((p.y + p.art.box.t * p.scale - 6 - v.y) / v.h) * 100).toFixed(3) + '%',
      leftSide: p.x > v.x + v.w * 0.72,
    };
  }

  private async start(): Promise<void> {
    const el = this.host.nativeElement;
    let alive = true;
    this.destroyRef.onDestroy(() => (alive = false));

    // On attend la vraie police (au plus 1,5 s) pour mesurer le mot, puis on le remesure si elle arrive plus tard.
    const remeasure = () => {
      const m = measure(this.wordmark().toUpperCase());
      if (m && alive) this.metrics.set(m);
    };
    try {
      await Promise.race([
        document.fonts.load(`${FONT_WEIGHT} ${FONT_SIZE}px Outfit`),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);
    } catch {
      // police indisponible : on garde l'estimation
    }
    if (!alive) return;
    remeasure();

    this.layoutDoodles(true);
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => this.layoutDoodles(false));
      ro.observe(el);
      this.destroyRef.onDestroy(() => ro.disconnect());
    }

    const play = () => {
      if (this.play()) return;
      this.sim.start = performance.now();
      this.play.set(true);
    };
    if (this.reduced) {
      this.sim.visible = true;
      play();
    }
    if (typeof IntersectionObserver === 'undefined') {
      this.sim.visible = true;
      play();
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            this.sim.visible = e.isIntersecting;
            if (e.isIntersecting && e.intersectionRatio > 0.12) play();
          }
        },
        { threshold: [0, 0.12, 0.3] },
      );
      io.observe(el);
      this.destroyRef.onDestroy(() => io.disconnect());
    }

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!this.sim.visible || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      this.animate(now, dt);
    };
    raf = requestAnimationFrame(frame);
    this.destroyRef.onDestroy(() => cancelAnimationFrame(raf));
  }

  /** Place les petits dessins une première fois ; au redimensionnement, ils gardent leur place relative. */
  private layoutDoodles(first: boolean): void {
    const rect = this.host.nativeElement.getBoundingClientRect();
    const s = this.sim;
    const ow = s.w;
    const oh = s.h;
    s.w = rect.width;
    s.h = rect.height;
    const n = this.doodleCount;
    if (first || !s.floaters.length) {
      s.floaters = Array.from({ length: n }, (_, k) => ({
        x: (0.04 + 0.92 * ((k + hash(k * 9.1) * 0.8) / n)) * rect.width,
        y: (0.02 + hash(k * 3.3) * 0.56) * rect.height,
        vx: 0,
        vy: 0,
        rot: (hash(k * 1.7) - 0.5) * 50,
        vr: (hash(k * 6.1) - 0.5) * 30,
        fall: 9 + hash(k * 2.9) * 16,
        phase: hash(k * 8.3) * Math.PI * 2,
        pop: 0,
      }));
    } else if (ow && oh) {
      for (const f of s.floaters) {
        f.x *= rect.width / ow;
        f.y *= rect.height / oh;
      }
    }
    this.paintDoodles();
  }

  private paintDoodles(): void {
    const s = this.sim;
    const k = clamp(s.w / 1100, 0.5, 1);
    const els = this.doodleEls();
    for (let i = 0; i < s.floaters.length; i++) {
      const el = els[i]?.nativeElement;
      const f = s.floaters[i];
      if (!el || !f) continue;
      let scale = k;
      let opacity = 1;
      if (f.pop > 0) {
        const age = 1.4 - f.pop;
        scale = k * (1 + Math.min(1, age / 0.3) * 0.7);
        opacity = Math.max(0, 1 - age / 0.3);
      }
      el.style.transform = `translate3d(${f.x.toFixed(1)}px,${f.y.toFixed(1)}px,0) rotate(${f.rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      el.style.opacity = String(opacity);
    }
  }

  private rand(): number {
    this.sim.seed = (this.sim.seed * 16807) % 2147483647;
    return this.sim.seed / 2147483647;
  }

  private svgPoint(cx: number, cy: number): { x: number; y: number } | null {
    const svg = this.host.nativeElement.querySelector<SVGSVGElement>('svg.dcf-svg');
    const m = svg?.getScreenCTM();
    if (!m) return null;
    const inv = m.inverse();
    return { x: inv.a * cx + inv.c * cy + inv.e, y: inv.b * cx + inv.d * cy + inv.f };
  }

  /** Une image : les yeux (regard et clin d'œil) et la chute des petits dessins. */
  private animate(now: number, dt: number): void {
    const s = this.sim;
    const t = now / 1000;
    const root = this.host.nativeElement;
    const placed = this.placed();
    const target = s.inside ? this.svgPoint(s.px, s.py) : null;

    for (let c = 0; c < placed.length; c++) {
      const p = placed[c];
      const g = (s.gaze[c] ||= { tx: 0, ty: 0, next: 0, blinkAt: t + 1 + hash(c * 3.7) * 3, blink: 0, o: [] });
      if (!target && t > g.next) {
        // au repos : un coup d'œil ailleurs, parfois vers un voisin
        const other = placed[(c + 1 + Math.floor(this.rand() * Math.max(1, placed.length - 1))) % placed.length];
        if (other && this.rand() < 0.45) {
          g.tx = other.x;
          g.ty = other.y - 60 * other.scale;
        } else {
          g.tx = p.x + (this.rand() - 0.5) * 900;
          g.ty = p.y - 80 * p.scale + (this.rand() - 0.5) * 500;
        }
        g.next = t + 1.4 + this.rand() * 2.6;
      }
      if (t > g.blinkAt) {
        g.blink = 0.16;
        g.blinkAt = t + 2.2 + this.rand() * 4;
      }
      g.blink = Math.max(0, g.blink - dt);
      const lid = g.blink > 0 ? 0.12 + (Math.abs(g.blink - 0.08) / 0.08) * 0.88 : 1;
      for (let e = 0; e < p.art.eyes.length; e++) {
        const eye = p.art.eyes[e];
        const pupil = root.querySelector(`.dcf-pupil[data-c="${c}"][data-e="${e}"]`);
        const blink = root.querySelector(`.dcf-blink[data-c="${c}"][data-e="${e}"]`);
        if (!pupil || !blink) continue;
        const ex = p.x + eye.x * p.scale * p.flip;
        const ey = p.y + eye.y * p.scale;
        const o = lookAt(ex, ey, target ? target.x : g.tx, target ? target.y : g.ty, eye.max, 220);
        const prev = g.o[e] || { x: 0, y: 0 };
        const ease = Math.min(1, dt * (target ? 14 : 6));
        const nx = prev.x + (o.x * p.flip - prev.x) * ease;
        const ny = prev.y + (o.y - prev.y) * ease;
        g.o[e] = { x: nx, y: ny };
        pupil.setAttribute('transform', `translate(${nx.toFixed(2)} ${ny.toFixed(2)})`);
        blink.setAttribute('transform', `translate(0 ${(eye.y * (1 - lid)).toFixed(2)}) scale(1 ${lid.toFixed(3)})`);
      }
    }

    if (s.floaters.length && this.play() && (now - s.start > this.tl().doodles || this.reduced)) {
      const r = root.getBoundingClientRect();
      const px = s.inside ? s.px - r.left : NaN;
      const py = s.inside ? s.py - r.top : NaN;
      if (!this.reduced) for (const f of s.floaters) stepFloater(f, dt, t, s.w, s.h, px, py, 110, () => this.rand());
      this.paintDoodles();
    }
  }
}
