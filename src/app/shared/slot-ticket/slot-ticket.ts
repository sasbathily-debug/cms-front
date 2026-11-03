import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NextSlot } from '../../core/services/next-slot';

/**
 * Étiquette du prochain créneau libre : un ticket de rendez-vous à souche (le jour à gauche, une ligne en pointillés
 * entre deux encoches, la phrase à droite). Elle renvoie vers la réservation et ne s'affiche que s'il y a un créneau ;
 * sinon, le contenu placé à l'intérieur de la balise (par exemple un bouton) s'affiche à sa place.
 * Les encoches prennent la couleur du fond qui l'entoure : `--ticket-fond` (la couleur de la page par défaut).
 */
@Component({
  selector: 'app-slot-ticket',
  imports: [RouterLink],
  template: `
    @if (slots.ticket(); as t) {
      <a
        routerLink="/rendez-vous"
        class="relative flex w-full items-stretch overflow-hidden rounded-[14px] border border-line bg-surface no-underline transition-colors hover:border-accent-500"
      >
        <span
          class="flex w-16 shrink-0 flex-col items-center justify-center gap-0.5 bg-accent-soft py-2 font-display"
        >
          <span class="text-xs font-bold leading-none tracking-[0.12em] text-accent-800">{{
            t.jour
          }}</span>
          <span class="text-2xl font-bold leading-none text-fg">{{ t.numero }}</span>
        </span>
        <span
          aria-hidden="true"
          class="absolute inset-y-0 left-16 border-l-2 border-dashed border-line-strong"
        ></span>
        <span
          aria-hidden="true"
          class="absolute -top-[9px] left-[56px] h-[18px] w-[18px] rounded-full border border-line bg-[var(--ticket-fond,var(--color-page))]"
        ></span>
        <span
          aria-hidden="true"
          class="absolute -bottom-[9px] left-[56px] h-[18px] w-[18px] rounded-full border border-line bg-[var(--ticket-fond,var(--color-page))]"
        ></span>
        <span class="flex flex-1 items-center justify-between gap-2 px-4 py-2 font-display">
          <span class="flex flex-col gap-[3px]">
            <span class="text-xs font-semibold leading-none tracking-[0.09em] text-accent-700"
              >PROCHAIN CRÉNEAU LIBRE</span
            >
            <span class="text-base font-bold leading-tight text-fg">{{ t.phrase }}</span>
          </span>
          <span aria-hidden="true" class="text-xl font-bold leading-none text-accent-800">→</span>
        </span>
      </a>
    } @else {
      <ng-content />
    }
  `,
})
export class SlotTicket {
  protected readonly slots = inject(NextSlot);
}
