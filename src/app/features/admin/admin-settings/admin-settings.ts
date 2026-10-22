import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SiteContentService } from '../../../core/services/site-content';
import { FileUploadService } from '../../../core/services/file-upload';
import { HeroImageDto, OpeningHourDto } from '../../../core/models/site-content.models';
import { OptimizedImagePipe } from '../../../shared/optimized-image.pipe';

const DAY_LABELS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

interface HourRow {
  day: number;
  label: string;
  opens: string;
  closes: string;
  closed: boolean;
}

function defaultRows(): HourRow[] {
  return DAY_LABELS.map((label, i) => ({
    day: i + 1,
    label,
    opens: '09:00',
    closes: '17:00',
    closed: i === 6,
  }));
}

@Component({
  selector: 'app-admin-settings',
  imports: [ReactiveFormsModule, RouterLink, OptimizedImagePipe],
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

  readonly hours = signal<HourRow[]>(defaultRows());
  readonly savingHours = signal(false);
  readonly hoursMessage = signal<{ ok: boolean; text: string } | null>(null);

  readonly heroImages = signal<HeroImageDto[]>([]);
  readonly loadingHeroImages = signal(true);
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
    landmark: [''],
    emergencyNumber: [''],
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
          landmark: settings.landmark ?? '',
          emergencyNumber: settings.emergencyNumber ?? '',
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.loadHeroImages();
    this.siteContentService.getOpeningHours().subscribe({
      next: (days) => this.hours.set(this.toRows(days)),
    });
  }

  private toRows(days: OpeningHourDto[]): HourRow[] {
    const byDay = new Map(days.map((d) => [d.dayOfWeek, d]));
    return defaultRows().map((row) => {
      const found = byDay.get(row.day);
      return found
        ? {
            ...row,
            opens: found.opens ?? row.opens,
            closes: found.closes ?? row.closes,
            closed: found.closed,
          }
        : row;
    });
  }

  setHour(index: number, field: 'opens' | 'closes' | 'closed', value: string | boolean): void {
    this.hoursMessage.set(null);
    this.hours.update((rows) =>
      rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }

  /** Copie les horaires du lundi sur les autres jours ouverts du lundi au vendredi. */
  copyMondayToWeek(): void {
    const monday = this.hours()[0];
    this.hoursMessage.set(null);
    this.hours.update((rows) =>
      rows.map((row, i) =>
        i > 0 && i < 5
          ? { ...row, opens: monday.opens, closes: monday.closes, closed: monday.closed }
          : row,
      ),
    );
  }

  saveHours(): void {
    this.hoursMessage.set(null);
    const rows = this.hours();
    const invalid = rows.find(
      (row) => !row.closed && (!row.opens || !row.closes || row.opens >= row.closes),
    );
    if (invalid) {
      this.hoursMessage.set({
        ok: false,
        text: `${invalid.label} : l'ouverture doit être avant la fermeture, ou cochez « Fermé ».`,
      });
      return;
    }
    this.savingHours.set(true);
    const days: OpeningHourDto[] = rows.map((row) => ({
      dayOfWeek: row.day,
      opens: row.closed ? null : row.opens,
      closes: row.closed ? null : row.closes,
      closed: row.closed,
    }));
    this.siteContentService.updateOpeningHours(days).subscribe({
      next: (saved) => {
        this.hours.set(this.toRows(saved));
        this.savingHours.set(false);
        this.hoursMessage.set({ ok: true, text: 'Horaires enregistrés.' });
      },
      error: () => {
        this.savingHours.set(false);
        this.hoursMessage.set({ ok: false, text: "Les horaires n'ont pas pu être enregistrés." });
      },
    });
  }

  private loadHeroImages(): void {
    this.siteContentService.getHeroImages().subscribe({
      next: (images) => {
        this.heroImages.set(images);
        this.loadingHeroImages.set(false);
      },
      error: () => this.loadingHeroImages.set(false),
    });
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

  onHeroImageTitleBlur(id: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    const current = this.heroImages().find((image) => image.id === id);
    if (!current || (current.title ?? '') === value) {
      return;
    }
    this.siteContentService.updateHeroImageTitle(id, value).subscribe({
      next: (updated) =>
        this.heroImages.update((images) =>
          images.map((image) => (image.id === id ? updated : image)),
        ),
    });
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

  private uploadImage(
    event: Event,
    uploadingSignal: typeof this.uploadingAbout,
    field: 'aboutImageUrl',
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
        aboutImageUrl: value.aboutImageUrl || null,
        address: value.address || null,
        phone: value.phone || null,
        email: value.email || null,
        whatsappNumber: value.whatsappNumber || null,
        openingHours: value.openingHours || null,
        landmark: value.landmark || null,
        emergencyNumber: value.emergencyNumber || null,
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
