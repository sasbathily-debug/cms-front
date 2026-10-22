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
              <stop offset="0" stop-color="#F6AE6B" />
              <stop offset="1" stop-color="#E0873F" />
            </linearGradient>
          </defs>
          <path [attr.d]="bubble" fill="url(#chat-3d-face)" />
          <path d="M8 8h24a4 4 0 0 1 4 4v3H4v-3a4 4 0 0 1 4-4z" fill="#fff" fill-opacity="0.28" />
          <circle cx="13" cy="20" r="2.3" fill="#1F1226" />
          <circle cx="20" cy="20" r="2.3" fill="#1F1226" />
          <circle cx="27" cy="20" r="2.3" fill="#1F1226" />
        </svg>
      </span>
    </span>
  `,
})
export class ChatIcon {
  protected readonly bubble =
    'M8 7h24a5 5 0 0 1 5 5v14a5 5 0 0 1-5 5H18l-9 7v-7H8a5 5 0 0 1-5-5V12a5 5 0 0 1 5-5z';
  protected readonly layers = [
    { z: -4, fill: '#7A430F' },
    { z: -2, fill: '#9A5518' },
    { z: 0, fill: '#C7702A' },
    { z: 2, fill: '#D07A33' },
  ];
}
