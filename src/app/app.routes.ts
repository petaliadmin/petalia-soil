import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'Accueil - Petalia Soil'
  },
  {
    path: 'lands',
    loadComponent: () => import('./features/lands/lands-list.component').then(m => m.LandsListComponent),
    title: 'Terres disponibles - Petalia Soil'
  },
  {
    path: 'lands/:id',
    loadComponent: () => import('./features/land-detail/land-detail.component').then(m => m.LandDetailComponent),
    title: 'Details de la terre - Petalia Soil'
  },
  {
    path: 'map',
    loadComponent: () => import('./features/map/map.component').then(m => m.MapComponent),
    title: 'Carte interactive - Petalia Soil'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
