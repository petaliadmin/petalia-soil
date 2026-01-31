import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LandService } from '../../../shared/services/land.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Land, LandStatus, LAND_STATUS_LABELS, LAND_TYPE_LABELS, formatPrice } from '../../../shared/models/land.model';

interface DashboardStats {
  totalLands: number;
  availableLands: number;
  totalViews: number;
  rentLands: number;
  saleLands: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Tableau de bord
          </h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Bienvenue, {{ authService.user()?.fullName }}
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <a
            routerLink="/admin/lands/new"
            class="inline-flex items-center px-4 py-2 bg-agri-600 text-white font-medium rounded-lg hover:bg-agri-700 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Ajouter une terre
          </a>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Lands -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 bg-agri-100 dark:bg-agri-900/30 rounded-lg">
              <svg class="w-6 h-6 text-agri-600 dark:text-agri-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total des terres</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats().totalLands }}</p>
            </div>
          </div>
        </div>

        <!-- Available Lands -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Disponibles</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats().availableLands }}</p>
            </div>
          </div>
        </div>

        <!-- For Rent -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">En location</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats().rentLands }}</p>
            </div>
          </div>
        </div>

        <!-- For Sale -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">En vente</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats().saleLands }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Lands -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Dernières terres ajoutées
            </h2>
            <a
              routerLink="/admin/lands"
              class="text-sm text-agri-600 hover:text-agri-700 dark:text-agri-400 font-medium"
            >
              Voir tout
            </a>
          </div>
        </div>

        @if (landService.loading()) {
          <div class="p-8 text-center">
            <div class="animate-spin w-8 h-8 border-4 border-agri-600 border-t-transparent rounded-full mx-auto"></div>
            <p class="mt-4 text-gray-500 dark:text-gray-400">Chargement...</p>
          </div>
        } @else if (recentLands().length === 0) {
          <div class="p-8 text-center">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
            <p class="text-gray-500 dark:text-gray-400">Aucune terre enregistrée</p>
            <a
              routerLink="/admin/lands/new"
              class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-agri-600 hover:text-agri-700"
            >
              Ajouter votre première terre
            </a>
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
                    Statut
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                @for (land of recentLands(); track land._id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          @if (land.thumbnail || land.images?.[0]) {
                            <img
                              [src]="land.thumbnail || land.images?.[0]"
                              [alt]="land.title"
                              class="h-10 w-10 rounded-lg object-cover"
                            />
                          } @else {
                            <div class="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            {{ land.address.region }}
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
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ formatPrice(land.price) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="relative">
                          <select
                            [value]="land.status"
                            (change)="onStatusChange(land, $event)"
                            [disabled]="updatingLandId() === land._id"
                            class="text-xs font-medium rounded-full pl-3 pr-7 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-agri-500 appearance-none"
                          [class.bg-green-100]="land.status === 'AVAILABLE'"
                          [class.text-green-800]="land.status === 'AVAILABLE'"
                          [class.dark:bg-green-900/30]="land.status === 'AVAILABLE'"
                          [class.dark:text-green-400]="land.status === 'AVAILABLE'"
                          [class.bg-yellow-100]="land.status === 'PENDING'"
                          [class.text-yellow-800]="land.status === 'PENDING'"
                          [class.dark:bg-yellow-900/30]="land.status === 'PENDING'"
                          [class.dark:text-yellow-400]="land.status === 'PENDING'"
                          [class.bg-red-100]="land.status === 'SOLD'"
                          [class.text-red-800]="land.status === 'SOLD'"
                          [class.dark:bg-red-900/30]="land.status === 'SOLD'"
                          [class.dark:text-red-400]="land.status === 'SOLD'"
                          [class.bg-blue-100]="land.status === 'RENTED'"
                          [class.text-blue-800]="land.status === 'RENTED'"
                          [class.dark:bg-blue-900/30]="land.status === 'RENTED'"
                          [class.dark:text-blue-400]="land.status === 'RENTED'"
                        >
                          <option value="AVAILABLE">Disponible</option>
                          <option value="PENDING">En attente</option>
                          @if (land.type === 'SALE') {
                            <option value="SOLD">Vendu</option>
                          }
                          @if (land.type === 'RENT') {
                            <option value="RENTED">Loué</option>
                          }
                          </select>
                          <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-current opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                          </svg>
                        </div>
                        @if (updatingLandId() === land._id) {
                          <span class="ml-2 inline-block">
                            <svg class="animate-spin w-4 h-4 text-agri-600" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                        }
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end space-x-1">
                        <a
                          [routerLink]="['/lands', land._id]"
                          target="_blank"
                          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Voir sur le site"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </a>
                        <a
                          [routerLink]="['/admin/lands', land._id, 'edit']"
                          class="p-2 text-agri-600 hover:text-agri-700 dark:text-agri-400 rounded-lg hover:bg-agri-50 dark:hover:bg-agri-900/20 transition-colors"
                          title="Modifier"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </a>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Add Land Card -->
        <a
          routerLink="/admin/lands/new"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
        >
          <div class="flex items-center">
            <div class="p-3 bg-agri-100 dark:bg-agri-900/30 rounded-lg group-hover:bg-agri-200 dark:group-hover:bg-agri-900/50 transition-colors">
              <svg class="w-6 h-6 text-agri-600 dark:text-agri-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Ajouter une nouvelle terre
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Publiez une annonce pour votre terrain agricole
              </p>
            </div>
          </div>
        </a>

        <!-- View Site Card -->
        <a
          routerLink="/"
          target="_blank"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
        >
          <div class="flex items-center">
            <div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
              <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Voir le site public
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Visualisez vos annonces comme les visiteurs
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  landService = inject(LandService);
  authService = inject(AuthService);

  stats = signal<DashboardStats>({
    totalLands: 0,
    availableLands: 0,
    totalViews: 0,
    rentLands: 0,
    saleLands: 0
  });

  recentLands = signal<Land[]>([]);
  updatingLandId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const currentUser = this.authService.user();
    const isAdmin = currentUser?.role === 'ADMIN';

    // Use my-lands endpoint for owners, all lands for admins
    const landsObservable = isAdmin
      ? this.landService.loadLands()
      : this.landService.getMyLands();

    landsObservable.subscribe(lands => {
      // Calculate stats
      this.stats.set({
        totalLands: lands.length,
        availableLands: lands.filter(l => l.status === 'AVAILABLE').length,
        totalViews: lands.reduce((sum, l) => sum + (l.views || 0), 0),
        rentLands: lands.filter(l => l.type === 'RENT').length,
        saleLands: lands.filter(l => l.type === 'SALE').length
      });

      // Get recent lands (last 5)
      const sorted = [...lands].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      this.recentLands.set(sorted.slice(0, 5));
    });
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

  onStatusChange(land: Land, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value as LandStatus;

    if (newStatus === land.status) return;

    this.updatingLandId.set(land._id);

    this.landService.updateLandStatus(land._id, newStatus).subscribe({
      next: (updatedLand) => {
        if (updatedLand) {
          // Update local state
          this.recentLands.update(lands =>
            lands.map(l => l._id === land._id ? { ...l, status: newStatus } : l)
          );
          // Update stats
          this.stats.update(s => ({
            ...s,
            availableLands: this.recentLands().filter(l => l.status === 'AVAILABLE').length
          }));
        }
        this.updatingLandId.set(null);
      },
      error: () => {
        // Revert select value on error
        select.value = land.status;
        this.updatingLandId.set(null);
      }
    });
  }
}
