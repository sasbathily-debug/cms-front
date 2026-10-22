import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Barre prune en haut des pages de connexion et de création de compte sur téléphone. */
@Component({
  selector: 'app-auth-mobile-bar',
  imports: [RouterLink],
  host: { class: 'block lg:hidden' },
  template: `
    <div class="flex items-center justify-between bg-forest-900 px-4 py-3.5 lg:hidden">
      <a routerLink="/" class="flex items-center gap-2.5">
        <span
          class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-accent-500"
        >
          <img src="/logo/logo-icon-dark.png" alt="" class="h-[70%] w-[70%] object-contain" />
        </span>
        <span class="font-display text-sm font-bold text-white">Dr Aïssatou Mamadou Fall</span>
      </a>
      <a routerLink="/" class="text-[13.5px] font-semibold text-[#F1C99B]">Accueil</a>
    </div>
  `,
})
export class AuthMobileBar {}
