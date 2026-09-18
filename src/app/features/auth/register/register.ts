import { Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { AuthVisualPanel } from '../../../shared/auth-visual-panel/auth-visual-panel';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword ? { passwordsMismatch: true } : null;
}

@Component({
  imports: [ReactiveFormsModule, RouterLink, AuthVisualPanel],
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
  readonly loading = signal(false);

  readonly form = this.fb.group(
    {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator },
  );

  readonly passwordValue = signal('');
  readonly passwordLongEnough = computed(() => this.passwordValue().length >= 8);

  constructor() {
    this.form.controls.password.valueChanges.subscribe((value) => this.passwordValue.set(value ?? ''));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const value = this.form.getRawValue();
    this.auth
      .register({
        firstName: value.firstName!,
        lastName: value.lastName!,
        email: value.email!,
        password: value.password!,
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
          this.errorMessage.set(err.error?.message ?? 'Une erreur est survenue. Réessayez.');
        },
      });
  }
}
