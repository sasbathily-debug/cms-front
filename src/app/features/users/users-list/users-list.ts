import { Component, OnInit, inject, signal } from '@angular/core';
import { UserService } from '../../../core/services/user';
import { UserDto } from '../../../core/models/user.models';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-users-list',
  styleUrl: './users-list.css',
  templateUrl: './users-list.html',
})
export class UsersList implements OnInit {
  private readonly userService = inject(UserService);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly users = signal<UserDto[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.userService.findAll().subscribe({
      next: (page) => {
        this.users.set(page.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  logout(): void {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
