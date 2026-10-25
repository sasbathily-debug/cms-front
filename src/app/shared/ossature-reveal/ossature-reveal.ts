import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

const SIZE = 640;
/** Amplitude du bruit sur la position du front de révélation (en fraction de la hauteur). */
const SPREAD = 0.36;

/** Générateur pseudo-aléatoire à graine : le bord irrégulier est le même à chaque visite. */
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Bruit de valeur à plusieurs échelles : un bord organique, avec des éclaboussures. */
function makeNoise(size: number): Float32Array {
  const rand = mulberry32(20261025);
  const out = new Float32Array(size * size);
  for (const [cells, amp] of [
    [10, 0.5],
    [26, 0.28],
    [64, 0.14],
    [160, 0.08],
  ] as const) {
    const side = cells + 2;
    const grid = new Float32Array(side * side);
    for (let i = 0; i < grid.length; i++) grid[i] = rand();
    for (let y = 0; y < size; y++) {
      const fy = (y / size) * (side - 2);
      const y0 = fy | 0;
      const ty = fy - y0;
      const sy = ty * ty * (3 - 2 * ty);
      for (let x = 0; x < size; x++) {
        const fx = (x / size) * (side - 2);
        const x0 = fx | 0;
        const tx = fx - x0;
        const sx = tx * tx * (3 - 2 * tx);
        const a = grid[y0 * side + x0];
        const b = grid[y0 * side + x0 + 1];
        const c = grid[(y0 + 1) * side + x0];
        const d = grid[(y0 + 1) * side + x0 + 1];
        const top = a + (b - a) * sx;
        out[y * size + x] += amp * (top + (c + (d - c) * sx - top) * sy);
      }
    }
  }
  return out;
}

/**
 * « De l'ossature à la personne » : un dessin au trait de la doctoresse, tiré de sa propre photo, qui laisse peu à peu
 * place à la photo au fil du défilement. La photo se révèle par le haut, avec un bord irrégulier comme de l'encre.
 *
 * Le composant doit se trouver dans un conteneur `[data-reveal-scene]` : une scène haute dont le premier enfant est
 * collant (`sticky`) ; la progression va de 0 (le cadre vient de se coller) à 1 (il va se décoller).
 * Sans animation (mouvement réduit) ou si la scène manque : la photo seule, sans effet.
 */
@Component({
  selector: 'app-ossature-reveal',
  host: { class: 'relative block' },
  template: `
    <span
      #disc
      aria-hidden="true"
      class="absolute right-[-6%] top-[6%] aspect-square w-[58%] rounded-full bg-accent-500 will-change-transform"
    ></span>
    <span aria-hidden="true" class="absolute right-[-6%] top-[62%] h-3 w-3 bg-accent-500"></span>
    <div
      class="absolute inset-x-0 bottom-0 flex justify-center"
      role="img"
      [attr.aria-label]="alt()"
    >
      <div class="relative aspect-square w-[128%] shrink-0">
        @if (still()) {
          <img
            [src]="photo()"
            alt=""
            class="absolute inset-0 h-full w-full object-cover"
            style="
              -webkit-mask-image: linear-gradient(to bottom, transparent, #000 5%, #000 90%, transparent),
                linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
              mask-image: linear-gradient(to bottom, transparent, #000 5%, #000 90%, transparent),
                linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
              -webkit-mask-composite: source-in;
              mask-composite: intersect;
            "
          />
        }
        <canvas
          #lines
          [width]="size"
          [height]="size"
          aria-hidden="true"
          class="absolute inset-0 h-full w-full"
        ></canvas>
        <canvas
          #photoCanvas
          [width]="size"
          [height]="size"
          aria-hidden="true"
          class="absolute inset-0 h-full w-full"
        ></canvas>
      </div>
    </div>
  `,
})
export class OssatureReveal {
  readonly photo = input.required<string>();
  readonly trait = input.required<string>();
  readonly alt = input('');

  protected readonly size = SIZE;
  protected readonly still = signal(false);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  private readonly lines = viewChild.required<ElementRef<HTMLCanvasElement>>('lines');
  private readonly photoCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('photoCanvas');
  private readonly disc = viewChild.required<ElementRef<HTMLElement>>('disc');

  private scene: HTMLElement | null = null;
  private ctxLines!: CanvasRenderingContext2D;
  private ctxPhoto!: CanvasRenderingContext2D;
  private photoData!: ImageData;
  private lineData!: ImageData;
  private lineBase!: Uint8Array;
  private noise!: Float32Array;
  private feather!: Float32Array;
  private ready = false;
  private first = true;
  private last = -1;
  private prevLo = 0;
  private prevHi = 0;
  private ticking = false;

