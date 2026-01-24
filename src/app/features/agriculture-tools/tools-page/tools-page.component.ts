import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SenegalMapComponent } from '../senegal-map/senegal-map.component';

@Component({
  selector: 'app-tools-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SenegalMapComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-agri-600 to-agri-700 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-4xl font-bold mb-4">
            Outils Agricoles
          </h1>
          <p class="text-xl text-agri-100 max-w-2xl">
            Explorez les zones agricoles du Sénégal et découvrez les cultures adaptées à chaque région
          </p>
        </div>
      </div>

      <!-- Quick Tools -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Map Tool -->
          <a
            routerLink="/tools/map"
            class="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div class="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Carte Agricole
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Visualisez les zones agricoles du Sénégal et leurs caractéristiques
            </p>
          </a>

          <!-- Recommendations Tool -->
          <a
            routerLink="/tools/recommendations"
            class="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div class="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Recommandations
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Obtenez des recommandations de cultures personnalisées
            </p>
          </a>

          <!-- Soil Analysis (Future) -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 opacity-60">
            <div class="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-7 h-7 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Analyse de Sol
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Bientôt disponible - Analysez votre sol
            </p>
            <span class="inline-block mt-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs rounded">
              Prochainement
            </span>
          </div>
        </div>
      </div>

      <!-- Interactive Map Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <app-senegal-map />
      </div>

      <!-- Crops Overview -->
      <div class="bg-white dark:bg-gray-800 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Cultures du Sénégal
          </h2>

          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            @for (crop of featuredCrops; track crop.id) {
              <a
                [routerLink]="['/tools/recommendations']"
                [queryParams]="{ crop: crop.id }"
                class="group bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center hover:bg-agri-50 dark:hover:bg-agri-900/30 transition-colors"
              >
                <div class="w-12 h-12 bg-agri-100 dark:bg-agri-900/50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <span class="text-2xl">{{ crop.emoji }}</span>
                </div>
                <h4 class="font-medium text-gray-900 dark:text-white text-sm">
                  {{ crop.name }}
                </h4>
              </a>
            }
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
            <div class="text-3xl font-bold text-agri-600 mb-1">6</div>
            <div class="text-gray-600 dark:text-gray-400 text-sm">Zones agricoles</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
            <div class="text-3xl font-bold text-agri-600 mb-1">14</div>
            <div class="text-gray-600 dark:text-gray-400 text-sm">Régions couvertes</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
            <div class="text-3xl font-bold text-agri-600 mb-1">25+</div>
            <div class="text-gray-600 dark:text-gray-400 text-sm">Cultures référencées</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
            <div class="text-3xl font-bold text-agri-600 mb-1">100%</div>
            <div class="text-gray-600 dark:text-gray-400 text-sm">Gratuit</div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-gradient-to-r from-agri-600 to-green-600 py-16">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold text-white mb-4">
            Prêt à optimiser vos cultures ?
          </h2>
          <p class="text-agri-100 mb-8 text-lg">
            Utilisez notre outil de recommandation pour trouver les cultures les mieux adaptées à votre terrain
          </p>
          <a
            routerLink="/tools/recommendations"
            class="inline-block px-8 py-4 bg-white text-agri-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Obtenir des recommandations
          </a>
        </div>
      </div>
    </div>
  `
})
export class ToolsPageComponent {
  featuredCrops = [
    { id: 'mil', name: 'Mil', emoji: '🌾' },
    { id: 'arachide', name: 'Arachide', emoji: '🥜' },
    { id: 'riz', name: 'Riz', emoji: '🍚' },
    { id: 'tomate', name: 'Tomate', emoji: '🍅' },
    { id: 'oignon', name: 'Oignon', emoji: '🧅' },
    { id: 'mangue', name: 'Mangue', emoji: '🥭' },
    { id: 'mais', name: 'Maïs', emoji: '🌽' },
    { id: 'manioc', name: 'Manioc', emoji: '🥔' },
    { id: 'coton', name: 'Coton', emoji: '🌿' },
    { id: 'canne_sucre', name: 'Canne à sucre', emoji: '🎋' },
    { id: 'banane', name: 'Banane', emoji: '🍌' },
    { id: 'pasteque', name: 'Pastèque', emoji: '🍉' }
  ];
}
