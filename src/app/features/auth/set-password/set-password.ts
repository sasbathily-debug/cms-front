import { AuthSteps } from '../../../shared/auth-steps/auth-steps';
import { Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  ReactiveFormsModule,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { AuthVisualPanel } from '../../../shared/auth-visual-panel/auth-visual-panel';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword
    ? { passwordsMismatch: true }
    : null;
}

@Component({
  imports: [ReactiveFormsModule, RouterLink, AuthVisualPanel, AuthSteps],
  selector: 'app-set-password',
  styleUrl: './set-password.css',
  templateUrl: './set-password.html',
})
export class SetPassword {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly email = signal('');
  readonly phone = signal('');
  readonly showPassword = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly loading = signal(false);

  readonly form = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator },
  );

  readonly passwordValue = signal('');
  readonly passwordLongEnough = computed(() => this.passwordValue().length >= 8);

  constructor() {
    this.email.set(this.route.snapshot.queryParamMap.get('email') ?? '');
    this.phone.set(this.route.snapshot.queryParamMap.get('phone') ?? '');
    this.form.controls.password.valueChanges.subscribe((value) =>
      this.passwordValue.set(value ?? ''),
    );
  }

  /** Ce qui s'affiche sous le titre : le numéro saisi, ou l'e-mail à défaut. */
  recipient(): string {
    return this.phone() ? `+221 ${this.phone()}` : this.email();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth
      .completeRegistration({ email: this.email(), password: this.form.getRawValue().password! })
      .subscribe({
        next: () => {
          this.loading.set(false);
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
            return;
          }
          const role = this.auth.currentUser()?.role;
          this.router.navigate([role === 'ADMIN' ? '/admin' : '/client']);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.message ?? 'Une erreur est survenue. Réessayez.');
        },
      });
  }
}
