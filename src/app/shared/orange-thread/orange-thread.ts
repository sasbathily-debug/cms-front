import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  signal,
  viewChild,
} from '@angular/core';

interface ThreadNode {
  x: number;
  y: number;
  on: boolean;
}

const DESKTOP_MIN_WIDTH = 1024;
const EDGE = 22;
const CROSSING = 120;

/**
 * Le fil orange : un trait qui longe les bords de la page, passe d'un côté à l'autre entre deux
 * sections et se dessine au fil du défilement. À poser en premier enfant d'un bloc `relative`
 * qui contient des `<section>` : il se calcule à partir de leur position (et se recalcule
 * quand la page change de taille). Sur téléphone, c'est un simple trait sur le bord gauche.
 *
 * Fluidité : le défilement ne passe plus par des signaux ni par un recalcul du tracé à chaque image.
 *  - Téléphone : le trait dessiné est une barre qui s'allonge par `transform: scaleY` (composée par la carte graphique,
 *    sans aucun repeint du grand SVG), et sa longueur se calcule d'un coup, sans mesurer le tracé.
 *  - Ordinateur : le tracé est échantillonné une fois (table longueur/hauteur) ; à chaque image, une recherche dans
 *    la table et une seule écriture de `stroke-dashoffset`.
 *  - Les pastilles ne sont redessinées que lorsque l'une d'elles change d'état.
 */
