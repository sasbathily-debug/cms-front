import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AvailabilityRuleDto,
  AvailabilityRuleRequest,
  AvailableSlotDto,
  ScheduleExceptionDto,
  ScheduleExceptionRequest,
} from '../models/availability.models';

@Service()
export class AvailabilityService {
  private readonly http = inject(HttpClient);

  getAvailableSlots(from: string, to: string): Observable<AvailableSlotDto[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<AvailableSlotDto[]>(`${environment.apiUrl}/site/availability`, { params });
  }

  getRules(): Observable<AvailabilityRuleDto[]> {
    return this.http.get<AvailabilityRuleDto[]>(`${environment.apiUrl}/site/availability/rules`);
  }

  createRule(request: AvailabilityRuleRequest): Observable<AvailabilityRuleDto> {
    return this.http.post<AvailabilityRuleDto>(
      `${environment.apiUrl}/site/availability/rules`,
      request,
    );
  }

  updateRule(id: string, request: AvailabilityRuleRequest): Observable<AvailabilityRuleDto> {
    return this.http.put<AvailabilityRuleDto>(
      `${environment.apiUrl}/site/availability/rules/${id}`,
      request,
    );
  }

  deleteRule(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/site/availability/rules/${id}`);
  }

  getExceptions(): Observable<ScheduleExceptionDto[]> {
    return this.http.get<ScheduleExceptionDto[]>(
      `${environment.apiUrl}/site/availability/exceptions`,
    );
  }

  createException(request: ScheduleExceptionRequest): Observable<ScheduleExceptionDto> {
    return this.http.post<ScheduleExceptionDto>(
      `${environment.apiUrl}/site/availability/exceptions`,
      request,
    );
  }

  deleteException(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/site/availability/exceptions/${id}`);
  }
}
