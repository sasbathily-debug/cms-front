import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NextSlot } from './next-slot';

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
});
