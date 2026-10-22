import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactMessage {
  name: string;
  phone: string;
  email: string | null;
  motif: string;
  message: string;
  consent: boolean;
  /** Piège à robots : toujours vide pour un vrai visiteur. */
  website: string;
}

/** Envoie le formulaire de contact au backend, qui le remet par e-mail à la doctoresse. */
@Service()
export class ContactService {
  private readonly http = inject(HttpClient);

  send(message: ContactMessage): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/site/contact`, message);
  }
}
