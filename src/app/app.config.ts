import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { Auth } from './core/services/auth';

/** Chemin de la page affichée (sans le #fragment) : sert à ne pas animer un simple saut d'ancre. */
function leafPath(root: ActivatedRouteSnapshot): string {
  const parts: string[] = [];
  for (let r: ActivatedRouteSnapshot | null = root; r; r = r.firstChild) {
    parts.push(r.url.map((segment) => segment.path).join('/'));
  }
  return parts.join('/');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' }),
      withViewTransitions({
        // Au premier chargement il n'y a pas de page précédente : rien à animer.
        skipInitialTransition: true,
        onViewTransitionCreated: ({ transition, from, to }) => {
          if (leafPath(from) === leafPath(to)) transition.skipTransition();
        },
      }),
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(() => firstValueFrom(inject(Auth).init())),
  ],
};
