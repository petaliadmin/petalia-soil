import { Component, signal, computed, inject, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CropRecommendationService } from '../../../shared/services/crop-recommendation.service';
import { AgriculturalZone, ZONE_TYPE_LABELS, REGION_LABELS } from '../../../shared/models/senegal-zones.model';
import { CLIMATE_TYPE_LABELS, CROP_CATEGORY_LABELS } from '../../../shared/models/crop.model';

@Component({
  selector: 'app-senegal-map',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Carte Agricole du Sénégal
        </h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Découvrez les différentes zones agricoles et les cultures adaptées à chaque région
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-0">
        <!-- SVG Map -->
        <div class="lg:col-span-2 p-6 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
          <div class="relative">
            <!-- Senegal SVG Map -->
            <svg
              viewBox="0 0 800 500"
              class="w-full h-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!-- Background -->
              <rect width="800" height="500" fill="transparent"/>

              <!-- Ocean -->
              <path
                d="M0,0 L0,500 L150,500 L120,400 L80,300 L100,200 L130,100 L150,0 Z"
                fill="#E3F2FD"
                class="dark:fill-blue-900/30"
              />

              <!-- Zone des Niayes -->
              <path
                d="M130,80 L180,70 L200,100 L190,180 L170,250 L140,300 L120,280 L100,200 L110,120 Z"
                [attr.fill]="getZoneColor('niayes')"
                [class.opacity-100]="!selectedZone() || selectedZone()?.id === 'niayes'"
                [class.opacity-40]="selectedZone() && selectedZone()?.id !== 'niayes'"
                class="cursor-pointer transition-all duration-300 hover:opacity-80 stroke-white stroke-2"
                (click)="selectZone('niayes')"
              />
              <text x="150" y="180" class="text-xs fill-white font-semibold pointer-events-none">Niayes</text>

              <!-- Vallée du Fleuve -->
              <path
                d="M180,50 L350,30 L500,40 L600,60 L580,100 L450,90 L300,85 L200,100 Z"
                [attr.fill]="getZoneColor('vallee_fleuve')"
                [class.opacity-100]="!selectedZone() || selectedZone()?.id === 'vallee_fleuve'"
                [class.opacity-40]="selectedZone() && selectedZone()?.id !== 'vallee_fleuve'"
                class="cursor-pointer transition-all duration-300 hover:opacity-80 stroke-white stroke-2"
                (click)="selectZone('vallee_fleuve')"
              />
              <text x="380" y="70" class="text-xs fill-white font-semibold pointer-events-none">Vallée du Fleuve</text>

              <!-- Zone Sylvo-pastorale -->
              <path
                d="M200,100 L300,85 L450,90 L580,100 L560,180 L450,200 L300,190 L200,180 Z"
                [attr.fill]="getZoneColor('zone_sylvopastorale')"
                [class.opacity-100]="!selectedZone() || selectedZone()?.id === 'zone_sylvopastorale'"
                [class.opacity-40]="selectedZone() && selectedZone()?.id !== 'zone_sylvopastorale'"
                class="cursor-pointer transition-all duration-300 hover:opacity-80 stroke-white stroke-2"
                (click)="selectZone('zone_sylvopastorale')"
              />
              <text x="350" y="150" class="text-xs fill-white font-semibold pointer-events-none">Zone Sylvo-pastorale</text>

              <!-- Bassin Arachidier -->
              <path
                d="M140,300 L170,250 L190,180 L200,180 L300,190 L380,200 L400,280 L350,350 L250,380 L180,360 Z"
                [attr.fill]="getZoneColor('bassin_arachidier')"
                [class.opacity-100]="!selectedZone() || selectedZone()?.id === 'bassin_arachidier'"
                [class.opacity-40]="selectedZone() && selectedZone()?.id !== 'bassin_arachidier'"
                class="cursor-pointer transition-all duration-300 hover:opacity-80 stroke-white stroke-2"
                (click)="selectZone('bassin_arachidier')"
              />
              <text x="260" y="300" class="text-xs fill-white font-semibold pointer-events-none">Bassin Arachidier</text>

              <!-- Sénégal Oriental -->
              <path
                d="M380,200 L450,200 L560,180 L600,200 L650,280 L700,350 L680,420 L550,450 L450,420 L400,350 L400,280 Z"
                [attr.fill]="getZoneColor('senegal_oriental')"
                [class.opacity-100]="!selectedZone() || selectedZone()?.id === 'senegal_oriental'"
                [class.opacity-40]="selectedZone() && selectedZone()?.id !== 'senegal_oriental'"
                class="cursor-pointer transition-all duration-300 hover:opacity-80 stroke-white stroke-2"
                (click)="selectZone('senegal_oriental')"
              />
              <text x="520" y="320" class="text-xs fill-white font-semibold pointer-events-none">Sénégal Oriental</text>

              <!-- Casamance -->
              <path
                d="M120,380 L180,360 L250,380 L350,400 L400,420 L380,470 L280,480 L180,470 L120,450 L100,420 Z"
                [attr.fill]="getZoneColor('casamance')"
                [class.opacity-100]="!selectedZone() || selectedZone()?.id === 'casamance'"
                [class.opacity-40]="selectedZone() && selectedZone()?.id !== 'casamance'"
                class="cursor-pointer transition-all duration-300 hover:opacity-80 stroke-white stroke-2"
                (click)="selectZone('casamance')"
              />
              <text x="240" y="440" class="text-xs fill-white font-semibold pointer-events-none">Casamance</text>

              <!-- Gambia (enclave) -->
              <path
                d="M120,380 L350,350 L350,400 L120,420 Z"
                fill="#E0E0E0"
                class="dark:fill-gray-600 stroke-gray-400 stroke-1"
              />
              <text x="220" y="390" class="text-[10px] fill-gray-600 dark:fill-gray-300 pointer-events-none">Gambie</text>

              <!-- Major cities -->
              <g class="pointer-events-none">
                <!-- Dakar -->
                <circle cx="120" cy="180" r="6" fill="#EF4444"/>
                <text x="85" y="175" class="text-[10px] fill-gray-700 dark:fill-gray-200 font-medium">Dakar</text>

                <!-- Saint-Louis -->
                <circle cx="160" cy="70" r="4" fill="#F97316"/>
                <text x="165" y="65" class="text-[10px] fill-gray-700 dark:fill-gray-200">Saint-Louis</text>

                <!-- Thiès -->
                <circle cx="170" cy="220" r="4" fill="#F97316"/>
                <text x="175" y="215" class="text-[10px] fill-gray-700 dark:fill-gray-200">Thiès</text>

                <!-- Kaolack -->
                <circle cx="290" cy="320" r="4" fill="#F97316"/>
                <text x="295" y="315" class="text-[10px] fill-gray-700 dark:fill-gray-200">Kaolack</text>

                <!-- Tambacounda -->
                <circle cx="550" cy="350" r="4" fill="#F97316"/>
                <text x="480" y="365" class="text-[10px] fill-gray-700 dark:fill-gray-200">Tambacounda</text>

                <!-- Ziguinchor -->
                <circle cx="160" cy="450" r="4" fill="#F97316"/>
                <text x="165" y="460" class="text-[10px] fill-gray-700 dark:fill-gray-200">Ziguinchor</text>
              </g>

              <!-- Compass -->
              <g transform="translate(720, 60)">
                <circle cx="0" cy="0" r="25" fill="white" fill-opacity="0.9" class="dark:fill-gray-700"/>
                <path d="M0,-20 L5,10 L0,5 L-5,10 Z" fill="#EF4444"/>
                <path d="M0,20 L5,-10 L0,-5 L-5,-10 Z" fill="#374151"/>
                <text x="0" y="-28" text-anchor="middle" class="text-[10px] fill-gray-700 dark:fill-gray-200 font-bold">N</text>
              </g>
            </svg>

            <!-- Legend -->
            <div class="mt-4 flex flex-wrap gap-3">
              @for (zone of zones(); track zone.id) {
                <button
                  (click)="selectZone(zone.id)"
                  class="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all"
                  [class.ring-2]="selectedZone()?.id === zone.id"
                  [class.ring-offset-2]="selectedZone()?.id === zone.id"
                  [class.ring-agri-500]="selectedZone()?.id === zone.id"
                >
                  <span
                    class="w-3 h-3 rounded-full"
                    [style.backgroundColor]="zone.color"
                  ></span>
                  <span class="text-gray-700 dark:text-gray-300">{{ zone.name }}</span>
                </button>
              }
            </div>
          </div>
        </div>

        <!-- Zone Details Panel -->
        <div class="p-6 border-l border-gray-200 dark:border-gray-700">
          @if (selectedZone(); as zone) {
            <div class="space-y-6">
              <!-- Zone Header -->
              <div>
                <div class="flex items-center gap-3">
                  <span
                    class="w-4 h-4 rounded-full"
                    [style.backgroundColor]="zone.color"
                  ></span>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ zone.name }}
                  </h3>
                </div>
                <p class="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                  {{ zone.description }}
                </p>
              </div>

              <!-- Climate Info -->
              <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 class="font-semibold text-blue-900 dark:text-blue-300 mb-3">
                  Climat
                </h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Type</span>
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ getClimateLabel(zone.climate) }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Pluviométrie</span>
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ zone.averageRainfall }} mm/an
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Saison des pluies</span>
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ getMonthName(zone.rainySeasonStart) }} - {{ getMonthName(zone.rainySeasonEnd) }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Température</span>
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ zone.temperatureRange[0] }}°C - {{ zone.temperatureRange[1] }}°C
                    </span>
                  </div>
                </div>
              </div>

              <!-- Soil Info -->
              <div class="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                <h4 class="font-semibold text-amber-900 dark:text-amber-300 mb-3">
                  Sols
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ zone.soilDescription }}
                </p>
                <div class="mt-2 flex flex-wrap gap-1">
                  @for (soil of zone.dominantSoilTypes; track soil) {
                    <span class="px-2 py-0.5 bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded text-xs">
                      {{ soil }}
                    </span>
                  }
                </div>
              </div>

              <!-- Main Crops -->
              <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 class="font-semibold text-green-900 dark:text-green-300 mb-3">
                  Cultures principales
                </h4>
                <div class="flex flex-wrap gap-2">
                  @for (cropId of zone.mainCrops; track cropId) {
                    @if (getCropName(cropId); as cropName) {
                      <span class="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                        {{ cropName }}
                      </span>
                    }
                  }
                </div>
              </div>

              <!-- Secondary Crops -->
              @if (zone.secondaryCrops.length > 0) {
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Cultures secondaires
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    @for (cropId of zone.secondaryCrops; track cropId) {
                      @if (getCropName(cropId); as cropName) {
                        <span class="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                          {{ cropName }}
                        </span>
                      }
                    }
                  </div>
                </div>
              }

              <!-- Regions -->
              <div>
                <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Régions concernées
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ getRegionNames(zone.regions) }}
                </p>
              </div>

              <!-- Potential -->
              <div class="flex items-center gap-2">
                <span class="text-gray-600 dark:text-gray-400 text-sm">Potentiel agricole:</span>
                <span
                  class="px-2 py-1 rounded-full text-xs font-semibold"
                  [class.bg-green-100]="zone.agriculturalPotential === 'high'"
                  [class.text-green-800]="zone.agriculturalPotential === 'high'"
                  [class.bg-yellow-100]="zone.agriculturalPotential === 'medium'"
                  [class.text-yellow-800]="zone.agriculturalPotential === 'medium'"
                  [class.bg-red-100]="zone.agriculturalPotential === 'low'"
                  [class.text-red-800]="zone.agriculturalPotential === 'low'"
                >
                  {{ zone.agriculturalPotential === 'high' ? 'Élevé' :
                     zone.agriculturalPotential === 'medium' ? 'Moyen' : 'Faible' }}
                </span>
              </div>

              <!-- Action Button -->
              <a
                [routerLink]="['/tools/recommendations']"
                [queryParams]="{ zone: zone.id }"
                class="block w-full text-center px-4 py-3 bg-agri-600 hover:bg-agri-700 text-white rounded-lg font-semibold transition-colors"
              >
                Voir les recommandations pour cette zone
              </a>
            </div>
          } @else {
            <!-- Empty State -->
            <div class="h-full flex flex-col items-center justify-center text-center py-12">
              <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Sélectionnez une zone
              </h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm">
                Cliquez sur une zone de la carte pour voir les détails et les cultures adaptées
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class SenegalMapComponent {
  private recommendationService = inject(CropRecommendationService);

  // Input/Output
  initialZone = input<string>();
  zoneSelected = output<AgriculturalZone>();

  // State
  selectedZone = signal<AgriculturalZone | null>(null);
  zones = this.recommendationService.allZones;

  private monthNames = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
    'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
  ];

  constructor() {
    // Select initial zone if provided
    const initial = this.initialZone();
    if (initial) {
      this.selectZone(initial);
    }
  }

  selectZone(zoneId: string): void {
    const zone = this.zones().find(z => z.id === zoneId);
    if (zone) {
      this.selectedZone.set(zone);
      this.zoneSelected.emit(zone);
    }
  }

  getZoneColor(zoneId: string): string {
    const zone = this.zones().find(z => z.id === zoneId);
    return zone?.color || '#9E9E9E';
  }

  getClimateLabel(climate: string): string {
    return CLIMATE_TYPE_LABELS[climate as keyof typeof CLIMATE_TYPE_LABELS] || climate;
  }

  getMonthName(month: number): string {
    return this.monthNames[month - 1] || '';
  }

  getCropName(cropId: string): string | null {
    const crop = this.recommendationService.allCrops().find(c => c.id === cropId);
    return crop?.nameFr || null;
  }

  getRegionNames(regions: string[]): string {
    return regions
      .map(r => REGION_LABELS[r as keyof typeof REGION_LABELS] || r)
      .join(', ');
  }
}
