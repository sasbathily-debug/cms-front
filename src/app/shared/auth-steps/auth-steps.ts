import { Component, input } from '@angular/core';

/** Les trois étapes de la création de compte : informations, code, mot de passe. */
@Component({
  selector: 'app-auth-steps',
  template: `
    <ol class="m-0 mb-8 flex list-none items-start p-0" aria-label="Étapes de création du compte">
      @for (label of labels; track label; let i = $index) {
        <li
          class="flex items-start"
          [class.flex-1]="i < labels.length - 1"
          [attr.aria-current]="step() === i + 1 ? 'step' : null"
        >
          <span class="flex flex-col items-center gap-2">
            <span
              class="flex h-[34px] w-[34px] items-center justify-center rounded-full border-2 font-display text-[15px] font-bold"
              [class]="
                i + 1 <= step()
                  ? 'border-accent-500 bg-accent-500 text-forest-900'
                  : 'border-[#D9C8B8] bg-white text-ink-600'
              "
              >{{ i + 1 }}</span
            >
            <span
              class="whitespace-nowrap text-[12.5px] font-semibold"
              [class]="i + 1 <= step() ? 'text-forest-900' : 'text-ink-600'"
              >{{ label }}</span
            >
          </span>
          @if (i < labels.length - 1) {
            <span
              class="mx-2 mt-[17px] h-0.5 flex-1"
              [class]="i + 1 < step() ? 'bg-accent-500' : 'bg-[#E8DACE]'"
            ></span>
          }
        </li>
      }
    </ol>
  `,
})
export class AuthSteps {
  readonly step = input.required<1 | 2 | 3>();
  readonly labels = ['Vos informations', 'Code', 'Mot de passe'];
}
