import { Component } from '@angular/core';

/**
 * Schéma du tour de taille : un tronc au trait, deux repères (dernières côtes, haut des hanches) et un ruban de
 * couturière posé à mi-distance. Dessiné dans le style du logo (trait fin, tons chauds) ; les étiquettes sont du
 * texte, donc lisibles et traduisibles. À poser sur un fond prune.
 */
@Component({
  selector: 'app-tour-de-taille',
  template: `
    <figure
      class="relative m-0 aspect-[440/340] w-full"
      role="img"
      aria-label="Schéma d'un tronc : le tour de taille se mesure à mi-distance entre les dernières côtes et le haut des hanches."
    >
      <svg
        viewBox="0 0 440 340"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <!-- le tronc -->
        <g stroke="var(--color-peach)" stroke-width="3" opacity="0.7">
          <path
            d="M150 8C150 28 132 34 104 44C94 48 90 58 92 76C96 120 114 150 116 190C117 225 98 262 98 330"
          />
          <path
            d="M230 8C230 28 248 34 276 44C286 48 290 58 288 76C284 120 266 150 264 190C263 225 282 262 282 330"
          />
          <path d="M150 30C170 41 210 41 230 30" opacity="0.6" />
        </g>
        <!-- repères : dernières côtes et haut des hanches -->
        <g stroke="var(--color-peach)" stroke-width="1.5" stroke-dasharray="3 6" opacity="0.55">
          <line x1="104" y1="172" x2="276" y2="172" />
          <line x1="100" y1="236" x2="280" y2="236" />
        </g>
        <!-- à mi-distance -->
        <g stroke="var(--color-peach)" stroke-width="1.5" opacity="0.8">
          <path d="M296 172v64M291 172h10M291 236h10" />
        </g>
        <!-- le ruban : l'arrière en pointillé, l'avant plein avec ses graduations -->
        <path
          d="M116 204A74 13 0 0 1 264 204"
          stroke="var(--color-accent-500)"
          stroke-width="3"
          stroke-dasharray="2 7"
          opacity="0.7"
        />
        <path d="M116 204A74 13 0 0 0 264 204" stroke="var(--color-accent-500)" stroke-width="12" />
        <path
          d="M121 206A69 11 0 0 0 259 206"
          stroke="var(--color-plum-900)"
          stroke-width="5"
          stroke-dasharray="1.2 6.4"
          opacity="0.75"
        />
        <!-- fils vers les étiquettes -->
        <g stroke="var(--color-peach)" stroke-width="1.5" opacity="0.85">
          <path d="M92 172h14M92 236h10" />
          <path d="M268 204h26" stroke="var(--color-accent-500)" stroke-width="2" opacity="1" />
        </g>
        <g fill="var(--color-peach)">
          <circle cx="108" cy="172" r="3" />
          <circle cx="104" cy="236" r="3" />
        </g>
        <circle cx="266" cy="204" r="4" fill="var(--color-accent-500)" />
      </svg>
      <figcaption class="contents">
        <span
          class="absolute right-[79.1%] top-[calc(172/340*100%-0.6em)] text-right text-[12.5px] leading-tight text-on-plum"
          >Dernières côtes</span
        >
        <span
          class="absolute right-[79.1%] top-[calc(236/340*100%-0.6em)] text-right text-[12.5px] leading-tight text-on-plum"
          >Haut des hanches</span
        >
        <span class="absolute left-[68.2%] top-[calc(204/340*100%-1.05em)] w-[31.8%] leading-tight">
          <span class="block text-[12.5px] font-semibold text-peach">On mesure ici</span>
          <span class="block text-[11.5px] text-on-plum-subtle">à mi-distance</span>
        </span>
      </figcaption>
    </figure>
  `,
})
export class TourDeTaille {}
