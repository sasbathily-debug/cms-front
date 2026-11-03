import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { SiteSettings } from '../../../core/services/site-settings';
import { PageContent } from '../../../core/services/page-content';
import { FAQ_PAGE } from '../../../core/page-content/defs/faq';
import { SiteFaq } from '../../../core/services/site-faq';

const normalize = (text: string): string => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

@Component({
  selector: 'app-faq',
  imports: [RouterLink, PublicPage, PageHero, CtaBand],
  styleUrl: './faq.css',
  templateUrl: './faq.html',
})
export class Faq {
  readonly crumbs = [{ label: 'Accueil', route: '/' }, { label: 'Questions fréquentes' }];
  readonly query = signal('');

  protected readonly c = inject(PageContent).use(FAQ_PAGE);

  /** Les bulles animées ; `{urgence}` est remplacé par le numéro saisi dans les réglages. */
  readonly bubbles = computed(() =>
    this.c().bulles.map((b) => ({ q: b.q, a: this.withUrgence(b.a) })),
  );

  /** Remplace `{urgence}` par le numéro d'urgence des réglages (à défaut, le SAMU national). */
  protected withUrgence(text: string): string {
    return text.replace('{urgence}', this.site.emergencyNumber());
  }

  protected readonly site = inject(SiteSettings);
  private readonly siteFaq = inject(SiteFaq);
  readonly allGroups = this.siteFaq.groups;

  readonly groups = computed(() => {
    const q = normalize(this.query().trim());
    if (!q) {
      return this.allGroups();
    }
    return this.allGroups()
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          normalize(item.question + ' ' + item.answer).includes(q),
        ),
      }))
      .filter((group) => group.items.length > 0);
  });

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  scrollTo(id: string): void {
    this.query.set('');
    setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      0,
    );
  }
}
