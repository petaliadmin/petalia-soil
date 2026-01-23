import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LandService } from '../../../shared/services/land.service';
import { AdminLandService } from '../../../shared/services/admin-land.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Land, LandType, LandStatus, LAND_TYPE_LABELS, LAND_STATUS_LABELS, formatPrice } from '../../../shared/models/land.model';

@Component({
  selector: 'app-admin-lands-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des terres
          </h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {{ landService.landsCount() }} terre(s) au total
          </p>
        </div>
        <a
          routerLink="/admin/lands/new"
          class="inline-flex items-center px-4 py-2 bg-agri-600 text-white font-medium rounded-lg hover:bg-agri-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nouvelle terre
        </a>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div class="flex flex-wrap items-center gap-4">
          <!-- Search -->
          <div class="flex-1 min-w-[200px]">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="filterLands()"
              placeholder="Rechercher une terre..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
            />
          </div>

          <!-- Type Filter -->
          <select
            [(ngModel)]="filterType"
            (ngModelChange)="filterLands()"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agri-500"
          >
            <option value="">Tous les types</option>
            <option value="RENT">Location</option>
            <option value="SALE">Vente</option>
          </select>

          <!-- Status Filter -->
          <select
            [(ngModel)]="filterStatus"
            (ngModelChange)="filterLands()"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agri-500"
          >
            <option value="">Tous les statuts</option>
            <option value="AVAILABLE">Disponible</option>
            <option value="PENDING">En attente</option>
            <option value="SOLD">Vendu</option>
            <option value="RENTED">Loué</option>
          </select>

          <!-- Clear Filters -->
          @if (searchQuery || filterType || filterStatus) {
            <button
              (click)="clearFilters()"
              class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Effacer les filtres
            </button>
          }
        </div>
      </div>

      <!-- Success/Error Messages -->
      @if (adminLandService.success()) {
        <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-sm text-green-700 dark:text-green-400">{{ adminLandService.success() }}</span>
          </div>
          <button (click)="adminLandService.clearMessages()" class="text-green-700 dark:text-green-400 hover:text-green-900">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }

      @if (adminLandService.error()) {
        <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-sm text-red-700 dark:text-red-400">{{ adminLandService.error() }}</span>
          </div>
          <button (click)="adminLandService.clearMessages()" class="text-red-700 dark:text-red-400 hover:text-red-900">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }

      <!-- Lands Table -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        @if (landService.loading()) {
          <div class="p-8 text-center">
            <div class="animate-spin w-8 h-8 border-4 border-agri-600 border-t-transparent rounded-full mx-auto"></div>
            <p class="mt-4 text-gray-500 dark:text-gray-400">Chargement des terres...</p>
          </div>
        } @else if (filteredLands().length === 0) {
          <div class="p-8 text-center">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune terre trouvée
            </h3>
            <p class="text-gray-500 dark:text-gray-400 mb-4">
              @if (searchQuery || filterType || filterStatus) {
                Aucun résultat ne correspond à vos critères de recherche.
              } @else {
                Commencez par ajouter votre première terre.
              }
            </p>
            @if (!searchQuery && !filterType && !filterStatus) {
              <a
                routerLink="/admin/lands/new"
                class="inline-flex items-center px-4 py-2 bg-agri-600 text-white font-medium rounded-lg hover:bg-agri-700 transition-colors"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Ajouter une terre
              </a>
            }
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Terre
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Surface
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Prix
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    pH du sol
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                @for (land of filteredLands(); track land._id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-12 w-12">
                          @if (land.thumbnail || land.images?.[0]) {
                            <img
                              [src]="land.thumbnail || land.images?.[0]"
                              [alt]="land.title"
                              class="h-12 w-12 rounded-lg object-cover"
                            />
                          } @else {
                            <div class="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                              </svg>
                            </div>
                          }
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ land.title }}
                          </div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">
                            {{ land.address.city }}, {{ land.address.region }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [class.bg-blue-100]="land.type === 'RENT'"
                        [class.text-blue-800]="land.type === 'RENT'"
                        [class.dark:bg-blue-900/30]="land.type === 'RENT'"
                        [class.dark:text-blue-400]="land.type === 'RENT'"
                        [class.bg-amber-100]="land.type === 'SALE'"
                        [class.text-amber-800]="land.type === 'SALE'"
                        [class.dark:bg-amber-900/30]="land.type === 'SALE'"
                        [class.dark:text-amber-400]="land.type === 'SALE'"
                      >
                        {{ getTypeLabel(land.type) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ land.surface }} ha
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {{ formatPrice(land.price) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <span
                          class="w-3 h-3 rounded-full mr-2"
                          [class.bg-green-500]="land.soilParameters.ph >= 6 && land.soilParameters.ph <= 7.5"
                          [class.bg-amber-500]="land.soilParameters.ph < 6 || land.soilParameters.ph > 7.5"
                          [class.bg-red-500]="land.soilParameters.ph < 5 || land.soilParameters.ph > 8"
                        ></span>
                        <span class="text-sm text-gray-900 dark:text-white">{{ land.soilParameters.ph }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [class.bg-green-100]="land.status === 'AVAILABLE'"
                        [class.text-green-800]="land.status === 'AVAILABLE'"
                        [class.dark:bg-green-900/30]="land.status === 'AVAILABLE'"
                        [class.dark:text-green-400]="land.status === 'AVAILABLE'"
                        [class.bg-yellow-100]="land.status === 'PENDING'"
                        [class.text-yellow-800]="land.status === 'PENDING'"
                        [class.dark:bg-yellow-900/30]="land.status === 'PENDING'"
                        [class.dark:text-yellow-400]="land.status === 'PENDING'"
                        [class.bg-gray-100]="land.status === 'SOLD' || land.status === 'RENTED'"
                        [class.text-gray-800]="land.status === 'SOLD' || land.status === 'RENTED'"
                        [class.dark:bg-gray-700]="land.status === 'SOLD' || land.status === 'RENTED'"
                        [class.dark:text-gray-400]="land.status === 'SOLD' || land.status === 'RENTED'"
                      >
                        {{ getStatusLabel(land.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end space-x-2">
                        <a
                          [routerLink]="['/lands', land._id]"
                          target="_blank"
                          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="Voir sur le site"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </a>
                        <a
                          [routerLink]="['/admin/lands', land._id, 'edit']"
                          class="p-2 text-agri-600 hover:text-agri-700 dark:text-agri-400"
                          title="Modifier"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </a>
                        <button
                          (click)="confirmDelete(land)"
                          class="p-2 text-red-500 hover:text-red-700"
                          title="Supprimer"
                          [disabled]="adminLandService.loading()"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Delete Confirmation Modal -->
      @if (landToDelete()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div class="flex items-center mb-4">
              <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <h3 class="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
                Confirmer la suppression
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Êtes-vous sûr de vouloir supprimer la terre <strong>{{ landToDelete()?.title }}</strong> ?
              Cette action est irréversible.
            </p>
            <div class="flex justify-end space-x-3">
              <button
                (click)="cancelDelete()"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
              <button
                (click)="deleteLand()"
                [disabled]="adminLandService.loading()"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors flex items-center"
              >
                @if (adminLandService.loading()) {
                  <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                }
                Supprimer
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminLandsListComponent implements OnInit {
  landService = inject(LandService);
  adminLandService = inject(AdminLandService);
  authService = inject(AuthService);

  searchQuery = '';
  filterType: LandType | '' = '';
  filterStatus: LandStatus | '' = '';

  filteredLands = signal<Land[]>([]);
  landToDelete = signal<Land | null>(null);

  ngOnInit(): void {
    this.landService.loadLands().subscribe(() => {
      this.filterLands();
    });
  }

  filterLands(): void {
    let lands = this.landService.lands();

    // Apply search
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      lands = lands.filter(land =>
        land.title.toLowerCase().includes(query) ||
        land.address.city.toLowerCase().includes(query) ||
        land.address.region.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (this.filterType) {
      lands = lands.filter(land => land.type === this.filterType);
    }

    // Apply status filter
    if (this.filterStatus) {
      lands = lands.filter(land => land.status === this.filterStatus);
    }

    this.filteredLands.set(lands);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterType = '';
    this.filterStatus = '';
    this.filterLands();
  }

  getTypeLabel(type: string): string {
    return LAND_TYPE_LABELS[type as keyof typeof LAND_TYPE_LABELS] || type;
  }

  getStatusLabel(status: string): string {
    return LAND_STATUS_LABELS[status as keyof typeof LAND_STATUS_LABELS] || status;
  }

  formatPrice(price: number): string {
    return formatPrice(price);
  }

  confirmDelete(land: Land): void {
    this.landToDelete.set(land);
  }

  cancelDelete(): void {
    this.landToDelete.set(null);
  }

  deleteLand(): void {
    const land = this.landToDelete();
    if (!land) return;

    this.adminLandService.deleteLand(land._id).subscribe({
      next: () => {
        this.landToDelete.set(null);
        // Reload lands
        this.landService.loadLands().subscribe(() => {
          this.filterLands();
        });
      },
      error: () => {
        // Error handled by service
      }
    });
  }
}
