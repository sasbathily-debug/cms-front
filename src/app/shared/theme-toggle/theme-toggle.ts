import { Component, computed, inject, input } from '@angular/core';
import { Theme } from '../../core/theme';

/** Bouton rond clair / sombre. `onDark` : version pour les surfaces toujours sombres (en-tête, panneaux prune). */
@Component({
  selector: 'app-theme-toggle',
  template: `
    <button
      type="button"
      (click)="theme.toggle()"
      [attr.aria-label]="label()"
      [attr.title]="label()"
      class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition"
      [class]="
        onDark()
          ? 'border-white/40 bg-[rgba(20,11,25,0.55)] text-white hover:bg-white/10'
          : 'border-line-strong bg-surface text-fg hover:bg-sunken'
      "
    >
      @if (theme.isDark()) {
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path
            d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
          />
        </svg>
      } @else {
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.8 6.8 0 0 0 10.7 10.7z" />
        </svg>
      }
    </button>
  `,
})
export class ThemeToggle {
  protected readonly theme = inject(Theme);
  readonly onDark = input(false);
  protected readonly label = computed(() =>
    this.theme.isDark() ? 'Passer au thème clair' : 'Passer au thème sombre',
  );
}
