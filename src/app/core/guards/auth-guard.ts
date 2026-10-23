import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);

  // La session est vérifiée au démarrage ; si le serveur est lent, on attend sa réponse
  // plutôt que de renvoyer à tort un patient connecté vers la page de connexion.
  await auth.whenReady();

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
