import { Component, computed, input, signal } from '@angular/core';

export type EtatInsuline = 'ok' | 'type1' | 'type2';

interface Grain {
  x: number;
  y: number;
  delai: number;
  duree: number;
  /** Fin du parcours : dans la cellule (passe) ou contre la paroi (bloque). */
  fx: number;
  fy: number;
}

/** Jeu de grains de sucre réparti dans le sang : même départ pour les trois états, seule la fin du trajet change. */
const DEPARTS: [number, number][] = [
  [60, 100],
  [110, 150],
  [70, 200],
  [150, 120],
  [190, 190],
  [130, 235],
  [230, 105],
  [260, 165],
  [210, 228],
  [300, 130],
  [320, 205],
  [170, 160],
];

/**
 * Comment le sucre entre dans la cellule : le sang à gauche, la cellule à droite, une porte dans sa paroi.
 * Trois états : tout va bien (la porte s'ouvre, le sucre passe), type 1 (pas de clé : la porte reste fermée, le sucre
 * s'accumule), type 2 (la clé tourne mal : la porte s'ouvre à peine). Un seul schéma, trois lectures.
 */
@Component({
  selector: 'app-schema-insuline',
  styles: `
    :host {
      display: block;
    }
    .grain {
      transform-box: fill-box;
      transform-origin: center;
      opacity: 0;
      animation-fill-mode: both;
      animation-timing-function: linear;
    }
    .passe {
      animation-name: passe;
      animation-iteration-count: infinite;
    }
    .bloque {
      animation-name: bloque;
      animation-iteration-count: 1;
    }
    .cle {
      transform-box: fill-box;
      transform-origin: 14px 50%;
    }
    .tourne {
      animation: tourne 2.4s ease-in-out infinite;
    }
    @keyframes passe {
      0% {
        transform: translate(0, 0);
        opacity: 0;
      }
      8% {
        opacity: 1;
      }
      52% {
        transform: translate(var(--gx), var(--gy));
        opacity: 1;
      }
      100% {
        transform: translate(var(--fx), var(--fy));
        opacity: 0;
      }
    }
    @keyframes bloque {
      0% {
        transform: translate(0, 0);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      100% {
        transform: translate(var(--fx), var(--fy));
        opacity: 1;
      }
    }
    @keyframes tourne {
      0%,
      100% {
        transform: rotate(-12deg);
      }
      50% {
        transform: rotate(12deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .grain {
        animation: none !important;
        opacity: 1 !important;
        transform: translate(var(--fx), var(--fy)) !important;
      }
      .tourne {
        animation: none;
      }
    }
  `,
  template: `
    <div class="flex flex-col gap-4 rounded-[22px] bg-plum-800 p-4 sm:p-6">
      <div class="flex flex-wrap gap-2" role="group" aria-label="Situation à comparer">
        @for (o of onglets(); track o.etat) {
          <button
            type="button"
            (click)="etat.set(o.etat)"
            [attr.aria-pressed]="etat() === o.etat"
            class="cursor-pointer rounded-full border-[1.5px] px-4 py-2 font-display text-[14px] font-semibold transition-colors duration-200"
            [class]="
              etat() === o.etat
                ? 'border-accent-500 bg-accent-500 text-on-accent'
                : 'border-white/25 bg-transparent text-on-plum hover:border-peach'
            "
          >
            {{ o.libelle }}
          </button>
        }
      </div>

      <div
        class="relative -mb-2 h-4 text-[12px] font-semibold tracking-[0.14em] text-on-plum-subtle"
        aria-hidden="true"
      >
        <span class="absolute" style="left: 4.7%">SANG</span>
        <span class="absolute" style="left: 61.1%">CELLULE</span>
      </div>

      <svg
        viewBox="0 30 720 262"
        class="block h-auto w-full"
        role="img"
        [attr.aria-label]="description()"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <defs>
          <polygon id="sucre" points="0,-8 7,-4 7,4 0,8 -7,4 -7,-4" />
        </defs>
        <!-- le sang -->
        <rect
          x="16"
          y="64"
          width="388"
          height="196"
          rx="30"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.14)"
          stroke-width="1.5"
        />
        <!-- la cellule, avec sa porte dans la paroi de gauche -->
        <path
          [attr.d]="paroi()"
          stroke="var(--color-peach)"
          stroke-width="3"
          fill="rgba(255,226,190,0.05)"
        />
        <circle
          cx="596"
          cy="160"
          r="46"
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(255,255,255,0.18)"
          stroke-width="1.5"
        />
        <circle cx="424" [attr.cy]="160 - demi()" r="6" fill="var(--color-peach)" />
        <circle cx="424" [attr.cy]="160 + demi()" r="6" fill="var(--color-peach)" />
        <!-- les clés d'insuline -->
        @for (c of cles(); track $index) {
          <g
            [attr.transform]="'translate(' + c.x + ' ' + c.y + ') rotate(' + c.a + ')'"
            [attr.opacity]="c.o"
          >
            <g class="cle" [class.tourne]="c.tourne" stroke="var(--color-peach)" stroke-width="2.6">
              <circle cx="8" cy="0" r="7" />
              <path d="M15 0H44M36 0v8M44 0v6" />
            </g>
          </g>
        }
        @if (etat() === 'type1') {
          <g opacity="0.55" stroke="var(--color-peach)" stroke-width="2.4" stroke-dasharray="3 5">
            <g transform="translate(330 160)">
              <circle cx="8" cy="0" r="7" />
              <path d="M15 0H44M36 0v8M44 0v6" />
            </g>
          </g>
        }
        <!-- le sucre -->
        @for (g of grains(); track $index + etat()) {
          <g [attr.transform]="'translate(' + g.x + ' ' + g.y + ')'">
            <g
              class="grain"
              [class.passe]="g.passe"
              [class.bloque]="!g.passe"
              [style.--gx.px]="404 - g.x"
              [style.--gy.px]="160 - g.y"
              [style.--fx.px]="g.fx - g.x"
              [style.--fy.px]="g.fy - g.y"
              [style.animation-delay.s]="g.delai"
              [style.animation-duration.s]="g.duree"
            >
              <use href="#sucre" fill="var(--color-accent-500)" />
            </g>
          </g>
        }
      </svg>

      <div class="flex flex-wrap items-center gap-x-5 gap-y-1 text-[12.5px] text-on-plum-subtle">
        <span class="inline-flex items-center gap-2"
          ><svg width="14" height="14" viewBox="-8 -8 16 16" aria-hidden="true">
            <use href="#sucre" fill="var(--color-accent-500)" /></svg
          >Sucre (glucose)</span
        >
        <span class="inline-flex items-center gap-2"
          ><svg
            width="30"
            height="14"
            viewBox="0 -7 46 14"
            fill="none"
            stroke="var(--color-peach)"
            stroke-width="2.6"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <circle cx="8" cy="0" r="6" />
            <path d="M14 0H42M34 0v6M42 0v5" /></svg
          >Insuline (la clé)</span
        >
        <span class="ml-auto">Schéma simplifié, pour comprendre le principe.</span>
      </div>

      <div class="rounded-2xl bg-white/[0.05] px-5 py-4">
        <h3 class="m-0 font-display text-xl font-bold text-peach">{{ courante().title }}</h3>
        <p class="m-0 mt-2 text-[14.5px] leading-[1.65] text-on-plum-muted">
          {{ courante().text }}
        </p>
      </div>
    </div>
  `,
})
export class SchemaInsuline {
  /** Les trois situations, dans l'ordre : tout va bien, type 1, type 2. */
  readonly cartes = input.required<{ title: string; text: string }[]>();

