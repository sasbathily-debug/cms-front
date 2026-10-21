import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { AppointmentService } from '../../../core/services/appointment';
import { PatientDocumentService } from '../../../core/services/patient-document';
import { SiteContentService } from '../../../core/services/site-content';
import { CurrentUserStore } from '../../../core/services/current-user-store';
import { AppointmentDto } from '../../../core/models/appointment.models';
import { PatientDocumentDto, DocumentCategory } from '../../../core/models/patient-document.models';
import { HealthTipDto, SiteSettingsDto } from '../../../core/models/site-content.models';
import { AppHeader } from '../../../shared/app-header/app-header';
import { AppFooter } from '../../../shared/app-footer/app-footer';
import { FloatingActions } from '../../../shared/floating-actions/floating-actions';
import { AppointmentHistory } from '../../../shared/appointment-history/appointment-history';
import { HealthIcon } from '../../../shared/health-icon/health-icon';
import {
  appointmentStatusClasses,
  appointmentStatusLabel,
} from '../../../shared/appointment-status.util';

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  ORDONNANCE: 'Ordonnance',
  COMPTE_RENDU: 'Compte-rendu',
  ANALYSE: 'Analyse',
  AUTRE: 'Document',
};

@Component({
  imports: [
    RouterLink,
    SlicePipe,
    AppHeader,
    AppFooter,
    FloatingActions,
    AppointmentHistory,
    HealthIcon,
  ],
  selector: 'app-client-home',
  styleUrl: './client-home.css',
  templateUrl: './client-home.html',
})
export class ClientHome implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  private readonly documentService = inject(PatientDocumentService);
  private readonly siteContentService = inject(SiteContentService);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly currentUserStore = inject(CurrentUserStore);

  readonly appointments = signal<AppointmentDto[]>([]);
  readonly loadingAppointments = signal(true);
  readonly documents = signal<PatientDocumentDto[]>([]);
  readonly loadingDocuments = signal(true);
  readonly healthTips = signal<HealthTipDto[]>([]);
  readonly loadingHealthTips = signal(true);
  readonly settings = signal<SiteSettingsDto | null>(null);

  readonly firstName = computed(() => this.currentUserStore.user()?.firstName ?? '');
  readonly upcomingCount = computed(
    () => this.appointments().filter((a) => a.status === 'CONFIRMED').length,
  );

  /** Le prochain rendez-vous confirmé dont la date n'est pas passée. */
  readonly nextAppointment = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
    return (
      this.appointments()
        .filter((a) => a.status === 'CONFIRMED' && a.preferredDate && a.preferredDate >= today)
        .sort((a, b) =>
          (a.preferredDate! + (a.preferredTime ?? '')).localeCompare(
            b.preferredDate! + (b.preferredTime ?? ''),
          ),
        )[0] ?? null
    );
  });

  readonly nextLabel = computed(() => {
    const next = this.nextAppointment();
    if (!next?.preferredDate) {
      return '';
    }
    const d = new Date(`${next.preferredDate}T${next.preferredTime ?? '00:00'}`);
    const weekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(d);
    const month = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(d);
    const time = next.preferredTime ? ` · ${next.preferredTime.slice(0, 5)}` : '';
    return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} ${d.getDate()} ${month}${time}`;
  });

  /** « 3 novembre 2026 · 10:00 » à partir de la date et de l'heure enregistrées. */
  readonly whenLabel = (date: string, time: string | null): string => {
    const d = new Date(`${date}T${time ?? '00:00'}`);
    const day = new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
    return time ? `${day} · ${time.slice(0, 5)}` : day;
  };

  readonly statusLabel = appointmentStatusLabel;
  readonly statusClasses = appointmentStatusClasses;
  readonly categoryLabel = (category: DocumentCategory) => CATEGORY_LABELS[category];

  ngOnInit(): void {
    this.appointmentService.findMine().subscribe({
      next: (page) => {
        this.appointments.set(page.content);
        this.loadingAppointments.set(false);
      },
      error: () => this.loadingAppointments.set(false),
    });

    this.documentService.findMine().subscribe({
      next: (page) => {
        this.documents.set(page.content);
        this.loadingDocuments.set(false);
      },
      error: () => this.loadingDocuments.set(false),
    });

    this.siteContentService.getHealthTips().subscribe({
      next: (tips) => {
        this.healthTips.set(tips);
        this.loadingHealthTips.set(false);
      },
      error: () => this.loadingHealthTips.set(false),
    });
    this.siteContentService
      .getSettings()
      .subscribe({ next: (settings) => this.settings.set(settings) });
  }

  bookAppointment(): void {
    this.router.navigate(['/rendez-vous']);
  }

  logout(): void {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
