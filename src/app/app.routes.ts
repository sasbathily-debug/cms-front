import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'verify-otp',
    loadComponent: () => import('./features/auth/verify-otp/verify-otp').then((m) => m.VerifyOtp),
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile/profile').then((m) => m.Profile),
    canActivate: [authGuard],
  },
  {
    path: 'client',
    loadComponent: () => import('./features/client/client-home/client-home').then((m) => m.ClientHome),
    canActivate: [authGuard, roleGuard('USER')],
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-shell/admin-shell').then((m) => m.AdminShell),
    canActivate: [authGuard, roleGuard('ADMIN')],
    children: [
      { path: '', redirectTo: 'appointments', pathMatch: 'full' },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./features/admin/admin-appointments/admin-appointments').then((m) => m.AdminAppointments),
      },
      {
        path: 'services',
        loadComponent: () => import('./features/admin/admin-services/admin-services').then((m) => m.AdminServices),
      },
      {
        path: 'faq',
        loadComponent: () => import('./features/admin/admin-faq/admin-faq').then((m) => m.AdminFaq),
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/admin-settings/admin-settings').then((m) => m.AdminSettings),
      },
      {
        path: 'health-tips',
        loadComponent: () =>
          import('./features/admin/admin-health-tips/admin-health-tips').then((m) => m.AdminHealthTips),
      },
      {
        path: 'documents',
        loadComponent: () => import('./features/admin/admin-documents/admin-documents').then((m) => m.AdminDocuments),
      },
      {
        path: 'availability',
        loadComponent: () =>
          import('./features/admin/admin-availability/admin-availability').then((m) => m.AdminAvailability),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
