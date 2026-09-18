export type DocumentCategory = 'ORDONNANCE' | 'COMPTE_RENDU' | 'ANALYSE' | 'AUTRE';

export interface PatientDocumentDto {
  id: string;
  userId: string;
  appointmentId: string | null;
  fileName: string;
  fileUrl: string;
  category: DocumentCategory;
  uploadedAt: string;
}

export interface PatientDocumentRequest {
  userId: string;
  appointmentId: string | null;
  fileName: string;
  fileUrl: string;
  category: DocumentCategory;
}
