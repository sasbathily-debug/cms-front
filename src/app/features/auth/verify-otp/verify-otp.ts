import { AuthSteps } from '../../../shared/auth-steps/auth-steps';
import { Component, ElementRef, OnInit, inject, signal, viewChildren } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { AuthVisualPanel } from '../../../shared/auth-visual-panel/auth-visual-panel';

@Component({
  imports: [ReactiveFormsModule, RouterLink, AuthVisualPanel, AuthSteps],
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
  readonly phone = signal('');

  /** Les six cases du code : une signal par chiffre, le champ `otp` du formulaire les réunit. */
  readonly digits = signal<string[]>(['', '', '', '', '', '']);
  private readonly boxes = viewChildren<ElementRef<HTMLInputElement>>('box');

  readonly form = this.fb.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  ngOnInit(): void {
    this.email.set(this.route.snapshot.queryParamMap.get('email') ?? '');
    this.phone.set(this.route.snapshot.queryParamMap.get('phone') ?? '');
  }

  /** Ce qui s'affiche sous le titre : le numéro saisi, ou l'e-mail à défaut. */
  recipient(): string {
    return this.phone() ? `+221 ${this.phone()}` : this.email();
  }

  private setDigits(next: string[]): void {
    this.digits.set(next);
    this.form.controls.otp.setValue(next.join(''));
  }

  onInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(-1);
    input.value = value;
    const next = [...this.digits()];
    next[index] = value;
    this.setDigits(next);
    if (value && index < 5) {
      this.boxes()[index + 1]?.nativeElement.focus();
    }
  }

  onKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.digits()[index] && index > 0) {
      this.boxes()[index - 1]?.nativeElement.focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.boxes()[index - 1]?.nativeElement.focus();
    } else if (event.key === 'ArrowRight' && index < 5) {
      this.boxes()[index + 1]?.nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    const pasted = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, 6);
    if (!pasted) {
      return;
    }
    event.preventDefault();
    const next = ['', '', '', '', '', ''].map((_, i) => pasted[i] ?? '');
    this.setDigits(next);
    this.boxes()[Math.min(pasted.length, 5)]?.nativeElement.focus();
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
        if (this.phone()) {
          queryParams['phone'] = this.phone();
        }
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