@Component({
  selector: 'app-orange-thread',
  template: `
    @if (straight()) {
      <!-- Téléphone : que des éléments simples (aucun SVG de la hauteur de la page), le trait avance par transform -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute z-[3] w-[3px] rounded-full bg-accent-500/20"
        style="left: 8.5px"
        [style.top.px]="barTop()"
        [style.height.px]="barHeight()"
      ></div>
      <div
        #bar
        aria-hidden="true"
        class="pointer-events-none absolute z-[3] w-1 origin-top rounded-full bg-accent-500 will-change-transform"
        style="left: 8px; transform: scaleY(0)"
        [style.top.px]="barTop()"
        [style.height.px]="barHeight()"
      ></div>
      @for (node of nodes(); track $index) {
        <span
          aria-hidden="true"
          class="pointer-events-none absolute z-[4] box-border h-[21px] w-[21px] rounded-full border-[3px] border-peach-pale bg-accent-500 transition duration-500"
          style="left: -0.5px"
          [style.top.px]="node.y - 10.5"
          [class]="node.on ? 'scale-100 opacity-100' : 'scale-[0.3] opacity-0'"
        ></span>
      }
      @if (end(); as e) {
        <span
          aria-hidden="true"
          class="pointer-events-none absolute z-[4] flex h-8 w-8 items-center justify-center rounded-full bg-accent-500/25 transition-opacity duration-500"
          style="left: -6px"
          [style.top.px]="e.y - 16"
          [class]="e.on ? 'opacity-100' : 'opacity-0'"
        >
          <span
            class="box-border h-[22px] w-[22px] rounded-full border-4 border-accent-500 bg-peach-pale"
          ></span>
        </span>
      }
    } @else {
      <svg
        class="pointer-events-none absolute left-0 top-0 z-[3] overflow-visible"
        aria-hidden="true"
        [attr.width]="width()"
        [attr.height]="height()"
        [attr.viewBox]="'0 0 ' + width() + ' ' + height()"
      >
        <path
          #base
          [attr.d]="path()"
          fill="none"
          stroke="rgba(224,135,63,0.22)"
          stroke-width="3"
          stroke-linecap="round"
        />
        <path
          #draw
          [attr.d]="path()"
          pathLength="1"
          fill="none"
          stroke="var(--color-accent-500)"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-dasharray="1"
          stroke-dashoffset="1"
        />
        @for (node of nodes(); track $index) {
          <circle
            [attr.cx]="node.x"
            [attr.cy]="node.y"
            r="9"
            fill="var(--color-accent-500)"
            stroke="var(--color-peach-pale)"
            stroke-width="3"
            class="origin-center transition duration-500 [transform-box:fill-box]"
            [class]="node.on ? 'scale-100 opacity-100' : 'scale-[0.3] opacity-0'"
          />
        }
        @if (end(); as e) {
          <g [class]="e.on ? 'opacity-100' : 'opacity-0'" class="transition-opacity duration-500">
            <circle [attr.cx]="e.x" [attr.cy]="e.y" r="16" fill="rgba(224,135,63,0.25)" />
            <circle
              [attr.cx]="e.x"
              [attr.cy]="e.y"
              r="9"
              fill="var(--color-peach-pale)"
              stroke="var(--color-accent-500)"
              stroke-width="4"
            />
          </g>
        }
      </svg>
    }
  `,
})
export class OrangeThread implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly base = viewChild<ElementRef<SVGPathElement>>('base');
  private readonly draw = viewChild<ElementRef<SVGPathElement>>('draw');
  private readonly bar = viewChild<ElementRef<HTMLElement>>('bar');

  readonly width = signal(0);
  readonly height = signal(0);
  readonly path = signal('');
  /** Sur téléphone, le fil est une ligne droite : une simple barre, sans tracé à mesurer. */
  readonly straight = signal(false);
  readonly barTop = signal(0);
  readonly barHeight = signal(0);
  readonly nodes = signal<ThreadNode[]>([]);
  readonly end = signal<ThreadNode | null>(null);

  /** Table longueur → hauteur du tracé (ordinateur), échantillonnée une fois par mise en page. */
  private lutLength: Float32Array = new Float32Array(0);
  private lutY: Float32Array = new Float32Array(0);
  private resizeObserver: ResizeObserver | null = null;
  private frame = 0;
  private readonly reducedMotion =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  private readonly onScroll = (): void => this.schedule(() => this.updateProgress());

  ngAfterViewInit(): void {
    const parent = this.host.nativeElement.parentElement;
    if (!parent || typeof ResizeObserver === 'undefined') {
      return;
    }
    this.resizeObserver = new ResizeObserver(() => this.schedule(() => this.layout()));
    this.resizeObserver.observe(parent);
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.layout();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    window.removeEventListener('scroll', this.onScroll);
    cancelAnimationFrame(this.frame);
  }

  private schedule(work: () => void): void {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(work);
  }

  /** Recalcule le tracé à partir de la position des sections. */
  private layout(): void {
    const parent = this.host.nativeElement.parentElement;
    if (!parent) {
      return;
    }
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    const sections = Array.from(parent.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== this.host.nativeElement,
    );
    if (sections.length < 2 || w === 0) {
      this.path.set('');
      return;
    }

    const tops = sections.map((s) => s.offsetTop);
    const bottoms = sections.map((s, i) => tops[i] + s.offsetHeight);
    const startY = tops[0] + 40;
    const endY = bottoms[bottoms.length - 1] - 60;
    const nodes: { x: number; y: number }[] = [];
    let d: string;
    let endX: number;

    if (w >= DESKTOP_MIN_WIDTH) {
      const left = EDGE;
      const right = w - EDGE;
      let side = left;
      d = `M${side},${startY}`;
      nodes.push({ x: side, y: startY });
      let lastY = startY;
      for (let i = 0; i < sections.length - 1; i++) {
        const y = Math.round((bottoms[i] + tops[i + 1]) / 2);
        if (y - CROSSING <= lastY + 40 || y + CROSSING >= endY - 40) {
          continue;
        }
        const other = side === left ? right : left;
        d += ` L${side},${y - CROSSING} C${side},${y} ${other},${y} ${other},${y + CROSSING}`;
        nodes.push({ x: other, y: y + CROSSING });
        side = other;
        lastY = y + CROSSING;
      }
      d += ` L${side},${endY}`;
      endX = side;
    } else {
      const x = 10;
      d = `M${x},${startY} L${x},${endY}`;
      sections.forEach((s, i) => nodes.push({ x, y: tops[i] + 40 }));
      endX = x;
    }

    this.width.set(w);
    this.height.set(h);
    this.path.set(d);
    this.straight.set(w < DESKTOP_MIN_WIDTH);
    this.barTop.set(startY);
    this.barHeight.set(Math.max(0, endY - startY));
    this.nodes.set(nodes.map((n) => ({ ...n, on: this.reducedMotion })));
    this.end.set({ x: endX, y: endY, on: this.reducedMotion });
    // Le tracé (ou la barre) doit être dans le DOM avant de l'animer : on attend deux images.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        this.sampleTrace();
        this.updateProgress();
      }),
    );
  }

  /** Échantillonne le tracé une fois (ordinateur) : une recherche dans la table remplace des dizaines de mesures par image. */
  private sampleTrace(): void {
    if (this.straight()) {
      return;
    }
    const pathEl = this.base()?.nativeElement;
    const total = pathEl?.getTotalLength() ?? 0;
    if (!pathEl || !total) {
      return;
    }
    const count = Math.min(1200, Math.max(24, Math.ceil(total / 12)));
    this.lutLength = new Float32Array(count + 1);
    this.lutY = new Float32Array(count + 1);
    for (let i = 0; i <= count; i++) {
      const length = (total * i) / count;
      this.lutLength[i] = length / total;
      this.lutY[i] = pathEl.getPointAtLength(length).y;
    }
  }

  /** Met à jour la partie du fil déjà dessinée selon le défilement : écritures directes, sans signal ni recalcul du tracé. */
  private updateProgress(): void {
    const parent = this.host.nativeElement.parentElement;
    if (!parent || !this.path()) {
      return;
    }
    const parentTop = parent.getBoundingClientRect().top + window.scrollY;
    const yDraw = window.scrollY + window.innerHeight * 0.65 - parentTop;

    let progress: number;
    if (this.reducedMotion) {
      progress = 1;
    } else if (this.straight()) {
      const height = this.barHeight();
      progress = height > 0 ? (yDraw - this.barTop()) / height : 0;
    } else {
      progress = this.progressOnTrace(yDraw);
    }
    progress = Math.min(Math.max(progress, 0), 1);

    const bar = this.bar()?.nativeElement;
    if (bar) {
      bar.style.transform = `scaleY(${progress.toFixed(4)})`;
    }
    const draw = this.draw()?.nativeElement;
    if (draw) {
      draw.setAttribute('stroke-dashoffset', (1 - progress).toFixed(4));
    }

    // Les pastilles ne changent que quand le fil les atteint : pas de nouvelle liste à chaque image.
    const reached = (y: number): boolean => this.reducedMotion || y <= yDraw;
    const current = this.nodes();
    if (current.some((n) => n.on !== reached(n.y))) {
      this.nodes.set(current.map((n) => ({ ...n, on: reached(n.y) })));
    }
    const end = this.end();
    const endOn = this.reducedMotion || yDraw >= (end?.y ?? Infinity) - 4;
    if (end && end.on !== endOn) {
      this.end.set({ ...end, on: endOn });
    }
  }

  /** Part du tracé atteinte à la hauteur `yDraw` (le fil descend toujours) : recherche dans la table échantillonnée. */
  private progressOnTrace(yDraw: number): number {
    const y = this.lutY;
    const n = y.length;
    if (n < 2) {
      return 0;
    }
    if (yDraw <= y[0]) {
      return 0;
    }
    if (yDraw >= y[n - 1]) {
      return 1;
    }
    let lo = 0;
    let hi = n - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (y[mid] < yDraw) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    const span = y[hi] - y[lo];
    const t = span > 0 ? (yDraw - y[lo]) / span : 0;
    return this.lutLength[lo] + (this.lutLength[hi] - this.lutLength[lo]) * t;
  }
}
