import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AppointmentService } from '../../../core/services/appointment';
import { AppointmentDto, AppointmentStatus } from '../../../core/models/appointment.models';
import { AppointmentHistory } from '../../../shared/appointment-history/appointment-history';
import {
  appointmentStatusClasses,
  appointmentStatusDotClasses,
  appointmentStatusLabel,
} from '../../../shared/appointment-status.util';

type FilterValue = 'ALL' | AppointmentStatus;

@Component({
  selector: 'app-admin-appointments',
  imports: [AppointmentHistory],
  styleUrl: './admin-appointments.css',
  templateUrl: './admin-appointments.html',
})
export class AdminAppointments implements OnInit {
  private readonly appointmentService = inject(AppointmentService);

  private readonly all = signal<AppointmentDto[]>([]);
  readonly loading = signal(true);
  readonly filter = signal<FilterValue>('ALL');
  readonly updatingId = signal<string | null>(null);

  readonly statusLabel = appointmentStatusLabel;
  readonly statusClasses = appointmentStatusClasses;
  readonly dotClasses = appointmentStatusDotClasses;

  readonly counts = computed(() => {
    const list = this.all();
    return {
      ALL: list.length,
      PENDING: list.filter((a) => a.status === 'PENDING').length,
      CONFIRMED: list.filter((a) => a.status === 'CONFIRMED').length,
      CANCELLED: list.filter((a) => a.status === 'CANCELLED').length,
      COMPLETED: list.filter((a) => a.status === 'COMPLETED').length,
      NO_SHOW: list.filter((a) => a.status === 'NO_SHOW').length,
    };
  });

  readonly filtered = computed(() => {
    const filter = this.filter();
    const list = this.all();
    return filter === 'ALL' ? list : list.filter((a) => a.status === filter);
  });

  ngOnInit(): void {
    this.refresh();
  }

  setFilter(filter: FilterValue): void {
    this.filter.set(filter);
  }

  refresh(): void {
    this.loading.set(true);
    this.appointmentService.findAll(null, 0, 200).subscribe({
      next: (page) => {
        this.all.set(page.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  confirm(appointment: AppointmentDto): void {
    this.changeStatus(appointment, 'CONFIRMED');
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
        this.all.update((list) => list.map((a) => (a.id === updated.id ? updated : a)));
        this.updatingId.set(null);
      },
      error: () => this.updatingId.set(null),
    });
  }
}
