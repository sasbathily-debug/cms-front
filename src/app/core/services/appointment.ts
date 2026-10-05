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

export interface AppointmentFilter {
  status?: AppointmentStatus | null;
  date?: string | null;
  from?: string | null;
  to?: string | null;
  search?: string | null;
  sort?: string | null;
  pastDue?: boolean | null;
}

export interface AppointmentCountsDto {
  all: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  noShow: number;
  pastDue: number;
}

export interface AppointmentStatsDto {
  today: number;
  thisWeek: number;
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

  findAll(filter: AppointmentFilter, page = 0, size = 20): Observable<Page<AppointmentDto>> {
    const params = this.buildParams(filter).set('page', page).set('size', size);
    return this.http.get<Page<AppointmentDto>>(`${environment.apiUrl}/appointments`, { params });
  }

  getCounts(filter: Pick<AppointmentFilter, 'date' | 'from' | 'to' | 'search'>): Observable<AppointmentCountsDto> {
    const params = this.buildParams(filter);
    return this.http.get<AppointmentCountsDto>(`${environment.apiUrl}/appointments/counts`, { params });
  }

  getStats(): Observable<AppointmentStatsDto> {
    return this.http.get<AppointmentStatsDto>(`${environment.apiUrl}/appointments/stats`);
  }

  exportCsv(filter: AppointmentFilter): Observable<Blob> {
    const params = this.buildParams(filter);
    return this.http.get(`${environment.apiUrl}/appointments/export`, { params, responseType: 'blob' });
  }

  updateStatus(id: string, status: AppointmentStatus): Observable<AppointmentDto> {
    return this.http.patch<AppointmentDto>(`${environment.apiUrl}/appointments/${id}/status`, { status });
  }

  getHistory(id: string): Observable<AppointmentStatusEventDto[]> {
    return this.http.get<AppointmentStatusEventDto[]>(`${environment.apiUrl}/appointments/${id}/history`);
  }

  private buildParams(filter: Partial<AppointmentFilter>): HttpParams {
    let params = new HttpParams();
    if (filter.status) {
      params = params.set('status', filter.status);
    }
    if (filter.date) {
      params = params.set('date', filter.date);
    }
    if (filter.from) {
      params = params.set('from', filter.from);
    }
    if (filter.to) {
      params = params.set('to', filter.to);
    }
    if (filter.search) {
      params = params.set('search', filter.search);
    }
    if (filter.sort) {
      params = params.set('sort', filter.sort);
    }
    if (filter.pastDue) {
      params = params.set('pastDue', 'true');
    }
    return params;
  }
}
