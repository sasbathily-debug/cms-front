import { Component, OnDestroy, computed, inject, input, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { Auth } from '../../core/services/auth';
import { MobileMenu } from '../mobile-menu/mobile-menu';
import { NAV_GROUPS, NAV_SIMPLE, NavGroup } from '../../core/site-nav';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MobileMenu],
  styleUrl: './app-header.css',
  templateUrl: './app-header.html',
})
export class AppHeader implements OnDestroy {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly navSub: Subscription;

  readonly variant = input<'app' | 'public'>('app');

  readonly groups = NAV_GROUPS;
  readonly simpleLinks = NAV_SIMPLE;

  readonly mobileMenuOpen = signal(false);
  readonly openGroup = signal<string | null>(null);
  readonly mobileGroup = signal<string | null>(null);
  readonly currentUrl = signal(this.router.url);

  readonly isAuthenticated = computed(() => this.auth.isAuthenticated());
  readonly spaceLink = computed(() => {
    if (!this.auth.isAuthenticated()) {
      return '/login';
    }
    return this.auth.currentUser()?.role === 'ADMIN' ? '/admin' : '/client';
  });

  constructor() {
    this.navSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
        this.closeAll();
      });
  }

  ngOnDestroy(): void {
    this.navSub.unsubscribe();
  }

  isGroupActive(group: NavGroup): boolean {
    const url = this.currentUrl().split(/[?#]/)[0];
    return group.links.some((link) => url === link.route || url.startsWith(link.route + '/'));
  }

  isSimpleActive(route: string): boolean {
    return this.currentUrl().split(/[?#]/)[0] === route;
  }

  toggleGroup(key: string): void {
    this.openGroup.update((current) => (current === key ? null : key));
  }

  hoverGroup(key: string): void {
    this.openGroup.set(key);
  }

  leaveGroups(): void {
    this.openGroup.set(null);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  toggleMobileGroup(key: string): void {
    this.mobileGroup.update((current) => (current === key ? null : key));
  }

  closeAll(): void {
    this.mobileMenuOpen.set(false);
    this.openGroup.set(null);
    this.mobileGroup.set(null);
  }

  logout(): void {
    this.closeAll();
    const goToLogin = () => this.router.navigate(['/login']);
    this.auth.logout().subscribe({ next: goToLogin, error: goToLogin });
  }
}
