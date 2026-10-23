import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { environment } from '../../environments/environment';
import { Analytics, cleanPath, isTrackable } from './analytics';

function fakeStorage(initial: Record<string, string> = {}): Storage {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    clear: () => data.clear(),
    key: (index: number) => [...data.keys()][index] ?? null,
    get length() {
      return data.size;
    },
  };
}

const ID = 'G-TEST123456';

function setup(analyticsId: string, stored: Record<string, string> = {}) {
  Object.defineProperty(window, 'localStorage', { value: fakeStorage(stored), configurable: true });
  environment.analyticsId = analyticsId;
  environment.analyticsHosts = [window.location.hostname];
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', children: [] }])] });
  return TestBed.inject(Analytics);
}

const googleScripts = () => document.head.querySelectorAll('script[src*="googletagmanager"]');

describe('Analytics', () => {
  beforeEach(() => {
    googleScripts().forEach((s) => s.remove());
    delete window.gtag;
    delete window.dataLayer;
  });
  afterEach(() => {
    environment.analyticsId = '';
    environment.analyticsHosts = [];
  });

  it("ne fait rien et n'affiche aucun bandeau sans identifiant", () => {
    const analytics = setup('');
    analytics.start();
    expect(analytics.enabled).toBe(false);
    expect(analytics.asking()).toBe(false);
    expect(googleScripts().length).toBe(0);
  });

  it("n'appelle pas Google avant que le visiteur accepte, et pose la question", () => {
    const analytics = setup(ID);
    analytics.start();
    expect(analytics.asking()).toBe(true);
    expect(googleScripts().length).toBe(0);
    expect(window.gtag).toBeUndefined();
  });

  it('charge Google une seule fois après acceptation et retient le choix', () => {
    const analytics = setup(ID);
    analytics.start();
    analytics.accept();
    analytics.accept();
    expect(googleScripts().length).toBe(1);
    expect(googleScripts()[0].getAttribute('src')).toContain(ID);
    expect(analytics.asking()).toBe(false);
    expect(window.localStorage.getItem('analytics-consent')).toBe('granted');
  });

  it("n'appelle jamais Google après un refus, et ne repose pas la question", () => {
    const analytics = setup(ID);
    analytics.start();
    analytics.refuse();
    expect(googleScripts().length).toBe(0);
    expect(analytics.asking()).toBe(false);
    expect((window as unknown as Record<string, unknown>)[`ga-disable-${ID}`]).toBe(true);
    analytics.track('rendez_vous_reserve');
    expect(window.gtag).toBeUndefined();
  });

  it("n'appelle jamais Google hors du vrai site, même après acceptation", () => {
    const analytics = setup(ID);
    environment.analyticsHosts = ['draissatoumamadou.com'];
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', children: [] }])] });
    const preview = TestBed.inject(Analytics);
    preview.start();
    expect(preview.asking()).toBe(true);
    preview.accept();
    expect(googleScripts().length).toBe(0);
    expect(window.gtag).toBeUndefined();
    expect(analytics).toBeTruthy();
  });

  it('reprend un accord déjà donné sans reposer la question', () => {
    const analytics = setup(ID, { 'analytics-consent': 'granted' });
    analytics.start();
    expect(analytics.asking()).toBe(false);
    expect(googleScripts().length).toBe(1);
  });

  it('rouvre la question depuis « Gérer les cookies »', () => {
    const analytics = setup(ID, { 'analytics-consent': 'denied' });
    analytics.start();
    expect(analytics.asking()).toBe(false);
    analytics.reopen();
    expect(analytics.asking()).toBe(true);
    analytics.accept();
    expect(analytics.asking()).toBe(false);
  });

  it("ne pose pas la question sur l'espace privé", async () => {
    const analytics = setup(ID);
    analytics.start();
    await TestBed.inject(Router).navigateByUrl('/client');
    expect(analytics.asking()).toBe(false);
  });
});

describe('chemins mesurables', () => {
  it('ne mesure jamais les zones privées', () => {
    for (const path of [
      '/admin',
      '/admin/pages/a-propos',
      '/client',
      '/profile',
      '/login',
      '/register',
      '/verify-otp',
      '/set-password',
      '/mot-de-passe-oublie',
    ]) {
      expect(isTrackable(path), path).toBe(false);
    }
    for (const path of [
      '/',
      '/contact',
      '/rendez-vous',
      '/specialites/diabete',
      '/administration-publique',
    ]) {
      expect(isTrackable(path), path).toBe(true);
    }
  });

  it("retire les paramètres et l'ancre d'une adresse", () => {
    expect(cleanPath('/verify-otp?email=awa@example.com&phone=77')).toBe('/verify-otp');
    expect(cleanPath('/contact#formulaire')).toBe('/contact');
    expect(cleanPath('/')).toBe('/');
  });
});
