export interface CareServiceDto {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  displayOrder: number;
}

export interface CareServiceRequest {
  title: string;
  description: string;
  icon: string | null;
  displayOrder: number;
}

export interface FaqItemDto {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
}

export interface FaqItemRequest {
  question: string;
  answer: string;
  displayOrder: number;
}

export interface HealthTipDto {
  id: string;
  title: string;
  body: string;
  icon: string | null;
  displayOrder: number;
}

export interface HealthTipRequest {
  title: string;
  body: string;
  icon: string | null;
  displayOrder: number;
}

export interface SiteSettingsDto {
  heroTitle: string;
  heroSubtitle: string | null;
  aboutText: string | null;
  yearsExperience: string | null;
  patientsCount: string | null;
  satisfactionRating: string | null;
  aboutImageUrl: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  whatsappNumber: string | null;
  openingHours: string | null;
}

export type UpdateSiteSettingsRequest = SiteSettingsDto;

export interface HeroImageDto {
  id: string;
  imageUrl: string;
  displayOrder: number;
}
