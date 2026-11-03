import { Service, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';

const SITE_NAME = 'Dr Aïssatou Mamadou Fall';
const DEFAULT_TITLE = 'Dr Aïssatou Mamadou Fall – Endocrinologue à Dakar';
const SITE_ORIGIN = 'https://draissatoumamadou.com';

/**
 * Titre, adresse canonique et consigne « ne pas indexer » propres à chaque page.
 * Sans cela, toutes les pages avaient le titre de l'accueil et déclaraient l'accueil comme adresse canonique.
 */
@Service()
export class SiteTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(snapshot);
    this.title.setTitle(pageTitle ? `${pageTitle} | ${SITE_NAME}` : DEFAULT_TITLE);

    const path = snapshot.url.split(/[?#]/)[0].replace(/\/+$/, '');
    this.setCanonical(SITE_ORIGIN + path);
    this.setNoindex(this.deepest(snapshot.root).data['noindex'] === true);
  }

  private deepest(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let current = route;
    while (current.firstChild) current = current.firstChild;
    return current;
  }

  private setCanonical(href: string): void {
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = href || SITE_ORIGIN + '/';
  }

  private setNoindex(noindex: boolean): void {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!noindex) {
      meta?.remove();
      return;
    }
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';
  }
}
