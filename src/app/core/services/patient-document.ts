import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PatientDocumentDto, PatientDocumentRequest } from '../models/patient-document.models';
import { Page } from '../models/user.models';

@Service()
export class PatientDocumentService {
  private readonly http = inject(HttpClient);

  findMine(page = 0, size = 50): Observable<Page<PatientDocumentDto>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<PatientDocumentDto>>(`${environment.apiUrl}/documents/me`, {
      params,
    });
  }

  findAll(userId: string | null, page = 0, size = 50): Observable<Page<PatientDocumentDto>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (userId) {
      params = params.set('userId', userId);
    }
    return this.http.get<Page<PatientDocumentDto>>(`${environment.apiUrl}/documents`, { params });
  }

  create(request: PatientDocumentRequest): Observable<PatientDocumentDto> {
    return this.http.post<PatientDocumentDto>(`${environment.apiUrl}/documents`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/documents/${id}`);
  }
}
