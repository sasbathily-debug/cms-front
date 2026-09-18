import { Service, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  ResendOtpRequest,
  VerifyOtpRequest,
} from '../models/auth.models';

interface JwtClaims {
  sub: string;
  email: string;
  role: 'ADMIN' | 'USER';
  exp: number;
}

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

function decodeJwt(token: string): JwtClaims | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

@Service()
export class Auth {
  private readonly http = inject(HttpClient);

  private readonly accessToken = signal<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY));

  readonly isAuthenticated = computed(() => !!this.accessToken());
  readonly currentUser = computed(() => {
    const token = this.accessToken();
    return token ? decodeJwt(token) : null;
  });

  getAccessToken(): string | null {
    return this.accessToken();
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(tap((res) => this.storeTokens(res)));
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/auth/register`, request);
  }

  verifyOtp(request: VerifyOtpRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/verify-otp`, request)
      .pipe(tap((res) => this.storeTokens(res)));
  }

  resendOtp(request: ResendOtpRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/resend-otp`, request);
  }

  refresh(): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, {
        refreshToken: this.getRefreshToken(),
      })
      .pipe(tap((res) => this.storeTokens(res)));
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/logout`, {}).pipe(
      tap({
        next: () => this.clearTokens(),
        error: () => this.clearTokens(),
      }),
    );
  }

  private storeTokens(res: AuthResponse): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
    this.accessToken.set(res.accessToken);
  }

  private clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.accessToken.set(null);
  }
}
