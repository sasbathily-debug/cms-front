import { Service, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HealthTipDto } from '../models/site-content.models';
import { ArticleView, SAMPLE_ARTICLES } from '../sample-content';
import { SiteContentService } from './site-content';

/** Photos de remplacement, dans l'ordre, pour les articles sans photo. */
const FALLBACK_PHOTOS = ['/img/photo-1.jpg', '/img/photo-2.jpg', '/img/photo-3.jpg'];

export function toArticleView(tip: HealthTipDto, index: number): ArticleView {
  return {
    category: tip.category?.trim() || 'Conseils',
    duration: tip.readingMinutes ? `${tip.readingMinutes} min` : '',
    title: tip.title,
    text: tip.body,
    photo: tip.photoUrl || FALLBACK_PHOTOS[index % FALLBACK_PHOTOS.length],
  };
}

/** Articles de « Conseils santé », publiés depuis l'admin ; les textes d'exemple servent tant que `sampleContent` est actif et que rien n'est publié. */
@Service()
export class SiteArticles {
  private readonly content = inject(SiteContentService);

  readonly items = signal<ArticleView[]>(environment.sampleContent ? SAMPLE_ARTICLES : []);

  /** « Tous » puis les thèmes présents, dans l'ordre d'apparition. */
  readonly categories = computed(() => [
    'Tous',
    ...new Set(this.items().map((article) => article.category)),
  ]);

  constructor() {
    this.content.getHealthTips().subscribe({
      next: (tips) => {
        if (tips.length > 0 || !environment.sampleContent) {
          this.items.set(tips.map(toArticleView));
        }
      },
      error: () => undefined,
    });
  }
}
