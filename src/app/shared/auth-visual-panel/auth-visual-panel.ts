import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteSettings } from '../../core/services/site-settings';

@Component({
  selector: 'app-auth-visual-panel',
  imports: [RouterLink],
  styleUrl: './auth-visual-panel.css',
  templateUrl: './auth-visual-panel.html',
})
export class AuthVisualPanel {
  protected readonly site = inject(SiteSettings);

  readonly points = [
    'Réservez un créneau en quelques clics',
    'Recevez un rappel avant chaque rendez-vous',
    'Retrouvez vos ordonnances et comptes rendus',
  ];
}
