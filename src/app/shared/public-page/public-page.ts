import { Component, input } from '@angular/core';
import { AppHeader } from '../app-header/app-header';
import { HomeHeader } from '../home-header/home-header';
import { AppFooter } from '../app-footer/app-footer';
import { FloatingActions } from '../floating-actions/floating-actions';

/** Cadre commun des pages publiques : menu, pied de page, boutons d'appel et WhatsApp. */
@Component({
  selector: 'app-public-page',
  imports: [AppHeader, HomeHeader, AppFooter, FloatingActions],
  template: `
    <div class="min-h-screen bg-cream-50 font-body text-ink-900">
      @if (!tileHeader()) {
        <app-header variant="public" />
      }
      <div class="relative">
        @if (tileHeader()) {
          <app-home-header />
        }
        <main><ng-content /></main>
      </div>
      <app-footer />
      <app-floating-actions />
    </div>
  `,
})
export class PublicPage {
  /** Sur l'accueil, le menu à tuiles se pose sur la photo au lieu de la barre blanche. */
  readonly tileHeader = input(false);
}
