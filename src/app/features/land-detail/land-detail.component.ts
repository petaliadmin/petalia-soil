import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  AfterViewInit,
  signal,
  computed,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LandService } from '../../shared/services/land.service';
import { FarmerService } from '../../shared/services/farmer.service';
import { AuthService } from '../../shared/services/auth.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { SoilGaugeComponent } from '../../shared/components/soil-gauge/soil-gauge.component';
import {
  Land,
  formatPrice,
  formatSurface,
  LAND_TYPE_LABELS,
  LAND_STATUS_LABELS
} from '../../shared/models/land.model';
import {
  SOIL_TEXTURE_LABELS,
  DRAINAGE_LABELS,
  getPhDescription
} from '../../shared/models/soil-parameters.model';
import { Owner, getWhatsAppLink } from '../../shared/models/owner.model';
import { getLatitude, getLongitude } from '../../shared/models/location.model';

@Component({
  selector: 'app-land-detail',
  standalone: true,
  imports: [RouterLink, LoadingSpinnerComponent, SoilGaugeComponent],
  template: `
    @if (loading()) {
      <div class="min-h-screen flex items-center justify-center">
        <app-loading-spinner message="Chargement des details..." />
      </div>
    }

    @if (error()) {
      <div class="min-h-screen flex items-center justify-center">
        <div class="card p-12 text-center max-w-md">
          <div class="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Terre non trouvee</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">{{ error() }}</p>
          <a routerLink="/lands" class="btn-primary">Retour aux terres</a>
        </div>
      </div>
    }

    @if (land()) {
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Hero Image Gallery -->
        <div class="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            [src]="currentImage()"
            [alt]="land()!.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          <!-- Back Button -->
          <a
            routerLink="/lands"
            class="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors z-10"
          >
            <svg class="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </a>

          <!-- Favorite Button -->
          <button
            (click)="onFavoriteToggle()"
            class="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors z-10"
            [attr.aria-label]="isFavorite() ? 'Retirer des favoris' : 'Ajouter aux favoris'"
          >
            <svg
              class="w-6 h-6"
              [class.text-red-500]="isFavorite()"
              [class.text-gray-600]="!isFavorite()"
              [class.dark:text-gray-300]="!isFavorite()"
              [attr.fill]="isFavorite() ? 'currentColor' : 'none'"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>

          <!-- Image Gallery Thumbnails -->
          @if (land()!.images && land()!.images!.length > 1) {
            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              @for (image of land()!.images; track image; let i = $index) {
                <button
                  (click)="currentImageIndex.set(i)"
                  [class.ring-2]="currentImageIndex() === i"
                  [class.ring-white]="currentImageIndex() === i"
                  class="w-16 h-12 rounded-lg overflow-hidden opacity-70 hover:opacity-100 transition-opacity"
                >
                  <img [src]="image" [alt]="'Image ' + (i + 1)" class="w-full h-full object-cover" />
                </button>
              }
            </div>
          }

          <!-- Title Overlay -->
          <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div class="max-w-7xl mx-auto">
              <div class="flex flex-wrap items-center gap-3 mb-4">
                <span [class]="land()!.type === 'RENT' ? 'badge-blue' : 'badge-green'">
                  {{ getTypeLabel(land()!.type) }}
                </span>
                <span class="badge bg-white/20 text-white">
                  {{ getStatusLabel(land()!.status) }}
                </span>
              </div>
              <h1 class="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-2">
                {{ land()!.title }}
              </h1>
              <div class="flex items-center gap-2 text-white/80">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>{{ land()!.address.commune }}, {{ land()!.address.region }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div class="grid lg:grid-cols-3 gap-8">
            <!-- Left Column - Details -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Price & Quick Info -->
              <div class="card p-6 md:p-8">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Prix</p>
                    <p class="text-3xl md:text-4xl font-bold text-agri-600 dark:text-agri-400">
                      {{ formatPrice(land()!.price, land()!.priceUnit) }}
                    </p>
                  </div>
                  <div class="grid grid-cols-3 gap-6">
                    <div class="text-center">
                      <p class="text-2xl font-bold text-gray-900 dark:text-white">
                        {{ formatSurface(land()!.surface) }}
                      </p>
                      <p class="text-xs text-gray-500">Surface</p>
                    </div>
                    <div class="text-center">
                      <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {{ land()!.soilParameters.ph }}
                      </p>
                      <p class="text-xs text-gray-500">pH</p>
                    </div>
                    <div class="text-center">
                      <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {{ land()!.soilParameters.moisture }}%
                      </p>
                      <p class="text-xs text-gray-500">Humidite</p>
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h2>
                  <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {{ land()!.description }}
                  </p>
                </div>
              </div>

              <!-- Soil Parameters -->
              <div class="card p-6 md:p-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                    </svg>
                  </div>
                  Parametres du sol
                </h2>

                <div class="grid md:grid-cols-2 gap-6">
                  <!-- pH -->
                  <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <app-soil-gauge
                      label="pH du sol"
                      [value]="land()!.soilParameters.ph"
                      [min]="0"
                      [max]="14"
                      [optimal]="{ min: 6, max: 7.5 }"
                      [showRange]="true"
                    />
                    <p class="mt-2 text-xs" [class]="phDescription().color">
                      {{ phDescription().label }}
                    </p>
                  </div>

                  <!-- Moisture -->
                  <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <app-soil-gauge
                      label="Humidite"
                      [value]="land()!.soilParameters.moisture"
                      [min]="0"
                      [max]="100"
                      unit="%"
                      [optimal]="{ min: 40, max: 70 }"
                    />
                  </div>

                  <!-- NPK Values -->
                  <div class="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      NPK (Azote - Phosphore - Potassium)
                    </h3>
                    <div class="grid grid-cols-3 gap-4">
                      <div>
                        <app-soil-gauge
                          label="Azote (N)"
                          [value]="land()!.soilParameters.npk.nitrogen"
                          [min]="0"
                          [max]="100"
                          unit=" mg/kg"
                        />
                      </div>
                      <div>
                        <app-soil-gauge
                          label="Phosphore (P)"
                          [value]="land()!.soilParameters.npk.phosphorus"
                          [min]="0"
                          [max]="60"
                          unit=" mg/kg"
                        />
                      </div>
                      <div>
                        <app-soil-gauge
                          label="Potassium (K)"
                          [value]="land()!.soilParameters.npk.potassium"
                          [min]="0"
                          [max]="300"
                          unit=" mg/kg"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Texture & Drainage -->
                  <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400">Texture du sol</span>
                      <span class="font-semibold text-gray-900 dark:text-white">
                        {{ getTextureLabel(land()!.soilParameters.texture) }}
                      </span>
                    </div>
                  </div>

                  <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400">Drainage</span>
                      <span class="font-semibold text-gray-900 dark:text-white">
                        {{ getDrainageLabel(land()!.soilParameters.drainage) }}
                      </span>
                    </div>
                  </div>

                  @if (land()!.soilParameters.organicMatter) {
                    <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600 dark:text-gray-400">Matiere organique</span>
                        <span class="font-semibold text-gray-900 dark:text-white">
                          {{ land()!.soilParameters.organicMatter }}%
                        </span>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Recommended Crops -->
              @if (land()!.recommendedCrops && land()!.recommendedCrops!.length > 0) {
                <div class="card p-6 md:p-8">
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-agri-100 dark:bg-agri-900/30 flex items-center justify-center">
                      <svg class="w-5 h-5 text-agri-600 dark:text-agri-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                      </svg>
                    </div>
                    Cultures recommandees
                  </h2>

                  <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    @for (crop of land()!.recommendedCrops; track crop.name) {
                      <div
                        class="p-4 rounded-xl border-2 transition-colors"
                        [class.border-agri-200]="crop.suitability === 'excellent'"
                        [class.bg-agri-50]="crop.suitability === 'excellent'"
                        [class.dark:bg-agri-900/20]="crop.suitability === 'excellent'"
                        [class.dark:border-agri-800]="crop.suitability === 'excellent'"
                        [class.border-amber-200]="crop.suitability === 'good'"
                        [class.bg-amber-50]="crop.suitability === 'good'"
                        [class.dark:bg-amber-900/20]="crop.suitability === 'good'"
                        [class.dark:border-amber-800]="crop.suitability === 'good'"
                        [class.border-gray-200]="crop.suitability === 'moderate'"
                        [class.bg-gray-50]="crop.suitability === 'moderate'"
                        [class.dark:bg-gray-700/50]="crop.suitability === 'moderate'"
                        [class.dark:border-gray-600]="crop.suitability === 'moderate'"
                      >
                        <div class="flex items-center gap-3 mb-2">
                          <span class="text-2xl">{{ crop.icon }}</span>
                          <div>
                            <h3 class="font-semibold text-gray-900 dark:text-white">{{ crop.name }}</h3>
                            <span
                              class="text-xs"
                              [class.text-agri-600]="crop.suitability === 'excellent'"
                              [class.dark:text-agri-400]="crop.suitability === 'excellent'"
                              [class.text-amber-600]="crop.suitability === 'good'"
                              [class.dark:text-amber-400]="crop.suitability === 'good'"
                              [class.text-gray-500]="crop.suitability === 'moderate'"
                            >
                              {{ getSuitabilityLabel(crop.suitability) }}
                            </span>
                          </div>
                        </div>
                        @if (crop.season) {
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            Saison: {{ crop.season }}
                          </p>
                        }
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Culture History -->
              @if (land()!.cultureHistory && land()!.cultureHistory!.length > 0) {
                <div class="card p-6 md:p-8">
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    Historique des cultures
                  </h2>

                  <div class="space-y-4">
                    @for (history of land()!.cultureHistory; track history.year) {
                      <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div class="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <span class="font-bold text-purple-600 dark:text-purple-400">{{ history.year }}</span>
                        </div>
                        <div class="flex-1">
                          <h4 class="font-medium text-gray-900 dark:text-white">{{ history.crop }}</h4>
                          @if (history.yield) {
                            <p class="text-sm text-gray-500">Rendement: {{ history.yield }}</p>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Mini Map -->
              <div class="card p-6 md:p-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  Localisation
                </h2>
                <div id="detail-map" class="h-64 rounded-xl overflow-hidden"></div>
                <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  {{ land()!.address.village ? land()!.address.village + ', ' : '' }}
                  {{ land()!.address.commune }}, {{ land()!.address.region }}
                </p>
              </div>
            </div>

            <!-- Right Column - Contact Card -->
            <div class="lg:col-span-1">
              <div class="card p-6 sticky top-24">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Contacter le proprietaire
                </h2>

                @if (owner()) {
                  <!-- Owner Info -->
                  <div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div class="w-14 h-14 rounded-full bg-agri-100 dark:bg-agri-900/50 flex items-center justify-center">
                      @if (owner()!.avatar) {
                        <img [src]="owner()!.avatar" [alt]="getInitials(owner()!.fullName)" class="w-full h-full rounded-full object-cover" />
                      } @else {
                        <span class="text-xl font-bold text-agri-600 dark:text-agri-400">
                          {{ getInitials(owner()!.fullName)}}
                        </span>
                      }
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900 dark:text-white">{{ owner()!.fullName }}</h3>
                      @if (owner()!.verified) {
                        <div class="flex items-center gap-1 text-agri-600 dark:text-agri-400">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                          </svg>
                          <span class="text-xs">Verifie</span>
                        </div>
                      }
                    </div>
                  </div>

                  <!-- Contact Buttons -->
                  <div class="space-y-3">
                    <!-- Phone -->
                    <a
                      [href]="'tel:' + owner()!.phone"
                      class="flex items-center gap-3 w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Telephone</p>
                        <p class="font-medium text-gray-900 dark:text-white">{{ owner()!.phone }}</p>
                      </div>
                    </a>

                    <!-- Email -->
                    <a
                      [href]="'mailto:' + owner()!.email + '?subject=Demande concernant: ' + land()!.title"
                      class="flex items-center gap-3 w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div class="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p class="font-medium text-gray-900 dark:text-white truncate">{{ owner()!.email }}</p>
                      </div>
                    </a>

                    <!-- WhatsApp -->
                    @if (owner()!.whatsapp) {
                      <a
                        [href]="getWhatsAppUrl()"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center gap-3 w-full p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <div class="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </div>
                        <div>
                          <p class="text-sm text-gray-500 dark:text-gray-400">WhatsApp</p>
                          <p class="font-medium text-green-700 dark:text-green-400">Envoyer un message</p>
                        </div>
                      </a>
                    }
                  </div>
                }

                <!-- Stats -->
                <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500 dark:text-gray-400">
                      <svg class="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      {{ land()!.views || 0 }} vues
                    </span>
                    <span class="text-gray-500 dark:text-gray-400">
                      <svg class="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                      {{ land()!.favorites || 0 }} favoris
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class LandDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private landService = inject(LandService);
  private farmerService = inject(FarmerService);
  private authService = inject(AuthService);

  loading = signal(true);
  error = signal<string | null>(null);
  land = signal<Land | null>(null);
  currentImageIndex = signal(0);

  private map: any = null;

  currentImage = computed(() => {
    const landData = this.land();
    if (!landData?.images?.length) {
      return landData?.thumbnail || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200';
    }
    return landData.images[this.currentImageIndex()];
  });

  owner = computed(() => {
    const landData = this.land();
    if (!landData) return null;
    return typeof landData.owner === 'object' ? landData.owner as Owner : null;
  });

  phDescription = computed(() => {
    const landData = this.land();
    if (!landData) return { label: '', color: '' };
    return getPhDescription(landData.soilParameters.ph);
  });

  isFavorite = computed(() => {
    const landData = this.land();
    if (!landData) return false;
    return this.farmerService.isFavorite(landData._id);
  });

  formatPrice = formatPrice;
  formatSurface = formatSurface;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('ID de terre invalide');
      this.loading.set(false);
      return;
    }

    this.landService.getLandById(id).subscribe(land => {
      if (land) {
        this.land.set(land);
        // Track visit for all authenticated users
        if (this.authService.isAuthenticated()) {
          this.farmerService.markAsVisited(land._id);
        }
      } else {
        this.error.set('Cette terre n\'existe pas ou a ete supprimee');
      }
      this.loading.set(false);
    });
  }

  async ngAfterViewInit(): Promise<void> {
    // Wait for land data before initializing map
    setTimeout(async () => {
      if (isPlatformBrowser(this.platformId) && this.land()) {
        await this.initDetailMap();
      }
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private async initDetailMap(): Promise<void> {
    const landData = this.land();
    if (!landData) return;

    const L = await import('leaflet');
    const Leaflet = L.default || L;

    const lat = getLatitude(landData.location);
    const lng = getLongitude(landData.location);

    this.map = Leaflet.map('detail-map', {
      center: [lat, lng],
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: false
    });

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Add marker
    const markerColor = landData.type === 'RENT' ? '#3b82f6' : '#22c55e';
    const icon = Leaflet.divIcon({
      className: 'custom-marker-wrapper',
      html: `
        <div style="
          width: 40px;
          height: 40px;
          background-color: ${markerColor};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    Leaflet.marker([lat, lng], { icon }).addTo(this.map);
  }

  getTypeLabel(type: string): string {
    return LAND_TYPE_LABELS[type as keyof typeof LAND_TYPE_LABELS] || type;
  }

  getStatusLabel(status: string): string {
    return LAND_STATUS_LABELS[status as keyof typeof LAND_STATUS_LABELS] || status;
  }

  getTextureLabel(texture: string): string {
    return SOIL_TEXTURE_LABELS[texture as keyof typeof SOIL_TEXTURE_LABELS] || texture;
  }

  getDrainageLabel(drainage: string): string {
    return DRAINAGE_LABELS[drainage as keyof typeof DRAINAGE_LABELS] || drainage;
  }

  getSuitabilityLabel(suitability: string): string {
    const labels: Record<string, string> = {
      excellent: 'Excellent',
      good: 'Bon',
      moderate: 'Modere'
    };
    return labels[suitability] || suitability;
  }


  getWhatsAppUrl(): string {
    const ownerData = this.owner();
    const landData = this.land();
    if (!ownerData?.whatsapp) return '#';
    return getWhatsAppLink(ownerData.whatsapp, landData?.title);
  }

  onFavoriteToggle(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/login']);
      return;
    }
    const landData = this.land();
    if (landData) {
      this.farmerService.toggleFavorite(landData._id);
    }
  }

   getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}
