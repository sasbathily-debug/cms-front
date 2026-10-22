import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CareServiceDto,
  CareServiceRequest,
  FaqItemDto,
  FaqItemRequest,
  HealthTipDto,
  HealthTipRequest,
  HeroImageDto,
  OpeningHourDto,
  SitePageDto,
  SitePageSummaryDto,
  SiteSettingsDto,
  UpdateSiteSettingsRequest,
} from '../models/site-content.models';

@Service()
export class SiteContentService {
  private readonly http = inject(HttpClient);

  getServices(): Observable<CareServiceDto[]> {
    return this.http.get<CareServiceDto[]>(`${environment.apiUrl}/site/services`);
  }

  createService(request: CareServiceRequest): Observable<CareServiceDto> {
    return this.http.post<CareServiceDto>(`${environment.apiUrl}/site/services`, request);
  }

  updateService(id: string, request: CareServiceRequest): Observable<CareServiceDto> {
    return this.http.put<CareServiceDto>(`${environment.apiUrl}/site/services/${id}`, request);
  }

  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/site/services/${id}`);
  }

  /** Questions publiées (site public). */
  getFaq(): Observable<FaqItemDto[]> {
    return this.http.get<FaqItemDto[]>(`${environment.apiUrl}/site/faq`);
  }

  /** Toutes les questions, brouillons compris (admin). */
  getFaqAdmin(): Observable<FaqItemDto[]> {
    return this.http.get<FaqItemDto[]>(`${environment.apiUrl}/site/faq/all`);
  }

  createFaq(request: FaqItemRequest): Observable<FaqItemDto> {
    return this.http.post<FaqItemDto>(`${environment.apiUrl}/site/faq`, request);
  }

  updateFaq(id: string, request: FaqItemRequest): Observable<FaqItemDto> {
    return this.http.put<FaqItemDto>(`${environment.apiUrl}/site/faq/${id}`, request);
  }

  deleteFaq(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/site/faq/${id}`);
  }

  getSettings(): Observable<SiteSettingsDto> {
    return this.http.get<SiteSettingsDto>(`${environment.apiUrl}/site/settings`);
  }

  updateSettings(request: UpdateSiteSettingsRequest): Observable<SiteSettingsDto> {
    return this.http.put<SiteSettingsDto>(`${environment.apiUrl}/site/settings`, request);
  }

  /** Articles publiés (site public). */
  getHealthTips(): Observable<HealthTipDto[]> {
    return this.http.get<HealthTipDto[]>(`${environment.apiUrl}/site/health-tips`);
  }

  /** Tous les articles, brouillons compris (admin). */
  getHealthTipsAdmin(): Observable<HealthTipDto[]> {
    return this.http.get<HealthTipDto[]>(`${environment.apiUrl}/site/health-tips/all`);
  }

  /** Contenu saisi pour une page (404 tant que l'admin n'y a rien saisi). */
  getPage(slug: string): Observable<SitePageDto> {
    return this.http.get<SitePageDto>(`${environment.apiUrl}/site/pages/${slug}`);
  }

  /** Les pages modifiées depuis l'admin (admin). */
  listPages(): Observable<SitePageSummaryDto[]> {
    return this.http.get<SitePageSummaryDto[]>(`${environment.apiUrl}/site/pages`);
  }

  savePage(slug: string, content: Record<string, unknown>): Observable<SitePageDto> {
    return this.http.put<SitePageDto>(`${environment.apiUrl}/site/pages/${slug}`, { content });
  }

  /** Supprime le contenu saisi : la page retrouve ses textes d'origine. */
  resetPage(slug: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/site/pages/${slug}`);
  }

  getOpeningHours(): Observable<OpeningHourDto[]> {
    return this.http.get<OpeningHourDto[]>(`${environment.apiUrl}/site/opening-hours`);
  }

  updateOpeningHours(days: OpeningHourDto[]): Observable<OpeningHourDto[]> {
    return this.http.put<OpeningHourDto[]>(`${environment.apiUrl}/site/opening-hours`, { days });
  }

  createHealthTip(request: HealthTipRequest): Observable<HealthTipDto> {
    return this.http.post<HealthTipDto>(`${environment.apiUrl}/site/health-tips`, request);
  }

  updateHealthTip(id: string, request: HealthTipRequest): Observable<HealthTipDto> {
    return this.http.put<HealthTipDto>(`${environment.apiUrl}/site/health-tips/${id}`, request);
  }

  deleteHealthTip(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/site/health-tips/${id}`);
  }

  getHeroImages(): Observable<HeroImageDto[]> {
    return this.http.get<HeroImageDto[]>(`${environment.apiUrl}/site/hero-images`);
  }

  createHeroImage(imageUrl: string, title?: string): Observable<HeroImageDto> {
    return this.http.post<HeroImageDto>(`${environment.apiUrl}/site/hero-images`, {
      imageUrl,
      title,
    });
  }

  updateHeroImageTitle(id: string, title: string): Observable<HeroImageDto> {
    return this.http.put<HeroImageDto>(`${environment.apiUrl}/site/hero-images/${id}`, { title });
  }

  reorderHeroImages(orderedIds: string[]): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/site/hero-images/reorder`, { orderedIds });
  }

  deleteHeroImage(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/site/hero-images/${id}`);
  }
}
