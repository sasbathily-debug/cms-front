import { Service, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { SKIP_AUTH_REDIRECT } from '../interceptors/auth-interceptor';
import { environment } from '../../../environments/environment';
import {
  CompleteRegistrationRequest,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  ResendOtpRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '../models/auth.models';
import { UserDto } from '../models/user.models';

@Service()
export class Auth {
  private readonly http = inject(HttpClient);

  private readonly user = signal<UserDto | null>(null);
  private readonly ready = signal(false);

  readonly currentUser = computed(() => this.user());
  readonly isAuthenticated = computed(() => !!this.user());
  readonly isReady = computed(() => this.ready());

  /** Checks for an existing session cookie. Awaited once at app bootstrap. */
  init(): Observable<UserDto | null> {
    return this.http
      .get<UserDto>(`${environment.apiUrl}/users/me`, {
        context: new HttpContext().set(SKIP_AUTH_REDIRECT, true),
      })
      .pipe(
        tap((user) => {
          this.user.set(user);
          this.ready.set(true);
        }),
        catchError(() => {
          this.user.set(null);
          this.ready.set(true);
          return of(null);
        }),
      );
  }

  login(request: LoginRequest): Observable<UserDto> {
    return this.http
      .post<UserDto>(`${environment.apiUrl}/auth/login`, request)
      .pipe(tap((user) => this.user.set(user)));
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/auth/register`, request);
  }

  verifyOtp(request: VerifyOtpRequest): Observable<VerifyOtpResponse> {
    return this.http.post<VerifyOtpResponse>(`${environment.apiUrl}/auth/verify-otp`, request);
  }

  completeRegistration(request: CompleteRegistrationRequest): Observable<UserDto> {
    return this.http
      .post<UserDto>(`${environment.apiUrl}/auth/complete-registration`, request)
      .pipe(tap((user) => this.user.set(user)));
  }

  resendOtp(request: ResendOtpRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/resend-otp`, request);
  }

  refresh(): Observable<UserDto> {
    return this.http
      .post<UserDto>(`${environment.apiUrl}/auth/refresh`, {})
      .pipe(tap((user) => this.user.set(user)));
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/logout`, {}).pipe(
      tap({
        next: () => this.clearSession(),
        error: () => this.clearSession(),
      }),
    );
  }

  clearSession(): void {
    this.user.set(null);
  }
}
