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
  /** Thème sous lequel la question est rangée sur la page FAQ. */
  category: string | null;
  published: boolean;
}

export interface FaqItemRequest {
  question: string;
  answer: string;
  displayOrder: number;
  category: string | null;
  published: boolean;
}

/** Un article de « Conseils santé ». */
export interface HealthTipDto {
  id: string;
  title: string;
  body: string;
  icon: string | null;
  displayOrder: number;
  category: string | null;
  readingMinutes: number | null;
  photoUrl: string | null;
  published: boolean;
}

export interface HealthTipRequest {
  title: string;
  body: string;
  icon: string | null;
  displayOrder: number;
  category: string | null;
  readingMinutes: number | null;
  photoUrl: string | null;
  published: boolean;
}

/** Horaires d'un jour : `dayOfWeek` de 1 (lundi) à 7 (dimanche), heures au format « HH:mm ». */
export interface OpeningHourDto {
  dayOfWeek: number;
  opens: string | null;
  closes: string | null;
  closed: boolean;
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
  /** Repère connu à côté du cabinet (étage, entrée…). */
  landmark: string | null;
  /** Numéro à appeler en cas d'urgence, affiché sur le site. */
  emergencyNumber: string | null;
}

export type UpdateSiteSettingsRequest = SiteSettingsDto;

export interface HeroImageDto {
  id: string;
  imageUrl: string;
  displayOrder: number;
  title: string | null;
}
