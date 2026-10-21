import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home/home').then((m) => m.Home),
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/pages/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'faq',
    loadComponent: () => import('./features/pages/faq/faq').then((m) => m.Faq),
  },
  {
    path: 'a-propos',
    loadComponent: () => import('./features/pages/a-propos/a-propos').then((m) => m.APropos),
  },
  {
    path: 'specialites',
    loadComponent: () =>
      import('./features/pages/specialites/specialites').then((m) => m.Specialites),
  },
  {
    path: 'premiere-consultation',
    loadComponent: () =>
      import('./features/pages/premiere-consultation/premiere-consultation').then(
        (m) => m.PremiereConsultation,
      ),
  },
  {
    path: 'conseils-sante',
    loadComponent: () =>
      import('./features/pages/conseils-sante/conseils-sante').then((m) => m.ConseilsSante),
  },
  {
    path: 'infos-pratiques',
    loadComponent: () =>
      import('./features/pages/infos-pratiques/infos-pratiques').then((m) => m.InfosPratiques),
  },
  {
    path: 'le-cabinet',
    loadComponent: () => import('./features/pages/le-cabinet/le-cabinet').then((m) => m.LeCabinet),
  },
  {
    path: 'specialites/:slug',
    loadComponent: () => import('./features/pages/maladie/maladie').then((m) => m.Maladie),
  },
  {
    path: 'rendez-vous',
    loadComponent: () =>
      import('./features/pages/rendez-vous/rendez-vous').then((m) => m.RendezVous),
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
    path: 'set-password',
    loadComponent: () =>
      import('./features/auth/set-password/set-password').then((m) => m.SetPassword),
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile/profile').then((m) => m.Profile),
    canActivate: [authGuard],
  },
  {
    path: 'client',
    loadComponent: () =>
      import('./features/client/client-home/client-home').then((m) => m.ClientHome),
    canActivate: [authGuard, roleGuard('USER')],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin-shell/admin-shell').then((m) => m.AdminShell),
    canActivate: [authGuard, roleGuard('ADMIN')],
    children: [
      { path: '', redirectTo: 'appointments', pathMatch: 'full' },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./features/admin/admin-appointments/admin-appointments').then(
            (m) => m.AdminAppointments,
          ),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./features/admin/admin-services/admin-services').then((m) => m.AdminServices),
      },
      {
        path: 'faq',
        loadComponent: () => import('./features/admin/admin-faq/admin-faq').then((m) => m.AdminFaq),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/admin/admin-settings/admin-settings').then((m) => m.AdminSettings),
      },
      {
        path: 'health-tips',
        loadComponent: () =>
          import('./features/admin/admin-health-tips/admin-health-tips').then(
            (m) => m.AdminHealthTips,
          ),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./features/admin/admin-documents/admin-documents').then((m) => m.AdminDocuments),
      },
      {
        path: 'availability',
        loadComponent: () =>
          import('./features/admin/admin-availability/admin-availability').then(
            (m) => m.AdminAvailability,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
