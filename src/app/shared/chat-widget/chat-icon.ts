import { Component } from '@angular/core';

/** Icône du chat : une bulle de dialogue orange empilée en couches, qui pivote doucement (CSS 3D). */
@Component({
  selector: 'app-chat-icon',
  styleUrl: './chat-icon.css',
  template: `
    <span class="chat-3d" aria-hidden="true">
      <span class="chat-3d-body">
        @for (layer of layers; track layer.z) {
          <svg viewBox="0 0 40 40" [style.transform]="'translateZ(' + layer.z + 'px)'">
            <path [attr.d]="bubble" [attr.fill]="layer.fill" />
          </svg>
        }
        <svg viewBox="0 0 40 40" style="transform: translateZ(4px)">
          <defs>
            <linearGradient id="chat-3d-face" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="var(--color-accent-300)" />
              <stop offset="1" stop-color="var(--color-accent-500)" />
            </linearGradient>
          </defs>
          <path [attr.d]="bubble" fill="url(#chat-3d-face)" />
          <path
            d="M8 8h24a4 4 0 0 1 4 4v3H4v-3a4 4 0 0 1 4-4z"
            fill="var(--color-white)"
            fill-opacity="0.28"
          />
          <circle cx="13" cy="20" r="2.3" fill="var(--color-plum-900)" />
          <circle cx="20" cy="20" r="2.3" fill="var(--color-plum-900)" />
          <circle cx="27" cy="20" r="2.3" fill="var(--color-plum-900)" />
        </svg>
      </span>
    </span>
  `,
})
export class ChatIcon {
  protected readonly bubble =
    'M8 7h24a5 5 0 0 1 5 5v14a5 5 0 0 1-5 5H18l-9 7v-7H8a5 5 0 0 1-5-5V12a5 5 0 0 1 5-5z';
  protected readonly layers = [
    { z: -4, fill: 'var(--color-accent-800)' },
    { z: -2, fill: 'var(--color-accent-700)' },
    { z: 0, fill: 'var(--color-accent-600)' },
    { z: 2, fill: 'var(--color-accent-550)' },
  ];
}
