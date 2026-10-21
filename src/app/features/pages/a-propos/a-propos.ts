import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { SiteContentService } from '../../../core/services/site-content';
import { SiteSettings } from '../../../core/services/site-settings';
import { OptimizedImagePipe } from '../../../shared/optimized-image.pipe';

/** Texte d'exemple : les passages entre crochets sont à remplir avec la doctoresse. */
const PARCOURS = [
  { periode: '[Années]', titre: 'Doctorat en médecine', lieu: '[Université, ville, pays]' },
  { periode: '[Années]', titre: 'Spécialisation en endocrinologie, diabétologie et maladies métaboliques', lieu: '[Établissement, ville, pays]' },
  { periode: '[Années]', titre: 'Formation en nutrition clinique', lieu: '[Diplôme universitaire, établissement]' },
  { periode: '[Années]', titre: 'Exercice hospitalier', lieu: '[Service, structure, responsabilités]' },
  { periode: 'Depuis [année]', titre: "Cabinet d'endocrinologie et de nutrition", lieu: 'Sacré-Cœur, Dakar' },
];

const VALEURS = [
  { sym: 'Éc', titre: 'Écoute', texte: 'Chaque patient arrive avec son histoire, ses habitudes et ses craintes. La consultation commence toujours par vous écouter.' },
  { sym: 'Pé', titre: 'Pédagogie', texte: "Comprendre sa maladie rend le traitement plus facile à suivre. J'explique avec des mots simples, autant de fois que nécessaire." },
  { sym: 'Su', titre: 'Suivi dans la durée', texte: "Un plan de soins n'est jamais figé : nous l'ajustons ensemble, consultation après consultation." },
];

@Component({
  selector: 'app-a-propos',
  imports: [RouterLink, PublicPage, CtaBand, OptimizedImagePipe],
  templateUrl: './a-propos.html',
})
export class APropos {
  private readonly content = inject(SiteContentService);
  protected readonly site = inject(SiteSettings);

  readonly parcours = PARCOURS;
  readonly valeurs = VALEURS;

  readonly bandImage = signal<string | null>(null);
  readonly portraitUrl = computed(() => this.site.settings()?.aboutImageUrl || null);
  readonly aboutText = computed(() => this.site.settings()?.aboutText || null);

  constructor() {
    this.content.getHeroImages().subscribe({
      next: (images) => this.bandImage.set(images[0]?.imageUrl ?? null),
      error: () => undefined,
    });
  }
}
