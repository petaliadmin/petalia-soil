import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Land, formatPrice, formatSurface, LAND_TYPE_LABELS, LAND_STATUS_LABELS, LandStatus } from '../../models/land.model';
import { SOIL_TEXTURE_LABELS } from '../../models/soil-parameters.model';

@Component({
  selector: 'app-land-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="card-interactive group overflow-hidden" [class.opacity-75]="!isAvailable()">
      <!-- Image -->
      <div class="relative h-48 md:h-52 overflow-hidden">
        <img
          [src]="land.thumbnail || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400'"
          [alt]="land.title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          [class.grayscale]="!isAvailable()"
        />
        <!-- Overlay gradient -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        <!-- Sold/Rented Overlay -->
        @if (!isAvailable()) {
          <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div [class]="getStatusBadgeClass()" class="px-4 py-2 rounded-lg font-bold text-lg shadow-lg transform -rotate-12">
              {{ getStatusLabel(land.status) }}
            </div>
          </div>
        }

        <!-- Type Badge -->
        <div class="absolute top-4 left-4 flex gap-2">
          <span [class]="land.type === 'RENT' ? 'badge-blue' : 'badge-green'">
            {{ getTypeLabel(land.type) }}
          </span>
          @if (land.status === 'PENDING') {
            <span class="badge-yellow">En attente</span>
          }
        </div>

        <!-- Favorite Button -->
        <button
          (click)="onFavoriteClick($event)"
          class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
        >
          <svg
            class="w-5 h-5"
            [class.text-red-500]="isFavorite"
            [class.text-gray-400]="!isFavorite"
            [attr.fill]="isFavorite ? 'currentColor' : 'none'"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>

        <!-- Price Badge -->
        <div class="absolute bottom-4 left-4 right-4">
          <div class="flex items-end justify-between">
            <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <span class="text-lg font-bold text-agri-600 dark:text-agri-400">
                {{ formatPrice(land.price, land.priceUnit) }}
              </span>
            </div>
            <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ formatSurface(land.surface) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-5">
        <!-- Title & Location -->
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-agri-600 dark:group-hover:text-agri-400 transition-colors">
          {{ land.title }}
        </h3>
        <div class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mb-4">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span>{{ land.address.commune }}, {{ land.address.region }}</span>
        </div>

        <!-- Soil Parameters -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <!-- pH -->
          <div class="flex items-center gap-2 text-sm">
            <div class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <svg class="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
              </svg>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400 text-xs">pH</span>
              <p class="font-medium text-gray-900 dark:text-white">{{ land.soilParameters.ph }}</p>
            </div>
          </div>

          <!-- Texture -->
          <div class="flex items-center gap-2 text-sm">
            <div class="w-8 h-8 rounded-lg bg-soil-100 dark:bg-soil-900/30 flex items-center justify-center">
              <svg class="w-4 h-4 text-soil-600 dark:text-soil-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
              </svg>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400 text-xs">Sol</span>
              <p class="font-medium text-gray-900 dark:text-white">{{ getTextureLabel(land.soilParameters.texture) }}</p>
            </div>
          </div>

          <!-- NPK -->
          <div class="flex items-center gap-2 text-sm">
            <div class="w-8 h-8 rounded-lg bg-agri-100 dark:bg-agri-900/30 flex items-center justify-center">
              <svg class="w-4 h-4 text-agri-600 dark:text-agri-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400 text-xs">NPK</span>
              <p class="font-medium text-gray-900 dark:text-white text-xs">
                {{ land.soilParameters.npk.nitrogen }}-{{ land.soilParameters.npk.phosphorus }}-{{ land.soilParameters.npk.potassium }}
              </p>
            </div>
          </div>

          <!-- Moisture -->
          <div class="flex items-center gap-2 text-sm">
            <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
              </svg>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400 text-xs">Humidite</span>
              <p class="font-medium text-gray-900 dark:text-white">{{ land.soilParameters.moisture }}%</p>
            </div>
          </div>
        </div>

        <!-- Recommended Crops -->
        @if (land.recommendedCrops && land.recommendedCrops.length > 0) {
          <div class="flex flex-wrap gap-1.5 mb-4">
            @for (crop of land.recommendedCrops.slice(0, 3); track crop.name) {
              <span class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-600 dark:text-gray-300">
                <span>{{ crop.icon }}</span>
                <span>{{ crop.name }}</span>
              </span>
            }
            @if (land.recommendedCrops.length > 3) {
              <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-500 dark:text-gray-400">
                +{{ land.recommendedCrops.length - 3 }}
              </span>
            }
          </div>
        }

        <!-- Action Button -->
        <a
          [routerLink]="['/lands', land._id]"
          class="w-full btn-outline text-sm py-2.5 justify-center"
        >
          Voir les details
          <svg class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
      </div>
    </article>
  `
})
export class LandCardComponent {
  @Input({ required: true }) land!: Land;
  @Input() isFavorite = false;
  @Output() favoriteToggle = new EventEmitter<Land>();

  formatPrice = formatPrice;
  formatSurface = formatSurface;

  getTypeLabel(type: string): string {
    return LAND_TYPE_LABELS[type as keyof typeof LAND_TYPE_LABELS] || type;
  }

  getTextureLabel(texture: string): string {
    return SOIL_TEXTURE_LABELS[texture as keyof typeof SOIL_TEXTURE_LABELS] || texture;
  }

  getStatusLabel(status: LandStatus): string {
    return LAND_STATUS_LABELS[status] || status;
  }

  isAvailable(): boolean {
    return this.land.status === 'AVAILABLE' || this.land.status === 'PENDING';
  }

  getStatusBadgeClass(): string {
    switch (this.land.status) {
      case 'SOLD':
        return 'bg-red-500 text-white';
      case 'RENTED':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }

  onFavoriteClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteToggle.emit(this.land);
  }
}
