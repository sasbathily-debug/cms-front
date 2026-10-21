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
 */
@Component({
  selector: 'app-orange-thread',
  template: `
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
        [attr.d]="path()"
        pathLength="1"
        fill="none"
        stroke="#E0873F"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray="1"
        [attr.stroke-dashoffset]="1 - progress()"
      />
      @for (node of nodes(); track $index) {
        <circle
          [attr.cx]="node.x"
          [attr.cy]="node.y"
          r="9"
          fill="#E0873F"
          stroke="#FFE2BE"
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
            fill="#FFE2BE"
            stroke="#E0873F"
            stroke-width="4"
          />
        </g>
      }
    </svg>
  `,
})
export class OrangeThread implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly base = viewChild<ElementRef<SVGPathElement>>('base');

  readonly width = signal(0);
  readonly height = signal(0);
  readonly path = signal('');
  readonly progress = signal(0);
  readonly nodes = signal<ThreadNode[]>([]);
  readonly end = signal<ThreadNode | null>(null);

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
    this.nodes.set(nodes.map((n) => ({ ...n, on: this.reducedMotion })));
    this.end.set({ x: endX, y: endY, on: this.reducedMotion });
    // Le tracé doit être dans le DOM avant de mesurer sa longueur.
    requestAnimationFrame(() => this.updateProgress());
  }

  /** Met à jour la partie du fil déjà dessinée selon le défilement. */
  private updateProgress(): void {
    const parent = this.host.nativeElement.parentElement;
    const pathEl = this.base()?.nativeElement;
    if (!parent || !pathEl || !this.path()) {
      return;
    }
    const total = pathEl.getTotalLength();
    if (!total) {
      return;
    }
    if (this.reducedMotion) {
      this.progress.set(1);
      return;
    }

    const parentTop = parent.getBoundingClientRect().top + window.scrollY;
    const yDraw = window.scrollY + window.innerHeight * 0.65 - parentTop;

    // Le fil descend toujours : on cherche par dichotomie la longueur où il atteint yDraw.
    let lo = 0;
    let hi = total;
    for (let i = 0; i < 18; i++) {
      const mid = (lo + hi) / 2;
      if (pathEl.getPointAtLength(mid).y < yDraw) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    this.progress.set(Math.min(Math.max(lo / total, 0), 1));

    const reached = (y: number): boolean => y <= yDraw;
    this.nodes.update((list) => list.map((n) => ({ ...n, on: reached(n.y) })));
    this.end.update((e) => (e ? { ...e, on: yDraw >= e.y - 4 } : e));
  }
}
