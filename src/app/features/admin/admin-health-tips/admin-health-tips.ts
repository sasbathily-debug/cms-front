import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SiteContentService } from '../../../core/services/site-content';
import { FileUploadService } from '../../../core/services/file-upload';
import { HealthTipDto } from '../../../core/models/site-content.models';
import { HEALTH_ICON_NAMES, HealthIcon } from '../../../shared/health-icon/health-icon';

@Component({
  selector: 'app-admin-health-tips',
  imports: [ReactiveFormsModule, HealthIcon],
  styleUrl: './admin-health-tips.css',
  templateUrl: './admin-health-tips.html',
})
export class AdminHealthTips implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly siteContentService = inject(SiteContentService);
  private readonly fileUploadService = inject(FileUploadService);

  readonly iconNames = HEALTH_ICON_NAMES;
  /** Thèmes proposés ; on peut aussi en saisir un autre. */
  readonly categorySuggestions = ['Diabète', 'Thyroïde', 'Nutrition', 'Ramadan'];
  readonly tips = signal<HealthTipDto[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly uploadingPhoto = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly deletingId = signal<string | null>(null);

  readonly form = this.fb.group({
    title: ['', [Validators.required]],
    body: ['', [Validators.required]],
    icon: [''],
    displayOrder: [0, [Validators.required]],
    category: [''],
    readingMinutes: [null as number | null, [Validators.min(1), Validators.max(120)]],
    photoUrl: [''],
    published: [true],
  });

  ngOnInit(): void {
    this.refresh();
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.uploadingPhoto.set(true);
    this.fileUploadService.upload(file).subscribe({
      next: (res) => {
        this.form.patchValue({ photoUrl: res.url });
        this.uploadingPhoto.set(false);
      },
      error: () => this.uploadingPhoto.set(false),
    });
    input.value = '';
  }

  refresh(): void {
    this.loading.set(true);
    this.siteContentService.getHealthTipsAdmin().subscribe({
      next: (tips) => {
        this.tips.set(tips);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  edit(tip: HealthTipDto): void {
    this.editingId.set(tip.id);
    this.form.setValue({
      title: tip.title,
      body: tip.body,
      icon: tip.icon ?? '',
      displayOrder: tip.displayOrder,
      category: tip.category ?? '',
      readingMinutes: tip.readingMinutes,
      photoUrl: tip.photoUrl ?? '',
      published: tip.published,
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({
      title: '',
      body: '',
      icon: '',
      displayOrder: 0,
      category: '',
      readingMinutes: null,
      photoUrl: '',
      published: true,
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const value = this.form.getRawValue();
    const request = {
      title: value.title!,
      body: value.body!,
      icon: value.icon || null,
      displayOrder: value.displayOrder!,
      category: value.category?.trim() || null,
      readingMinutes: value.readingMinutes ?? null,
      photoUrl: value.photoUrl?.trim() || null,
      published: value.published ?? true,
    };

    const editingId = this.editingId();
    const request$ = editingId
      ? this.siteContentService.updateHealthTip(editingId, request)
      : this.siteContentService.createHealthTip(request);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.cancelEdit();
        this.refresh();
      },
      error: () => this.saving.set(false),
    });
  }

  delete(tip: HealthTipDto): void {
    this.deletingId.set(tip.id);
    this.siteContentService.deleteHealthTip(tip.id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.refresh();
      },
      error: () => this.deletingId.set(null),
    });
  }
}
