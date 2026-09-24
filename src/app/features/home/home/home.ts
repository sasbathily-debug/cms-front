import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
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
export class Home implements OnInit, AfterViewInit, OnDestroy {
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
  readonly activeHeroIndex = signal(0);
  private heroInterval: ReturnType<typeof setInterval> | null = null;

  @ViewChild('whatsappFloating') private whatsappFloatingRef?: ElementRef<HTMLElement>;
  @ViewChild('whatsappRealButton') private whatsappRealButtonRef?: ElementRef<HTMLElement>;
  readonly whatsappFlyTransform = signal('translate(0px, 0px) scale(1)');
  readonly whatsappFlyOpacity = signal(1);
  private whatsappBaseRect: DOMRect | null = null;
  private whatsappTicking = false;
  private readonly whatsappAnimRange = 500;
  private readonly onWhatsappScroll = (): void => {
    if (this.whatsappTicking) {
      return;
    }
    this.whatsappTicking = true;
    requestAnimationFrame(() => {
      this.updateWhatsappFlyPosition();
      this.whatsappTicking = false;
    });
  };
  private readonly onWhatsappResize = (): void => {
    const floating = this.whatsappFloatingRef?.nativeElement;
    if (!floating) {
      return;
    }
    this.whatsappFlyTransform.set('translate(0px, 0px) scale(1)');
    requestAnimationFrame(() => {
      this.whatsappBaseRect = floating.getBoundingClientRect();
      this.updateWhatsappFlyPosition();
    });
  };

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
    this.siteContentService.getServices().subscribe({ next: (services) => this.services.set(services) });
    this.siteContentService.getFaq().subscribe({
      next: (faqs) => this.faqs.set(faqs.map((faq, index) => ({ ...faq, open: index === 0 }))),
    });
    this.siteContentService.getHeroImages().subscribe({
      next: (images) => {
        this.heroImages.set(images);
        if (images.length > 1) {
          this.heroInterval = setInterval(() => {
            this.activeHeroIndex.update((i) => (i + 1) % images.length);
          }, 5000);
        }
      },
    });

    this.refreshAvailableSlots();

    if (this.route.snapshot.queryParamMap.get('book') === '1' && this.isAuthenticated()) {
      setTimeout(() => this.scrollToBooking(), 0);
    }
  }

  ngAfterViewInit(): void {
    const floating = this.whatsappFloatingRef?.nativeElement;
    if (!floating) {
      return;
    }
    this.whatsappBaseRect = floating.getBoundingClientRect();
    window.addEventListener('scroll', this.onWhatsappScroll, { passive: true });
    window.addEventListener('resize', this.onWhatsappResize);
    this.updateWhatsappFlyPosition();
  }

  private updateWhatsappFlyPosition(): void {
    const target = this.whatsappRealButtonRef?.nativeElement;
    if (!target || !this.whatsappBaseRect) {
      return;
    }
    const targetRect = target.getBoundingClientRect();
    const distanceToTarget = targetRect.top - window.innerHeight;
    const progress = Math.min(Math.max(1 - distanceToTarget / this.whatsappAnimRange, 0), 1);

    if (progress <= 0) {
      this.whatsappFlyTransform.set('translate(0px, 0px) scale(1)');
      this.whatsappFlyOpacity.set(1);
      return;
    }

    const base = this.whatsappBaseRect;
    const dx = targetRect.left + targetRect.width / 2 - (base.left + base.width / 2);
    const dy = targetRect.top + targetRect.height / 2 - (base.top + base.height / 2);
    const scale = 1 - 0.8 * progress;

    this.whatsappFlyTransform.set(`translate(${dx * progress}px, ${dy * progress}px) scale(${scale})`);
    this.whatsappFlyOpacity.set(1 - progress);
  }

  ngOnDestroy(): void {
    if (this.heroInterval !== null) {
      clearInterval(this.heroInterval);
    }
    window.removeEventListener('scroll', this.onWhatsappScroll);
    window.removeEventListener('resize', this.onWhatsappResize);
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
