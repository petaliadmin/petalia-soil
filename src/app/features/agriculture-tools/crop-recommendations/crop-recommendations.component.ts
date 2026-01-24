import { Component, signal, computed, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CropRecommendationService, RecommendationInput } from '../../../shared/services/crop-recommendation.service';
import { SENEGAL_AGRICULTURAL_ZONES } from '../../../shared/services/crop-data';
import {
  Crop,
  CropRecommendationResult,
  CropCategory,
  CROP_CATEGORY_LABELS,
  WATER_NEEDS_LABELS,
  CLIMATE_TYPE_LABELS,
  MONTH_NAMES_FR
} from '../../../shared/models/crop.model';
import { SoilParameters, SOIL_TEXTURES, DRAINAGE_LABELS } from '../../../shared/models/soil-parameters.model';
import { SenegalRegion, REGION_LABELS } from '../../../shared/models/senegal-zones.model';

@Component({
  selector: 'app-crop-recommendations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Recommandations de Cultures
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Trouvez les cultures les mieux adaptées à vos conditions de sol et de climat
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Filters Panel -->
          <div class="lg:col-span-1">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Paramètres
              </h2>

              <!-- Zone Selection -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Zone agricole
                </label>
                <select
                  [(ngModel)]="selectedZoneId"
                  (ngModelChange)="onZoneChange($event)"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agri-500"
                >
                  <option value="">Toutes les zones</option>
                  @for (zone of zones; track zone.id) {
                    <option [value]="zone.id">{{ zone.name }}</option>
                  }
                </select>
              </div>

              <!-- Category Filter -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Catégories
                </label>
                <div class="space-y-2">
                  @for (cat of categories; track cat.value) {
                    <label class="flex items-center">
                      <input
                        type="checkbox"
                        [checked]="selectedCategories().includes(cat.value)"
                        (change)="toggleCategory(cat.value)"
                        class="rounded border-gray-300 text-agri-600 focus:ring-agri-500"
                      >
                      <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">{{ cat.label }}</span>
                    </label>
                  }
                </div>
              </div>

              <!-- Water Availability -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Disponibilité en eau
                </label>
                <select
                  [(ngModel)]="waterAvailability"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agri-500"
                >
                  <option value="">Non spécifié</option>
                  <option value="limited">Limitée (pluies uniquement)</option>
                  <option value="moderate">Modérée (irrigation possible)</option>
                  <option value="abundant">Abondante (irrigation disponible)</option>
                </select>
              </div>

              <!-- Soil Parameters Toggle -->
              <div class="mb-6">
                <button
                  (click)="showSoilParams.set(!showSoilParams())"
                  class="w-full flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <span>Paramètres du sol</span>
                  <svg
                    class="w-5 h-5 transition-transform"
                    [class.rotate-180]="showSoilParams()"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                @if (showSoilParams()) {
                  <div class="mt-4 space-y-4">
                    <!-- pH -->
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">pH du sol: {{ soilParams.ph }}</label>
                      <input
                        type="range"
                        [(ngModel)]="soilParams.ph"
                        min="4" max="9" step="0.1"
                        class="w-full"
                      >
                    </div>

                    <!-- Texture -->
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Texture</label>
                      <select
                        [(ngModel)]="soilParams.texture"
                        class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      >
                        @for (tex of soilTextures; track tex.value) {
                          <option [value]="tex.value">{{ tex.label }}</option>
                        }
                      </select>
                    </div>

                    <!-- Moisture -->
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Humidité: {{ soilParams.moisture }}%</label>
                      <input
                        type="range"
                        [(ngModel)]="soilParams.moisture"
                        min="0" max="100" step="5"
                        class="w-full"
                      >
                    </div>

                    <!-- Drainage -->
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Drainage</label>
                      <select
                        [(ngModel)]="soilParams.drainage"
                        class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Bon</option>
                        <option value="moderate">Moyen</option>
                        <option value="poor">Faible</option>
                      </select>
                    </div>
                  </div>
                }
              </div>

              <!-- Apply Button -->
              <button
                (click)="calculateRecommendations()"
                class="w-full px-4 py-3 bg-agri-600 hover:bg-agri-700 text-white rounded-lg font-semibold transition-colors"
              >
                Calculer les recommandations
              </button>
            </div>
          </div>

          <!-- Results Panel -->
          <div class="lg:col-span-3">
            @if (isCalculating()) {
              <!-- Loading -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-agri-500 border-t-transparent"></div>
                <p class="mt-4 text-gray-600 dark:text-gray-400">Calcul des recommandations...</p>
              </div>
            } @else if (recommendations().length > 0) {
              <!-- Selected Zone Info -->
              @if (selectedZoneInfo(); as zone) {
                <div class="mb-6 bg-gradient-to-r from-agri-500 to-agri-600 rounded-xl p-6 text-white">
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-xl font-bold">{{ zone.name }}</h3>
                      <p class="mt-1 text-agri-100">{{ zone.description }}</p>
                    </div>
                    <a
                      routerLink="/tools/map"
                      [queryParams]="{ zone: zone.id }"
                      class="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm"
                    >
                      Voir sur la carte
                    </a>
                  </div>
                  <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span class="text-agri-200">Pluviométrie</span>
                      <p class="font-semibold">{{ zone.averageRainfall }} mm/an</p>
                    </div>
                    <div>
                      <span class="text-agri-200">Température</span>
                      <p class="font-semibold">{{ zone.temperatureRange[0] }}°C - {{ zone.temperatureRange[1] }}°C</p>
                    </div>
                    <div>
                      <span class="text-agri-200">Climat</span>
                      <p class="font-semibold">{{ getClimateLabel(zone.climate) }}</p>
                    </div>
                    <div>
                      <span class="text-agri-200">Potentiel</span>
                      <p class="font-semibold">{{ zone.agriculturalPotential === 'high' ? 'Élevé' : zone.agriculturalPotential === 'medium' ? 'Moyen' : 'Faible' }}</p>
                    </div>
                  </div>
                </div>
              }

              <!-- Results Summary -->
              <div class="mb-6 flex items-center justify-between">
                <p class="text-gray-600 dark:text-gray-400">
                  <span class="font-semibold text-gray-900 dark:text-white">{{ recommendations().length }}</span>
                  cultures recommandées
                </p>
                <div class="flex gap-2">
                  <button
                    (click)="viewMode.set('grid')"
                    class="p-2 rounded-lg"
                    [class.bg-agri-100]="viewMode() === 'grid'"
                    [class.text-agri-600]="viewMode() === 'grid'"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                    </svg>
                  </button>
                  <button
                    (click)="viewMode.set('list')"
                    class="p-2 rounded-lg"
                    [class.bg-agri-100]="viewMode() === 'list'"
                    [class.text-agri-600]="viewMode() === 'list'"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Top Recommendations -->
              @if (topRecommendations().length > 0) {
                <div class="mb-8">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    Hautement recommandées
                  </h3>
                  <div
                    class="grid gap-4"
                    [class.grid-cols-1]="viewMode() === 'list'"
                    [class.md:grid-cols-2]="viewMode() === 'grid'"
                    [class.lg:grid-cols-3]="viewMode() === 'grid'"
                  >
                    @for (rec of topRecommendations(); track rec.crop.id) {
                      <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow border-2 border-green-200 dark:border-green-800"
                        (click)="selectCrop(rec)"
                      >
                        @if (viewMode() === 'grid') {
                          <ng-container *ngTemplateOutlet="cropCardGrid; context: { $implicit: rec }"/>
                        } @else {
                          <ng-container *ngTemplateOutlet="cropCardList; context: { $implicit: rec }"/>
                        }
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Moderate Recommendations -->
              @if (moderateRecommendations().length > 0) {
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                    </svg>
                    Recommandées avec précautions
                  </h3>
                  <div
                    class="grid gap-4"
                    [class.grid-cols-1]="viewMode() === 'list'"
                    [class.md:grid-cols-2]="viewMode() === 'grid'"
                    [class.lg:grid-cols-3]="viewMode() === 'grid'"
                  >
                    @for (rec of moderateRecommendations(); track rec.crop.id) {
                      <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                        (click)="selectCrop(rec)"
                      >
                        @if (viewMode() === 'grid') {
                          <ng-container *ngTemplateOutlet="cropCardGrid; context: { $implicit: rec }"/>
                        } @else {
                          <ng-container *ngTemplateOutlet="cropCardList; context: { $implicit: rec }"/>
                        }
                      </div>
                    }
                  </div>
                </div>
              }
            } @else {
              <!-- Empty State -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <div class="w-20 h-20 bg-agri-100 dark:bg-agri-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-10 h-10 text-agri-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Trouvez les meilleures cultures
                </h3>
                <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Sélectionnez une zone agricole et ajustez les paramètres pour obtenir des recommandations personnalisées.
                </p>
                <button
                  (click)="calculateRecommendations()"
                  class="px-6 py-3 bg-agri-600 hover:bg-agri-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Obtenir des recommandations
                </button>
              </div>
            }
          </div>
        </div>

        <!-- Crop Detail Modal -->
        @if (selectedCrop(); as rec) {
          <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            (click)="selectedCrop.set(null)"
          >
            <div
              class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              (click)="$event.stopPropagation()"
            >
              <!-- Modal Header -->
              <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ rec.crop.nameFr }}
                  </h2>
                  <p class="text-gray-500 italic">{{ rec.crop.scientificName }}</p>
                </div>
                <button
                  (click)="selectedCrop.set(null)"
                  class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <!-- Compatibility Scores -->
              <div class="p-6 bg-gray-50 dark:bg-gray-900/50">
                <div class="grid grid-cols-4 gap-4">
                  <div class="text-center">
                    <div class="text-3xl font-bold" [class]="getScoreColor(rec.compatibilityScore)">
                      {{ rec.compatibilityScore }}%
                    </div>
                    <div class="text-xs text-gray-500 mt-1">Score global</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-semibold text-amber-600">{{ rec.soilScore }}%</div>
                    <div class="text-xs text-gray-500 mt-1">Sol</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-semibold text-blue-600">{{ rec.climateScore }}%</div>
                    <div class="text-xs text-gray-500 mt-1">Climat</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-semibold text-green-600">{{ rec.seasonScore }}%</div>
                    <div class="text-xs text-gray-500 mt-1">Saison</div>
                  </div>
                </div>
              </div>

              <div class="p-6 space-y-6">
                <!-- Description -->
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ rec.crop.description }}</p>
                </div>

                <!-- Reasons & Warnings -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  @if (rec.reasons.length > 0) {
                    <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <h4 class="font-semibold text-green-800 dark:text-green-300 mb-2">Points forts</h4>
                      <ul class="space-y-1">
                        @for (reason of rec.reasons; track reason) {
                          <li class="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
                            <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                            {{ reason }}
                          </li>
                        }
                      </ul>
                    </div>
                  }
                  @if (rec.warnings.length > 0) {
                    <div class="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                      <h4 class="font-semibold text-amber-800 dark:text-amber-300 mb-2">Attention</h4>
                      <ul class="space-y-1">
                        @for (warning of rec.warnings; track warning) {
                          <li class="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400">
                            <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                            </svg>
                            {{ warning }}
                          </li>
                        }
                      </ul>
                    </div>
                  }
                </div>

                <!-- Ideal Parameters -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Soil Requirements -->
                  <div class="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                    <h4 class="font-semibold text-amber-800 dark:text-amber-300 mb-3">Exigences Sol</h4>
                    <dl class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <dt class="text-gray-600 dark:text-gray-400">pH</dt>
                        <dd class="font-medium">{{ rec.crop.soilRequirements.phMin }} - {{ rec.crop.soilRequirements.phMax }}</dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-gray-600 dark:text-gray-400">Textures</dt>
                        <dd class="font-medium">{{ rec.crop.soilRequirements.textures.join(', ') }}</dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-gray-600 dark:text-gray-400">Humidité</dt>
                        <dd class="font-medium">{{ rec.crop.soilRequirements.moistureMin }}% - {{ rec.crop.soilRequirements.moistureMax }}%</dd>
                      </div>
                    </dl>
                  </div>

                  <!-- Climate Requirements -->
                  <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 class="font-semibold text-blue-800 dark:text-blue-300 mb-3">Exigences Climat</h4>
                    <dl class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <dt class="text-gray-600 dark:text-gray-400">Température</dt>
                        <dd class="font-medium">{{ rec.crop.climateRequirements.temperatureMin }}°C - {{ rec.crop.climateRequirements.temperatureMax }}°C</dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-gray-600 dark:text-gray-400">Pluviométrie</dt>
                        <dd class="font-medium">{{ rec.crop.climateRequirements.rainfallMin }} - {{ rec.crop.climateRequirements.rainfallMax }} mm</dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-gray-600 dark:text-gray-400">Besoins eau</dt>
                        <dd class="font-medium">{{ getWaterNeedsLabel(rec.crop.waterNeeds) }}</dd>
                      </div>
                    </dl>
                  </div>

                  <!-- Cultivation -->
                  <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h4 class="font-semibold text-green-800 dark:text-green-300 mb-3">Culture</h4>
                    <dl class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <dt class="text-gray-600 dark:text-gray-400">Semis</dt>
                        <dd class="font-medium">{{ getMonthsLabel(rec.crop.cultivationCycle.seedingMonths) }}</dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-gray-600 dark:text-gray-400">Récolte</dt>
                        <dd class="font-medium">{{ getMonthsLabel(rec.crop.cultivationCycle.harvestMonths) }}</dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-gray-600 dark:text-gray-400">Cycle</dt>
                        <dd class="font-medium">{{ rec.crop.cultivationCycle.cycleDuration }} jours</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <!-- Yield Info -->
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-3">Rendement</h4>
                  <div class="flex items-center gap-8">
                    <div>
                      <span class="text-gray-500 text-sm">Moyen:</span>
                      <span class="ml-2 font-semibold text-gray-900 dark:text-white">
                        {{ rec.crop.yieldInfo.averageYield.toLocaleString() }} {{ rec.crop.yieldInfo.unit }}
                      </span>
                    </div>
                    <div>
                      <span class="text-gray-500 text-sm">Optimal:</span>
                      <span class="ml-2 font-semibold text-green-600">
                        {{ rec.crop.yieldInfo.optimalYield.toLocaleString() }} {{ rec.crop.yieldInfo.unit }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Tips -->
                @if (rec.crop.tips && rec.crop.tips.length > 0) {
                  <div>
                    <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Conseils</h4>
                    <ul class="space-y-1">
                      @for (tip of rec.crop.tips; track tip) {
                        <li class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <svg class="w-4 h-4 mt-0.5 text-agri-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                          </svg>
                          {{ tip }}
                        </li>
                      }
                    </ul>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Card Templates -->
    <ng-template #cropCardGrid let-rec>
      <div class="p-4">
        <!-- Score Badge -->
        <div class="flex items-start justify-between mb-3">
          <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
            {{ getCategoryLabel(rec.crop.category) }}
          </span>
          <div
            class="px-3 py-1 rounded-full text-sm font-bold"
            [class]="getScoreBadgeClass(rec.compatibilityScore)"
          >
            {{ rec.compatibilityScore }}%
          </div>
        </div>

        <!-- Crop Info -->
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ rec.crop.nameFr }}
        </h4>
        <p class="text-xs text-gray-500 italic mb-2">{{ rec.crop.scientificName }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
          {{ rec.crop.description }}
        </p>

        <!-- Score Bars -->
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500 w-12">Sol</span>
            <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full bg-amber-500 rounded-full" [style.width.%]="rec.soilScore"></div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500 w-12">Climat</span>
            <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full bg-blue-500 rounded-full" [style.width.%]="rec.climateScore"></div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500 w-12">Saison</span>
            <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full bg-green-500 rounded-full" [style.width.%]="rec.seasonScore"></div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>

    <ng-template #cropCardList let-rec>
      <div class="p-4 flex items-center gap-4">
        <!-- Score -->
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
          [class]="getScoreCircleClass(rec.compatibilityScore)"
        >
          <span class="text-lg font-bold">{{ rec.compatibilityScore }}%</span>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h4 class="font-semibold text-gray-900 dark:text-white">{{ rec.crop.nameFr }}</h4>
            <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
              {{ getCategoryLabel(rec.crop.category) }}
            </span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 truncate">{{ rec.crop.description }}</p>
          <div class="mt-2 flex gap-4 text-xs text-gray-500">
            <span>Sol: {{ rec.soilScore }}%</span>
            <span>Climat: {{ rec.climateScore }}%</span>
            <span>Saison: {{ rec.seasonScore }}%</span>
          </div>
        </div>

        <!-- Arrow -->
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </ng-template>
  `
})
export class CropRecommendationsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private recommendationService = inject(CropRecommendationService);

  // State
  selectedZoneId = '';
  waterAvailability: 'limited' | 'moderate' | 'abundant' | '' = '';
  showSoilParams = signal(false);
  viewMode = signal<'grid' | 'list'>('grid');
  selectedCrop = signal<CropRecommendationResult | null>(null);
  selectedCategories = signal<CropCategory[]>([]);

  soilParams: Partial<SoilParameters> = {
    ph: 6.5,
    texture: 'loamy',
    moisture: 40,
    drainage: 'good',
    npk: { nitrogen: 30, phosphorus: 20, potassium: 100 }
  };

  // Data
  zones = SENEGAL_AGRICULTURAL_ZONES;
  categories = Object.entries(CROP_CATEGORY_LABELS).map(([value, label]) => ({
    value: value as CropCategory,
    label
  }));
  soilTextures = SOIL_TEXTURES;

  // Computed
  recommendations = this.recommendationService.recommendations;
  topRecommendations = this.recommendationService.topRecommendations;
  isCalculating = this.recommendationService.isCalculating;

  moderateRecommendations = computed(() =>
    this.recommendations().filter(r => r.compatibilityScore >= 50 && r.compatibilityScore < 70)
  );

  selectedZoneInfo = computed(() => {
    if (!this.selectedZoneId) return null;
    return this.zones.find(z => z.id === this.selectedZoneId);
  });

  ngOnInit(): void {
    // Check for zone query param
    this.route.queryParams.subscribe(params => {
      if (params['zone']) {
        this.selectedZoneId = params['zone'];
        this.calculateRecommendations();
      }
    });
  }

  onZoneChange(zoneId: string): void {
    this.selectedZoneId = zoneId;
  }

  toggleCategory(category: CropCategory): void {
    const current = this.selectedCategories();
    if (current.includes(category)) {
      this.selectedCategories.set(current.filter(c => c !== category));
    } else {
      this.selectedCategories.set([...current, category]);
    }
  }

  calculateRecommendations(): void {
    const input: RecommendationInput = {
      currentMonth: new Date().getMonth() + 1
    };

    if (this.selectedZoneId) {
      input.zone = this.selectedZoneId;
    }

    if (this.selectedCategories().length > 0) {
      input.preferredCategories = this.selectedCategories();
    }

    if (this.waterAvailability) {
      input.waterAvailability = this.waterAvailability;
    }

    if (this.showSoilParams()) {
      input.soilParameters = this.soilParams as SoilParameters;
    }

    this.recommendationService.calculateRecommendations(input);
  }

  selectCrop(rec: CropRecommendationResult): void {
    this.selectedCrop.set(rec);
  }

  getCategoryLabel(category: CropCategory): string {
    return CROP_CATEGORY_LABELS[category];
  }

  getClimateLabel(climate: string): string {
    return CLIMATE_TYPE_LABELS[climate as keyof typeof CLIMATE_TYPE_LABELS] || climate;
  }

  getWaterNeedsLabel(needs: string): string {
    return WATER_NEEDS_LABELS[needs as keyof typeof WATER_NEEDS_LABELS] || needs;
  }

  getMonthsLabel(months: number[]): string {
    return months.map(m => MONTH_NAMES_FR[m - 1].substring(0, 3)).join(', ');
  }

  getScoreColor(score: number): string {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  }

  getScoreBadgeClass(score: number): string {
    if (score >= 70) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  }

  getScoreCircleClass(score: number): string {
    if (score >= 70) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  }
}
