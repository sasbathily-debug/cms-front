import { Service, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { SiteContentService } from './site-content';
import { PageDef, mergeContent } from '../page-content/fields';

type Saved = Record<string, unknown> | null;

/**
 * Textes des pages du site : ceux d'origine, remplacés par ce que l'admin a saisi.
 * Chaque page n'est demandée qu'une fois ; si le serveur ne répond pas ou n'a rien pour la page,
 * ses textes d'origine s'affichent.
 */
@Service()
export class PageContent {
  private readonly content = inject(SiteContentService);
  private readonly saved = new Map<string, WritableSignal<Saved>>();
  private readonly requested = new Set<string>();

  /** Les textes de la page, toujours complets (jamais de champ manquant). */
  use<T extends object>(def: PageDef<T>): Signal<T> {
    this.load(def.slug);
    const saved = this.slot(def.slug);
    return computed(() => mergeContent(def.defaults, saved()));
  }

  /** Après une modification dans l'admin : le site affiche tout de suite le nouveau contenu. */
  setSaved(slug: string, content: Saved): void {
    this.requested.add(slug);
    this.slot(slug).set(content);
  }

  private load(slug: string): void {
    if (this.requested.has(slug)) return;
    this.requested.add(slug);
    this.content.getPage(slug).subscribe({
      next: (page) => this.slot(slug).set(page.content),
      error: () => this.slot(slug).set(null),
    });
  }

  private slot(slug: string): WritableSignal<Saved> {
    let slot = this.saved.get(slug);
    if (!slot) {
      slot = signal<Saved>(null);
      this.saved.set(slug, slot);
    }
    return slot;
  }
}
