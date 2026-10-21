import { AuthSteps } from '../../../shared/auth-steps/auth-steps';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  imports: [ReactiveFormsModule, AuthSteps],
  selector: 'app-verify-otp',
  styleUrl: './verify-otp.css',
  templateUrl: './verify-otp.html',
})
export class VerifyOtp implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly errorMessage = signal<string | null>(null);
  readonly resendMessage = signal<string | null>(null);
  readonly loading = signal(false);
  readonly email = signal('');

  readonly form = this.fb.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  ngOnInit(): void {
    this.email.set(this.route.snapshot.queryParamMap.get('email') ?? '');
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth.verifyOtp({ email: this.email(), otp: this.form.getRawValue().otp! }).subscribe({
      next: () => {
        this.loading.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const queryParams: Record<string, string> = { email: this.email() };
        if (returnUrl) {
          queryParams['returnUrl'] = returnUrl;
        }
        this.router.navigate(['/set-password'], { queryParams });
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Code invalide ou expiré.');
      },
    });
  }

  resend(): void {
    this.resendMessage.set(null);
    this.errorMessage.set(null);
    this.auth.resendOtp({ email: this.email() }).subscribe({
      next: () => this.resendMessage.set('Un nouveau code a été envoyé.'),
      error: (err) =>
        this.errorMessage.set(err.error?.message ?? "Impossible d'envoyer un nouveau code."),
    });
  }
}
