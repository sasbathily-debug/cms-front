import { Component, input, model } from '@angular/core';

/**
 * Cadre commun des schémas à plusieurs situations : des boutons en haut, le schéma au milieu (contenu projeté),
 * une légende, puis le texte de la situation choisie. Le schéma lit la situation avec `[(actif)]`.
 */
@Component({
  selector: 'app-schema-onglets',
  template: `
    <div class="flex flex-col gap-4 rounded-[22px] bg-plum-800 p-4 sm:p-6">
      <div class="flex flex-wrap gap-2" role="group" [attr.aria-label]="groupe()">
        @for (libelle of libelles(); track libelle; let i = $index) {
          <button
            type="button"
            (click)="actif.set(i)"
            [attr.aria-pressed]="actif() === i"
            class="cursor-pointer rounded-full border-[1.5px] px-4 py-2 font-display text-[14px] font-semibold transition-colors duration-200"
            [class]="
              actif() === i
                ? 'border-accent-500 bg-accent-500 text-on-accent'
                : 'border-white/25 bg-transparent text-on-plum hover:border-peach'
            "
          >
            {{ libelle }}
          </button>
        }
      </div>
      <ng-content />
      <div class="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-on-plum-subtle">
        <ng-content select="[legende]" />
        <span class="ml-auto">Schéma simplifié, pour comprendre le principe.</span>
      </div>
      @if (cartes()[actif()]; as carte) {
        <div class="rounded-2xl bg-white/[0.05] px-5 py-4">
          <h3 class="m-0 font-display text-xl font-bold text-peach">{{ carte.title }}</h3>
          <p class="m-0 mt-2 text-[14.5px] leading-[1.65] text-on-plum-muted">{{ carte.text }}</p>
        </div>
      }
    </div>
  `,
})
export class SchemaOnglets {
  readonly libelles = input.required<string[]>();
  readonly cartes = input.required<{ title: string; text: string }[]>();
  readonly groupe = input('Situation à comparer');
  readonly actif = model(0);
}
