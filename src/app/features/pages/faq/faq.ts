import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { SiteContentService } from '../../../core/services/site-content';
import { FAQ_GROUPS, FaqGroup } from './faq.data';

const normalize = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

@Component({
  selector: 'app-faq',
  imports: [RouterLink, PublicPage, PageHero, CtaBand],
  styleUrl: './faq.css',
  templateUrl: './faq.html',
})
export class Faq {
  private readonly content = inject(SiteContentService);

  readonly crumbs = [{ label: 'Accueil', route: '/' }, { label: 'Questions fréquentes' }];
  readonly query = signal('');

  /** Questions gérées par la doctoresse dans l'espace admin, ajoutées après les thèmes ci-dessus. */
  private readonly cabinetGroup = signal<FaqGroup | null>(null);

  readonly bubbles = [
    { q: 'Dois-je créer un compte pour réserver ?', a: 'Oui, en une minute, depuis la page de rendez-vous.' },
    { q: 'Que dois-je apporter ?', a: 'Vos analyses récentes et la liste de vos médicaments.' },
    { q: "Et si j'ai une urgence ?", a: 'Appelez le SAMU au 1515. Ne passez pas par le site.' },
  ];

  readonly allGroups = computed(() => {
    const extra = this.cabinetGroup();
    return extra ? [...FAQ_GROUPS, extra] : FAQ_GROUPS;
  });

  readonly groups = computed(() => {
    const q = normalize(this.query().trim());
    if (!q) {
      return this.allGroups();
    }
    return this.allGroups()
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => normalize(item.question + ' ' + item.answer).includes(q)),
      }))
      .filter((group) => group.items.length > 0);
  });

  constructor() {
    this.content.getFaq().subscribe({
      next: (items) => {
        if (items.length) {
          this.cabinetGroup.set({
            id: 'cabinet',
            title: 'Les questions du cabinet',
            items: items.map((item) => ({ question: item.question, answer: item.answer })),
          });
        }
      },
      error: () => undefined,
    });
  }

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  scrollTo(id: string): void {
    this.query.set('');
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  }
}
