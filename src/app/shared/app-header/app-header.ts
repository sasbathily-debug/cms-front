import { AfterViewInit, Component, OnDestroy, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';

const SECTION_IDS = ['about', 'services', 'parcours', 'faq'];

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  styleUrl: './app-header.css',
  templateUrl: './app-header.html',
})
export class AppHeader implements AfterViewInit, OnDestroy {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private observer: IntersectionObserver | null = null;

  readonly variant = input<'app' | 'public'>('app');

  readonly mobileMenuOpen = signal(false);
  readonly activeSection = signal('home');

  readonly isAuthenticated = computed(() => this.auth.isAuthenticated());
  readonly spaceLink = computed(() => (this.auth.currentUser()?.role === 'ADMIN' ? '/admin' : '/client'));

  ngAfterViewInit(): void {
    if (this.variant() !== 'public' || typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) {
        this.observer.observe(el);
      }
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  onNavClick(section: string): void {
    this.activeSection.set(section);
    this.closeMobileMenu();
  }

  onBookClick(event: Event): void {
    event.preventDefault();
    this.closeMobileMenu();
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/?book=1' } });
      return;
    }
    document.getElementById('rdv')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  logout(): void {
    this.closeMobileMenu();
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
