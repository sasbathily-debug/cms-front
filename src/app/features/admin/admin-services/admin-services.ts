import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SiteContentService } from '../../../core/services/site-content';
import { CareServiceDto } from '../../../core/models/site-content.models';
import { HEALTH_ICON_NAMES, HealthIcon } from '../../../shared/health-icon/health-icon';

@Component({
  selector: 'app-admin-services',
  imports: [ReactiveFormsModule, HealthIcon],
  styleUrl: './admin-services.css',
  templateUrl: './admin-services.html',
})
export class AdminServices implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly siteContentService = inject(SiteContentService);

  readonly iconNames = HEALTH_ICON_NAMES;
  readonly services = signal<CareServiceDto[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly deletingId = signal<string | null>(null);

  readonly form = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    icon: [''],
    displayOrder: [0, [Validators.required]],
  });

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.siteContentService.getServices().subscribe({
      next: (services) => {
        this.services.set(services);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  edit(service: CareServiceDto): void {
    this.editingId.set(service.id);
    this.form.setValue({
      title: service.title,
      description: service.description,
      icon: service.icon ?? '',
      displayOrder: service.displayOrder,
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ title: '', description: '', icon: '', displayOrder: 0 });
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
      description: value.description!,
      icon: value.icon || null,
      displayOrder: value.displayOrder!,
    };

    const editingId = this.editingId();
    const request$ = editingId
      ? this.siteContentService.updateService(editingId, request)
      : this.siteContentService.createService(request);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.cancelEdit();
        this.refresh();
      },
      error: () => this.saving.set(false),
    });
  }

  delete(service: CareServiceDto): void {
    this.deletingId.set(service.id);
    this.siteContentService.deleteService(service.id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.refresh();
      },
      error: () => this.deletingId.set(null),
    });
  }
}
