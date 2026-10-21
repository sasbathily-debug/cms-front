import { Component, input } from '@angular/core';

/** Les trois étapes de la création de compte : les étapes faites passent en prune avec une coche. */
@Component({
  selector: 'app-auth-steps',
  template: `
    <ol class="m-0 flex list-none items-start p-0" aria-label="Étapes de création du compte">
      @for (label of labels; track label; let i = $index) {
        <li class="contents" [attr.aria-current]="step() === i + 1 ? 'step' : null">
          <span class="flex flex-none flex-col items-center gap-2">
            <span
              class="flex h-[34px] w-[34px] items-center justify-center rounded-full border-2 font-display text-[15px] font-bold"
              [class]="
                i + 1 < step()
                  ? 'border-forest-900 bg-forest-900 text-cream-50'
                  : i + 1 === step()
                    ? 'border-accent-500 bg-accent-500 text-forest-900'
                    : 'border-[#D9C8B8] bg-white text-[#8A7E88]'
              "
            >
              @if (i + 1 < step()) {
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12l5 5 9-10" />
                </svg>
              } @else {
                {{ i + 1 }}
              }
            </span>
            <span
              class="whitespace-nowrap text-[12.5px]"
              [class]="
                i + 1 === step()
                  ? 'font-semibold text-forest-900'
                  : i + 1 < step()
                    ? 'font-medium text-forest-900'
                    : 'font-medium text-[#8A7E88]'
              "
              >{{ label }}</span
            >
          </span>
          @if (i < labels.length - 1) {
            <span
              class="mx-2 mt-[17px] h-0.5 flex-1"
              [class]="i + 1 < step() ? 'bg-forest-900' : 'bg-[#D9C8B8]'"
            ></span>
          }
        </li>
      }
    </ol>
  `,
})
export class AuthSteps {
  readonly step = input.required<1 | 2 | 3>();
  readonly labels = ['Vos informations', 'Vérification', 'Mot de passe'];
}
