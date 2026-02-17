import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  AfterViewInit,
  signal,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LandService } from '../../shared/services/land.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { Land, formatPrice, formatSurface } from '../../shared/models/land.model';
import { getLatitude, getLongitude } from '../../shared/models/location.model';

// Leaflet types - will be imported dynamically
type LeafletMap = any;
type LeafletMarker = any;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-display font-bold text-gray-900 dark:text-white">
                Carte des terres
              </h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ landService.landsCount() }} terres disponibles
              </p>
            </div>
            <a routerLink="/lands" class="btn-outline">
              <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
              Vue liste
            </a>
          </div>
        </div>
      </div>

      <!-- Map Container -->
      <div class="flex-1 relative">
        <!-- Loading Overlay -->
        @if (loading()) {
          <div class="absolute inset-0 z-20 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center">
            <app-loading-spinner message="Chargement de la carte..." />
          </div>
        }

        <!-- Map -->
        <div id="map" class="w-full h-full min-h-[calc(100vh-140px)]"></div>

        <!-- Legend -->
        <div class="absolute bottom-6 left-6 z-10">
          <div class="card p-4">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Legende</h3>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-full bg-blue-500"></div>
                <span class="text-xs text-gray-600 dark:text-gray-400">Location</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-full bg-green-500"></div>
                <span class="text-xs text-gray-600 dark:text-gray-400">Vente</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Land Panel -->
        @if (selectedLand()) {
          <div class="absolute top-4 right-4 z-10 w-80 animate-slide-down">
            <div class="card overflow-hidden">
              <!-- Close Button -->
              <button
                (click)="clearSelection()"
                class="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center shadow hover:bg-white dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>

              <!-- Image -->
              <div class="h-40 relative">
                <img
                  [src]="selectedLand()!.thumbnail || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400'"
                  [alt]="selectedLand()!.title"
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-3 left-3">
                  <span [class]="selectedLand()!.type === 'RENT' ? 'badge-blue' : 'badge-green'">
                    {{ selectedLand()!.type === 'RENT' ? 'Location' : 'Vente' }}
                  </span>
                </div>
              </div>

              <!-- Content -->
              <div class="p-4">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                  {{ selectedLand()!.title }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {{ selectedLand()!.address.commune }}, {{ selectedLand()!.address.region }}
                </p>

                <div class="grid grid-cols-3 gap-3 mb-4">
                  <div class="text-center">
                    <p class="text-lg font-bold text-agri-600 dark:text-agri-400">
                      {{ formatSurface(selectedLand()!.surface) }}
                    </p>
                    <p class="text-xs text-gray-500">Surface</p>
                  </div>
                  <div class="text-center">
                    <p class="text-lg font-bold text-amber-600 dark:text-amber-400">
                      {{ selectedLand()!.soilParameters?.ph ?? '-' }}
                    </p>
                    <p class="text-xs text-gray-500">pH</p>
                  </div>
                  <div class="text-center">
                    <p class="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {{ selectedLand()!.soilParameters?.moisture ?? '-' }}%
                    </p>
                    <p class="text-xs text-gray-500">Humidite</p>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <p class="font-bold text-gray-900 dark:text-white">
                    {{ formatPrice(selectedLand()!.price, selectedLand()!.priceUnit) }}
                  </p>
                  <a
                    [routerLink]="['/lands', selectedLand()!._id]"
                    class="btn-primary text-sm py-2 px-4"
                  >
                    Voir details
                  </a>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  landService = inject(LandService);

  loading = signal(true);
  selectedLand = signal<Land | null>(null);

  formatPrice = formatPrice;
  formatSurface = formatSurface;

  private map: LeafletMap | null = null;
  private markers: LeafletMarker[] = [];
  private L: any;

  ngOnInit(): void {
    this.landService.loadLands().subscribe();
  }

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      await this.initMap();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private async initMap(): Promise<void> {
    // Dynamic import of Leaflet for SSR compatibility
    const L = await import('leaflet');
    this.L = L.default || L;

    // Fix default marker icons
    delete (this.L.Icon.Default.prototype as any)._getIconUrl;
    this.L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    // Initialize map centered on Senegal
    this.map = this.L.map('map', {
      center: [14.4974, -14.4524],
      zoom: 7,
      zoomControl: true,
    });

    // Add tile layer (OpenStreetMap)
    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Load markers once lands are available
    this.loadMarkers();
    this.loading.set(false);
  }

  private loadMarkers(): void {
    if (!this.map || !this.L) return;

    // Clear existing markers
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    const lands = this.landService.filteredLands();

    lands.filter(land => !!land.location).forEach(land => {
      const lat = getLatitude(land.location!);
      const lng = getLongitude(land.location!);

      // Create custom icon based on land type
      const markerColor = land.type === 'RENT' ? '#3b82f6' : '#22c55e';
      const icon = this.L.divIcon({
        className: 'custom-marker-wrapper',
        html: `
          <div style="
            width: 36px;
            height: 36px;
            background-color: ${markerColor};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      });

      const marker = this.L.marker([lat, lng], { icon })
        .addTo(this.map);

      // Create popup content
      const popupContent = this.createPopupContent(land);
      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });

      // Handle click
      marker.on('click', () => {
        this.selectedLand.set(land);
      });

      this.markers.push(marker);
    });

    // Fit bounds if we have markers
    if (this.markers.length > 0) {
      const group = this.L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  private createPopupContent(land: Land): string {
    return `
      <div style="min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; font-weight: 600; font-size: 14px; color: #111827;">
          ${land.title}
        </h3>
        <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280;">
          ${land.address.commune}, ${land.address.region}
        </p>
        <div style="display: flex; gap: 12px; margin-bottom: 12px;">
          <div>
            <span style="font-weight: 600; color: #16a34a;">${formatSurface(land.surface)}</span>
            <span style="font-size: 11px; color: #9ca3af; display: block;">Surface</span>
          </div>
          <div>
            <span style="font-weight: 600; color: #d97706;">pH ${land.soilParameters?.ph ?? '-'}</span>
            <span style="font-size: 11px; color: #9ca3af; display: block;">Sol</span>
          </div>
        </div>
        <p style="margin: 0; font-weight: 700; color: #16a34a; font-size: 14px;">
          ${formatPrice(land.price, land.priceUnit)}
        </p>
      </div>
    `;
  }

  clearSelection(): void {
    this.selectedLand.set(null);
  }
}
