import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { SlotPicker } from '../../../shared/slot-picker/slot-picker';
import { AppointmentService } from '../../../core/services/appointment';
import { AvailabilityService } from '../../../core/services/availability';
import { AvailableSlotDto } from '../../../core/models/availability.models';
import { Auth } from '../../../core/services/auth';
import { CurrentUserStore } from '../../../core/services/current-user-store';
import { SiteSettings } from '../../../core/services/site-settings';

const MOTIFS = ['Première consultation', 'Suivi', "Résultats d'analyses", 'Nutrition', 'Autre'];

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatSlot(date: string, time: string): string {
  const d = new Date(`${date}T${time}`);
  const weekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(d);
  const month = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(d);
  const capitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${capitalized} ${d.getDate()} ${month} à ${time.slice(0, 5).replace(':', 'h')}`;
}

@Component({
  selector: 'app-rendez-vous',
  imports: [ReactiveFormsModule, RouterLink, PublicPage, SlotPicker],
  templateUrl: './rendez-vous.html',
})
export class RendezVous implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly appointmentService = inject(AppointmentService);
  private readonly availabilityService = inject(AvailabilityService);
  private readonly currentUserStore = inject(CurrentUserStore);
  private readonly auth = inject(Auth);
  protected readonly site = inject(SiteSettings);

  readonly motifs = MOTIFS;
  readonly isAuthenticated = computed(() => this.auth.isAuthenticated());

  readonly availableSlots = signal<AvailableSlotDto[]>([]);
  readonly loadingSlots = signal(true);
  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly confirmedLabel = signal('');
  readonly errorMessage = signal<string | null>(null);

  readonly etapes = [
    { n: '1', titre: 'Choisissez', texte: 'un motif, un jour et une heure parmi les créneaux libres.' },
    { n: '2', titre: 'Vérifiez', texte: 'vos coordonnées, déjà remplies depuis votre compte.' },
    { n: '3', titre: 'Confirmez', texte: 'et recevez votre confirmation. Un rappel vous est envoyé avant le rendez-vous.' },
  ];

  readonly form = this.fb.group({
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    email: [''],
    reason: [MOTIFS[0], Validators.required],
    preferredDate: [''],
    preferredTime: [''],
    message: [''],
  });

  constructor() {
    effect(() => {
      const user = this.currentUserStore.user();
      if (user) {
        this.form.patchValue({
          fullName: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          phone: user.phone ?? '',
        });
      }
    });
  }

  ngOnInit(): void {
    this.refreshSlots();
  }

  private refreshSlots(): void {
    this.loadingSlots.set(true);
    const from = new Date();
    const to = new Date();
    to.setDate(to.getDate() + 45);
    this.availabilityService.getAvailableSlots(toIsoDate(from), toIsoDate(to)).subscribe({
      next: (slots) => {
        this.availableSlots.set(slots);
        this.loadingSlots.set(false);
      },
      error: () => this.loadingSlots.set(false),
    });
  }

  setMotif(motif: string): void {
    this.form.patchValue({ reason: motif });
  }

  onSlotSelected(slot: { date: string; time: string }): void {
    this.form.patchValue({ preferredDate: slot.date, preferredTime: slot.time });
  }

  submit(): void {
    const v = this.form.getRawValue();
    if (this.form.invalid || !v.preferredDate || !v.preferredTime) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Merci de choisir un créneau et de compléter les champs obligatoires.');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.appointmentService
      .create({
        fullName: v.fullName!,
        phone: v.phone!,
        email: v.email || undefined,
        reason: v.reason!,
        preferredDate: v.preferredDate,
        preferredTime: v.preferredTime,
        message: v.message || undefined,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.confirmedLabel.set(formatSlot(v.preferredDate!, v.preferredTime!));
          this.submitted.set(true);
        },
        error: (err) => {
          this.submitting.set(false);
          this.errorMessage.set(err.error?.message || 'Une erreur est survenue, veuillez réessayer.');
          if (err.status === 409) {
            this.form.patchValue({ preferredDate: '', preferredTime: '' });
            this.refreshSlots();
          }
        },
      });
  }

  reset(): void {
    this.submitted.set(false);
    this.form.patchValue({ preferredDate: '', preferredTime: '', message: '' });
    this.refreshSlots();
  }
}
