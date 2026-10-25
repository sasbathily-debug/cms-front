import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { PageContent } from './page-content';
import { SiteContentService } from './site-content';
import { PageDef } from '../page-content/fields';
import { ALL_PAGES, PAGES, pageBySlug } from '../page-content/pages';

function fakeStorage(initial: Record<string, string> = {}): Storage {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    clear: () => data.clear(),
    key: (index: number) => [...data.keys()][index] ?? null,
    get length() {
      return data.size;
    },
  };
}

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
    Object.defineProperty(window, 'localStorage', { value: fakeStorage(), configurable: true });
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

describe('PageContent : mémoire du navigateur', () => {
  function setup(storage: Storage, getPage: ReturnType<typeof vi.fn>) {
    Object.defineProperty(window, 'localStorage', { value: storage, configurable: true });
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: SiteContentService, useValue: { getPage } }],
    });
    return TestBed.inject(PageContent);
  }

  it('affiche tout de suite les derniers textes reçus, puis les remplace par ceux du serveur', () => {
    const storage = fakeStorage({
      'page-content:essai': JSON.stringify({ titre: 'Texte en mémoire' }),
    });
    const answers = { next: undefined as ((v: unknown) => void) | undefined };
    const getPage = vi.fn(
      () =>
        new (class {
          subscribe(observer: { next: (v: unknown) => void }) {
            answers.next = observer.next;
            return { unsubscribe() {} };
          }
        })(),
    );
    const content = setup(storage, getPage).use(def());
    expect(content().titre).toBe('Texte en mémoire');

    answers.next?.({ slug: 'essai', content: { titre: 'Texte du serveur' }, updatedAt: '' });
    expect(content().titre).toBe('Texte du serveur');
    expect(storage.getItem('page-content:essai')).toContain('Texte du serveur');
  });

  it('garde les derniers textes connus quand le serveur est injoignable', () => {
    const storage = fakeStorage({
      'page-content:essai': JSON.stringify({ titre: 'Texte en mémoire' }),
    });
    const getPage = vi.fn(() => throwError(() => new HttpErrorResponse({ status: 0 })));
    expect(setup(storage, getPage).use(def())().titre).toBe('Texte en mémoire');
  });

  it('revient aux textes du code quand la page n’est plus enregistrée (404)', () => {
    const storage = fakeStorage({
      'page-content:essai': JSON.stringify({ titre: 'Texte en mémoire' }),
    });
    const getPage = vi.fn(() => throwError(() => new HttpErrorResponse({ status: 404 })));
    const content = setup(storage, getPage).use(def());
    expect(content().titre).toBe('Texte du code');
    expect(storage.getItem('page-content:essai')).toBeNull();
  });

  it('prefetch demande chaque page une seule fois', () => {
    const getPage = vi.fn(() => of({ slug: 'a', content: { titre: 'x' }, updatedAt: '' }));
    const service = setup(fakeStorage(), getPage);
    service.prefetch(['a', 'b']);
    service.prefetch(['a', 'b']);
    expect(getPage).toHaveBeenCalledTimes(2);
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
    expect(slugs.length).toBe(17);
  });
});
