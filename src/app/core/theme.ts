import { DOCUMENT } from '@angular/common';
import { Service, computed, inject, signal } from '@angular/core';

export type ThemeName = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const THEME_COLOR: Record<ThemeName, string> = { light: '#1f1226', dark: '#150c1a' };

/** Le stockage peut être indisponible (navigation privée) : le thème marche alors sans mémoire. */
function readStored(): ThemeName | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

/**
 * Thème clair ou sombre. Tant que le visiteur n'a rien choisi, on suit le réglage de son appareil ;
 * son choix, une fois fait, est gardé sur cet appareil. Le thème s'applique en posant
 * `data-theme` sur <html> (le script de index.html le fait avant le premier affichage, sans flash).
 */
@Service()
export class Theme {
  private readonly document = inject(DOCUMENT);
  /** Absent dans certains environnements (tests) : on suit alors le thème clair. */
  private readonly systemQuery =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null;

  /** Le choix du visiteur, ou null s'il suit son appareil. */
  private readonly chosen = signal<ThemeName | null>(readStored());
  private readonly systemDark = signal(this.systemQuery?.matches ?? false);

  readonly current = computed<ThemeName>(
    () => this.chosen() ?? (this.systemDark() ? 'dark' : 'light'),
  );
  readonly isDark = computed(() => this.current() === 'dark');

  constructor() {
    this.systemQuery?.addEventListener('change', (event) => this.systemDark.set(event.matches));
    this.apply();
  }

  toggle(): void {
    this.set(this.isDark() ? 'light' : 'dark');
  }

  set(theme: ThemeName): void {
    this.chosen.set(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // pas de mémoire : le choix vaut pour cette visite seulement
    }
    this.apply();
  }

  private apply(): void {
    const theme = this.current();
    this.document.documentElement.setAttribute('data-theme', theme);
    this.document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[theme]);
  }
}
