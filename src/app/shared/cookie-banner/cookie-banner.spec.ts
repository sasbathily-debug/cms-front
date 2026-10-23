import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Analytics } from '../../core/analytics';
import { CookieBanner } from './cookie-banner';

describe('CookieBanner', () => {
  const asking = signal(true);
  const analytics = { asking, accept: vi.fn(), refuse: vi.fn() };

  beforeEach(() => {
    asking.set(true);
    analytics.accept.mockClear();
    analytics.refuse.mockClear();
    TestBed.configureTestingModule({ providers: [{ provide: Analytics, useValue: analytics }] });
  });

  function render() {
    const fixture = TestBed.createComponent(CookieBanner);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const find = (root: HTMLElement, label: RegExp) =>
    [...root.querySelectorAll('button')].find((b) => label.test(b.textContent ?? ''));

  it("affiche l'essentiel sans rien à déplier", () => {
    const root = render();
    const text = root.textContent ?? '';
    expect(text).toContain('Nécessaires');
    expect(text).toContain('Google Analytics');
    expect(text).toContain("Nous n'envoyons ni nom");
    expect(text).toContain('2 mois');
    expect(text).toContain('Gérer les cookies');
    expect(find(root, /En savoir plus/)).toBeUndefined();
  });

  it("est un panneau de dialogue nommé, collé au bord de l'écran, qui ne bloque pas la page", () => {
    const root = render();
    const dialog = root.querySelector('[role=dialog]')!;
    expect(dialog.getAttribute('aria-labelledby')).toBe('cookie-title');
    expect(dialog.getAttribute('aria-modal')).toBeNull();
    expect(dialog.className).toContain('cookie-panel');
    expect(dialog.className).toContain('sm:left-6');
    expect(root.querySelector('.backdrop-blur-\\[3px\\]')).toBeNull();
  });

  it('propose « Refuser » et « Accepter » avec le même poids', () => {
    const root = render();
    const refuse = find(root, /^\s*Refuser\s*$/)!;
    const accept = find(root, /Accepter les cookies/)!;
    expect(refuse.className).toContain('flex-1');
    expect(accept.className).toContain('flex-1');
  });

  it('ne montre rien quand il ne faut pas poser la question', () => {
    asking.set(false);
    expect(render().querySelector('[role=dialog]')).toBeNull();
  });

  it('transmet le choix du visiteur', () => {
    const root = render();
    find(root, /Accepter les cookies/)!.click();
    expect(analytics.accept).toHaveBeenCalledTimes(1);
    find(root, /^\s*Refuser\s*$/)!.click();
    expect(analytics.refuse).toHaveBeenCalledTimes(1);
  });
});
