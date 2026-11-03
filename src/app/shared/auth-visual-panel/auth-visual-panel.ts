import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MALADIES } from '../../features/pages/maladie/maladies.data';
import { SiteSettings } from '../../core/services/site-settings';

/** Le jour de l'année (1 à 366), pour qu'un même conseil reste affiché toute la journée et change le lendemain. */
function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  return Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start) / 86_400_000,
  );
}

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

  /** La phrase de la doctoresse, en grand. */
  readonly phrase = input('Votre suivi, à votre rythme.');

  /** Un conseil du suivi, tiré des conseils déjà publiés sur la page Diabète ; il change chaque jour. */
  protected readonly conseil = (() => {
    const conseils = MALADIES['diabete'].quotidien;
    return conseils[dayOfYear(new Date()) % conseils.length];
  })();
}
