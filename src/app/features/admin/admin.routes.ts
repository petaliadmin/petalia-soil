import { Routes } from '@angular/router';
import { authGuard, adminGuard, ownerGuard, farmerGuard, noAuthGuard } from '../../shared/guards/auth.guard';

export const adminRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/admin-login.component').then(m => m.AdminLoginComponent),
    canActivate: [noAuthGuard],
    title: 'Connexion - Admin Petalia Soil'
  },
  {
    path: 'register',
    loadComponent: () => import('./register/admin-register.component').then(m => m.AdminRegisterComponent),
    canActivate: [noAuthGuard],
    title: 'Inscription - Admin Petalia Soil'
  },
  // Farmer dashboard (separate from owner/admin)
  {
    path: 'farmer',
    loadComponent: () => import('./layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [farmerGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./farmer-dashboard/farmer-dashboard.component').then(m => m.FarmerDashboardComponent),
        title: 'Mon espace - Petalia Soil'
      }
    ]
  },
  // Owner/Admin dashboard
  {
    path: '',
    loadComponent: () => import('./layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [ownerGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'Tableau de bord - Admin Petalia Soil'
      },
      {
        path: 'lands',
        loadComponent: () => import('./lands/admin-lands-list.component').then(m => m.AdminLandsListComponent),
        title: 'Gestion des terres - Admin Petalia Soil'
      },
      {
        path: 'lands/new',
        loadComponent: () => import('./lands/admin-land-form.component').then(m => m.AdminLandFormComponent),
        title: 'Nouvelle terre - Admin Petalia Soil'
      },
      {
        path: 'lands/:id/edit',
        loadComponent: () => import('./lands/admin-land-form.component').then(m => m.AdminLandFormComponent),
        title: 'Modifier la terre - Admin Petalia Soil'
      },
      {
        path: 'users',
        loadComponent: () => import('./users/admin-users-list.component').then(m => m.AdminUsersListComponent),
        canActivate: [adminGuard],
        title: 'Gestion des utilisateurs - Admin Petalia Soil'
      },
      {
        path: 'soil-analysis',
        loadComponent: () => import('./soil-analysis/admin-soil-analysis-list.component').then(m => m.AdminSoilAnalysisListComponent),
        title: 'Demandes d\'analyse - Admin Petalia Soil'
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
