import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export function roleGuard(allowedRole: 'ADMIN' | 'USER'): CanActivateFn {
  return () => {
    const auth = inject(Auth);
    const router = inject(Router);

    const user = auth.currentUser();
    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    if (user.role !== allowedRole) {
      router.navigate(['/']);
      return false;
    }

    return true;
  };
}
