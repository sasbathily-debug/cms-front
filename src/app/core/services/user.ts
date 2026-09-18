import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChangePasswordRequest, Page, UpdateProfileRequest, UserDto } from '../models/user.models';

@Service()
export class UserService {
  private readonly http = inject(HttpClient);

  findAll(page = 0, size = 20): Observable<Page<UserDto>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<UserDto>>(`${environment.apiUrl}/users`, { params });
  }

  getMe(): Observable<UserDto> {
    return this.http.get<UserDto>(`${environment.apiUrl}/users/me`);
  }

  updateMe(request: UpdateProfileRequest): Observable<UserDto> {
    return this.http.put<UserDto>(`${environment.apiUrl}/users/me`, request);
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/users/me/password`, request);
  }
}
