import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import {
  AppointmentCountsDto,
  AppointmentFilter,
  AppointmentService,
  AppointmentStatsDto,
} from '../../../core/services/appointment';
import { AppointmentDto, AppointmentStatus } from '../../../core/models/appointment.models';
import { AppointmentHistory } from '../../../shared/appointment-history/appointment-history';
import {
  appointmentStatusClasses,
  appointmentStatusDotClasses,
  appointmentStatusLabel,
} from '../../../shared/appointment-status.util';

type FilterValue = 'ALL' | AppointmentStatus | 'PAST_DUE';
type DateMode = 'ALL' | 'TODAY' | 'TOMORROW' | 'WEEK' | 'CUSTOM';
type SortOption = 'date-asc' | 'date-desc' | 'created-desc';

const PAGE_SIZE = 20;
const EMPTY_COUNTS: AppointmentCountsDto = {
  all: 0,
  confirmed: 0,
  cancelled: 0,
  completed: 0,
  noShow: 0,
  pastDue: 0,
};

function toIsoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function mondayOf(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Component({
  selector: 'app-admin-appointments',
  imports: [AppointmentHistory],
  styleUrl: './admin-appointments.css',
  templateUrl: './admin-appointments.html',
})
export class AdminAppointments implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly appointments = signal<AppointmentDto[]>([]);
  readonly loading = signal(true);
  readonly totalElements = signal(0);
  readonly totalPages = signal(0);
  readonly page = signal(0);

  readonly statusFilter = signal<FilterValue>('ALL');
  readonly dateMode = signal<DateMode>('ALL');
  readonly customDate = signal<string | null>(null);
  readonly searchInput = signal('');
  readonly searchTerm = signal('');
  readonly sort = signal<SortOption>('date-asc');

  readonly updatingId = signal<string | null>(null);
  readonly exporting = signal(false);

  readonly counts = signal<AppointmentCountsDto>(EMPTY_COUNTS);
  readonly stats = signal<AppointmentStatsDto | null>(null);

  readonly statusLabel = appointmentStatusLabel;
  readonly statusClasses = appointmentStatusClasses;
  readonly dotClasses = appointmentStatusDotClasses;

  private readonly searchSubject = new Subject<string>();

  readonly dateRange = computed<{ date: string | null; from: string | null; to: string | null }>(
    () => {
      const mode = this.dateMode();
      const today = new Date();
      switch (mode) {
        case 'TODAY':
          return { date: toIsoDate(today), from: null, to: null };
        case 'TOMORROW': {
          const t = new Date(today);
          t.setDate(t.getDate() + 1);
          return { date: toIsoDate(t), from: null, to: null };
        }
        case 'WEEK': {
          const start = mondayOf(today);
          const end = new Date(start);
          end.setDate(end.getDate() + 6);
          return { date: null, from: toIsoDate(start), to: toIsoDate(end) };
        }
        case 'CUSTOM':
          return { date: this.customDate(), from: null, to: null };
        default:
          return { date: null, from: null, to: null };
      }
    },
  );

  readonly hasActiveFilters = computed(
    () =>
      this.statusFilter() !== 'ALL' || this.dateMode() !== 'ALL' || this.searchTerm().length > 0,
  );

  readonly emptyMessage = computed(() => {
    const parts: string[] = [];
    const filter = this.statusFilter();
    if (filter === 'PAST_DUE') {
      parts.push('en retard');
    } else if (filter !== 'ALL') {
      parts.push(this.statusLabel(filter as AppointmentStatus).toLowerCase());
    }
    const mode = this.dateMode();
    if (mode === 'TODAY') {
      parts.push("aujourd'hui");
    } else if (mode === 'TOMORROW') {
      parts.push('demain');
    } else if (mode === 'WEEK') {
      parts.push('cette semaine');
    } else if (mode === 'CUSTOM' && this.customDate()) {
      parts.push(`le ${this.customDate()}`);
    }
    if (this.searchTerm()) {
      parts.push(`pour "${this.searchTerm()}"`);
    }

    if (parts.length === 0) {
      return 'Aucune demande pour le moment.';
    }
    return `Aucun rendez-vous ${parts.join(' ')}.`;
  });

  constructor() {
    this.searchSubject.pipe(debounceTime(350), distinctUntilChanged()).subscribe((term) => {
      this.searchTerm.set(term);
      this.page.set(0);
      this.syncUrl();
      this.refresh();
      this.refreshCounts();
    });
  }

  ngOnInit(): void {
    this.readFiltersFromUrl();
    this.refresh();
    this.refreshCounts();
    this.refreshStats();
  }

  private readFiltersFromUrl(): void {
    const qp = this.route.snapshot.queryParamMap;
    const status = qp.get('status') as FilterValue | null;
    if (status) {
      this.statusFilter.set(status);
    }
    const dateMode = qp.get('dateMode') as DateMode | null;
    if (dateMode) {
      this.dateMode.set(dateMode);
    }
    const customDate = qp.get('date');
    if (customDate) {
      this.customDate.set(customDate);
    }
    const search = qp.get('search');
    if (search) {
      this.searchInput.set(search);
      this.searchTerm.set(search);
    }
    const sort = qp.get('sort') as SortOption | null;
    if (sort) {
      this.sort.set(sort);
    }
    const page = qp.get('page');
    if (page) {
      this.page.set(Number(page) || 0);
    }
  }

  private syncUrl(): void {
    const queryParams: Record<string, string | null> = {
      status: this.statusFilter() !== 'ALL' ? this.statusFilter() : null,
      dateMode: this.dateMode() !== 'ALL' ? this.dateMode() : null,
      date: this.dateMode() === 'CUSTOM' ? this.customDate() : null,
      search: this.searchTerm() || null,
      sort: this.sort() !== 'date-asc' ? this.sort() : null,
      page: this.page() > 0 ? String(this.page()) : null,
    };
    this.router.navigate([], { relativeTo: this.route, queryParams, replaceUrl: true });
  }

  private buildFilter(): AppointmentFilter {
    const { date, from, to } = this.dateRange();
    const filter = this.statusFilter();
    const isPastDue = filter === 'PAST_DUE';
    return {
      status: !isPastDue && filter !== 'ALL' ? (filter as AppointmentStatus) : null,
      pastDue: isPastDue || null,
      date,
      from,
      to,
      search: this.searchTerm() || null,
      sort: this.sortParam(),
    };
  }

  isOverdue(appointment: AppointmentDto): boolean {
    if (
      appointment.status !== 'CONFIRMED' ||
      !appointment.preferredDate ||
      !appointment.preferredTime
    ) {
      return false;
    }
    return new Date(`${appointment.preferredDate}T${appointment.preferredTime}`) < new Date();
  }

  private sortParam(): string {
    switch (this.sort()) {
      case 'date-desc':
        return 'preferredDate,desc';
      case 'created-desc':
        return 'createdAt,desc';
      default:
        return 'preferredDate,asc';
    }
  }

  refresh(): void {
    this.loading.set(true);
    this.appointmentService.findAll(this.buildFilter(), this.page(), PAGE_SIZE).subscribe({
      next: (p) => {
        this.appointments.set(p.content);
        this.totalElements.set(p.totalElements);
        this.totalPages.set(p.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  refreshCounts(): void {
    const { date, from, to } = this.dateRange();
    this.appointmentService
      .getCounts({ date, from, to, search: this.searchTerm() || null })
      .subscribe({
        next: (c) => this.counts.set(c),
      });
  }

  refreshStats(): void {
    this.appointmentService.getStats().subscribe({ next: (s) => this.stats.set(s) });
  }

  setFilter(filter: FilterValue): void {
    this.statusFilter.set(filter);
    this.page.set(0);
    this.syncUrl();
    this.refresh();
  }

  setDateMode(mode: DateMode): void {
    this.dateMode.set(mode);
    if (mode !== 'CUSTOM') {
      this.customDate.set(null);
    }
    this.page.set(0);
    this.syncUrl();
    this.refresh();
    this.refreshCounts();
  }

  onCustomDateChange(value: string): void {
    this.customDate.set(value || null);
    this.dateMode.set(value ? 'CUSTOM' : 'ALL');
    this.page.set(0);
    this.syncUrl();
    this.refresh();
    this.refreshCounts();
  }

  onSearchInput(value: string): void {
    this.searchInput.set(value);
    this.searchSubject.next(value.trim());
  }

  setSort(value: string): void {
    this.sort.set(value as SortOption);
    this.syncUrl();
    this.refresh();
  }

  resetFilters(): void {
    this.statusFilter.set('ALL');
    this.dateMode.set('ALL');
    this.customDate.set(null);
    this.searchInput.set('');
    this.searchTerm.set('');
    this.sort.set('date-asc');
    this.page.set(0);
    this.syncUrl();
    this.refresh();
    this.refreshCounts();
  }

  goToPage(p: number): void {
    if (p < 0 || p >= this.totalPages()) {
      return;
    }
    this.page.set(p);
    this.syncUrl();
    this.refresh();
  }

  highlight(text: string): string {
    const term = this.searchTerm().trim();
    if (!term) {
      return text;
    }
    const pattern = new RegExp(`(${escapeRegExp(term)})`, 'ig');
    return text.replace(
      pattern,
      '<mark class="rounded bg-accent-soft px-0.5 text-inherit">$1</mark>',
    );
  }

  export(): void {
    this.exporting.set(true);
    this.appointmentService.exportCsv(this.buildFilter()).subscribe({
      next: (blob) => {
        this.exporting.set(false);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rendez-vous.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      },
      error: () => this.exporting.set(false),
    });
  }

  cancel(appointment: AppointmentDto): void {
    this.changeStatus(appointment, 'CANCELLED');
  }

  complete(appointment: AppointmentDto): void {
    this.changeStatus(appointment, 'COMPLETED');
  }

  markNoShow(appointment: AppointmentDto): void {
    this.changeStatus(appointment, 'NO_SHOW');
  }

  private changeStatus(appointment: AppointmentDto, status: AppointmentStatus): void {
    this.updatingId.set(appointment.id);
    this.appointmentService.updateStatus(appointment.id, status).subscribe({
      next: (updated) => {
        this.appointments.update((list) => list.map((a) => (a.id === updated.id ? updated : a)));
        this.updatingId.set(null);
        this.refreshCounts();
        this.refreshStats();
      },
      error: () => this.updatingId.set(null),
    });
  }
}
