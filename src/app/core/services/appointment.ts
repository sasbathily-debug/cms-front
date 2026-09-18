import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppointmentDto, AppointmentStatus, AppointmentStatusEventDto } from '../models/appointment.models';
import { Page } from '../models/user.models';

export interface AppointmentRequest {
  fullName: string;
  phone: string;
  email?: string;
  reason: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
}

@Service()
export class AppointmentService {
  private readonly http = inject(HttpClient);

  create(request: AppointmentRequest): Observable<AppointmentDto> {
    return this.http.post<AppointmentDto>(`${environment.apiUrl}/appointments`, request);
  }

  findMine(page = 0, size = 20): Observable<Page<AppointmentDto>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<AppointmentDto>>(`${environment.apiUrl}/appointments/me`, { params });
  }

  findAll(status: AppointmentStatus | null, page = 0, size = 20): Observable<Page<AppointmentDto>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Page<AppointmentDto>>(`${environment.apiUrl}/appointments`, { params });
  }

  updateStatus(id: string, status: AppointmentStatus): Observable<AppointmentDto> {
    return this.http.patch<AppointmentDto>(`${environment.apiUrl}/appointments/${id}/status`, { status });
  }

  getHistory(id: string): Observable<AppointmentStatusEventDto[]> {
    return this.http.get<AppointmentStatusEventDto[]>(`${environment.apiUrl}/appointments/${id}/history`);
  }
}
