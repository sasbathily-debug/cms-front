import { TestBed } from '@angular/core/testing';
import { BackToTop } from './back-to-top';

describe('BackToTop', () => {
  afterEach(() => vi.restoreAllMocks());

  it('propose un bouton « Remonter » accessible', () => {
    const fixture = TestBed.createComponent(BackToTop);
    fixture.detectChanges();
    const bouton = fixture.nativeElement.querySelector('button');
    expect(bouton?.getAttribute('aria-label')).toBe('Remonter en haut de la page');
  });

  it('remonte en haut de la page au clic', () => {
    const scroll = vi.fn();
    vi.stubGlobal('scrollTo', scroll);
    const fixture = TestBed.createComponent(BackToTop);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    expect(scroll).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
    vi.unstubAllGlobals();
  });
});
