import { Component } from '@angular/core';
import { AppHeader } from '../app-header/app-header';
import { AppFooter } from '../app-footer/app-footer';
import { FloatingActions } from '../floating-actions/floating-actions';

/** Cadre commun des pages publiques : menu, pied de page, boutons d'appel et WhatsApp. */
@Component({
  selector: 'app-public-page',
  imports: [AppHeader, AppFooter, FloatingActions],
  template: `
    <div class="min-h-screen bg-cream-50 font-body text-ink-900">
      <app-header variant="public" />
      <main><ng-content /></main>
      <app-footer />
      <app-floating-actions />
    </div>
  `,
})
export class PublicPage {}
