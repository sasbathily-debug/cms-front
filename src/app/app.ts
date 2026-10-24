import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrentUserStore } from './core/services/current-user-store';
import { Reveal } from './core/reveal';
import { Theme } from './core/theme';
import { PageContent } from './core/services/page-content';
import { Analytics } from './core/analytics';
import { ChatWidget } from './shared/chat-widget/chat-widget';
import { CookieBanner } from './shared/cookie-banner/cookie-banner';
import { UpdateToast } from './shared/update-toast/update-toast';
import { PwaUpdate } from './core/pwa-update';

@Component({
  imports: [RouterOutlet, ChatWidget, CookieBanner, UpdateToast],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('projet-frontend');

  constructor() {
    inject(CurrentUserStore);
    inject(Reveal);
    inject(Theme);
    inject(Analytics).start();
    inject(PwaUpdate).start();
    this.prefetchPageTexts();
  }

  /** Quand le navigateur est au repos, on demande les textes des pages modifiables : leur ouverture sera immédiate. */
  private prefetchPageTexts(): void {
    const pageContent = inject(PageContent);
    const run = () =>
      void import('./core/page-content/pages').then(({ PAGES }) =>
        pageContent.prefetch(PAGES.map((page) => page.slug)),
      );
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(run, { timeout: 5000 });
    } else {
      window.setTimeout(run, 2500);
    }
  }
}
