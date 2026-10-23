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

  const buttons = (root: HTMLElement) => [...root.querySelectorAll('button')];
  const find = (root: HTMLElement, label: RegExp) =>
    buttons(root).find((b) => label.test(b.textContent ?? ''));

  it('propose « Refuser » et « Accepter » avec le même poids', () => {
    const root = render();
    const refuse = find(root, /Refuser les cookies/);
    const accept = find(root, /Accepter les cookies/);
    expect(refuse).toBeTruthy();
    expect(accept).toBeTruthy();
    expect(refuse!.className).toContain('flex-1');
    expect(accept!.className).toContain('flex-1');
  });

  it('ne montre rien quand il ne faut pas poser la question', () => {
    asking.set(false);
    expect(render().querySelector('[role=dialog]')).toBeNull();
  });

  it('déplie et replie le détail des cookies', async () => {
    const fixture = TestBed.createComponent(CookieBanner);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).not.toContain('Cookies nécessaires');

    const toggle = find(root, /En savoir plus/)!;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(root.textContent).toContain('Cookies nécessaires');
    expect(root.textContent).toContain('Google Analytics');
    expect(find(root, /Masquer le détail/)?.getAttribute('aria-expanded')).toBe('true');
  });

  it('transmet le choix du visiteur', () => {
    const root = render();
    find(root, /Accepter les cookies/)!.click();
    expect(analytics.accept).toHaveBeenCalledTimes(1);
    find(root, /Refuser les cookies/)!.click();
    expect(analytics.refuse).toHaveBeenCalledTimes(1);
  });
});
