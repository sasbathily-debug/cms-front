import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { SiteSettings } from '../../core/services/site-settings';

/** Pages où la barre mobile n'a rien à proposer : on y est déjà, ou le clavier prend la place. */
const SANS_BARRE = ['/rendez-vous', '/contact'];
/** Pages qui proposent déjà l'appel et WhatsApp en grand : les boutons ronds y feraient doublon. */
const SANS_BOUTONS_RONDS = ['/contact'];

@Component({
  selector: 'app-floating-actions',
  imports: [RouterLink],
  templateUrl: './floating-actions.html',
})
export class FloatingActions {
  protected readonly site = inject(SiteSettings);
  private readonly router = inject(Router);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: typeof location === 'undefined' ? this.router.url : location.pathname },
  );

  private readonly path = computed(() => this.url().split(/[?#]/)[0]);
  protected readonly showBar = computed(
    () => !SANS_BARRE.some((p) => this.path() === p || this.path().startsWith(p + '/')),
  );
  protected readonly showCircles = computed(
    () => !SANS_BOUTONS_RONDS.some((p) => this.path() === p || this.path().startsWith(p + '/')),
  );
}
