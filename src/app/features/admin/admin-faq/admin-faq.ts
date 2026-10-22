import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SiteContentService } from '../../../core/services/site-content';
import { FaqItemDto } from '../../../core/models/site-content.models';

@Component({
  selector: 'app-admin-faq',
  imports: [ReactiveFormsModule],
  styleUrl: './admin-faq.css',
  templateUrl: './admin-faq.html',
})
export class AdminFaq implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly siteContentService = inject(SiteContentService);

  readonly items = signal<FaqItemDto[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly deletingId = signal<string | null>(null);

  readonly form = this.fb.group({
    question: ['', [Validators.required]],
    answer: ['', [Validators.required]],
    displayOrder: [0, [Validators.required]],
    category: [''],
    published: [true],
  });

  /** Thèmes de la page FAQ ; on peut aussi en saisir un autre. */
  readonly categorySuggestions = [
    'Rendez-vous et compte',
    'La consultation',
    'Tarifs et paiement',
    'Vos questions de santé',
    'Vos données et votre confidentialité',
  ];

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.siteContentService.getFaqAdmin().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  edit(item: FaqItemDto): void {
    this.editingId.set(item.id);
    this.form.setValue({
      question: item.question,
      answer: item.answer,
      displayOrder: item.displayOrder,
      category: item.category ?? '',
      published: item.published,
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ question: '', answer: '', displayOrder: 0, category: '', published: true });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const value = this.form.getRawValue();
    const request = {
      question: value.question!,
      answer: value.answer!,
      displayOrder: value.displayOrder!,
      category: value.category?.trim() || null,
      published: value.published ?? true,
    };

    const editingId = this.editingId();
    const request$ = editingId
      ? this.siteContentService.updateFaq(editingId, request)
      : this.siteContentService.createFaq(request);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.cancelEdit();
        this.refresh();
      },
      error: () => this.saving.set(false),
    });
  }

  delete(item: FaqItemDto): void {
    this.deletingId.set(item.id);
    this.siteContentService.deleteFaq(item.id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.refresh();
      },
      error: () => this.deletingId.set(null),
    });
  }
}
