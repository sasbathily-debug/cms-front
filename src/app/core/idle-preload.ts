import { Service } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { EMPTY, Observable, mergeMap, of } from 'rxjs';

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

/** Pas de préchargement en économie de données ni sur une connexion très lente : le visiteur paie chaque octet. */
function connectionAllows(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (!connection) return true;
  return !connection.saveData && !/^(slow-2g|2g)$/.test(connection.effectiveType ?? '');
}

function whenIdle(): Observable<void> {
  return new Observable<void>((subscriber) => {
    const done = () => {
      subscriber.next();
      subscriber.complete();
    };
    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(done, { timeout: 4000 });
      return () => window.cancelIdleCallback(handle);
    }
    const handle = window.setTimeout(done, 1500);
    return () => window.clearTimeout(handle);
  });
}

/**
 * Charge à l'avance, quand le navigateur est au repos, le code des pages publiques marquées `data: { preload: true }`
 * (jamais l'admin ni l'espace patient). Le clic suivant n'attend plus le téléchargement de la page.
 */
@Service()
export class IdlePreload implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (!route.data?.['preload'] || !connectionAllows()) return EMPTY;
    return whenIdle().pipe(mergeMap(() => load() ?? of(null)));
  }
}