  protected readonly etat = signal<EtatInsuline>('ok');

  protected readonly onglets = computed(() => [
    { etat: 'ok' as const, libelle: 'Tout va bien' },
    { etat: 'type1' as const, libelle: 'Type 1' },
    { etat: 'type2' as const, libelle: 'Type 2' },
  ]);

  protected readonly courante = computed(() => {
    const index = { ok: 0, type1: 1, type2: 2 }[this.etat()];
    return this.cartes()[index] ?? { title: '', text: '' };
  });

  protected readonly description = computed(
    () =>
      ({
        ok: "Schéma : les clés d'insuline ouvrent la porte de la cellule et le sucre du sang y entre.",
        type1:
          "Schéma : il n'y a plus de clé, la porte de la cellule reste fermée et le sucre s'accumule dans le sang.",
        type2:
          "Schéma : les clés sont là mais tournent mal, la porte s'ouvre à peine et peu de sucre entre.",
      })[this.etat()],
  );

  /** Demi-ouverture de la porte (pixels). */
  protected readonly demi = computed(() => ({ ok: 32, type1: 0, type2: 8 })[this.etat()]);

  /** Paroi de la cellule : un contour avec une interruption à hauteur de la porte. */
  protected readonly paroi = computed(() => {
    const g = this.demi();
    return `M424 ${160 - g}V88a48 48 0 0 1 48-48H656a48 48 0 0 1 48 48V232a48 48 0 0 1-48 48H472a48 48 0 0 1-48-48V${160 + g}`;
  });

  protected readonly cles = computed(() => {
    switch (this.etat()) {
      case 'ok':
        return [
          { x: 318, y: 112, a: 0, o: 1, tourne: false },
          { x: 322, y: 208, a: 0, o: 1, tourne: false },
          { x: 366, y: 160, a: 0, o: 1, tourne: true },
        ];
      case 'type2':
        return [
          { x: 318, y: 112, a: 28, o: 0.9, tourne: false },
          { x: 322, y: 208, a: -34, o: 0.9, tourne: false },
          { x: 366, y: 160, a: 14, o: 0.9, tourne: true },
        ];
      default:
        return [];
    }
  });

  /** Grains de sucre : chacun a un départ ; selon l'état, il traverse la porte ou s'arrête contre la paroi. */
  protected readonly grains = computed<(Grain & { passe: boolean })[]>(() => {
    const etat = this.etat();
    return DEPARTS.map(([x, y], i) => {
      // type 2 : un grain sur quatre passe ; tout va bien : tous passent ; type 1 : aucun
      const passe = etat === 'ok' || (etat === 'type2' && i % 4 === 0);
      const pile = {
        fx: 392 - (i % 3) * 16,
        fy: 92 + ((i * 37) % 150),
      };
      return {
        x,
        y,
        delai: (i % 6) * 0.55 + (i > 5 ? 0.3 : 0),
        duree: passe ? (etat === 'type2' ? 6.5 : 4.2) : 3 + (i % 4) * 0.6,
        fx: passe ? 520 + ((i * 29) % 120) : pile.fx,
        fy: passe ? 130 + ((i * 41) % 60) : pile.fy,
        passe,
      };
    });
  });
}
