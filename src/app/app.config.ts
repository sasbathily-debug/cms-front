import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { Auth } from './core/services/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' }),
      // Cliquer sur le lien de la page où l'on est déjà ramène en haut au lieu de ne rien faire.
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(() => firstValueFrom(inject(Auth).init())),
  ],
};
