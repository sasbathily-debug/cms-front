import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteSettings } from '../../core/services/site-settings';

@Component({
  selector: 'app-auth-visual-panel',
  // Le panneau reste plein écran et fixe pendant qu'on fait défiler un formulaire plus haut que l'écran.
  host: { class: 'block lg:sticky lg:top-0 lg:h-screen' },
  imports: [RouterLink],
  styleUrl: './auth-visual-panel.css',
  templateUrl: './auth-visual-panel.html',
})
export class AuthVisualPanel {
  protected readonly site = inject(SiteSettings);

  readonly points = [
    'Réservez un créneau en quelques clics',
    'Recevez un rappel la veille de chaque rendez-vous',
    "Retrouvez l'historique de vos consultations",
  ];
}