  constructor() {
    afterNextRender(() => {
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      this.scene = this.host.closest<HTMLElement>('[data-reveal-scene]');
      if (reduced || !this.scene || typeof IntersectionObserver === 'undefined') {
        this.still.set(true);
        return;
      }
      const onScroll = () => {
        if (this.ticking) return;
        this.ticking = true;
        requestAnimationFrame(() => {
          this.ticking = false;
          this.update();
        });
      };
      let loading = false;
      const observer = new IntersectionObserver(
        (entries) => {
          const near = entries.some((e) => e.isIntersecting);
          if (near && !loading) {
            loading = true;
            void this.load().then(() => this.update());
          }
          if (near) {
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onScroll);
            onScroll();
          } else {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
          }
        },
        { rootMargin: '700px 0px' },
      );
      observer.observe(this.scene);
      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      });
    });
  }

  private async load(): Promise<void> {
    const open = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    try {
      const [photo, trait] = await Promise.all([open(this.photo()), open(this.trait())]);
      const tmp = document.createElement('canvas');
      tmp.width = tmp.height = SIZE;
      const tctx = tmp.getContext('2d', { willReadFrequently: true })!;
      tctx.drawImage(photo, 0, 0, SIZE, SIZE);
      this.photoData = tctx.getImageData(0, 0, SIZE, SIZE);
      tctx.clearRect(0, 0, SIZE, SIZE);
      tctx.drawImage(trait, 0, 0, SIZE, SIZE);
      this.lineData = tctx.getImageData(0, 0, SIZE, SIZE);
      this.lineBase = new Uint8Array(SIZE * SIZE);
      for (let i = 0; i < SIZE * SIZE; i++) this.lineBase[i] = this.lineData.data[i * 4 + 3];
      this.noise = makeNoise(SIZE);
      // Les bords de la photo se fondent dans le fond : adoucis en haut, à gauche, à droite et en bas
      this.feather = new Float32Array(SIZE * SIZE);
      for (let y = 0; y < SIZE; y++) {
        const fy = Math.min(1, y / (SIZE * 0.05), (SIZE - 1 - y) / (SIZE * 0.1));
        for (let x = 0; x < SIZE; x++) {
          const fx = Math.min(x, SIZE - 1 - x) / (SIZE * 0.08);
          this.feather[y * SIZE + x] = Math.max(0, Math.min(1, fx, fy));
        }
      }
      this.ctxLines = this.lines().nativeElement.getContext('2d')!;
      this.ctxPhoto = this.photoCanvas().nativeElement.getContext('2d')!;
      this.ready = true;
    } catch {
      this.still.set(true);
    }
  }

  private progress(): number {
    const scene = this.scene!;
    const stage = scene.firstElementChild as HTMLElement | null;
    const total = scene.offsetHeight - (stage?.offsetHeight ?? window.innerHeight);
    if (total <= 0) return 1;
    return Math.max(0, Math.min(1, -scene.getBoundingClientRect().top / total));
  }

  private update(): void {
    if (!this.ready) return;
    const p = this.progress();
    if (!this.first && Math.abs(p - this.last) < 0.002) return;
    this.last = p;
    this.render(p);
    this.disc().nativeElement.style.transform = `translateY(${(-p * 14).toFixed(1)}px)`;
  }

  /** Ne recalcule que les lignes proches du front de révélation (et celles qu'il vient de quitter). */
  private render(p: number): void {
    const size = SIZE;
    const threshold = p * 1.32 - 0.12;
    const reach = SPREAD / 2 + 0.02;
    const lo = Math.max(0, Math.min(size - 1, Math.floor((threshold - reach) * size)));
    const hi = Math.max(0, Math.min(size - 1, Math.ceil((threshold + reach) * size)));
    const y0 = this.first ? 0 : Math.min(lo, this.prevLo);
    const y1 = this.first ? size - 1 : Math.max(hi, this.prevHi);
    const photo = this.photoData.data;
    const lines = this.lineData.data;
    for (let y = y0; y <= y1; y++) {
      const ty = y / size;
      for (let x = 0; x < size; x++) {
        const i = y * size + x;
        const t = ty + (this.noise[i] - 0.5) * SPREAD;
        const a = Math.max(0, Math.min(1, (threshold - t) / 0.006)) * this.feather[i];
        photo[i * 4 + 3] = a * 255;
        lines[i * 4 + 3] = this.lineBase[i] * (1 - a);
      }
    }
    this.ctxPhoto.putImageData(this.photoData, 0, 0, 0, y0, size, y1 - y0 + 1);
    this.ctxLines.putImageData(this.lineData, 0, 0, 0, y0, size, y1 - y0 + 1);
    this.prevLo = lo;
    this.prevHi = hi;
    this.first = false;
  }
}
