import { AuthSteps } from '../../../shared/auth-steps/auth-steps';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { AuthVisualPanel } from '../../../shared/auth-visual-panel/auth-visual-panel';

@Component({
  imports: [ReactiveFormsModule, RouterLink, AuthVisualPanel, AuthSteps],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

  readonly errorMessage = signal<string | null>(null);
  readonly unverifiedEmail = signal<string | null>(null);
  readonly loading = signal(false);

  readonly form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.unverifiedEmail.set(null);

    const value = this.form.getRawValue();
    this.auth
      .register({
        firstName: value.firstName!,
        lastName: value.lastName!,
        email: value.email!,
        phone: value.phone!,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          const queryParams: Record<string, string> = { email: value.email! };
          if (this.returnUrl) {
            queryParams['returnUrl'] = this.returnUrl;
          }
          this.router.navigate(['/verify-otp'], { queryParams });
        },
        error: (err) => {
          this.loading.set(false);
          if (err.status === 409 && err.error?.accountVerified === false) {
            this.errorMessage.set(
              "Un compte existe déjà avec cet email mais n'a pas encore été vérifié.",
            );
            this.unverifiedEmail.set(value.email!);
          } else {
            this.errorMessage.set(err.error?.message ?? 'Une erreur est survenue. Réessayez.');
          }
        },
      });
  }
}
