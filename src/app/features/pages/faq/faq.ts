import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { CtaBand } from '../../../shared/cta-band/cta-band';
import { SiteSettings } from '../../../core/services/site-settings';
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

  readonly bubbles = [
    {
      q: 'Dois-je créer un compte pour réserver ?',
      a: 'Oui, en une minute avec votre numéro de téléphone.',
    },
    { q: 'Que dois-je apporter ?', a: 'Vos analyses récentes et la liste de vos médicaments.' },
    { q: "Et si j'ai une urgence ?", a: 'Appelez le SAMU au 1515. Ne passez pas par le site.' },
  ];

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
