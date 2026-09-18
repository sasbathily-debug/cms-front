import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientDocumentService } from '../../../core/services/patient-document';
import { FileUploadService } from '../../../core/services/file-upload';
import { UserService } from '../../../core/services/user';
import { PatientDocumentDto, DocumentCategory } from '../../../core/models/patient-document.models';
import { UserDto } from '../../../core/models/user.models';
import { PatientPicker } from '../../../shared/patient-picker/patient-picker';

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  ORDONNANCE: 'Ordonnance',
  COMPTE_RENDU: 'Compte-rendu',
  ANALYSE: 'Analyse',
  AUTRE: 'Document',
};

@Component({
  selector: 'app-admin-documents',
  imports: [ReactiveFormsModule, SlicePipe, PatientPicker],
  styleUrl: './admin-documents.css',
  templateUrl: './admin-documents.html',
})
export class AdminDocuments implements OnInit {
  @ViewChild(PatientPicker) patientPicker?: PatientPicker;

  private readonly fb = inject(FormBuilder);
  private readonly documentService = inject(PatientDocumentService);
  private readonly fileUploadService = inject(FileUploadService);
  private readonly userService = inject(UserService);

  readonly documents = signal<PatientDocumentDto[]>([]);
  readonly patients = signal<UserDto[]>([]);
  readonly loading = signal(true);
  readonly uploading = signal(false);
  readonly saving = signal(false);
  readonly deletingId = signal<string | null>(null);
  readonly pendingFileUrl = signal<string | null>(null);
  readonly pendingFileName = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly categoryLabel = (category: DocumentCategory) => CATEGORY_LABELS[category];

  readonly form = this.fb.group({
    userId: ['', [Validators.required]],
    category: ['ORDONNANCE' as DocumentCategory, [Validators.required]],
  });

  ngOnInit(): void {
    this.refresh();
    this.userService.findAll(0, 200).subscribe({
      next: (page) => this.patients.set(page.content.filter((u) => u.role === 'USER')),
    });
  }

  refresh(): void {
    this.loading.set(true);
    this.documentService.findAll(null).subscribe({
      next: (page) => {
        this.documents.set(page.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onPatientSelected(patient: UserDto | null): void {
    this.form.patchValue({ userId: patient?.id ?? '' });
  }

  patientName(userId: string): string {
    const patient = this.patients().find((p) => p.id === userId);
    return patient ? `${patient.firstName} ${patient.lastName}` : userId;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.uploading.set(true);
    this.errorMessage.set(null);
    this.fileUploadService.upload(file).subscribe({
      next: (res) => {
        this.pendingFileUrl.set(res.url);
        this.pendingFileName.set(file.name);
        this.uploading.set(false);
      },
      error: () => {
        this.uploading.set(false);
        this.errorMessage.set("Échec de l'envoi du fichier.");
      },
    });
  }

  submit(): void {
    if (this.form.invalid || !this.pendingFileUrl()) {
      this.form.markAllAsTouched();
      if (!this.pendingFileUrl()) {
        this.errorMessage.set('Sélectionnez un fichier à partager.');
      }
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    const value = this.form.getRawValue();

    this.documentService
      .create({
        userId: value.userId!,
        appointmentId: null,
        fileName: this.pendingFileName()!,
        fileUrl: this.pendingFileUrl()!,
        category: value.category!,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.pendingFileUrl.set(null);
          this.pendingFileName.set(null);
          this.form.patchValue({ userId: '' });
          this.patientPicker?.clear();
          this.refresh();
        },
        error: () => {
          this.saving.set(false);
          this.errorMessage.set('Une erreur est survenue.');
        },
      });
  }

  delete(doc: PatientDocumentDto): void {
    this.deletingId.set(doc.id);
    this.documentService.delete(doc.id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.refresh();
      },
      error: () => this.deletingId.set(null),
    });
  }
}
