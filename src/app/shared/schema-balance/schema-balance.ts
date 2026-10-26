import { Component, computed, input } from '@angular/core';

/** Situations : 0 un équilibre réaliste, 1 sommeil et stress, 2 hormones, 3 un palier à la fois. */
const INCLINAISON = [0, -14, -9, -4];
const MANGE = [3, 5, 3, 4];
const DEPENSE = [3, 3, 2, 3];

/**
 * « Ce qu'on mange, ce qu'on dépense » : une balance dont les plateaux se chargent selon la situation. Le sommeil et le
 * stress alourdissent le plateau de ce qu'on mange ; une hormone qui ralentit allège celui de ce qu'on dépense ;
 * un palier à la fois, c'est rapprocher la balance de l'équilibre, un petit cran après l'autre.
 */
@Component({
  selector: 'app-schema-balance',
  styles: `
    :host {
      display: block;
    }
    .fleau,
    .plateau {
      transition: transform 0.9s cubic-bezier(0.3, 1.25, 0.4, 1);
    }
    .bloc {
      animation: pose 0.45s cubic-bezier(0.3, 1.5, 0.4, 1) both;
      transform-box: fill-box;
      transform-origin: center bottom;
    }
    @keyframes pose {
      from {
        transform: translateY(-14px) scale(0.6);
        opacity: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .fleau,
      .plateau {
        transition: none;
      }
      .bloc {
        animation: none;
      }
    }
  `,
  template: `
    <svg
      viewBox="0 0 720 300"
      class="block h-auto w-full"
      role="img"
      [attr.aria-label]="description()"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <!-- le pied -->
      <g stroke="var(--color-peach)" stroke-width="3" opacity="0.8">
        <path d="M360 76V268" />
        <path d="M300 276H420L404 268H316Z" fill="rgba(255,226,190,0.12)" />
      </g>
      <!-- le fléau et les plateaux -->
      <g transform="translate(360 76)">
        <g class="fleau" [style.transform]="'rotate(' + inclinaison() + 'deg)'">
          <path d="M-230 0H230" stroke="var(--color-peach)" stroke-width="5" />
          @for (cote of cotes; track cote.nom) {
            <g [attr.transform]="'translate(' + cote.x + ' 0)'">
              <g class="plateau" [style.transform]="'rotate(' + -inclinaison() + 'deg)'">
                <path
                  d="M0 0L-62 112M0 0L62 112"
                  stroke="var(--color-peach)"
                  stroke-width="1.8"
                  opacity="0.7"
                />
                <path d="M-72 112H72" stroke="var(--color-peach)" stroke-width="5" />
                @for (b of blocs(cote.nom); track b.i) {
                  <rect
                    class="bloc"
                    [attr.x]="b.x"
                    [attr.y]="b.y"
                    width="26"
                    height="22"
                    rx="5"
                    [attr.fill]="
                      cote.nom === 'mange' ? 'var(--color-accent-500)' : 'var(--color-peach)'
                    "
                    [style.animation-delay.ms]="b.i * 60"
                  />
                }
                @if (cote.nom === 'depense' && etat() === 2) {
                  <rect
                    x="12"
                    y="62"
                    width="26"
                    height="22"
                    rx="5"
                    stroke="var(--color-peach)"
                    stroke-width="1.8"
                    stroke-dasharray="3 4"
                    opacity="0.7"
                  />
                }
              </g>
            </g>
          }
          <circle r="9" fill="var(--color-plum-900)" stroke="var(--color-peach)" stroke-width="4" />
        </g>
      </g>
    </svg>
    <div
      class="relative -mt-1 flex justify-between px-[8%] text-[10px] font-semibold tracking-[0.05em] sm:text-[12px] sm:tracking-[0.12em] text-on-plum-subtle"
      aria-hidden="true"
    >
      <span>CE QU'ON MANGE</span><span>CE QU'ON DÉPENSE</span>
    </div>
  `,
})
export class SchemaBalance {
  /** Situation : 0 équilibre réaliste, 1 sommeil et stress, 2 hormones, 3 un palier à la fois. */
  readonly etat = input.required<number>();

  protected readonly cotes = [
    { nom: 'mange', x: -230 },
    { nom: 'depense', x: 230 },
  ];

  protected readonly inclinaison = computed(() => INCLINAISON[this.etat()] ?? 0);

  /** Les petits blocs posés sur un plateau : deux colonnes, trois rangées au plus. */
  protected blocs(cote: string): { i: number; x: number; y: number }[] {
    const n = (cote === 'mange' ? MANGE : DEPENSE)[this.etat()] ?? 0;
    return Array.from({ length: n }, (_, i) => ({
      i,
      x: i % 2 === 0 ? -34 : 4,
      y: 112 - 24 - Math.floor(i / 2) * 26,
    }));
  }

  protected readonly description = computed(
    () =>
      [
        "Schéma : une balance presque à l'équilibre, ce qu'on mange d'un côté et ce qu'on dépense de l'autre.",
        "Schéma : le sommeil et le stress alourdissent ce qu'on mange, la balance penche de ce côté.",
        "Schéma : une hormone ralentit la dépense d'énergie, le plateau de la dépense est plus léger et la balance penche vers ce qu'on mange.",
        "Schéma : la balance se rapproche de l'équilibre, un petit cran après l'autre.",
      ][this.etat()],
  );
}
