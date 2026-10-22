import { Component, input } from '@angular/core';
import { HomeHeader } from '../home-header/home-header';
import { AppFooter } from '../app-footer/app-footer';
import { FloatingActions } from '../floating-actions/floating-actions';

/** Cadre commun des pages publiques : menu, pied de page, boutons d'appel et WhatsApp. */
@Component({
  selector: 'app-public-page',
  imports: [HomeHeader, AppFooter, FloatingActions],
  template: `
    <div
      class="min-h-screen font-body"
      [class]="tileHeader() ? 'bg-[#140B19] text-[#F3EAE0]' : 'bg-cream-50 text-ink-900'"
    >
      @if (!tileHeader()) {
        <app-home-header variant="bar" />
      }
      <div class="relative">
        @if (tileHeader()) {
          <app-home-header />
        }
        <main><ng-content /></main>
      </div>
      <app-footer />
      <div [class]="hideFloatingOnMobile() ? 'hidden lg:block' : ''"><app-floating-actions /></div>
    </div>
  `,
})
export class PublicPage {
  /** Sur l'accueil, le menu à tuiles se pose sur la photo ; ailleurs, il forme une barre sombre fixe en haut. */
  readonly tileHeader = input(false);

  /** Sur l'accueil mobile, la barre de réservation remplace les boutons ronds flottants. */
  readonly hideFloatingOnMobile = input(false);
}
