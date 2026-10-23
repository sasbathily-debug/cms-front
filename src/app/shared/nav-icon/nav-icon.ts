import { Component, input } from '@angular/core';

export type NavIconName =
  'home' | 'cal' | 'pulse' | 'doc' | 'leaf' | 'user' | 'pin' | 'phone' | 'down' | 'plus' | 'check';

/** Petites icônes de navigation et d'action de l'espace patient. */
@Component({
  selector: 'app-nav-icon',
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @switch (name()) {
        @case ('home') {
          <path d="M3 11l9-8 9 8" />
          <path d="M5 10v10h14V10" />
        }
        @case ('cal') {
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        }
        @case ('pulse') {
          <path d="M3 12h4l3-7 4 14 3-7h4" />
        }
        @case ('doc') {
          <path d="M14 3v5a1 1 0 0 0 1 1h5" />
          <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
        }
        @case ('leaf') {
          <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" />
          <path d="M5 19l6-6" />
        }
        @case ('user') {
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
        }
        @case ('pin') {
          <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.3" />
        }
        @case ('phone') {
          <path
            d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
          />
        }
        @case ('down') {
          <path d="M12 4v12" />
          <path d="M7 11l5 5 5-5" />
          <path d="M5 20h14" />
        }
        @case ('plus') {
          <path d="M12 5v14M5 12h14" />
        }
        @case ('check') {
          <path d="M5 12l5 5 9-10" />
        }
      }
    </svg>
  `,
})
export class NavIcon {
  readonly name = input.required<NavIconName>();
  readonly size = input(20);
  readonly strokeWidth = input(1.8);
}
