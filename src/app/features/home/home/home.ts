import { Component, ElementRef, OnDestroy, OnInit, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppHeader } from '../../../shared/app-header/app-header';
import { AppFooter } from '../../../shared/app-footer/app-footer';
import { SlotPicker } from '../../../shared/slot-picker/slot-picker';
import { HealthIcon } from '../../../shared/health-icon/health-icon';
import { SiteContentService } from '../../../core/services/site-content';
import { AppointmentService } from '../../../core/services/appointment';
import { AvailabilityService } from '../../../core/services/availability';
import { CareServiceDto, FaqItemDto, HeroImageDto, SiteSettingsDto } from '../../../core/models/site-content.models';
import { AvailableSlotDto } from '../../../core/models/availability.models';
import { Auth } from '../../../core/services/auth';
import { CurrentUserStore } from '../../../core/services/current-user-store';

interface FaqView extends FaqItemDto {
  open: boolean;
}

function formatSlotLabel(date: string, time: string): string {
  const d = new Date(`${date}T${time}`);
  const weekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(d);
  const day = d.getDate();
  const month = new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(d).replace('.', '');
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${capitalizedWeekday} ${day} ${month} · ${time.slice(0, 5)}`;
}

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, RouterLink, AppHeader, AppFooter, SlotPicker, HealthIcon],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly siteContentService = inject(SiteContentService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly availabilityService = inject(AvailabilityService);
  private readonly currentUserStore = inject(CurrentUserStore);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);

  readonly settings = signal<SiteSettingsDto | null>(null);
  readonly services = signal<CareServiceDto[]>([]);
  readonly servicesLoop = computed(() => {
    const list = this.services();
    return list.length ? [...list, ...list, ...list] : [];
  });
  readonly faqs = signal<FaqView[]>([]);

  readonly heroImages = signal<HeroImageDto[]>([]);
  readonly heroLoading = signal(true);
  readonly servicesLoading = signal(true);
  readonly faqLoading = signal(true);
  readonly activeHeroIndex = signal(0);
  private heroInterval: ReturnType<typeof setInterval> | null = null;
  private heroSwipeStartX: number | null = null;

  @ViewChild('servicesTrack') private servicesTrackRef?: ElementRef<HTMLElement>;
  private servicesDragStartX: number | null = null;
  private servicesDragStartTime = 0;
  private readonly servicesLoopMs = 36000;

  readonly availableSlots = signal<AvailableSlotDto[]>([]);
  readonly loadingSlots = signal(true);

  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly preselectDate = signal<string | null>(null);
  readonly preselectTime = signal<string | null>(null);

  readonly isAuthenticated = computed(() => this.auth.isAuthenticated());

  readonly nextSlot = computed(() => this.availableSlots()[0] ?? null);
  readonly nextSlotLabel = computed(() => {
    const slot = this.nextSlot();
    return slot ? formatSlotLabel(slot.date, slot.time) : null;
  });

  readonly heroTitle = computed(() => this.settings()?.heroTitle || 'Comprendre votre corps, retrouver votre équilibre.');
  readonly heroSubtitle = computed(
    () =>
      this.settings()?.heroSubtitle ||
      "Le Dr Aissatou Mamadou Fall accompagne à Dakar les patients vivant avec le diabète, les troubles métaboliques et hormonaux — avec un suivi personnalisé, à l'écoute de chaque parcours.",
  );
  readonly aboutImageUrl = computed(() => this.settings()?.aboutImageUrl || null);
  readonly aboutText = computed(
    () =>
      this.settings()?.aboutText ||
      "Après une formation en endocrinologie et nutrition clinique, le Dr Fall a choisi de consacrer son cabinet aux patients vivant avec le diabète, les troubles métaboliques ou hormonaux — des maladies chroniques qui demandent un suivi rigoureux et une relation de confiance durable.",
  );
  readonly yearsExperience = computed(() => this.settings()?.yearsExperience || '15+');
  readonly patientsCount = computed(() => this.settings()?.patientsCount || '2 400+');
  readonly satisfactionRating = computed(() => this.settings()?.satisfactionRating || '4.9/5');
  readonly openingHours = computed(
    () => this.settings()?.openingHours || 'Lundi – Vendredi : 9h00 – 17h30\nSamedi : 9h00 – 13h00\nDimanche : Fermé',
  );
  readonly whatsappNumber = computed(() => this.settings()?.whatsappNumber || '');
  readonly mapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.google.com/maps?q=14.71259593963623,-17.46856689453125&z=17&output=embed',
  );

  readonly form = this.fb.group({
    fullName: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    email: [''],
    reason: ['', [Validators.required]],
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
    this.siteContentService.getSettings().subscribe({ next: (settings) => this.settings.set(settings) });
    this.siteContentService.getServices().subscribe({
      next: (services) => {
        this.services.set(services);
        this.servicesLoading.set(false);
      },
      error: () => this.servicesLoading.set(false),
    });
    this.siteContentService.getFaq().subscribe({
      next: (faqs) => {
        this.faqs.set(faqs.map((faq, index) => ({ ...faq, open: index === 0 })));
        this.faqLoading.set(false);
      },
      error: () => this.faqLoading.set(false),
    });
    this.siteContentService.getHeroImages().subscribe({
      next: (images) => {
        this.heroImages.set(images);
        this.heroLoading.set(false);
        this.startHeroAutoplay();
      },
      error: () => this.heroLoading.set(false),
    });

    this.refreshAvailableSlots();

    if (this.route.snapshot.queryParamMap.get('book') === '1' && this.isAuthenticated()) {
      setTimeout(() => this.scrollToBooking(), 0);
    }
  }

  ngOnDestroy(): void {
    if (this.heroInterval !== null) {
      clearInterval(this.heroInterval);
    }
  }

  private refreshAvailableSlots(): void {
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

  selectHeroImage(index: number): void {
    this.activeHeroIndex.set(index);
    this.restartHeroAutoplay();
  }

  nextHeroImage(): void {
    const total = this.heroImages().length;
    if (total < 2) {
      return;
    }
    this.activeHeroIndex.update((i) => (i + 1) % total);
    this.restartHeroAutoplay();
  }

  prevHeroImage(): void {
    const total = this.heroImages().length;
    if (total < 2) {
      return;
    }
    this.activeHeroIndex.update((i) => (i - 1 + total) % total);
    this.restartHeroAutoplay();
  }

  onHeroSwipeStart(event: PointerEvent): void {
    this.heroSwipeStartX = event.clientX;
  }

  onHeroSwipeEnd(event: PointerEvent): void {
    if (this.heroSwipeStartX === null) {
      return;
    }
    const delta = event.clientX - this.heroSwipeStartX;
    this.heroSwipeStartX = null;
    const SWIPE_THRESHOLD = 40;
    if (delta > SWIPE_THRESHOLD) {
      this.prevHeroImage();
    } else if (delta < -SWIPE_THRESHOLD) {
      this.nextHeroImage();
    }
  }

  private startHeroAutoplay(): void {
    const total = this.heroImages().length;
    if (total < 2) {
      return;
    }
    this.heroInterval = setInterval(() => {
      this.activeHeroIndex.update((i) => (i + 1) % total);
    }, 5000);
  }

  private restartHeroAutoplay(): void {
    if (this.heroInterval !== null) {
      clearInterval(this.heroInterval);
      this.heroInterval = null;
    }
    this.startHeroAutoplay();
  }

  serviceCardClass(index: number): string {
    const base =
      'group relative w-[300px] shrink-0 overflow-hidden rounded-[20px] border border-[#EADFC6]/70 bg-white p-7 transition-all duration-300';
    const isOffset = index % 3 === 1;
    if (isOffset) {
      return `${base} translate-y-4 rotate-1 shadow-[0_26px_56px_rgba(20,43,34,0.16)] hover:-translate-y-0.5 hover:rotate-0 hover:shadow-[0_32px_64px_rgba(20,43,34,0.2)]`;
    }
    return `${base} shadow-[0_10px_28px_rgba(20,43,34,0.06)] hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(20,43,34,0.14)]`;
  }

  onServicesPointerDown(event: PointerEvent): void {
    const track = this.servicesTrackRef?.nativeElement;
    const anim = track?.getAnimations()[0];
    if (!track || !anim) {
      return;
    }
    try {
      (event.currentTarget as Element).setPointerCapture(event.pointerId);
    } catch {
      // Ignore — best-effort capture, e.g. for a pointerId not recognized by the browser.
    }
    anim.pause();
    this.servicesDragStartX = event.clientX;
    this.servicesDragStartTime = Number(anim.currentTime) || 0;
  }

  onServicesPointerMove(event: PointerEvent): void {
    if (this.servicesDragStartX === null) {
      return;
    }
    const track = this.servicesTrackRef?.nativeElement;
    const anim = track?.getAnimations()[0];
    if (!track || !anim) {
      return;
    }
    const loopPx = track.scrollWidth / 3;
    const msPerPx = this.servicesLoopMs / loopPx;
    const deltaX = event.clientX - this.servicesDragStartX;
    const rawTime = this.servicesDragStartTime - deltaX * msPerPx;
    anim.currentTime = ((rawTime % this.servicesLoopMs) + this.servicesLoopMs) % this.servicesLoopMs;
  }

  onServicesPointerUp(): void {
    if (this.servicesDragStartX === null) {
      return;
    }
    this.servicesDragStartX = null;
    this.servicesTrackRef?.nativeElement?.getAnimations()[0]?.play();
  }

  toggleFaq(id: string): void {
    this.faqs.update((list) => list.map((faq) => (faq.id === id ? { ...faq, open: !faq.open } : faq)));
  }

  onSlotSelected(slot: { date: string; time: string }): void {
    this.form.patchValue({ preferredDate: slot.date, preferredTime: slot.time });
  }

  bookNextSlot(): void {
    if (!this.requireAuth()) {
      return;
    }
    const slot = this.nextSlot();
    if (slot) {
      this.preselectDate.set(slot.date);
      this.preselectTime.set(slot.time);
    }
    this.scrollToBooking();
  }

  scrollPastHero(): void {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }

  scrollToBooking(): void {
    if (!this.requireAuth()) {
      return;
    }
    document.getElementById('rdv')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private requireAuth(): boolean {
    if (this.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/?book=1' } });
    return false;
  }

  submit(): void {
    if (this.form.invalid || !this.form.value.preferredDate || !this.form.value.preferredTime) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Merci de choisir un créneau et de compléter le formulaire.');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    const value = this.form.getRawValue();

    this.appointmentService
      .create({
        fullName: value.fullName!,
        phone: value.phone!,
        email: value.email || undefined,
        reason: value.reason!,
        preferredDate: value.preferredDate || undefined,
        preferredTime: value.preferredTime || undefined,
        message: value.message || undefined,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.submitted.set(true);
        },
        error: (err) => {
          this.submitting.set(false);
          this.errorMessage.set(err.error?.message || 'Une erreur est survenue, veuillez réessayer.');
          if (err.status === 409) {
            this.form.patchValue({ preferredDate: '', preferredTime: '' });
            this.refreshAvailableSlots();
          }
        },
      });
  }

  resetForm(): void {
    this.submitted.set(false);
    this.form.reset();
  }
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
