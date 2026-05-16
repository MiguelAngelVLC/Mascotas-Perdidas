import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Mascotas Perdidas – Inicio',
  },
  {
    path: 'perdidos',
    loadComponent: () => import('./pages/lost/lost.component').then(m => m.LostComponent),
    title: 'Mascotas Perdidas – Animales Perdidos',
  },
  {
    path: 'encontrados',
    loadComponent: () => import('./pages/found/found.component').then(m => m.FoundComponent),
    title: 'Mascotas Perdidas – Animales Encontrados',
  },
  {
    path: 'reportar',
    loadComponent: () => import('./pages/report-form/report-form.component').then(m => m.ReportFormComponent),
    canActivate: [authGuard],
    title: 'Mascotas Perdidas – Publicar Reporte',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Mascotas Perdidas – Iniciar Sesión',
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    title: 'Mascotas Perdidas – Crear Cuenta',
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
    title: 'Mascotas Perdidas – Mi Perfil',
  },
  {
    path: 'sobre-nosotros',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'Mascotas Perdidas – Sobre Nosotros',
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Mascotas Perdidas – Contacto',
  },
  { path: '**', redirectTo: '' },
];
