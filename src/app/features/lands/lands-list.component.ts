import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LandService } from '../../shared/services/land.service';
import { LandCardComponent } from '../../shared/components/land-card/land-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { LandFilters, LandType } from '../../shared/models/land.model';
import { SoilTexture, SOIL_TEXTURE_LABELS } from '../../shared/models/soil-parameters.model';

@Component({
  selector: 'app-lands-list',
  standalone: true,
  imports: [FormsModule, RouterLink, LandCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 class="text-3xl font-display font-bold text-gray-900 dark:text-white">
                Terres disponibles
              </h1>
              <p class="mt-2 text-gray-600 dark:text-gray-400">
                {{ landService.landsCount() }} terres correspondent a vos criteres
              </p>
            </div>

            <!-- View Toggle & Sort -->
            <div class="flex items-center gap-4">
              <!-- View Toggle -->
              <div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  (click)="viewMode.set('grid')"
                  [class.bg-white]="viewMode() === 'grid'"
                  [class.dark:bg-gray-600]="viewMode() === 'grid'"
                  [class.shadow-sm]="viewMode() === 'grid'"
                  class="p-2 rounded-md transition-all"
                >
                  <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                  </svg>
                </button>
                <button
                  (click)="viewMode.set('list')"
                  [class.bg-white]="viewMode() === 'list'"
                  [class.dark:bg-gray-600]="viewMode() === 'list'"
                  [class.shadow-sm]="viewMode() === 'list'"
                  class="p-2 rounded-md transition-all"
                >
                  <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                  </svg>
                </button>
              </div>

              <!-- Map View Link -->
              <a routerLink="/map" class="btn-outline">
                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
                Voir sur la carte
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Filters Sidebar -->
          <aside class="w-full lg:w-80 flex-shrink-0">
            <div class="card p-6 sticky top-24">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Filtres</h2>
                @if (hasActiveFilters()) {
                  <button
                    (click)="clearAllFilters()"
                    class="text-sm text-agri-600 dark:text-agri-400 hover:underline"
                  >
                    Effacer tout
                  </button>
                }
              </div>

              <!-- Type Filter -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Type d'offre
                </label>
                <div class="flex gap-2">
                  <button
                    (click)="toggleType(undefined)"
                    [class.bg-agri-100]="!filters().type"
                    [class.text-agri-700]="!filters().type"
                    [class.dark:bg-agri-900]="!filters().type"
                    [class.dark:text-agri-400]="!filters().type"
                    class="flex-1 py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Tous
                  </button>
                  <button
                    (click)="toggleType('RENT')"
                    [class.bg-blue-100]="filters().type === 'RENT'"
                    [class.text-blue-700]="filters().type === 'RENT'"
                    [class.border-blue-300]="filters().type === 'RENT'"
                    [class.dark:bg-blue-900]="filters().type === 'RENT'"
                    [class.dark:text-blue-400]="filters().type === 'RENT'"
                    class="flex-1 py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Location
                  </button>
                  <button
                    (click)="toggleType('SALE')"
                    [class.bg-green-100]="filters().type === 'SALE'"
                    [class.text-green-700]="filters().type === 'SALE'"
                    [class.border-green-300]="filters().type === 'SALE'"
                    [class.dark:bg-green-900]="filters().type === 'SALE'"
                    [class.dark:text-green-400]="filters().type === 'SALE'"
                    class="flex-1 py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Vente
                  </button>
                </div>
              </div>

              <!-- Region Filter -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Region
                </label>
                <select
                  [ngModel]="filters().region || ''"
                  (ngModelChange)="updateFilter('region', $event || undefined)"
                  class="input-field"
                >
                  <option value="">Toutes les regions</option>
                  @for (region of landService.availableRegions(); track region) {
                    <option [value]="region">{{ region }}</option>
                  }
                </select>
              </div>

              <!-- Surface Range -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Surface (hectares)
                </label>
                <div class="flex items-center gap-3">
                  <input
                    type="number"
                    [ngModel]="filters().minSurface || ''"
                    (ngModelChange)="updateFilter('minSurface', $event ? +$event : undefined)"
                    placeholder="Min"
                    class="input-field"
                    min="0"
                  />
                  <span class="text-gray-400">-</span>
                  <input
                    type="number"
                    [ngModel]="filters().maxSurface || ''"
                    (ngModelChange)="updateFilter('maxSurface', $event ? +$event : undefined)"
                    placeholder="Max"
                    class="input-field"
                    min="0"
                  />
                </div>
              </div>

              <!-- pH Range -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  pH du sol
                </label>
                <div class="flex items-center gap-3">
                  <input
                    type="number"
                    [ngModel]="filters().minPh || ''"
                    (ngModelChange)="updateFilter('minPh', $event ? +$event : undefined)"
                    placeholder="Min"
                    class="input-field"
                    min="0"
                    max="14"
                    step="0.1"
                  />
                  <span class="text-gray-400">-</span>
                  <input
                    type="number"
                    [ngModel]="filters().maxPh || ''"
                    (ngModelChange)="updateFilter('maxPh', $event ? +$event : undefined)"
                    placeholder="Max"
                    class="input-field"
                    min="0"
                    max="14"
                    step="0.1"
                  />
                </div>
              </div>

              <!-- Texture Filter -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Type de sol
                </label>
                <div class="grid grid-cols-2 gap-2">
                  @for (texture of textureOptions; track texture.value) {
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        [checked]="isTextureSelected(texture.value)"
                        (change)="toggleTexture(texture.value)"
                        class="w-4 h-4 rounded border-gray-300 text-agri-600 focus:ring-agri-500"
                      />
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{ texture.label }}</span>
                    </label>
                  }
                </div>
              </div>

              <!-- Recommended Crop Filter -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Culture recommandee
                </label>
                <select
                  [ngModel]="filters().recommendedCrop || ''"
                  (ngModelChange)="updateFilter('recommendedCrop', $event || undefined)"
                  class="input-field"
                >
                  <option value="">Toutes les cultures</option>
                  @for (crop of landService.availableCrops(); track crop) {
                    <option [value]="crop">{{ crop }}</option>
                  }
                </select>
              </div>

              <!-- Active Filters Summary -->
              @if (hasActiveFilters()) {
                <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Filtres actifs:</p>
                  <div class="flex flex-wrap gap-2">
                    @if (filters().type) {
                      <span class="badge-green text-xs">
                        {{ filters().type === 'RENT' ? 'Location' : 'Vente' }}
                        <button (click)="updateFilter('type', undefined)" class="ml-1">&times;</button>
                      </span>
                    }
                    @if (filters().region) {
                      <span class="badge-blue text-xs">
                        {{ filters().region }}
                        <button (click)="updateFilter('region', undefined)" class="ml-1">&times;</button>
                      </span>
                    }
                    @if (filters().recommendedCrop) {
                      <span class="badge-amber text-xs">
                        {{ filters().recommendedCrop }}
                        <button (click)="updateFilter('recommendedCrop', undefined)" class="ml-1">&times;</button>
                      </span>
                    }
                  </div>
                </div>
              }
            </div>
          </aside>

          <!-- Main Content -->
          <main class="flex-1">
            <!-- Loading State -->
            @if (landService.loading()) {
              <app-loading-spinner message="Chargement des terres..." containerClass="py-20" />
            }

            <!-- Empty State -->
            @if (!landService.loading() && landService.filteredLands().length === 0) {
              <div class="card p-12 text-center">
                <div class="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Aucune terre trouvee
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                  Essayez de modifier vos criteres de recherche
                </p>
                <button (click)="clearAllFilters()" class="btn-primary">
                  Effacer les filtres
                </button>
              </div>
            }

            <!-- Lands Grid -->
            @if (!landService.loading() && landService.filteredLands().length > 0) {
              <div
                [class.grid]="viewMode() === 'grid'"
                [class.grid-cols-1]="viewMode() === 'grid'"
                [class.md:grid-cols-2]="viewMode() === 'grid'"
                [class.xl:grid-cols-3]="viewMode() === 'grid'"
                [class.gap-6]="viewMode() === 'grid'"
                [class.space-y-4]="viewMode() === 'list'"
              >
                @for (land of landService.filteredLands(); track land._id) {
                  <app-land-card [land]="land" />
                }
              </div>
            }
          </main>
        </div>
      </div>
    </div>
  `
})
export class LandsListComponent implements OnInit {
  landService = inject(LandService);

  viewMode = signal<'grid' | 'list'>('grid');
  filters = this.landService.filters;

  textureOptions: { value: SoilTexture; label: string }[] = Object.entries(SOIL_TEXTURE_LABELS)
    .map(([value, label]) => ({ value: value as SoilTexture, label }));

  hasActiveFilters = computed(() => {
    const f = this.filters();
    return !!(f.type || f.region || f.minSurface || f.maxSurface ||
              f.minPh || f.maxPh || f.texture?.length || f.recommendedCrop);
  });

  ngOnInit(): void {
    this.landService.loadLands().subscribe();
  }

  toggleType(type: LandType | undefined): void {
    this.landService.updateFilter('type', type);
  }

  updateFilter<K extends keyof LandFilters>(key: K, value: LandFilters[K]): void {
    this.landService.updateFilter(key, value);
  }

  isTextureSelected(texture: SoilTexture): boolean {
    return this.filters().texture?.includes(texture) ?? false;
  }

  toggleTexture(texture: SoilTexture): void {
    const current = this.filters().texture || [];
    const updated = this.isTextureSelected(texture)
      ? current.filter(t => t !== texture)
      : [...current, texture];
    this.updateFilter('texture', updated.length > 0 ? updated : undefined);
  }

  clearAllFilters(): void {
    this.landService.clearFilters();
  }
}
