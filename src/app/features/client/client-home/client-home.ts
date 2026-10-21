import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment';
import { PatientDocumentService } from '../../../core/services/patient-document';
import { SiteContentService } from '../../../core/services/site-content';
import { CurrentUserStore } from '../../../core/services/current-user-store';
import { ADDRESS_STREET, SiteSettings, WEEK_HOURS } from '../../../core/services/site-settings';
import { AppointmentDto } from '../../../core/models/appointment.models';
import { DocumentCategory, PatientDocumentDto } from '../../../core/models/patient-document.models';
import { HealthTipDto } from '../../../core/models/site-content.models';
import { AppointmentHistory } from '../../../shared/appointment-history/appointment-history';
import { NavIcon } from '../../../shared/nav-icon/nav-icon';
import { PatientShell } from '../../../shared/patient-shell/patient-shell';
import {
  appointmentStatusClasses,
  appointmentStatusLabel,
} from '../../../shared/appointment-status.util';

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  ORDONNANCE: 'Ordonnance',
  COMPTE_RENDU: 'Compte rendu',
  ANALYSE: 'Analyse',
  AUTRE: 'Document',
};

const DOT_COLORS: Record<string, { dot: string; halo: string }> = {
  CONFIRMED: { dot: '#E0873F', halo: 'rgba(224,135,63,0.25)' },
  COMPLETED: { dot: '#1F1226', halo: 'rgba(31,18,38,0.12)' },
  CANCELLED: { dot: '#B3261E', halo: 'rgba(179,38,30,0.15)' },
  NO_SHOW: { dot: '#8A4A2E', halo: 'rgba(138,74,46,0.15)' },
};

const PREP_ITEMS = [
  "Pièce d'identité",
  'Analyses récentes',
  'Ordonnances en cours',
  'Carnet de glycémie',
  'Mes questions, notées',
];
const PREP_KEY = 'cabinet-fall-preparation';

const MONTHS = [
  'JAN',
  'FÉV',
  'MAR',
  'AVR',
  'MAI',
  'JUIN',
  'JUIL',
  'AOÛT',
  'SEPT',
  'OCT',
  'NOV',
  'DÉC',
];

