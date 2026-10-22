import { Service, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FaqItemDto } from '../models/site-content.models';
import { FAQ_GROUPS, FaqGroup } from '../../features/pages/faq/faq.data';
import { FaqEntry, SAMPLE_HOME_FAQ } from '../sample-content';
import { SiteContentService } from './site-content';

const OTHER_GROUP = 'Autres questions';

const slug = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Range les questions par thème, dans l'ordre d'apparition du thème. */
export function toGroups(items: FaqItemDto[]): FaqGroup[] {
  const groups = new Map<string, FaqGroup>();
  for (const item of items) {
    const title = item.category?.trim() || OTHER_GROUP;
    let group = groups.get(title);
    if (!group) {
      group = { id: slug(title) || 'questions', title, items: [] };
      groups.set(title, group);
    }
    group.items.push({ question: item.question, answer: item.answer });
  }
  return [...groups.values()];
}

/** Questions fréquentes publiées depuis l'admin ; les textes d'exemple servent tant que `sampleContent` est actif et que rien n'est publié. */
@Service()
export class SiteFaq {
  private readonly content = inject(SiteContentService);

  private readonly loaded = signal<FaqItemDto[] | null>(null);

  private readonly useSamples = computed(() => {
    const items = this.loaded();
    return environment.sampleContent && (!items || items.length === 0);
  });

  /** La page FAQ : les questions par thème. */
  readonly groups = computed<FaqGroup[]>(() =>
    this.useSamples() ? FAQ_GROUPS : toGroups(this.loaded() ?? []),
  );

  /** L'accueil : les six premières questions. */
  readonly homeItems = computed<FaqEntry[]>(() =>
    this.useSamples()
      ? SAMPLE_HOME_FAQ
      : (this.loaded() ?? []).slice(0, 6).map((i) => ({ question: i.question, answer: i.answer })),
  );

  constructor() {
    this.content.getFaq().subscribe({
      next: (items) => this.loaded.set(items),
      error: () => undefined,
    });
  }
}
