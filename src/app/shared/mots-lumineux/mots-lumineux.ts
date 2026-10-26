import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  viewChildren,
} from '@angular/core';

/** Part du défilement pendant laquelle les mots s'allument ; le reste laisse lire la phrase entière. */
const LIT_SHARE = 0.8;
/** Progression à partir de laquelle les boutons de la scène apparaissent. */
const ACTIONS_AT = 0.88;

/**
 * Une phrase dont les mots passent du gris au blanc, l'un après l'autre, au fil du défilement.
 *
 * Le composant doit se trouver dans un conteneur `[data-reveal-scene]` : une scène haute dont le premier enfant est
 * collant (`sticky`). La progression va de 0 (le cadre vient de se coller) à 1 (il va se décoller). Pendant l'effet,
 * la scène porte `data-mots-actif` ; une fois la phrase lue, elle porte aussi `mots-fini`.
 * Sans défilement possible ou avec « réduire les animations », la phrase reste blanche, sans effet.
 */
@Component({
  selector: 'app-mots-lumineux',
  template: `
    @for (mot of mots(); track $index) {
      <span #mot class="mot">{{ mot }}</span>
    }
  `,
  host: { class: 'block' },
})
export class MotsLumineux {
  readonly texte = input.required<string>();

  protected readonly mots = computed(() => {
    // Typographie française : les guillemets et la ponctuation haute restent collés au mot voisin (espace insécable).
    const texte = this.texte()
      .replace(/« /g, '«\u00A0')
      .replace(/ ([»?!:;])/g, '\u00A0$1');
    const parts = texte.split(' ');
    return parts.map((word, i) => (i < parts.length - 1 ? word + ' ' : word));
  });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  private readonly spans = viewChildren<ElementRef<HTMLElement>>('mot');
  private scene: HTMLElement | null = null;
  private lit: number[] = [];

  constructor() {
    afterNextRender(() => {
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      this.scene = this.host.closest<HTMLElement>('[data-reveal-scene]');
      if (reduced || !this.scene || typeof IntersectionObserver === 'undefined') return;
      const scene = this.scene;
      scene.setAttribute('data-mots-actif', '');
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          this.paint(this.progress());
        });
      };
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onScroll);
            onScroll();
          } else {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
          }
        },
        { rootMargin: '300px 0px' },
      );
      observer.observe(scene);
      this.paint(this.progress());
      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        scene.removeAttribute('data-mots-actif');
        scene.classList.remove('mots-fini');
      });
    });
  }

  private progress(): number {
    const scene = this.scene!;
    const stage = scene.firstElementChild as HTMLElement | null;
    const total = scene.offsetHeight - (stage?.offsetHeight ?? window.innerHeight);
    if (total <= 0) return 1;
    return Math.max(0, Math.min(1, -scene.getBoundingClientRect().top / total));
  }

  private paint(p: number): void {
    const spans = this.spans();
    const reach = (p / LIT_SHARE) * (spans.length + 2);
    spans.forEach((span, i) => {
      const value = Math.max(0, Math.min(1, reach - i - 1));
      if (this.lit[i] === undefined || Math.abs(this.lit[i] - value) > 0.004) {
        this.lit[i] = value;
        span.nativeElement.style.setProperty('--l', value.toFixed(3));
      }
    });
    this.scene!.classList.toggle('mots-fini', p > ACTIONS_AT);
  }
}