/** Tableau de bord du patient : prochain rendez-vous, préparation, suivi, documents, rappels, conseils. */
@Component({
  imports: [RouterLink, AppointmentHistory, NavIcon, PatientShell],
  selector: 'app-client-home',
  templateUrl: './client-home.html',
})
export class ClientHome implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  private readonly documentService = inject(PatientDocumentService);
  private readonly siteContentService = inject(SiteContentService);
  protected readonly site = inject(SiteSettings);
  readonly store = inject(CurrentUserStore);

  readonly appointments = signal<AppointmentDto[]>([]);
  readonly loadingAppointments = signal(true);
  readonly documents = signal<PatientDocumentDto[]>([]);
  readonly loadingDocuments = signal(true);
  readonly healthTips = signal<HealthTipDto[]>([]);
  readonly documentFilter = signal<DocumentCategory | 'ALL'>('ALL');

  readonly hours = WEEK_HOURS;
  readonly addressStreet = ADDRESS_STREET;

  readonly firstName = computed(() => this.store.user()?.firstName ?? '');
  readonly upcoming = computed(() =>
    this.appointments().filter(
      (a) => a.status === 'CONFIRMED' && !!a.preferredDate && a.preferredDate >= todayIso(),
    ),
  );
  readonly upcomingCount = computed(() => this.upcoming().length);

  /** Le prochain rendez-vous confirmé dont la date n'est pas passée. */
  readonly next = computed(
    () =>
      [...this.upcoming()].sort((a, b) =>
        (a.preferredDate! + (a.preferredTime ?? '')).localeCompare(
          b.preferredDate! + (b.preferredTime ?? ''),
        ),
      )[0] ?? null,
  );

  readonly nextMonth = computed(() => this.dateParts(this.next())?.month ?? '');
  readonly nextDay = computed(() => this.dateParts(this.next())?.day ?? '');
  readonly nextWhen = computed(() => {
    const appt = this.next();
    if (!appt?.preferredDate) {
      return '';
    }
    const d = new Date(`${appt.preferredDate}T00:00`);
    const weekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(d);
    const time = appt.preferredTime ? ` · ${appt.preferredTime.slice(0, 5)}` : '';
    return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}${time}`;
  });
  readonly nextLongDate = computed(() => {
    const appt = this.next();
    return appt?.preferredDate
      ? new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(
          new Date(`${appt.preferredDate}T00:00`),
        )
      : '';
  });
  readonly countdown = computed(() => {
    const appt = this.next();
    if (!appt?.preferredDate) {
      return '';
    }
    const days = Math.round(
      (new Date(`${appt.preferredDate}T00:00`).getTime() -
        new Date(`${todayIso()}T00:00`).getTime()) /
        86_400_000,
    );
    return days <= 0 ? "aujourd'hui" : days === 1 ? 'demain' : `dans ${days} jours`;
  });

  readonly filteredDocuments = computed(() => {
    const filter = this.documentFilter();
    return filter === 'ALL'
      ? this.documents()
      : this.documents().filter((d) => d.category === filter);
  });
  readonly filters: { key: DocumentCategory | 'ALL'; label: string }[] = [
    { key: 'ALL', label: 'Tous' },
    { key: 'ORDONNANCE', label: 'Ordonnances' },
    { key: 'ANALYSE', label: 'Analyses' },
    { key: 'COMPTE_RENDU', label: 'Comptes rendus' },
  ];

  /** La liste « Ma préparation » est cochée par le patient ; elle est gardée sur son appareil. */
  readonly prepItems = PREP_ITEMS;
  readonly prepDone = signal<boolean[]>(loadPrep());
  readonly prepCount = computed(() => this.prepDone().filter(Boolean).length);

  readonly statusLabel = appointmentStatusLabel;
  readonly statusClasses = appointmentStatusClasses;
  readonly categoryLabel = (category: DocumentCategory) => CATEGORY_LABELS[category];
  readonly dot = (status: string) => DOT_COLORS[status] ?? DOT_COLORS['COMPLETED'];

  readonly mapsUrl = 'https://www.google.com/maps?q=14.71259593963623,-17.46856689453125';

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
    this.siteContentService
      .getHealthTips()
      .subscribe({ next: (tips) => this.healthTips.set(tips), error: () => undefined });
  }

  whenLabel(date: string, time: string | null): string {
    const d = new Date(`${date}T${time ?? '00:00'}`);
    const day = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
    const label = day.charAt(0).toUpperCase() + day.slice(1);
    return time ? `${label} · ${time.slice(0, 5)}` : label;
  }

  documentsFor(appointmentId: string): PatientDocumentDto[] {
    return this.documents().filter((d) => d.appointmentId === appointmentId);
  }

  togglePrep(index: number): void {
    this.prepDone.update((list) => list.map((done, i) => (i === index ? !done : done)));
    try {
      localStorage.setItem(PREP_KEY, JSON.stringify(this.prepDone()));
    } catch {
      // Stockage indisponible (navigation privée) : la coche reste valable jusqu'au rechargement.
    }
  }

  /** Télécharge un fichier .ics pour ajouter le rendez-vous à l'agenda du téléphone. */
  addToCalendar(): void {
    const appt = this.next();
    if (!appt?.preferredDate) {
      return;
    }
    const start = new Date(`${appt.preferredDate}T${appt.preferredTime ?? '09:00:00'}`);
    const end = new Date(start.getTime() + 30 * 60_000);
    const fmt = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Cabinet Dr Fall//Rendez-vous//FR',
      'BEGIN:VEVENT',
      `UID:${appt.id}@draissatoumamadou.com`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:Rendez-vous au cabinet du Dr Fall (${appt.reason})`,
      `LOCATION:${ADDRESS_STREET} Sacré-Cœur 3 Dakar`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rendez-vous-cabinet-fall.ics';
    link.click();
    URL.revokeObjectURL(url);
  }

  private dateParts(appt: AppointmentDto | null): { month: string; day: string } | null {
    if (!appt?.preferredDate) {
      return null;
    }
    const d = new Date(`${appt.preferredDate}T00:00`);
    return { month: MONTHS[d.getMonth()], day: pad(d.getDate()) };
  }
}

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function loadPrep(): boolean[] {
  try {
    const raw = JSON.parse(localStorage.getItem(PREP_KEY) ?? '[]');
    return PREP_ITEMS.map((_, i) => raw[i] === true);
  } catch {
    return PREP_ITEMS.map(() => false);
  }
}
