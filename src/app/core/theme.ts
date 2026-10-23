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
 * Thème clair ou sombre. Le site s'ouvre en clair (le design validé) quel que soit le réglage de l'appareil ;
 * le sombre n'apparaît que si le visiteur le choisit, et son choix est alors gardé sur cet appareil.
 * Le thème s'applique en posant `data-theme` sur <html> (le script de index.html le fait avant le
 * premier affichage, sans flash).
 * Pour suivre le réglage de l'appareil plutôt que le clair, lire `prefers-color-scheme` ici et dans index.html.
 */
@Service()
export class Theme {
  private readonly document = inject(DOCUMENT);
  private readonly chosen = signal<ThemeName>(readStored() ?? 'light');

  readonly current = this.chosen.asReadonly();
  readonly isDark = computed(() => this.chosen() === 'dark');

  constructor() {
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
