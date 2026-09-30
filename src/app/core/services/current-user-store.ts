import { Service, computed, effect, inject, signal } from '@angular/core';
import { Auth } from './auth';
import { UserService } from './user';
import { UserDto } from '../models/user.models';

/**
 * Single reactive source of truth for the logged-in user's profile data
 * (name, avatar, preferences...). Components read `user()` instead of each
 * fetching /users/me on their own, so a profile edit anywhere (Settings)
 * is reflected everywhere (header, home greeting) the instant it saves --
 * no reconnection or page reload needed. An effect watches the auth session
 * (login/logout/refresh) and keeps this in sync automatically.
 */
@Service()
export class CurrentUserStore {
  private readonly auth = inject(Auth);
  private readonly userService = inject(UserService);

  private readonly userSignal = signal<UserDto | null>(null);
  private loadedForUserId: string | null = null;

  readonly user = computed(() => this.userSignal());
  readonly initials = computed(() => {
    const user = this.userSignal();
    if (!user) {
      return '';
    }
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  });

  constructor() {
    effect(() => {
      const currentId = this.auth.currentUser()?.id ?? null;
      if (!currentId) {
        this.userSignal.set(null);
        this.loadedForUserId = null;
        return;
      }
      if (this.loadedForUserId === currentId) {
        return;
      }
      this.loadedForUserId = currentId;
      this.userService.getMe().subscribe({
        next: (user) => this.userSignal.set(user),
        error: () => {
          this.loadedForUserId = null;
        },
      });
    });
  }

  set(user: UserDto): void {
    this.userSignal.set(user);
    this.loadedForUserId = user.id;
  }
}
