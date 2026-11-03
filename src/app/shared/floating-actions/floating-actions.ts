import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { SiteSettings } from '../../core/services/site-settings';

/** Pages où la barre mobile n'a rien à proposer : on y est déjà, ou le clavier prend la place. */
const SANS_BARRE = ['/rendez-vous'];

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

  protected readonly showBar = computed(() => {
    const path = this.url().split(/[?#]/)[0];
    return !SANS_BARRE.some((p) => path === p || path.startsWith(p + '/'));
  });
}
