import { Service, computed, signal } from '@angular/core';
import { environment } from '../../environments/environment';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isStandalone(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches === true ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** iPhone et iPad (l'iPad récent se déclare comme un Mac, avec un écran tactile). */
function isIos(): boolean {
  const ua = navigator.userAgent;
  return (
    /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && (navigator.maxTouchPoints ?? 0) > 1)
  );
}

/**
 * Installation de l'application. Chrome, Edge et Android proposent un vrai bouton : on garde l'événement pour
 * l'offrir depuis notre propre lien. Sur iPhone, rien n'est proposé par Safari : on affiche le mode d'emploi.
 */
@Service()
export class PwaInstall {
  private deferred: BeforeInstallPromptEvent | null = null;
  private readonly installed = signal(isStandalone());
  private readonly promptReady = signal(false);
  private readonly ios = isIos();

  /** Le mode d'emploi pour iPhone est affiché. */
  readonly iosHelp = signal(false);

  /** Le lien « Installer l'application » doit apparaître. */
  readonly available = computed(
    () => environment.production && !this.installed() && (this.promptReady() || this.ios),
  );

  constructor() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferred = event as BeforeInstallPromptEvent;
      this.promptReady.set(true);
    });
    window.addEventListener('appinstalled', () => {
      this.installed.set(true);
      this.deferred = null;
      this.promptReady.set(false);
    });
  }

  async install(): Promise<void> {
    if (this.deferred) {
      const prompt = this.deferred;
      this.deferred = null;
      this.promptReady.set(false);
      await prompt.prompt();
      await prompt.userChoice;
      return;
    }
    if (this.ios) this.iosHelp.update((open) => !open);
  }
}
