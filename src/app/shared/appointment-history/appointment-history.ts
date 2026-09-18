import { Component, effect, inject, input, signal, untracked } from '@angular/core';
import { AppointmentService } from '../../core/services/appointment';
import { AppointmentStatus, AppointmentStatusEventDto } from '../../core/models/appointment.models';
import { appointmentStatusDotClasses, appointmentStatusLabel } from '../appointment-status.util';

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

@Component({
  selector: 'app-appointment-history',
  styleUrl: './appointment-history.css',
  templateUrl: './appointment-history.html',
})
export class AppointmentHistory {
  private readonly appointmentService = inject(AppointmentService);

  readonly appointmentId = input.required<string>();
  readonly status = input<AppointmentStatus | undefined>(undefined);

  readonly expanded = signal(false);
  readonly loading = signal(false);
  readonly loaded = signal(false);
  readonly events = signal<AppointmentStatusEventDto[]>([]);

  readonly statusLabel = appointmentStatusLabel;
  readonly dotClasses = appointmentStatusDotClasses;

  constructor() {
    effect(() => {
      this.status();
      untracked(() => {
        if (this.loaded()) {
          this.loaded.set(false);
          this.events.set([]);
          if (this.expanded()) {
            this.load();
          }
        }
      });
    });
  }

  toggle(): void {
    this.expanded.update((value) => !value);
    if (this.expanded() && !this.loaded()) {
      this.load();
    }
  }

  private load(): void {
    this.loading.set(true);
    this.appointmentService.getHistory(this.appointmentId()).subscribe({
      next: (events) => {
        this.events.set(events);
        this.loading.set(false);
        this.loaded.set(true);
      },
      error: () => this.loading.set(false),
    });
  }

  formatDate(iso: string): string {
    return dateFormatter.format(new Date(iso));
  }
}
