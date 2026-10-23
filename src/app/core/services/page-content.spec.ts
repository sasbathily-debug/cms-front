import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PageContent } from './page-content';
import { SiteContentService } from './site-content';
import { PageDef } from '../page-content/fields';
import { ALL_PAGES, PAGES, pageBySlug } from '../page-content/pages';

const def = (editable?: boolean): PageDef<{ titre: string }> => ({
  slug: 'essai',
  title: 'Essai',
  route: '/essai',
  editable,
  fields: [{ key: 'titre', label: 'Titre', type: 'text' }],
  defaults: { titre: 'Texte du code' },
});

describe('PageContent', () => {
  function service(getPage: ReturnType<typeof vi.fn>) {
    TestBed.configureTestingModule({
      providers: [{ provide: SiteContentService, useValue: { getPage } }],
    });
    return TestBed.inject(PageContent);
  }

  it('remplace le texte du code par celui de l’admin', () => {
    const getPage = vi.fn(() =>
      of({ slug: 'essai', content: { titre: 'Texte admin' }, updatedAt: '' }),
    );
    const content = service(getPage).use(def());
    expect(content().titre).toBe('Texte admin');
  });

  it('garde le texte du code quand le serveur ne répond pas', () => {
    const getPage = vi.fn(() => throwError(() => new Error('hors ligne')));
    expect(service(getPage).use(def())().titre).toBe('Texte du code');
  });

  it('ne lit rien dans la base pour une page non modifiable', () => {
    const getPage = vi.fn(() =>
      of({ slug: 'essai', content: { titre: 'Ancien texte' }, updatedAt: '' }),
    );
    const content = service(getPage).use(def(false));
    expect(content().titre).toBe('Texte du code');
    expect(getPage).not.toHaveBeenCalled();
  });
});

describe('liste des pages de l’admin', () => {
  it('ne propose que les pages convenues', () => {
    expect(PAGES.map((p) => p.slug)).toEqual([
      'accueil',
      'a-propos',
      'le-cabinet',
      'premiere-consultation',
      'infos-pratiques',
      'contact',
      'pied-de-page',
    ]);
  });

  it('refuse d’ouvrir l’éditeur d’une page non modifiable', () => {
    expect(pageBySlug('specialites')).toBeUndefined();
    expect(pageBySlug('maladie-diabete')).toBeUndefined();
    expect(pageBySlug('rendez-vous')).toBeUndefined();
    expect(pageBySlug('contact')?.slug).toBe('contact');
  });

  it('décrit toutes les pages avec un identifiant unique', () => {
    const slugs = ALL_PAGES.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.length).toBe(14);
  });
});
