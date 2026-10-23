import { Service, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../environments/environment';

export type Consent = 'granted' | 'denied' | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = 'analytics-consent';

/** Zones privées ou qui touchent à la santé d'une personne : jamais mesurées, quel que soit le consentement. */
const PRIVATE_PREFIXES = [
  '/admin',
  '/client',
  '/profile',
  '/login',
  '/register',
  '/verify-otp',
  '/set-password',
  '/mot-de-passe-oublie',
];

function readConsent(): Consent {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

/** Le chemin sans paramètres ni ancre : une adresse peut contenir un e-mail ou un téléphone (« ?email=… »). */
export function cleanPath(url: string): string {
  return url.split(/[?#]/)[0] || '/';
}

export function isTrackable(path: string): boolean {
  const clean = cleanPath(path);
  return !PRIVATE_PREFIXES.some((prefix) => clean === prefix || clean.startsWith(prefix + '/'));
}

/**
 * Mesure d'audience Google Analytics 4, avec le consentement du visiteur.
 *  - Sans identifiant dans l'environnement : rien ne se passe, aucun bandeau.
 *  - Rien n'est chargé chez Google tant que le visiteur n'a pas accepté ; s'il refuse, rien ne l'est jamais.
 *  - Nous n'envoyons ni nom, ni e-mail, ni téléphone, ni donnée de santé : seulement le chemin des pages publiques
 *    (sans paramètres) et deux événements sans détail. Google pose toutefois son propre identifiant dans un cookie,
 *    d'où le consentement ; à dire dans la politique de confidentialité.
 *  - Jamais l'admin, l'espace patient, la connexion ni la création de compte.
 */
@Service()
export class Analytics {
  private readonly router = inject(Router);
  private readonly id = environment.analyticsId;

  readonly enabled = !!this.id;
  readonly consent = signal<Consent>(readConsent());
  private readonly reopened = signal(false);
  private readonly path = signal(cleanPath(window.location.pathname));
  private loaded = false;

  /** Le bandeau s'affiche tant que le visiteur n'a pas répondu (ou quand il rouvre son choix), sur les pages publiques. */
  readonly asking = computed(
    () => this.enabled && (this.consent() === null || this.reopened()) && isTrackable(this.path()),
  );

  /** À appeler une fois au démarrage : suit la navigation et charge Google si le visiteur a déjà accepté. */
  start(): void {
    if (!this.enabled) return;
    if (this.consent() === 'granted') this.load();
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((event) => {
      this.path.set(cleanPath(event.urlAfterRedirects));
      this.pageView();
    });
  }

  accept(): void {
    this.remember('granted');
    this.window()[`ga-disable-${this.id}`] = false;
    this.load();
    this.pageView();
  }

  refuse(): void {
    this.remember('denied');
    this.window()[`ga-disable-${this.id}`] = true;
    this.forgetCookies();
  }

  /** Pour le lien « Gérer les cookies » du pied de page. */
  reopen(): void {
    this.reopened.set(true);
  }

  /** Un événement sans aucun détail (« rendez_vous_reserve », « contact_envoye »). */
  track(name: string): void {
    if (!this.enabled || this.consent() !== 'granted' || !this.loaded) return;
    window.gtag?.('event', name);
  }

  private remember(consent: 'granted' | 'denied'): void {
    this.consent.set(consent);
    this.reopened.set(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, consent);
    } catch {
      // pas de mémoire : la question sera reposée à la prochaine visite
    }
  }

  private pageView(): void {
    if (this.consent() !== 'granted' || !this.loaded || !isTrackable(this.path())) return;
    const path = this.path();
    // Le titre de la page est posé juste après la navigation.
    window.setTimeout(
      () =>
        window.gtag?.('event', 'page_view', {
          page_location: window.location.origin + path,
          page_path: path,
          page_title: document.title,
        }),
      0,
    );
  }

  private load(): void {
    if (this.loaded || !this.enabled) return;
    this.loaded = true;
    window.dataLayer = window.dataLayer ?? [];
    // Google attend l'objet « arguments » lui-même, pas un tableau.
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', this.id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_flags: 'SameSite=Lax;Secure',
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(this.id)}`;
    document.head.appendChild(script);
  }

  /** Efface les cookies de mesure déjà posés (« _ga », « _ga_… ») quand le visiteur refuse après avoir accepté. */
  private forgetCookies(): void {
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (name === '_ga' || name.startsWith('_ga_') || name === '_gid') {
        document.cookie = `${name}=; Max-Age=0; path=/`;
      }
    }
  }

  private window(): Record<string, unknown> {
    return window as unknown as Record<string, unknown>;
  }
}
