import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Analytics } from '../../../core/analytics';
import { AppointmentService } from '../../../core/services/appointment';
import { AvailabilityService } from '../../../core/services/availability';
import { Auth } from '../../../core/services/auth';
import { RendezVous } from './rendez-vous';

describe('rendez-vous sans compte', () => {
  const appointments = {
    create: vi.fn(() => of({})),
    createGuest: vi.fn(() => of({})),
    requestGuestCode: vi.fn(() => of(void 0)),
  };

  function composant(authenticated = false, query: Record<string, string> = {}) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap(query) } },
        },
        { provide: AppointmentService, useValue: appointments },
        { provide: AvailabilityService, useValue: { getAvailableSlots: () => of([]) } },
        { provide: Auth, useValue: { isAuthenticated: () => authenticated } },
        { provide: Analytics, useValue: { track: vi.fn() } },
      ],
    });
    const c = TestBed.createComponent(RendezVous).componentInstance;
    c.form.patchValue({
      fullName: 'Awa Diop',
      phone: '+221770000000',
      preferredDate: '2030-01-07',
      preferredTime: '09:00:00',
    });
    return c;
  }

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.resetTestingModule();
  });

  it('avec une adresse e-mail : envoie un code, puis réserve avec ce code', () => {
    const c = composant();
    c.form.patchValue({ email: 'awa@example.com' });

    c.submit();
    expect(appointments.requestGuestCode).toHaveBeenCalledWith('awa@example.com', 'Awa Diop', '');
    expect(appointments.createGuest).not.toHaveBeenCalled();
    expect(c.awaitingCode()).toBe(true);

    c.form.patchValue({ code: '123456' });
    c.submit();
    expect(appointments.createGuest).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'awa@example.com', code: '123456' }),
    );
    expect(c.submitted()).toBe(true);
    expect(c.guestVerified()).toBe(true);
  });

  it("refuse un code qui n'a pas 6 chiffres sans appeler le serveur", () => {
    const c = composant();
    c.form.patchValue({ email: 'awa@example.com' });
    c.submit();
    c.form.patchValue({ code: '12' });
    c.submit();
    expect(appointments.createGuest).not.toHaveBeenCalled();
    expect(c.errorMessage()).toContain('6 chiffres');
  });

  it("sans e-mail : réserve directement, marqué non vérifié", () => {
    const c = composant();
    c.submit();
    expect(appointments.requestGuestCode).not.toHaveBeenCalled();
    expect(appointments.createGuest).toHaveBeenCalledWith(
      expect.objectContaining({ email: undefined, code: undefined }),
    );
    expect(c.submitted()).toBe(true);
    expect(c.guestBooking()).toBe(true);
    expect(c.guestVerified()).toBe(false);
  });

  it("créneau déjà pris (409) : vide le créneau et revient au formulaire", () => {
    appointments.createGuest.mockReturnValueOnce(
      throwError(() => ({ status: 409, error: { message: 'Créneau indisponible' } })),
    );
    const c = composant();
    c.submit();
    expect(c.submitted()).toBe(false);
    expect(c.form.value.preferredTime).toBe('');
    expect(c.errorMessage()).toBe('Créneau indisponible');
  });

  it('connecté : utilise la réservation classique, sans code', () => {
    const c = composant(true);
    c.submit();
    expect(appointments.create).toHaveBeenCalled();
    expect(appointments.createGuest).not.toHaveBeenCalled();
    expect(c.guestBooking()).toBe(false);
  });

  it('une adresse e-mail invalide bloque l’envoi', () => {
    const c = composant();
    c.form.patchValue({ email: 'pas-un-email' });
    c.submit();
    expect(appointments.requestGuestCode).not.toHaveBeenCalled();
    expect(c.errorMessage()).toContain('e-mail');
  });

  it('venu du menu « Je viens pour… » : motif et sujet sont préremplis', () => {
    const c = composant(false, { motif: 'Nutrition', sujet: 'mon alimentation' });
    c.ngOnInit();
    expect(c.form.value.reason).toBe('Nutrition');
    expect(c.form.value.message).toBe('Je viens pour : mon alimentation.');
  });

  it('ignore un motif qui ne figure pas dans le formulaire', () => {
    const c = composant(false, { motif: 'Inconnu' });
    c.ngOnInit();
    expect(c.form.value.reason).toBe('Première consultation');
  });
});
