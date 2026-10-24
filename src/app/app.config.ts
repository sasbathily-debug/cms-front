import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  TitleStrategy,
  provideRouter,
  withInMemoryScrolling,
  withNavigationErrorHandler,
  withPreloading,
  withRouterConfig,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { firstValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { SiteTitleStrategy } from './core/site-title';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { Auth } from './core/services/auth';
import { IdlePreload } from './core/idle-preload';

/**
 * Après une mise à jour du site, un onglet resté ouvert garde l'ancienne version : le morceau de code de la
 * page demandée n'existe plus sur le serveur et le clic semblait ne rien faire jusqu'à un rechargement.
 * On recharge alors directement sur la page demandée.
 */
const STALE_CHUNK =
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError|Loading chunk/i;

function reloadOnStaleChunk(error: { error?: unknown; url: string }): void {
  const detail = error.error instanceof Error ? error.error.message : String(error.error ?? '');
  if (STALE_CHUNK.test(detail)) {
    window.location.assign(error.url);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' }),
      // Cliquer sur le lien de la page où l'on est déjà ramène en haut au lieu de ne rien faire.
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      withNavigationErrorHandler(reloadOnStaleChunk),
      // Les pages publiques se chargent en tâche de fond : le clic suivant est immédiat.
      withPreloading(IdlePreload),
    ),
    { provide: TitleStrategy, useClass: SiteTitleStrategy },
    // Application installable et pages publiques en cache. Actif seulement dans la version publiée, pas en développement.
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(() => {
      const auth = inject(Auth);
      // On n'attend la session que 3 secondes : si le serveur est en veille (offre gratuite), le site
      // s'affiche quand même et la session arrive ensuite ; les pages protégées attendent `whenReady()`.
      return Promise.race([
        firstValueFrom(auth.init()),
        new Promise<void>((resolve) => setTimeout(resolve, 3000)),
      ]);
    }),
  ],
};
