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
    path: 'tools',
    loadComponent: () => import('./features/agriculture-tools/tools-page/tools-page.component').then(m => m.ToolsPageComponent),
    title: 'Outils Agricoles - Petalia Soil'
  },
  {
    path: 'tools/map',
    loadComponent: () => import('./features/agriculture-tools/senegal-map/senegal-map.component').then(m => m.SenegalMapComponent),
    title: 'Carte Agricole du Sénégal - Petalia Soil'
  },
  {
    path: 'tools/recommendations',
    loadComponent: () => import('./features/agriculture-tools/crop-recommendations/crop-recommendations.component').then(m => m.CropRecommendationsComponent),
    title: 'Recommandations de Cultures - Petalia Soil'
  },
  {
    path: 'demande-analyse',
    loadComponent: () => import('./features/soil-analysis-request/soil-analysis-request.component').then(m => m.SoilAnalysisRequestComponent),
    title: 'Demande d\'analyse de sol - Petalia Soil'
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
