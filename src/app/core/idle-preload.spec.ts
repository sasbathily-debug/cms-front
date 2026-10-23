import { TestBed } from '@angular/core/testing';
import { Route } from '@angular/router';
import { of } from 'rxjs';
import { IdlePreload } from './idle-preload';

describe('IdlePreload', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const strategy = () => TestBed.inject(IdlePreload);

  it("ne charge rien pour une route qui n'est pas marquée", () => {
    const load = vi.fn(() => of(null));
    strategy()
      .preload({ path: 'admin' } as Route, load)
      .subscribe();
    vi.advanceTimersByTime(10_000);
    expect(load).not.toHaveBeenCalled();
  });

  it('charge une route publique quand le navigateur est au repos', () => {
    const load = vi.fn(() => of(null));
    strategy()
      .preload({ path: 'contact', data: { preload: true } } as Route, load)
      .subscribe();
    expect(load).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2000);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('ne charge rien en mode économie de données', () => {
    vi.stubGlobal('navigator', { connection: { saveData: true } });
    const load = vi.fn(() => of(null));
    strategy()
      .preload({ path: 'contact', data: { preload: true } } as Route, load)
      .subscribe();
    vi.advanceTimersByTime(10_000);
    expect(load).not.toHaveBeenCalled();
  });
});
