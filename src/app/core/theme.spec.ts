import { TestBed } from '@angular/core/testing';
import { Theme } from './theme';

/** Stockage en mémoire : l'environnement de test n'en fournit pas toujours un. */
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

function useStorage(storage: Storage): void {
  Object.defineProperty(window, 'localStorage', { value: storage, configurable: true });
}

describe('Theme', () => {
  beforeEach(() => {
    useStorage(fakeStorage());
    document.documentElement.removeAttribute('data-theme');
    TestBed.resetTestingModule();
  });

  it("s'ouvre en clair quand le visiteur n'a rien choisi", () => {
    const theme = TestBed.inject(Theme);
    expect(theme.current()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('bascule, pose data-theme sur <html> et garde le choix', () => {
    const theme = TestBed.inject(Theme);
    theme.toggle();
    expect(theme.isDark()).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(window.localStorage.getItem('theme')).toBe('dark');
    theme.toggle();
    expect(theme.current()).toBe('light');
    expect(window.localStorage.getItem('theme')).toBe('light');
  });

  it('reprend le choix mémorisé à la visite suivante', () => {
    useStorage(fakeStorage({ theme: 'dark' }));
    const theme = TestBed.inject(Theme);
    expect(theme.current()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it("reste clair même si l'appareil est réglé en sombre", () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: () => undefined }));
    try {
      const theme = TestBed.inject(Theme);
      expect(theme.current()).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
