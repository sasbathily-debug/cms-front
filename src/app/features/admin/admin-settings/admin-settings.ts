import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SiteContentService } from '../../../core/services/site-content';
import { FileUploadService } from '../../../core/services/file-upload';

@Component({
  selector: 'app-admin-settings',
  imports: [ReactiveFormsModule, RouterLink],
  styleUrl: './admin-settings.css',
  templateUrl: './admin-settings.html',
})
export class AdminSettings implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly siteContentService = inject(SiteContentService);
  private readonly fileUploadService = inject(FileUploadService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly uploadingHero = signal(false);
  readonly uploadingAbout = signal(false);

  readonly form = this.fb.group({
    heroTitle: ['', [Validators.required]],
    heroSubtitle: [''],
    aboutText: [''],
    yearsExperience: [''],
    patientsCount: [''],
    satisfactionRating: [''],
    heroImageUrl: [null as string | null],
    aboutImageUrl: [null as string | null],
    address: [''],
    phone: [''],
    email: [''],
    whatsappNumber: [''],
    openingHours: [''],
  });

  ngOnInit(): void {
    this.siteContentService.getSettings().subscribe({
      next: (settings) => {
        this.form.setValue({
          heroTitle: settings.heroTitle,
          heroSubtitle: settings.heroSubtitle ?? '',
          aboutText: settings.aboutText ?? '',
          yearsExperience: settings.yearsExperience ?? '',
          patientsCount: settings.patientsCount ?? '',
          satisfactionRating: settings.satisfactionRating ?? '',
          heroImageUrl: settings.heroImageUrl,
          aboutImageUrl: settings.aboutImageUrl,
          address: settings.address ?? '',
          phone: settings.phone ?? '',
          email: settings.email ?? '',
          whatsappNumber: settings.whatsappNumber ?? '',
          openingHours: settings.openingHours ?? '',
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onHeroImageSelected(event: Event): void {
    this.uploadImage(event, this.uploadingHero, 'heroImageUrl');
  }

  onAboutImageSelected(event: Event): void {
    this.uploadImage(event, this.uploadingAbout, 'aboutImageUrl');
  }

  removeHeroImage(): void {
    this.form.patchValue({ heroImageUrl: null });
  }

  removeAboutImage(): void {
    this.form.patchValue({ aboutImageUrl: null });
  }

  private uploadImage(
    event: Event,
    uploadingSignal: typeof this.uploadingHero,
    field: 'heroImageUrl' | 'aboutImageUrl',
  ): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    uploadingSignal.set(true);
    this.fileUploadService.upload(file).subscribe({
      next: (res) => {
        this.form.patchValue({ [field]: res.url });
        uploadingSignal.set(false);
      },
      error: () => uploadingSignal.set(false),
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

    this.siteContentService
      .updateSettings({
        heroTitle: value.heroTitle!,
        heroSubtitle: value.heroSubtitle || null,
        aboutText: value.aboutText || null,
        yearsExperience: value.yearsExperience || null,
        patientsCount: value.patientsCount || null,
        satisfactionRating: value.satisfactionRating || null,
        heroImageUrl: value.heroImageUrl || null,
        aboutImageUrl: value.aboutImageUrl || null,
        address: value.address || null,
        phone: value.phone || null,
        email: value.email || null,
        whatsappNumber: value.whatsappNumber || null,
        openingHours: value.openingHours || null,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.successMessage.set('Réglages enregistrés.');
        },
        error: () => {
          this.saving.set(false);
          this.errorMessage.set('Une erreur est survenue.');
        },
      });
  }
}
