import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SiteContentService } from '../../../core/services/site-content';
import { FileUploadService } from '../../../core/services/file-upload';
import { HeroImageDto } from '../../../core/models/site-content.models';

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
  readonly uploadingAbout = signal(false);

  readonly heroImages = signal<HeroImageDto[]>([]);
  readonly uploadingHeroImage = signal(false);
  readonly reorderingHeroImages = signal(false);

  readonly form = this.fb.group({
    heroTitle: ['', [Validators.required]],
    heroSubtitle: [''],
    aboutText: [''],
    yearsExperience: [''],
    patientsCount: [''],
    satisfactionRating: [''],
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
    this.loadHeroImages();
  }

  private loadHeroImages(): void {
    this.siteContentService.getHeroImages().subscribe({ next: (images) => this.heroImages.set(images) });
  }

  onHeroImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.uploadingHeroImage.set(true);
    this.fileUploadService.upload(file).subscribe({
      next: (res) => {
        this.siteContentService.createHeroImage(res.url).subscribe({
          next: () => {
            this.uploadingHeroImage.set(false);
            this.loadHeroImages();
          },
          error: () => this.uploadingHeroImage.set(false),
        });
      },
      error: () => this.uploadingHeroImage.set(false),
    });
    input.value = '';
  }

  removeHeroImage(id: string): void {
    this.siteContentService.deleteHeroImage(id).subscribe({
      next: () => this.heroImages.update((images) => images.filter((image) => image.id !== id)),
    });
  }

  moveHeroImage(index: number, direction: -1 | 1): void {
    const images = [...this.heroImages()];
    const target = index + direction;
    if (target < 0 || target >= images.length) {
      return;
    }
    [images[index], images[target]] = [images[target], images[index]];
    this.heroImages.set(images);

    this.reorderingHeroImages.set(true);
    this.siteContentService.reorderHeroImages(images.map((image) => image.id)).subscribe({
      next: () => this.reorderingHeroImages.set(false),
      error: () => this.reorderingHeroImages.set(false),
    });
  }

  onAboutImageSelected(event: Event): void {
    this.uploadImage(event, this.uploadingAbout, 'aboutImageUrl');
  }

  removeAboutImage(): void {
    this.form.patchValue({ aboutImageUrl: null });
  }

  private uploadImage(event: Event, uploadingSignal: typeof this.uploadingAbout, field: 'aboutImageUrl'): void {
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
