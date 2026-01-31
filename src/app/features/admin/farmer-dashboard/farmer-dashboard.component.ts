import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LandService } from '../../../shared/services/land.service';
import { FarmerService } from '../../../shared/services/farmer.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Land, formatPrice, LAND_TYPE_LABELS, LAND_STATUS_LABELS } from '../../../shared/models/land.model';

type TabType = 'rented' | 'visited' | 'favorites';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Mon espace agriculteur
          </h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Bienvenue, {{ authService.user()?.fullName }}
          </p>
        </div>
        <a
          routerLink="/lands"
          class="inline-flex items-center px-4 py-2 bg-agri-600 text-white font-medium rounded-lg hover:bg-agri-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          Explorer les terres
        </a>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <!-- Favorites -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 cursor-pointer transition-all hover:shadow-md"
          [class.ring-2]="activeTab() === 'favorites'"
          [class.ring-agri-500]="activeTab() === 'favorites'"
          (click)="setTab('favorites')"
        >
          <div class="flex items-center">
            <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Terres aimees</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ farmerService.favoritesCount() }}</p>
            </div>
          </div>
        </div>

        <!-- Visited -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 cursor-pointer transition-all hover:shadow-md"
          [class.ring-2]="activeTab() === 'visited'"
          [class.ring-agri-500]="activeTab() === 'visited'"
          (click)="setTab('visited')"
        >
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Terres visitees</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ farmerService.visitedCount() }}</p>
            </div>
          </div>
        </div>

        <!-- Rented -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 cursor-pointer transition-all hover:shadow-md"
          [class.ring-2]="activeTab() === 'rented'"
          [class.ring-agri-500]="activeTab() === 'rented'"
          (click)="setTab('rented')"
        >
          <div class="flex items-center">
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Terres louees</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ farmerService.rentedCount() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex -mb-px">
            <button
              (click)="setTab('favorites')"
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors"
              [class.border-agri-500]="activeTab() === 'favorites'"
              [class.text-agri-600]="activeTab() === 'favorites'"
              [class.dark:text-agri-400]="activeTab() === 'favorites'"
              [class.border-transparent]="activeTab() !== 'favorites'"
              [class.text-gray-500]="activeTab() !== 'favorites'"
              [class.hover:text-gray-700]="activeTab() !== 'favorites'"
              [class.dark:text-gray-400]="activeTab() !== 'favorites'"
            >
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                Aimees ({{ farmerService.favoritesCount() }})
              </span>
            </button>
            <button
              (click)="setTab('visited')"
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors"
              [class.border-agri-500]="activeTab() === 'visited'"
              [class.text-agri-600]="activeTab() === 'visited'"
              [class.dark:text-agri-400]="activeTab() === 'visited'"
              [class.border-transparent]="activeTab() !== 'visited'"
              [class.text-gray-500]="activeTab() !== 'visited'"
              [class.hover:text-gray-700]="activeTab() !== 'visited'"
              [class.dark:text-gray-400]="activeTab() !== 'visited'"
            >
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                Visitees ({{ farmerService.visitedCount() }})
              </span>
            </button>
            <button
              (click)="setTab('rented')"
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors"
              [class.border-agri-500]="activeTab() === 'rented'"
              [class.text-agri-600]="activeTab() === 'rented'"
              [class.dark:text-agri-400]="activeTab() === 'rented'"
              [class.border-transparent]="activeTab() !== 'rented'"
              [class.text-gray-500]="activeTab() !== 'rented'"
              [class.hover:text-gray-700]="activeTab() !== 'rented'"
              [class.dark:text-gray-400]="activeTab() !== 'rented'"
            >
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Louees ({{ farmerService.rentedCount() }})
              </span>
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          @if (landService.loading()) {
            <div class="text-center py-12">
              <div class="animate-spin w-8 h-8 border-4 border-agri-600 border-t-transparent rounded-full mx-auto"></div>
              <p class="mt-4 text-gray-500 dark:text-gray-400">Chargement...</p>
            </div>
          } @else if (currentLands().length === 0) {
            <div class="text-center py-12">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {{ getEmptyMessage() }}
              </h3>
              <p class="text-gray-500 dark:text-gray-400 mb-4">
                {{ getEmptySubMessage() }}
              </p>
              <a
                routerLink="/lands"
                class="inline-flex items-center px-4 py-2 bg-agri-600 text-white font-medium rounded-lg hover:bg-agri-700 transition-colors"
              >
                Explorer les terres disponibles
              </a>
            </div>
          } @else {
            <!-- Lands Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (land of currentLands(); track land._id) {
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <!-- Image -->
                  <div class="relative aspect-video">
                    @if (land.thumbnail || land.images?.[0]) {
                      <img
                        [src]="land.thumbnail || land.images?.[0]"
                        [alt]="land.title"
                        class="w-full h-full object-cover"
                      />
                    } @else {
                      <div class="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    }
                    <!-- Type Badge -->
                    <span
                      class="absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full"
                      [class.bg-blue-100]="land.type === 'RENT'"
                      [class.text-blue-800]="land.type === 'RENT'"
                      [class.bg-amber-100]="land.type === 'SALE'"
                      [class.text-amber-800]="land.type === 'SALE'"
                    >
                      {{ getTypeLabel(land.type) }}
                    </span>
                    <!-- Favorite Button -->
                    <button
                      (click)="toggleFavorite(land._id, $event)"
                      class="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    >
                      <svg
                        class="w-5 h-5"
                        [class.text-red-500]="farmerService.isFavorite(land._id)"
                        [class.fill-current]="farmerService.isFavorite(land._id)"
                        [class.text-gray-400]="!farmerService.isFavorite(land._id)"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Content -->
                  <div class="p-4">
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                      {{ land.title }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {{ land.address.city }}, {{ land.address.region }}
                    </p>
                    <div class="flex items-center justify-between mb-3">
                      <span class="text-lg font-bold text-agri-600 dark:text-agri-400">
                        {{ formatPrice(land.price) }}
                      </span>
                      <span class="text-sm text-gray-500 dark:text-gray-400">
                        {{ land.surface }} ha
                      </span>
                    </div>
                    <!-- Soil Info -->
                    <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span class="flex items-center">
                        <span
                          class="w-2 h-2 rounded-full mr-1"
                          [class.bg-green-500]="land.soilParameters.ph >= 6 && land.soilParameters.ph <= 7.5"
                          [class.bg-amber-500]="land.soilParameters.ph < 6 || land.soilParameters.ph > 7.5"
                        ></span>
                        pH {{ land.soilParameters.ph }}
                      </span>
                      <span>{{ land.soilParameters.moisture }}% humidite</span>
                    </div>
                    <!-- Actions -->
                    <div class="flex gap-2">
                      <a
                        [routerLink]="['/lands', land._id]"
                        class="flex-1 px-4 py-2 text-center text-sm font-medium bg-agri-600 text-white rounded-lg hover:bg-agri-700 transition-colors"
                      >
                        Voir details
                      </a>
                      @if (activeTab() === 'rented') {
                        <button
                          (click)="removeFromRented(land._id)"
                          class="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          title="Retirer de mes locations"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      }
                      @if (activeTab() === 'visited') {
                        <button
                          (click)="removeFromVisited(land._id)"
                          class="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                          title="Retirer de l'historique"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Clear History Button (for visited tab) -->
            @if (activeTab() === 'visited' && farmerService.visitedCount() > 0) {
              <div class="mt-6 text-center">
                <button
                  (click)="clearVisitedHistory()"
                  class="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  Effacer tout l'historique
                </button>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `
})
export class FarmerDashboardComponent implements OnInit {
  landService = inject(LandService);
  farmerService = inject(FarmerService);
  authService = inject(AuthService);

  activeTab = signal<TabType>('favorites');

  currentLands = signal<Land[]>([]);

  ngOnInit(): void {
    this.landService.loadLands().subscribe(() => {
      this.updateCurrentLands();
    });
  }

  setTab(tab: TabType): void {
    this.activeTab.set(tab);
    this.updateCurrentLands();
  }

  updateCurrentLands(): void {
    const tab = this.activeTab();
    switch (tab) {
      case 'favorites':
        this.currentLands.set(this.farmerService.favoriteLands());
        break;
      case 'visited':
        this.currentLands.set(this.farmerService.visitedLands());
        break;
      case 'rented':
        this.currentLands.set(this.farmerService.rentedLands());
        break;
    }
  }

  getEmptyMessage(): string {
    const tab = this.activeTab();
    switch (tab) {
      case 'favorites':
        return 'Aucune terre aimee';
      case 'visited':
        return 'Aucune terre visitee';
      case 'rented':
        return 'Aucune terre louee';
    }
  }

  getEmptySubMessage(): string {
    const tab = this.activeTab();
    switch (tab) {
      case 'favorites':
        return 'Ajoutez des terres a vos favoris en cliquant sur le coeur.';
      case 'visited':
        return 'Les terres que vous consultez apparaitront ici.';
      case 'rented':
        return 'Les terres que vous louez apparaitront ici.';
    }
  }

  getTypeLabel(type: string): string {
    return LAND_TYPE_LABELS[type as keyof typeof LAND_TYPE_LABELS] || type;
  }

  formatPrice(price: number): string {
    return formatPrice(price);
  }

  toggleFavorite(landId: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.farmerService.toggleFavorite(landId);
    this.updateCurrentLands();
  }

  removeFromRented(landId: string): void {
    this.farmerService.removeFromRented(landId);
    this.updateCurrentLands();
  }

  removeFromVisited(landId: string): void {
    this.farmerService.removeFromVisited(landId);
    this.updateCurrentLands();
  }

  clearVisitedHistory(): void {
    if (confirm('Voulez-vous vraiment effacer tout l\'historique de visite ?')) {
      this.farmerService.clearVisitedHistory();
      this.updateCurrentLands();
    }
  }
}
