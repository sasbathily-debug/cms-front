import { Service, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SiteContentService } from './site-content';
import { PageDef, mergeContent } from '../page-content/fields';
import { masquerBrouillons } from '../page-content/brouillons';

type Saved = Record<string, unknown> | null;

const CACHE_PREFIX = 'page-content:';

/** La mémoire du navigateur peut manquer (navigation privée, stockage plein) : le site marche alors sans elle. */
function readCache(slug: string): Saved {
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + slug);
    const value = raw ? (JSON.parse(raw) as unknown) : null;
    return value && typeof value === 'object' ? (value as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function writeCache(slug: string, content: Saved): void {
  try {
    if (content) window.localStorage.setItem(CACHE_PREFIX + slug, JSON.stringify(content));
    else window.localStorage.removeItem(CACHE_PREFIX + slug);
  } catch {
    // pas de mémoire : tant pis, la page se relira au serveur à chaque visite
  }
}

/**
 * Textes des pages du site : ceux d'origine, remplacés par ce que l'admin a saisi.
 * Chaque page n'est demandée qu'une fois par visite ; si le serveur ne répond pas ou n'a rien pour la page,
 * ses textes d'origine s'affichent. Les derniers textes reçus sont gardés dans le navigateur : à la visite suivante
 * la page s'ouvre directement avec eux, sans l'éclair des textes d'origine remplacés une seconde plus tard.
 */
@Service()
export class PageContent {
  private readonly content = inject(SiteContentService);
  private readonly saved = new Map<string, WritableSignal<Saved>>();
  private readonly requested = new Set<string>();

  /** Les textes de la page, toujours complets (jamais de champ manquant), sans repère « [à compléter] » : voir `brouillons.ts`. */
  use<T extends object>(def: PageDef<T>): Signal<T> {
    if (def.editable === false) {
      const propre = masquerBrouillons(def.defaults);
      return computed(() => propre);
    }
    this.load(def.slug);
    const saved = this.slot(def.slug);
    return computed(() => masquerBrouillons(mergeContent(def.defaults, saved())));
  }

  /** Après une modification dans l'admin : le site affiche tout de suite le nouveau contenu. */
  setSaved(slug: string, content: Saved): void {
    this.requested.add(slug);
    this.slot(slug).set(content);
    writeCache(slug, content);
  }

  /** Demande à l'avance les textes de ces pages (en tâche de fond) pour que leur ouverture soit immédiate. */
  prefetch(slugs: string[]): void {
    for (const slug of slugs) this.load(slug);
  }

  private load(slug: string): void {
    if (this.requested.has(slug)) return;
    this.requested.add(slug);
    this.content.getPage(slug).subscribe({
      next: (page) => {
        this.slot(slug).set(page.content);
        writeCache(slug, page.content);
      },
      error: (error: unknown) => {
        // Pas de page enregistrée (404) : on revient aux textes d'origine. Serveur injoignable ou en veille :
        // on garde les derniers textes connus plutôt que de les remplacer par ceux du code.
        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.slot(slug).set(null);
          writeCache(slug, null);
        }
      },
    });
  }

  private slot(slug: string): WritableSignal<Saved> {
    let slot = this.saved.get(slug);
    if (!slot) {
      slot = signal<Saved>(readCache(slug));
      this.saved.set(slug, slot);
    }
    return slot;
  }
}
