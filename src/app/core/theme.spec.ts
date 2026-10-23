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

  it("suit le thème clair quand le visiteur n'a rien choisi et que l'appareil ne dit rien", () => {
    const theme = TestBed.inject(Theme);
    expect(theme.current()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('bascule, pose data-theme sur <html> et garde le choix', () => {
    const theme = TestBed.inject(Theme);
    theme.toggle();
    expect(theme.isDark()).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    theme.toggle();
    expect(theme.current()).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('reprend le choix mémorisé à la visite suivante', () => {
    useStorage(fakeStorage({ theme: 'dark' }));
    const theme = TestBed.inject(Theme);
    expect(theme.current()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it("suit le réglage de l'appareil tant qu'aucun choix n'est fait", () => {
    let onChange: ((event: { matches: boolean }) => void) | undefined;
    vi.stubGlobal('matchMedia', () => ({
      matches: true,
      addEventListener: (_: string, fn: (event: { matches: boolean }) => void) => (onChange = fn),
    }));
    try {
      const theme = TestBed.inject(Theme);
      expect(theme.current()).toBe('dark');
      onChange?.({ matches: false });
      expect(theme.current()).toBe('light');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
