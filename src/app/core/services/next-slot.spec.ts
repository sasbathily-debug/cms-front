import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NextSlot, formatHeure } from './next-slot';

describe('NextSlot', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-23T15:20:00Z'));
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => vi.useRealTimers());

  const answer = (slots: { date: string; time: string }[]) =>
    http.expectOne((req) => req.url.endsWith('/site/availability')).flush(slots);

  it("propose le premier créneau à venir et nomme « aujourd'hui »", () => {
    const service = TestBed.inject(NextSlot);
    answer([
      { date: '2026-10-23', time: '15:00:00' },
      { date: '2026-10-23', time: '17:00:00' },
      { date: '2026-10-26', time: '09:00:00' },
    ]);
    const slot = service.next();
    expect(slot?.time).toBe('17:00:00');
    expect(service.dayLabel(slot!)).toBe("aujourd'hui");
  });

  it('retire un créneau dès que son heure est passée, sans recharger la page', () => {
    const service = TestBed.inject(NextSlot);
    answer([
      { date: '2026-10-23', time: '17:00:00' },
      { date: '2026-10-26', time: '09:00:00' },
    ]);
    expect(service.next()?.time).toBe('17:00:00');

    vi.setSystemTime(new Date('2026-10-23T17:00:30Z'));
    vi.advanceTimersByTime(30_000);

    const slot = service.next();
    expect(slot?.date).toBe('2026-10-26');
    expect(service.dayLabel(slot!)).toBe('lundi');
  });

  it('relit les créneaux au serveur après quelques minutes', () => {
    TestBed.inject(NextSlot);
    answer([{ date: '2026-10-23', time: '17:00:00' }]);

    vi.setSystemTime(new Date('2026-10-23T15:26:00Z'));
    vi.advanceTimersByTime(30_000);
    answer([{ date: '2026-10-23', time: '17:30:00' }]);
  });

  it("ne propose rien quand il n'y a aucun créneau", () => {
    const service = TestBed.inject(NextSlot);
    answer([]);
    expect(service.next()).toBeNull();
  });

  it("donne l'étiquette du créneau : jour abrégé, numéro et phrase", () => {
    const service = TestBed.inject(NextSlot);
    answer([
      { date: '2026-10-23', time: '17:30:00' },
      { date: '2026-10-26', time: '09:00:00' },
    ]);
    expect(service.ticket()).toEqual({
      jour: 'VEN',
      numero: '23',
      phrase: "aujourd'hui à 17 h 30",
    });

    vi.setSystemTime(new Date('2026-10-23T17:31:00Z'));
    vi.advanceTimersByTime(30_000);
    expect(service.ticket()).toEqual({ jour: 'LUN', numero: '26', phrase: 'lundi à 9 h' });
  });

  it("n'a pas d'étiquette sans créneau", () => {
    const service = TestBed.inject(NextSlot);
    answer([]);
    expect(service.ticket()).toBeNull();
  });

  it('écrit les heures à la française', () => {
    expect(formatHeure('09:00:00')).toBe('9 h');
    expect(formatHeure('17:30:00')).toBe('17 h 30');
    expect(formatHeure('12:05:00')).toBe('12 h 05');
  });
});
