import { ThemeToggle } from '../../../shared/theme-toggle/theme-toggle';
import { Component, computed, inject, signal, viewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { SiteSettings } from '../../../core/services/site-settings';
import { AuthVisualPanel } from '../../../shared/auth-visual-panel/auth-visual-panel';
import { OtpBoxes } from '../../../shared/otp-boxes/otp-boxes';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword
    ? { passwordsMismatch: true }
    : null;
}

/** « Mot de passe oublié » : l'adresse e-mail, puis le code reçu et le nouveau mot de passe. */
@Component({
  imports: [ThemeToggle, ReactiveFormsModule, RouterLink, AuthVisualPanel, OtpBoxes],
  selector: 'app-forgot-password',
  styleUrl: './forgot-password.css',
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly site = inject(SiteSettings);

  readonly step = signal<'email' | 'code'>('email');
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly infoMessage = signal<string | null>(null);
  readonly showPassword = signal(false);
  private readonly otpBoxes = viewChild(OtpBoxes);

  readonly emailForm = this.fb.group({
    email: [
      this.route.snapshot.queryParamMap.get('email') ?? '',
      [Validators.required, Validators.email],
    ],
  });

  readonly resetForm = this.fb.group(
    {
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator },
  );

  readonly passwordValue = signal('');
  readonly passwordLongEnough = computed(() => this.passwordValue().length >= 8);

  constructor() {
    this.resetForm.controls.password.valueChanges.subscribe((value) =>
      this.passwordValue.set(value ?? ''),
    );
  }

  private get email(): string {
    return this.emailForm.getRawValue().email!.trim();
  }

  onCode(code: string): void {
    this.resetForm.controls.otp.setValue(code);
  }

  sendCode(): void {
    const control = this.emailForm.controls.email;
    control.setValue((control.value ?? '').trim());
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      this.errorMessage.set('Saisissez une adresse e-mail valide.');
      return;
    }
    this.request(false);
  }

  resend(): void {
    this.request(true);
  }

  private request(isResend: boolean): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.infoMessage.set(null);

    this.auth.forgotPassword({ email: this.email }).subscribe({
      next: () => {
        this.loading.set(false);
        this.step.set('code');
        this.infoMessage.set(
          isResend
            ? 'Un nouveau code a été envoyé.'
            : `Si un compte existe pour ${this.email}, un code vient d'être envoyé.`,
        );
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.status === 429
            ? (err.error?.message ?? 'Veuillez patienter avant de redemander un code.')
            : "Impossible d'envoyer le code pour le moment. Réessayez dans un instant.",
        );
      },
    });
  }

  submitReset(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      const { otp, password, confirmPassword } = this.resetForm.controls;
      this.errorMessage.set(
        otp.invalid
          ? 'Saisissez les 6 chiffres du code reçu.'
          : password.hasError('minlength')
            ? 'Le mot de passe doit contenir au moins 8 caractères.'
            : confirmPassword.value && this.resetForm.hasError('passwordsMismatch')
              ? 'Les deux mots de passe ne sont pas identiques.'
              : 'Saisissez votre nouveau mot de passe et confirmez-le.',
      );
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.infoMessage.set(null);

    const { otp, password } = this.resetForm.getRawValue();
    this.auth.resetPassword({ email: this.email, otp: otp!, password: password! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login'], { queryParams: { reset: 1 } });
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Une erreur est survenue. Réessayez.');
        if (err.status === 400) {
          this.otpBoxes()?.clear();
        }
      },
    });
  }

  changeEmail(): void {
    this.step.set('email');
    this.errorMessage.set(null);
    this.infoMessage.set(null);
  }
}
