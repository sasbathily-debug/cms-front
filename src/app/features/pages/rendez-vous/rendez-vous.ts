import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Analytics } from '../../../core/analytics';
import { icsFile } from '../../../core/calendar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { SlotPicker } from '../../../shared/slot-picker/slot-picker';
import { AppointmentService } from '../../../core/services/appointment';
import { AvailabilityService } from '../../../core/services/availability';
import { AvailableSlotDto } from '../../../core/models/availability.models';
import { Auth } from '../../../core/services/auth';
import { CurrentUserStore } from '../../../core/services/current-user-store';
import { PageContent } from '../../../core/services/page-content';
import { RENDEZ_VOUS } from '../../../core/page-content/defs/rendez-vous';
import { OpeningHours } from '../../../core/services/opening-hours';
import { SiteSettings } from '../../../core/services/site-settings';

/** Le dernier rendez-vous pris sur cet appareil : seulement la date, l'heure et le motif (rien de personnel). */
interface DernierRdv {
  date: string;
  time: string;
  reason: string;
}

const CLE_DERNIER_RDV = 'rdv-dernier';

function lireDernierRdv(): DernierRdv | null {
  try {
    const brut = localStorage.getItem(CLE_DERNIER_RDV);
    if (!brut) return null;
    const rdv = JSON.parse(brut) as DernierRdv;
    // Un rendez-vous passé n'a plus besoin d'être rappelé.
    return rdv?.date && rdv.date >= new Date().toISOString().slice(0, 10) ? rdv : null;
  } catch {
    return null;
  }
}

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
  private readonly analytics = inject(Analytics);
  private readonly appointmentService = inject(AppointmentService);
  private readonly availabilityService = inject(AvailabilityService);
  private readonly currentUserStore = inject(CurrentUserStore);
  private readonly auth = inject(Auth);
  private readonly route = inject(ActivatedRoute);
  protected readonly site = inject(SiteSettings);
  protected readonly openingHours = inject(OpeningHours);

  readonly motifs = MOTIFS;
  readonly isAuthenticated = computed(() => this.auth.isAuthenticated());

  readonly availableSlots = signal<AvailableSlotDto[]>([]);
  readonly loadingSlots = signal(true);
  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly confirmedLabel = signal('');
  readonly errorMessage = signal<string | null>(null);
  /** Sans compte et avec une adresse e-mail : le code a été envoyé, on attend qu'il soit saisi. */
  readonly awaitingCode = signal(false);
  readonly resent = signal(false);
  /** Le rendez-vous a été pris sans compte ; `guestVerified` dit si l'e-mail a été confirmé par le code. */
  readonly guestBooking = signal(false);
  readonly guestVerified = signal(false);

  /** Le dernier rendez-vous pris depuis cet appareil, tant qu'il n'est pas passé. */
  readonly dernier = signal<DernierRdv | null>(lireDernierRdv());
  readonly dernierLabel = computed(() => {
    const d = this.dernier();
    return d ? formatSlot(d.date, d.time) : '';
  });

  /** « Déplacer ou annuler » : un message WhatsApp prérempli au cabinet (le numéro est aussi donné à côté). */
  protected messageLink(label: string): string {
    const base = this.site.whatsappHref();
    if (!base || !label) return '';
    const text = `Bonjour, je souhaite déplacer ou annuler mon rendez-vous du ${label}.`;
    return `${base}${base.includes('?') ? '&' : '?'}text=${encodeURIComponent(text)}`;
  }
  readonly messageConfirme = computed(() => this.messageLink(this.confirmedLabel()));
  readonly messageDernier = computed(() => this.messageLink(this.dernierLabel()));

  /** Télécharge un fichier .ics : l'agenda du téléphone propose alors d'ajouter le rendez-vous. */
  protected addToCalendar(date: string, time: string): void {
    const fichier = icsFile({
      date,
      time,
      title: 'Rendez-vous, Dr Aïssatou Mamadou Fall',
      location: this.site.addressLine() ? `${this.site.addressLine()}, Dakar` : 'Dakar',
      description: `Pour déplacer ou annuler : ${this.site.phone()}`,
    });
    const url = URL.createObjectURL(new Blob([fichier], { type: 'text/calendar;charset=utf-8' }));
    const lien = document.createElement('a');
    lien.href = url;
    lien.download = 'rendez-vous.ics';
    lien.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  protected addLastToCalendar(): void {
    const d = this.dernier();
    if (d) this.addToCalendar(d.date, d.time);
  }

  protected addConfirmedToCalendar(): void {
    const v = this.form.getRawValue();
    if (v.preferredDate && v.preferredTime) this.addToCalendar(v.preferredDate, v.preferredTime);
  }

  forgetLast(): void {
    try {
      localStorage.removeItem(CLE_DERNIER_RDV);
    } catch {
      // Navigation privée : rien à effacer.
    }
    this.dernier.set(null);
  }

  /** Le message WhatsApp qui prévient le cabinet du rendez-vous qu'on vient de prendre. */
  readonly whatsappConfirm = computed(() => {
    const base = this.site.whatsappHref();
    if (!base) return '';
    const v = this.form.getRawValue();
    const text = `Bonjour, c'est ${v.fullName}. Je viens de prendre rendez-vous : ${this.confirmedLabel()}. Merci de me confirmer.`;
    return `${base}${base.includes('?') ? '&' : '?'}text=${encodeURIComponent(text)}`;
  });

  protected readonly c = inject(PageContent).use(RENDEZ_VOUS);

  readonly form = this.fb.group({
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.email],
    code: [''],
    website: [''],
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
    // Venu du menu « Je viens pour… » : le motif et le sujet sont déjà remplis.
    const params = this.route.snapshot.queryParamMap;
    const motif = params.get('motif');
    if (motif && MOTIFS.includes(motif)) this.form.patchValue({ reason: motif });
    const sujet = params.get('sujet')?.trim().slice(0, 80);
    if (sujet && !this.form.value.message) {
      this.form.patchValue({ message: `Je viens pour : ${sujet}.` });
    }
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
      this.errorMessage.set(
        this.form.controls.email.invalid
          ? "L'adresse e-mail ne semble pas valide."
          : 'Merci de choisir un créneau et de compléter les champs obligatoires.',
      );
      return;
    }
    this.errorMessage.set(null);

    if (this.isAuthenticated()) {
      this.book(false, true, () =>
        this.appointmentService.create({
          fullName: v.fullName!,
          phone: v.phone!,
          email: v.email || undefined,
          reason: v.reason!,
          preferredDate: v.preferredDate!,
          preferredTime: v.preferredTime!,
          message: v.message || undefined,
        }),
      );
      return;
    }

    // Sans compte. Avec une adresse e-mail : un code la vérifie ; sans adresse : le cabinet confirmera lui-même.
    if (v.email && !this.awaitingCode()) {
      this.sendCode();
      return;
    }
    if (v.email && !/^\d{6}$/.test((v.code ?? '').trim())) {
      this.errorMessage.set('Le code a 6 chiffres. Vérifiez votre boîte de réception.');
      return;
    }
    this.book(true, !!v.email, () =>
      this.appointmentService.createGuest({
        fullName: v.fullName!,
        phone: v.phone!,
        email: v.email || undefined,
        reason: v.reason!,
        preferredDate: v.preferredDate!,
        preferredTime: v.preferredTime!,
        message: v.message || undefined,
        code: v.email ? (v.code ?? '').trim() : undefined,
        website: v.website ?? '',
      }),
    );
  }

  /** Envoie (ou renvoie) le code à l'adresse e-mail saisie. */
  sendCode(resend = false): void {
    const v = this.form.getRawValue();
    this.submitting.set(true);
    this.errorMessage.set(null);
    this.appointmentService.requestGuestCode(v.email!, v.fullName!, v.website ?? '').subscribe({
      next: () => {
        this.submitting.set(false);
        this.awaitingCode.set(true);
        this.resent.set(resend);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(
          err.status === 429
            ? err.error?.message || 'Trop de demandes. Réessayez dans quelques minutes.'
            : "Le code n'a pas pu être envoyé. Vérifiez l'adresse e-mail ou écrivez-nous sur WhatsApp.",
        );
      },
    });
  }

  /** Revient aux champs pour corriger l'adresse e-mail ou le numéro avant de redemander un code. */
  editDetails(): void {
    this.awaitingCode.set(false);
    this.form.patchValue({ code: '' });
    this.errorMessage.set(null);
  }

  private book(
    guest: boolean,
    verified: boolean,
    request: () => ReturnType<AppointmentService['create']>,
  ): void {
    const v = this.form.getRawValue();
    this.submitting.set(true);
    request().subscribe({
      next: () => {
        this.submitting.set(false);
        this.confirmedLabel.set(formatSlot(v.preferredDate!, v.preferredTime!));
        const rdv: DernierRdv = {
          date: v.preferredDate!,
          time: v.preferredTime!,
          reason: v.reason ?? '',
        };
        try {
          localStorage.setItem(CLE_DERNIER_RDV, JSON.stringify(rdv));
        } catch {
          // Navigation privée : le rappel dans le navigateur n'est qu'un confort.
        }
        this.dernier.set(rdv);
        this.guestBooking.set(guest);
        this.guestVerified.set(verified);
        this.submitted.set(true);
        this.analytics.track(guest ? 'rendez_vous_reserve_sans_compte' : 'rendez_vous_reserve');
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(
          err.status === 429
            ? err.error?.message ||
                'Trop de demandes. Réessayez plus tard ou écrivez-nous sur WhatsApp.'
            : err.error?.message || 'Une erreur est survenue, veuillez réessayer.',
        );
        if (err.status === 409) {
          this.form.patchValue({ preferredDate: '', preferredTime: '' });
          this.awaitingCode.set(false);
          this.refreshSlots();
        }
      },
    });
  }

  reset(): void {
    this.submitted.set(false);
    this.awaitingCode.set(false);
    this.form.patchValue({ code: '' });
    this.form.patchValue({ preferredDate: '', preferredTime: '', message: '' });
    this.refreshSlots();
  }
}
