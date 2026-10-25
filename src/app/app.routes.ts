import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

/** Titres des pages de spécialité (les contenus eux-mêmes sont chargés avec la page). */
const SPECIALTY_TITLES: Record<string, string> = {
  diabete: 'Diabète',
  thyroide: 'Thyroïde',
  obesite: 'Obésité et surpoids',
  'nutrition-clinique': 'Nutrition clinique',
  'troubles-hormonaux': 'Troubles hormonaux',
  cholesterol: 'Cholestérol et métabolisme',
};

export const routes: Routes = [
  {
    path: '',
    data: { preload: true },
    loadComponent: () => import('./features/home/home/home').then((m) => m.Home),
  },
  {
    path: 'contact',
    data: { preload: true },
    title: 'Contact',
    loadComponent: () => import('./features/pages/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'faq',
    data: { preload: true },
    title: 'Questions fréquentes',
    loadComponent: () => import('./features/pages/faq/faq').then((m) => m.Faq),
  },
  {
    path: 'a-propos',
    data: { preload: true },
    title: 'À propos',
    loadComponent: () => import('./features/pages/a-propos/a-propos').then((m) => m.APropos),
  },
  {
    path: 'specialites',
    data: { preload: true },
    title: 'Spécialités',
    loadComponent: () =>
      import('./features/pages/specialites/specialites').then((m) => m.Specialites),
  },
  {
    path: 'premiere-consultation',
    data: { preload: true },
    title: 'Première consultation',
    loadComponent: () =>
      import('./features/pages/premiere-consultation/premiere-consultation').then(
        (m) => m.PremiereConsultation,
      ),
  },
  {
    path: 'conseils-sante',
    data: { preload: true },
    title: 'Conseils santé',
    loadComponent: () =>
      import('./features/pages/conseils-sante/conseils-sante').then((m) => m.ConseilsSante),
  },
  {
    path: 'infos-pratiques',
    data: { preload: true },
    title: 'Infos pratiques et accès',
    loadComponent: () =>
      import('./features/pages/infos-pratiques/infos-pratiques').then((m) => m.InfosPratiques),
  },
  {
    path: 'le-cabinet',
    data: { preload: true },
    title: 'Le cabinet',
    loadComponent: () => import('./features/pages/le-cabinet/le-cabinet').then((m) => m.LeCabinet),
  },
  {
    path: 'specialites/:slug',
    data: { preload: true },
    title: (route) => SPECIALTY_TITLES[route.paramMap.get('slug') ?? ''] ?? 'Spécialités',
    loadComponent: () => import('./features/pages/maladie/maladie').then((m) => m.Maladie),
  },
  {
    path: 'rendez-vous',
    data: { preload: true },
    title: 'Prendre rendez-vous',
    loadComponent: () =>
      import('./features/pages/rendez-vous/rendez-vous').then((m) => m.RendezVous),
  },
  {
    path: 'login',
    title: 'Connexion',
    data: { noindex: true },
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    title: 'Créer un compte',
    data: { noindex: true },
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'mot-de-passe-oublie',
    title: 'Mot de passe oublié',
    data: { noindex: true },
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password').then((m) => m.ForgotPassword),
  },
  {
    path: 'verify-otp',
    title: 'Vérification du code',
    data: { noindex: true },
    loadComponent: () => import('./features/auth/verify-otp/verify-otp').then((m) => m.VerifyOtp),
  },
  {
    path: 'set-password',
    title: 'Choisir un mot de passe',
    data: { noindex: true },
    loadComponent: () =>
      import('./features/auth/set-password/set-password').then((m) => m.SetPassword),
  },
  {
    path: 'profile',
    title: 'Mon profil',
    data: { noindex: true },
    loadComponent: () => import('./features/profile/profile/profile').then((m) => m.Profile),
    canActivate: [authGuard],
  },
  {
    path: 'client',
    title: 'Mon espace',
    data: { noindex: true },
    loadComponent: () =>
      import('./features/client/client-home/client-home').then((m) => m.ClientHome),
    canActivate: [authGuard, roleGuard('USER')],
  },
  {
    path: 'admin',
    title: 'Espace pro',
    data: { noindex: true },
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
        path: 'pages',
        loadComponent: () =>
          import('./features/admin/admin-pages/admin-pages').then((m) => m.AdminPages),
      },
      {
        path: 'pages/:slug',
        loadComponent: () =>
          import('./features/admin/admin-page-editor/admin-page-editor').then(
            (m) => m.AdminPageEditor,
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
  {
    path: '**',
    title: 'Page introuvable',
    data: { noindex: true },
    loadComponent: () => import('./features/pages/not-found/not-found').then((m) => m.NotFound),
  },
];
