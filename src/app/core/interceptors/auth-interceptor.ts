import { HttpClient, HttpContext, HttpContextToken, HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Auth } from '../services/auth';

/** Marks a request that should never trigger the silent-refresh/redirect-to-login flow (e.g. the app-bootstrap session check). */
export const SKIP_AUTH_REDIRECT = new HttpContextToken<boolean>(() => false);

const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/verify-otp',
  '/auth/complete-registration',
  '/auth/resend-otp',
  '/auth/logout',
];
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function withCredentialsAndCsrf<T>(req: HttpRequest<T>): HttpRequest<T> {
  let outgoing = req.clone({ withCredentials: true });
  if (MUTATING_METHODS.has(req.method)) {
    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
      outgoing = outgoing.clone({ setHeaders: { 'X-XSRF-TOKEN': csrfToken } });
    }
  }
  return outgoing;
}

/**
 * The server toggles the XSRF-TOKEN cookie on every authenticated request (clears it if the
 * request carried one, reissues it if not) as an anti-fixation measure. A logged-in user's
 * session cookie can therefore "use up" the CSRF cookie on an unrelated GET (e.g. the
 * app-bootstrap session check), leaving a mutating request right after with nothing to send.
 * Make sure one exists immediately before sending a mutating request.
 */
function ensureCsrfCookie(http: HttpClient): Observable<unknown> {
  if (getCookie('XSRF-TOKEN')) {
    return of(null);
  }
  return http
    .get(`${environment.apiUrl}/users/me`, { context: new HttpContext().set(SKIP_AUTH_REDIRECT, true) })
    .pipe(catchError(() => of(null)));
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const http = inject(HttpClient);

  const isPublic = PUBLIC_PATHS.some((path) => req.url.includes(path));

  const send = () =>
    next(withCredentialsAndCsrf(req)).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !isPublic && !req.context.get(SKIP_AUTH_REDIRECT)) {
          return auth.refresh().pipe(
            switchMap(() => next(withCredentialsAndCsrf(req))),
            catchError((refreshError) => {
              auth.clearSession();
              router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
              return throwError(() => refreshError);
            }),
          );
        }
        return throwError(() => error);
      }),
    );

  if (MUTATING_METHODS.has(req.method) && !getCookie('XSRF-TOKEN')) {
    return ensureCsrfCookie(http).pipe(switchMap(() => send()));
  }

  return send();
};
