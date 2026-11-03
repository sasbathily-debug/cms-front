import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Analytics } from '../../core/analytics';
import { CookieBanner } from './cookie-banner';

describe('CookieBanner', () => {
  const asking = signal(true);
  const analytics = { asking, accept: vi.fn(), refuse: vi.fn() };

  beforeEach(() => {
    asking.set(true);
    analytics.accept.mockClear();
    analytics.refuse.mockClear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: Analytics, useValue: analytics }],
    });
  });

  function render() {
    const fixture = TestBed.createComponent(CookieBanner);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const find = (root: HTMLElement, label: RegExp) =>
    [...root.querySelectorAll('button')].find((b) => label.test(b.textContent ?? ''));

  it('dit en peu de mots ce qui est mesuré et ce qui ne part jamais', () => {
    const text = render().textContent ?? '';
    expect(text).toContain('Google Analytics');
    expect(text).toContain(
      "Nous n'envoyons à Google ni vos coordonnées ni aucune information de santé",
    );
    expect(text).toContain('Gérer les cookies');
  });

  it('est une barre large posée en bas, sans voile sur la page', () => {
    const root = render();
    const bar = root.querySelector('[role=dialog]')!;
    expect(bar.className).toContain('cookie-bar');
    expect(bar.className).toContain('max-w-[1040px]');
    expect(bar.getAttribute('aria-modal')).toBeNull();
    expect(root.querySelector('.fixed.inset-0')).toBeNull();
  });

  it("propose « j'accepte » et « je refuse » avec la même forme et le même poids", () => {
    const root = render();
    const accept = find(root, /j'accepte/i)!;
    const refuse = find(root, /je refuse/i)!;
    for (const b of [accept, refuse]) {
      expect(b.className).toContain('px-9');
      expect(b.className).toContain('py-3.5');
      expect(b.className).toContain('rounded-md');
    }
  });

  it('ne montre rien quand il ne faut pas poser la question', () => {
    asking.set(false);
    expect(render().querySelector('[role=dialog]')).toBeNull();
  });

  it('renvoie vers la politique de confidentialité', () => {
    const fixture = TestBed.createComponent(CookieBanner);
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a[href="/politique-de-confidentialite"]');
    expect(link).not.toBeNull();
  });

  it('transmet le choix du visiteur', () => {
    const root = render();
    find(root, /j'accepte/i)!.click();
    expect(analytics.accept).toHaveBeenCalledTimes(1);
    find(root, /je refuse/i)!.click();
    expect(analytics.refuse).toHaveBeenCalledTimes(1);
  });
});
