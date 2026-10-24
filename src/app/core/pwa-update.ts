import { Service, inject, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

/**
 * Niveau de l'arrêt d'urgence compris dans CE code. Le fichier `force-update.json` publié avec le site porte le
 * niveau demandé : s'il est plus grand que celui-ci, l'application est une version trop ancienne et se recharge
 * toute seule. Pour forcer tout le monde à se mettre à jour après un correctif important : augmenter ce nombre
 * ET celui de `public/force-update.json`, dans le même déploiement.
 */
export const FORCE_UPDATE_LEVEL = 1;

const CHECK_EVERY_MS = 10 * 60_000;
const MIN_GAP_MS = 60_000;
const FORCE_GUARD_KEY = 'force-update-at';
const FORCE_GUARD_MS = 2 * 60_000;
/** Une version qui arrive moins de 25 s après l'ouverture ou le retour sur l'application s'applique tout de suite. */
const FRESH_WINDOW_MS = 25_000;

/**
 * Tient l'application à jour sans rien demander au visiteur.
 *  - Elle cherche une nouvelle version à l'ouverture, au retour sur l'application et toutes les 10 minutes.
 *  - Une version qui arrive juste après l'ouverture ou le retour sur l'application s'applique tout de suite
 *    (le visiteur n'a encore rien lu ni saisi). Sinon elle s'applique au prochain changement de page.
 *  - Si le visiteur a saisi quelque chose ou ouvert le chat, jamais de rechargement sous ses doigts :
 *    un petit message « Actualiser » s'affiche à la place.
 *  - Arrêt d'urgence : si `force-update.json` demande un niveau plus récent, rechargement immédiat en vidant le cache.
 */
@Service()
export class PwaUpdate {
  /** Absent quand le service worker n'est pas fourni (développement, tests). */
  private readonly updates = inject(SwUpdate, { optional: true });
  private readonly router = inject(Router);

  /** Une nouvelle version est téléchargée et attend d'être appliquée. */
  readonly ready = signal(false);
  /** Une version est prête mais on attend la fin de la saisie : le message « Actualiser » s'affiche. */
  readonly prompt = signal(false);

  private lastCheck = 0;
  /** Dernière ouverture ou dernier retour sur l'application. */
  private foregroundAt = Date.now();
  /** Le visiteur a saisi du texte depuis l'ouverture de la page. */
  private typed = false;

  start(): void {
    const updates = this.updates;
    if (!updates?.isEnabled) return;

    updates.versionUpdates
      .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
      .subscribe(() => {
        this.ready.set(true);
        if (this.isBusy()) {
          this.prompt.set(true);
        } else if (Date.now() - this.foregroundAt < FRESH_WINDOW_MS) {
          void this.applyThen(() => window.location.reload());
        }
      });

    updates.unrecoverable.subscribe(() => void this.hardReload());

    this.router.events.pipe(filter((e) => e instanceof NavigationStart)).subscribe((event) => {
      if (this.ready() && !this.isBusy()) {
        void this.applyThen(() => window.location.assign(event.url));
      } else if (this.ready()) {
        this.prompt.set(true);
      }
    });

    document.addEventListener('input', () => (this.typed = true), true);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) return;
      this.foregroundAt = Date.now();
      void this.check();
    });
    window.setInterval(() => void this.check(), CHECK_EVERY_MS);
    void this.check();
  }

  /** Bouton « Actualiser » du message : applique la version prête tout de suite. */
  refreshNow(): void {
    void this.applyThen(() => window.location.reload());
  }

  private async check(): Promise<void> {
    if (document.hidden || Date.now() - this.lastCheck < MIN_GAP_MS) return;
    this.lastCheck = Date.now();
    try {
      await this.updates?.checkForUpdate();
    } catch {
      // hors ligne : on réessaiera au prochain passage
    }
    await this.checkForced();
  }

  private async checkForced(): Promise<void> {
    try {
      const response = await fetch('/force-update.json', { cache: 'no-store' });
      if (!response.ok) return;
      const wanted = ((await response.json()) as { level?: number }).level ?? 0;
      if (wanted > FORCE_UPDATE_LEVEL) await this.hardReload();
    } catch {
      // fichier absent ou réseau coupé : pas d'arrêt d'urgence
    }
  }

  private async applyThen(next: () => void): Promise<void> {
    try {
      await this.updates?.activateUpdate();
    } finally {
      next();
    }
  }

  /** Vide les caches et désinscrit le service worker, puis recharge : le visiteur repart d'une version neuve. */
  private async hardReload(): Promise<void> {
    try {
      const last = Number(window.sessionStorage.getItem(FORCE_GUARD_KEY) ?? 0);
      if (Date.now() - last < FORCE_GUARD_MS) return;
      window.sessionStorage.setItem(FORCE_GUARD_KEY, String(Date.now()));
    } catch {
      // pas de stockage de session : on tente quand même une fois
    }
    const registrations = await navigator.serviceWorker?.getRegistrations();
    await Promise.all((registrations ?? []).map((r) => r.unregister()));
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
    window.location.reload();
  }

  /**
   * Le visiteur est en train de faire quelque chose qu'un rechargement effacerait : il a saisi du texte, un formulaire
   * est modifié, ou le chat est ouvert (la conversation vit dans la page).
   */
  private isBusy(): boolean {
    return (
      this.typed ||
      document.querySelector('form.ng-dirty') !== null ||
      document.querySelector('.chat-panel') !== null
    );
  }
}
