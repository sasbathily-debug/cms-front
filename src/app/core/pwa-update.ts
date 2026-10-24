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

/**
 * Tient l'application à jour sans rien demander au visiteur.
 *  - Elle cherche une nouvelle version à l'ouverture, au retour sur l'application et toutes les 10 minutes.
 *  - Une version prête s'applique au prochain changement de page, sauf si un formulaire est en cours de saisie :
 *    un petit message « Actualiser » s'affiche alors à la place (jamais de rechargement qui efface une saisie).
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

  start(): void {
    const updates = this.updates;
    if (!updates?.isEnabled) return;

    updates.versionUpdates
      .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
      .subscribe(() => {
        this.ready.set(true);
        if (this.hasUnsavedForm()) this.prompt.set(true);
      });

    updates.unrecoverable.subscribe(() => void this.hardReload());

    this.router.events.pipe(filter((e) => e instanceof NavigationStart)).subscribe((event) => {
      if (this.ready() && !this.hasUnsavedForm()) {
        void this.applyThen(() => window.location.assign(event.url));
      } else if (this.ready()) {
        this.prompt.set(true);
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) void this.check();
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

  /** Un formulaire modifié par le visiteur : on ne recharge pas la page sous ses doigts. */
  private hasUnsavedForm(): boolean {
    return document.querySelector('form.ng-dirty') !== null;
  }
}
