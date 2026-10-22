import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export function roleGuard(allowedRole: 'ADMIN' | 'USER'): CanActivateFn {
  return async () => {
    const auth = inject(Auth);
    const router = inject(Router);

    await auth.whenReady();

    const user = auth.currentUser();
    if (!user) {
      return router.createUrlTree(['/login']);
    }

    if (user.role !== allowedRole) {
      return router.createUrlTree(['/']);
    }

    return true;
  };
}
