import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { PwaInstall } from './pwa-install';

describe('PwaInstall', () => {
  const originalUa = navigator.userAgent;

  function setup(production = true, userAgent = originalUa) {
    environment.production = production;
    Object.defineProperty(navigator, 'userAgent', { value: userAgent, configurable: true });
    TestBed.resetTestingModule();
    return TestBed.inject(PwaInstall);
  }

  afterEach(() => {
    environment.production = false;
    Object.defineProperty(navigator, 'userAgent', { value: originalUa, configurable: true });
  });

  it("ne propose rien tant que le navigateur n'offre pas l'installation (ordinateur, Chrome pas prêt)", () => {
    expect(setup().available()).toBe(false);
  });

  it('propose le lien quand Chrome signale que le site est installable, puis installe', async () => {
    const service = setup();
    const prompt = vi.fn(() => Promise.resolve());
    const event = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
      prompt,
      userChoice: Promise.resolve({ outcome: 'accepted' as const }),
    });
    window.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(service.available()).toBe(true);

    await service.install();
    expect(prompt).toHaveBeenCalledTimes(1);
    expect(service.available()).toBe(false);
  });

  it("disparaît une fois l'application installée", () => {
    const service = setup();
    window.dispatchEvent(
      Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
        prompt: () => Promise.resolve(),
        userChoice: Promise.resolve({ outcome: 'dismissed' as const }),
      }),
    );
    expect(service.available()).toBe(true);
    window.dispatchEvent(new Event('appinstalled'));
    expect(service.available()).toBe(false);
  });

  it("sur iPhone, propose le lien et affiche le mode d'emploi au lieu d'installer", async () => {
    const service = setup(
      true,
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1',
    );
    expect(service.available()).toBe(true);
    expect(service.iosHelp()).toBe(false);
    await service.install();
    expect(service.iosHelp()).toBe(true);
  });

  it('ne propose rien en développement', () => {
    const service = setup(
      false,
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1',
    );
    expect(service.available()).toBe(false);
  });
});
