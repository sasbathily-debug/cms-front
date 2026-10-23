import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import type { Anneau3D } from './anneau-verre-3d';

/**
 * Anneau en verre en 3D (forme abstraite, décorative). La scène three.js est chargée à la demande,
 * quand la figure arrive à l'écran ; en attendant, ou sans WebGL, un anneau dégradé en CSS s'affiche.
 */
@Component({
  selector: 'app-anneau-verre',
  templateUrl: './anneau-verre.html',
})
export class AnneauVerre {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly stage = viewChild<ElementRef<HTMLCanvasElement>>('stage');

  /** « css » : anneau de secours ; « 3d » : scène prête. */
  readonly mode = signal<'css' | '3d'>('css');

  private engine: Anneau3D | null = null;
  private loading = false;
  private visible = false;
  private dragging = false;
  private lastX = 0;

  constructor() {
    afterNextRender(() => {
      const observer = new IntersectionObserver(([entry]) => {
        this.visible = entry.isIntersecting;
        this.engine?.setActive(this.visible);
        if (this.visible) void this.load();
      });
      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        this.engine?.dispose();
        this.engine = null;
      });
    });
  }

  private async load(): Promise<void> {
    const canvas = this.stage()?.nativeElement;
    if (this.loading || this.engine || !canvas) return;
    this.loading = true;
    try {
      const { createAnneau3D } = await import('./anneau-verre-3d');
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const engine = createAnneau3D(canvas, !reduce);
      if (!engine) return;
      this.engine = engine;
      engine.setActive(this.visible);
      this.mode.set('3d');
    } catch {
      // Pas de 3D : l'anneau CSS reste affiché.
    }
  }

  pointerMove(event: PointerEvent): void {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    this.engine?.setPointer(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      ((event.clientY - rect.top) / rect.height) * 2 - 1,
    );
    if (this.dragging) {
      this.engine?.spin((event.clientX - this.lastX) * 0.05);
      this.lastX = event.clientX;
    }
  }

  pointerDown(event: PointerEvent): void {
    this.dragging = true;
    this.lastX = event.clientX;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  pointerUp(): void {
    this.dragging = false;
  }

  pointerLeave(): void {
    this.engine?.setPointer(0, 0);
  }
}
