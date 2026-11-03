import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { AuthVisualPanel } from '../../../shared/auth-visual-panel/auth-visual-panel';

@Component({
  imports: [ReactiveFormsModule, RouterLink, AuthVisualPanel],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** « Bonjour » le jour, « Bonsoir » à partir de 18 h, à l'heure de Dakar. */
  readonly salutation =
    Number(
      new Intl.DateTimeFormat('fr-FR', {
        hour: 'numeric',
        hourCycle: 'h23',
        timeZone: 'Africa/Dakar',
      }).format(new Date()),
    ) >= 18
      ? 'Bonsoir'
      : 'Bonjour';

  readonly errorMessage = signal<string | null>(null);
  readonly loading = signal(false);
  readonly showPassword = signal(false);
  readonly returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  /** Vrai quand on arrive de « Mot de passe oublié » après un changement réussi. */
  readonly passwordWasReset = this.route.snapshot.queryParamMap.get('reset') === '1';

  readonly form = this.fb.group({
    identifier: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  /** Si l'identifiant déjà saisi est une adresse e-mail, la page « Mot de passe oublié » la reprend. */
  forgotQueryParams(): { email?: string } {
    const identifier = this.form.controls.identifier.value?.trim() ?? '';
    return identifier.includes('@') ? { email: identifier } : {};
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Saisissez votre identifiant et votre mot de passe.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth.login(this.form.getRawValue() as { identifier: string; password: string }).subscribe({
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
        this.errorMessage.set(err.error?.message ?? 'Identifiants invalides');
      },
    });
  }
}
