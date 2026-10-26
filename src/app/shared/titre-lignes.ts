import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
} from '@angular/core';

/** Délai entre deux lignes (ms) et durée de l'apparition d'une ligne. */
const DECALAGE_MS = 110;

/**
 * Titre dont les lignes se lèvent l'une après l'autre, une seule fois, quand il arrive à l'écran.
 * Usage : `<h2 [appTitreLignes]="texte" class="…"></h2>` (le texte est écrit par la directive).
 *
 * Règles de sécurité :
 *  - le titre est du texte normal tant que rien n'a été mesuré, et le reste s'il est déjà à l'écran à l'ouverture ;
 *  - « réduire les animations » ou pas d'observateur : texte simple, sans rien cacher ;
 *  - les lignes sont recalculées si la largeur change ; un lecteur d'écran lit le titre d'un bloc (`aria-label`).
 */
@Directive({ selector: '[appTitreLignes]' })
export class TitreLignes {
  readonly appTitreLignes = input.required<string>();

  private readonly node = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  private pret = false;
  private revele = false;
  private anime = false;
  private largeur = 0;
  private minuteur = 0;

  constructor() {
    effect(() => {
      const texte = this.appTitreLignes();
      this.node.textContent = texte;
      this.node.setAttribute('aria-label', texte);
      if (this.pret && this.anime) void this.decouper();
    });

    afterNextRender(() => {
      const reduit = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      if (reduit || typeof IntersectionObserver === 'undefined') return;
      const rect = this.node.getBoundingClientRect();
      // Déjà à l'écran à l'ouverture : rien n'est caché, le titre est simplement là.
      if (rect.top < window.innerHeight && rect.bottom > 0) return;
      this.anime = true;
      this.pret = true;
      void this.decouper();
      this.largeur = this.node.clientWidth;

      const observateur = new IntersectionObserver(
        (entrees) => {
          if (!entrees.some((e) => e.isIntersecting)) return;
          this.revele = true;
          this.node.classList.add('lignes-visibles');
          observateur.disconnect();
        },
        { threshold: 0.4 },
      );
      observateur.observe(this.node);

      const surRedim = () => {
        window.clearTimeout(this.minuteur);
        this.minuteur = window.setTimeout(() => {
          if (Math.abs(this.node.clientWidth - this.largeur) < 2) return;
          this.largeur = this.node.clientWidth;
          void this.decouper();
        }, 150);
      };
      window.addEventListener('resize', surRedim);
      this.destroyRef.onDestroy(() => {
        observateur.disconnect();
        window.clearTimeout(this.minuteur);
        window.removeEventListener('resize', surRedim);
      });
    });
  }

  /** Coupe le titre en lignes telles qu'elles sont posées à l'écran, puis enveloppe chacune pour qu'elle puisse se lever. */
  private async decouper(): Promise<void> {
    await document.fonts?.ready;
    const texte = this.appTitreLignes();
    const noeud = this.node;
    noeud.classList.remove('lignes-pretes');
    noeud.textContent = '';
    const mots = texte.split(' ').map((mot, i, tous) => {
      const span = document.createElement('span');
      span.textContent = mot + (i < tous.length - 1 ? ' ' : '');
      span.style.display = 'inline-block';
      span.style.whiteSpace = 'pre';
      noeud.appendChild(span);
      return span;
    });
    const lignes: string[][] = [];
    let derniere = -1;
    for (const span of mots) {
      const haut = Math.round(span.offsetTop);
      if (haut !== derniere) {
        lignes.push([]);
        derniere = haut;
      }
      lignes[lignes.length - 1].push(span.textContent ?? '');
    }
    noeud.textContent = '';
    lignes.forEach((ligne, i) => {
      const bloc = document.createElement('span');
      bloc.className = 'ligne';
      const interieur = document.createElement('span');
      interieur.className = 'ligne-in';
      interieur.textContent = ligne.join('').replace(/\s+$/, '');
      interieur.style.setProperty('--d', `${i * DECALAGE_MS}ms`);
      bloc.setAttribute('aria-hidden', 'true');
      bloc.appendChild(interieur);
      noeud.appendChild(bloc);
    });
    noeud.classList.add('lignes-pretes');
    if (this.revele) noeud.classList.add('lignes-visibles');
  }
}
