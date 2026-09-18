import { Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user';
import { FileUploadService } from '../../../core/services/file-upload';
import { Auth } from '../../../core/services/auth';
import { CurrentUserStore } from '../../../core/services/current-user-store';
import { AppHeader } from '../../../shared/app-header/app-header';

@Component({
  imports: [ReactiveFormsModule, RouterLink, AppHeader],
  selector: 'app-profile',
  styleUrl: './profile.css',
  templateUrl: './profile.html',
})
export class Profile {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly fileUploadService = inject(FileUploadService);
  private readonly auth = inject(Auth);
  private readonly currentUserStore = inject(CurrentUserStore);

  readonly backLink = this.auth.currentUser()?.role === 'ADMIN' ? '/admin' : '/client';

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly uploading = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly profilePictureUrl = signal<string | null>(null);
  readonly email = signal('');

  readonly passwordSaving = signal(false);
  readonly passwordSuccess = signal<string | null>(null);
  readonly passwordError = signal<string | null>(null);

  readonly form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phone: [''],
    dateOfBirth: [''],
    emailReminders: [true],
    smsReminders: [false],
  });

  readonly passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const user = this.currentUserStore.user();
      if (user && this.loading()) {
        this.form.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone ?? '',
          dateOfBirth: user.dateOfBirth ?? '',
          emailReminders: user.emailReminders,
          smsReminders: user.smsReminders,
        });
        this.profilePictureUrl.set(user.profilePictureUrl);
        this.email.set(user.email);
        this.loading.set(false);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.uploading.set(true);
    this.fileUploadService.upload(file).subscribe({
      next: (res) => {
        this.profilePictureUrl.set(res.url);
        this.uploading.set(false);
      },
      error: () => this.uploading.set(false),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const value = this.form.getRawValue();
    this.userService
      .updateMe({
        firstName: value.firstName!,
        lastName: value.lastName!,
        profilePictureUrl: this.profilePictureUrl(),
        phone: value.phone || null,
        dateOfBirth: value.dateOfBirth || null,
        emailReminders: value.emailReminders!,
        smsReminders: value.smsReminders!,
      })
      .subscribe({
        next: (updated) => {
          this.saving.set(false);
          this.successMessage.set('Profil mis à jour.');
          this.currentUserStore.set(updated);
        },
        error: () => {
          this.saving.set(false);
          this.errorMessage.set('Une erreur est survenue.');
        },
      });
  }

  submitPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const value = this.passwordForm.getRawValue();
    if (value.newPassword !== value.confirmPassword) {
      this.passwordError.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.passwordSaving.set(true);
    this.passwordSuccess.set(null);
    this.passwordError.set(null);

    this.userService
      .changePassword({ currentPassword: value.currentPassword!, newPassword: value.newPassword! })
      .subscribe({
        next: () => {
          this.passwordSaving.set(false);
          this.passwordSuccess.set('Mot de passe mis à jour.');
          this.passwordForm.reset();
        },
        error: (err) => {
          this.passwordSaving.set(false);
          this.passwordError.set(err.error?.message ?? 'Une erreur est survenue.');
        },
      });
  }
}
