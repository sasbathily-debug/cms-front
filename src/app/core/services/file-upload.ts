import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FileUploadResponse {
  url: string;
}

@Service()
export class FileUploadService {
  private readonly http = inject(HttpClient);

  upload(file: File): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<FileUploadResponse>(`${environment.apiUrl}/files`, formData);
  }
}
