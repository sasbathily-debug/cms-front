import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SiteContentService } from '../../../core/services/site-content';
import { HealthTipDto } from '../../../core/models/site-content.models';

@Component({
  selector: 'app-admin-health-tips',
  imports: [ReactiveFormsModule],
  styleUrl: './admin-health-tips.css',
  templateUrl: './admin-health-tips.html',
})
export class AdminHealthTips implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly siteContentService = inject(SiteContentService);

  readonly tips = signal<HealthTipDto[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly deletingId = signal<string | null>(null);

  readonly form = this.fb.group({
    title: ['', [Validators.required]],
    body: ['', [Validators.required]],
    icon: [''],
    displayOrder: [0, [Validators.required]],
  });

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.siteContentService.getHealthTips().subscribe({
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
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ title: '', body: '', icon: '', displayOrder: 0 });
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
