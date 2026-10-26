import { Component, computed, input } from '@angular/core';

/** Situations : 0 trop lente (hypothyroïdie), 1 au bon réglage, 2 trop rapide (hyperthyroïdie), 3 nodules. */
const AIGUILLE = [-62, 0, 62, 0];
const PERIODE = [150, 96, 56, 96];
const DUREE = [4.2, 2.4, 1.1, 2.4];
const OPACITE = [0.28, 0.6, 0.95, 0.6];

/**
 * « Le thermostat du corps » : une thyroïde dans le cou, un cadran dont l'aiguille se règle (trop lent, bon réglage,
 * trop rapide) et un tracé de battements du cœur dont le rythme suit. Quatrième situation : des nodules dans la glande.
 */
@Component({
  selector: 'app-schema-thyroide',
  styles: `
    :host {
      display: block;
    }
    .aiguille {
      transition: transform 0.9s cubic-bezier(0.3, 1.35, 0.4, 1);
      transform-origin: 540px 218px;
    }
    .glande {
      transition:
        fill-opacity 0.6s,
        transform 0.6s;
      transform-box: fill-box;
      transform-origin: center;
    }
    .pouls {
      animation: defile var(--duree) linear infinite;
    }
    .halo {
      transform-box: fill-box;
      transform-origin: center;
    }
    .halo.rapide {
      animation: halo 0.55s ease-in-out infinite alternate;
    }
    @keyframes defile {
      to {
        transform: translateX(calc(var(--periode) * -1px));
      }
    }
    @keyframes halo {
      to {
        transform: scale(1.14);
        opacity: 0.55;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .pouls,
      .halo.rapide {
        animation: none;
      }
      .aiguille,
      .glande {
        transition: none;
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
      <defs>
        <clipPath id="fenetre-pouls"><rect x="380" y="248" width="320" height="44" /></clipPath>
        <radialGradient id="lueur">
          <stop offset="0" stop-color="var(--color-accent-500)" stop-opacity="0.55" />
          <stop offset="1" stop-color="var(--color-accent-500)" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- le cou et les épaules -->
      <g stroke="var(--color-peach)" stroke-width="3" opacity="0.7">
        <path d="M120 6C120 62 112 104 78 126C56 140 30 150 14 170" />
        <path d="M220 6C220 62 228 104 262 126C284 140 310 150 326 170" />
        <path d="M120 40C150 52 190 52 220 40" opacity="0.5" />
      </g>
      <!-- la glande : deux lobes et un pont, en papillon -->
      <circle
        class="halo"
        [class.rapide]="etat() === 2"
        cx="170"
        cy="116"
        r="84"
        fill="url(#lueur)"
        [attr.opacity]="etat() === 0 ? 0.25 : etat() === 2 ? 1 : 0.7"
      />
      <g
        [attr.transform]="
          etat() === 3 ? 'translate(170 112) scale(1.12) translate(-170 -112)' : null
        "
      >
        <g stroke="var(--color-peach)" stroke-width="2.6" fill="var(--color-accent-500)">
          <path
            class="glande"
            [attr.fill-opacity]="opacite()"
            d="M168 118C168 94 150 80 134 90C118 100 118 134 134 146C148 156 168 142 168 118Z"
          />
          <path
            class="glande"
            [attr.fill-opacity]="opacite()"
            d="M172 118C172 94 190 80 206 90C222 100 222 134 206 146C192 156 172 142 172 118Z"
          />
          <path class="glande" [attr.fill-opacity]="opacite()" d="M162 112H178V126H162Z" />
        </g>
        @if (etat() === 3) {
          <g fill="var(--color-plum-900)" stroke="var(--color-peach)" stroke-width="2.2">
            <circle cx="204" cy="112" r="10" />
            <circle cx="193" cy="132" r="6" />
            <circle cx="140" cy="122" r="5" />
          </g>
        }
      </g>
      <!-- repères -->
      <g stroke="var(--color-peach)" stroke-width="1.5" opacity="0.7">
        <path d="M232 112H300" stroke-dasharray="3 5" />
      </g>

      <!-- le cadran -->
      <g>
        <path
          d="M410 218A130 130 0 0 1 670 218"
          stroke="rgba(255,255,255,0.12)"
          stroke-width="18"
        />
        <path
          d="M410 218A130 130 0 0 1 459 117"
          stroke="var(--color-peach)"
          stroke-width="18"
          opacity="0.4"
        />
        <path
          d="M478 101A130 130 0 0 1 602 101"
          stroke="var(--color-accent-500)"
          stroke-width="18"
        />
        <path
          d="M621 117A130 130 0 0 1 670 218"
          stroke="var(--color-peach)"
          stroke-width="18"
          opacity="0.4"
        />
        <g class="aiguille" [style.transform]="'rotate(' + angle() + 'deg)'">
          <path d="M540 218V108" stroke="var(--color-on-plum)" stroke-width="5" />
          <path d="M532 118L540 100L548 118Z" fill="var(--color-on-plum)" stroke="none" />
        </g>
        <circle
          cx="540"
          cy="218"
          r="11"
          fill="var(--color-plum-900)"
          stroke="var(--color-on-plum)"
          stroke-width="4"
        />
      </g>

      <!-- le pouls -->
      <g clip-path="url(#fenetre-pouls)">
        <path
          class="pouls"
          [attr.d]="trace()"
          stroke="var(--color-accent-500)"
          stroke-width="3"
          [style.--duree.s]="duree()"
          [style.--periode]="periode()"
        />
      </g>
    </svg>
    <div
      class="relative -mt-1 grid grid-cols-[1fr_1.35fr] gap-2 text-[10px] font-semibold tracking-[0.05em] sm:text-[12px] sm:tracking-[0.12em] text-on-plum-subtle"
      aria-hidden="true"
    >
      <span class="pl-[8%]">THYROÏDE</span>
      <span class="flex justify-between px-[4%]"
        ><span>TROP LENT</span><span class="text-peach">BON RÉGLAGE</span
        ><span>TROP RAPIDE</span></span
      >
    </div>
  `,
})
export class SchemaThyroide {
  /** Situation : 0 trop lente, 1 bon réglage, 2 trop rapide, 3 nodules. */
  readonly etat = input.required<number>();

  protected readonly angle = computed(() => AIGUILLE[this.etat()] ?? 0);
  protected readonly periode = computed(() => PERIODE[this.etat()] ?? 96);
  protected readonly duree = computed(() => DUREE[this.etat()] ?? 2.4);
  protected readonly opacite = computed(() => OPACITE[this.etat()] ?? 0.6);

  /** Un battement de cœur répété : un tracé plat, un petit creux, un grand pic, un retour. */
  protected readonly trace = computed(() => {
    const p = this.periode();
    let d = 'M380 270';
    for (let x = 380; x < 700 + p; x += p) {
      d += `H${x + p * 0.28}l${p * 0.05} -5l${p * 0.05} 5H${x + p * 0.5}l${p * 0.04} 6l${p * 0.07} -30l${p * 0.07} 36l${p * 0.05} -12H${x + p}`;
    }
    return d;
  });

  protected readonly description = computed(
    () =>
      [
        "Schéma : la thyroïde produit trop peu, l'aiguille est du côté « trop lent » et le cœur bat lentement.",
        "Schéma : la thyroïde est au bon réglage, l'aiguille est au centre et le cœur bat à un rythme normal.",
        "Schéma : la thyroïde produit trop, l'aiguille est du côté « trop rapide » et le cœur bat vite.",
        'Schéma : des nodules, de petites boules, dans la glande ; le réglage reste souvent normal.',
      ][this.etat()],
  );
}
