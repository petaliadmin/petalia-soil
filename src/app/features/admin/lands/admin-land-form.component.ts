import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { LandService } from '../../../shared/services/land.service';
import { AdminLandService, CreateLandDto, UpdateLandDto } from '../../../shared/services/admin-land.service';
import { SoilAnalysisRequestService } from '../../../shared/services/soil-analysis-request.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Land, LandType, LandStatus } from '../../../shared/models/land.model';
import { CreateSoilAnalysisRequest } from '../../../shared/models/soil-analysis-request.model';

interface UploadedImage {
  id: string;
  file?: File;
  name: string;
  preview: string;
  url?: string;
  uploading: boolean;
  progress: number;
}

@Component({
  selector: 'app-admin-land-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode() ? 'Modifier la terre' : 'Nouvelle terre' }}
          </h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {{ isEditMode() ? 'Mettez à jour les informations de votre terrain' : 'Publiez une nouvelle annonce pour votre terrain agricole' }}
          </p>
        </div>
        <a
          routerLink="/admin/lands"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </a>
      </div>

      <!-- Loading State -->
      @if (loadingLand()) {
        <div class="flex items-center justify-center py-12">
          <div class="text-center">
            <div class="animate-spin w-10 h-10 border-4 border-agri-600 border-t-transparent rounded-full mx-auto"></div>
            <p class="mt-4 text-gray-500 dark:text-gray-400">Chargement des données...</p>
          </div>
        </div>
      } @else {

      <!-- Error Message -->
      @if (adminLandService.error()) {
        <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-sm text-red-700 dark:text-red-400">{{ adminLandService.error() }}</span>
          </div>
        </div>
      }

      <!-- Form -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Basic Information -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Informations générales
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Title -->
            <div class="md:col-span-2">
              <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Titre de l'annonce *
              </label>
              <input
                type="text"
                id="title"
                formControlName="title"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                placeholder="Ex: Terrain agricole fertile à Saint-Louis"
                [class.border-red-500]="isFieldInvalid('title')"
              />
              @if (isFieldInvalid('title')) {
                <p class="mt-1 text-sm text-red-500">Le titre est requis</p>
              }
            </div>

            <!-- Description -->
            <div class="md:col-span-2">
              <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Description *
              </label>
              <textarea
                id="description"
                formControlName="description"
                rows="4"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent resize-none"
                placeholder="Décrivez votre terrain en détail..."
                [class.border-red-500]="isFieldInvalid('description')"
              ></textarea>
              @if (isFieldInvalid('description')) {
                <p class="mt-1 text-sm text-red-500">La description est requise</p>
              }
            </div>

            <!-- Type -->
            <div>
              <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Type d'offre *
              </label>
              <select
                id="type"
                formControlName="type"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agri-500"
              >
                <option value="RENT">Location</option>
                <option value="SALE">Vente</option>
              </select>
            </div>

            <!-- Status (Edit mode only) -->
            @if (isEditMode()) {
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Statut
                </label>
                <select
                  id="status"
                  formControlName="status"
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agri-500"
                >
                  <option value="AVAILABLE">Disponible</option>
                  <option value="PENDING">En attente</option>
                  <option value="SOLD">Vendu</option>
                  <option value="RENTED">Loué</option>
                </select>
              </div>
            }

            <!-- Surface -->
            <div>
              <label for="surface" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Surface (hectares) *
              </label>
              <input
                type="number"
                id="surface"
                formControlName="surface"
                step="0.1"
                min="0.1"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                placeholder="Ex: 5.5"
                [class.border-red-500]="isFieldInvalid('surface')"
              />
              @if (isFieldInvalid('surface')) {
                <p class="mt-1 text-sm text-red-500">La surface est requise (min: 0.1 ha)</p>
              }
            </div>

            <!-- Price -->
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Prix (FCFA) *
              </label>
              <input
                type="number"
                id="price"
                formControlName="price"
                min="0"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                placeholder="Ex: 500000"
                [class.border-red-500]="isFieldInvalid('price')"
              />
              @if (isFieldInvalid('price')) {
                <p class="mt-1 text-sm text-red-500">Le prix est requis</p>
              }
            </div>
          </div>
        </div>

        <!-- Location -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Localisation
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Region -->
            <div>
              <label for="region" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Région *
              </label>
              <select
                id="region"
                formControlName="region"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agri-500"
              >
                <option value="">Sélectionnez une région</option>
                @for (region of regions; track region) {
                  <option [value]="region">{{ region }}</option>
                }
              </select>
              @if (isFieldInvalid('region')) {
                <p class="mt-1 text-sm text-red-500">La région est requise</p>
              }
            </div>

            <!-- City -->
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Ville *
              </label>
              <input
                type="text"
                id="city"
                formControlName="city"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                placeholder="Ex: Rufisque"
                [class.border-red-500]="isFieldInvalid('city')"
              />
              @if (isFieldInvalid('city')) {
                <p class="mt-1 text-sm text-red-500">La ville est requise</p>
              }
            </div>

            <!-- Commune -->
            <div>
              <label for="commune" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Commune *
              </label>
              <input
                type="text"
                id="commune"
                formControlName="commune"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                placeholder="Ex: Rufisque"
                [class.border-red-500]="isFieldInvalid('commune')"
              />
              @if (isFieldInvalid('commune')) {
                <p class="mt-1 text-sm text-red-500">La commune est requise</p>
              }
            </div>

            <!-- Village -->
            <div>
              <label for="village" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Village
              </label>
              <input
                type="text"
                id="village"
                formControlName="village"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                placeholder="Ex: Sangalkam"
              />
            </div>

            <!-- Full Address -->
            <div class="md:col-span-2">
              <label for="fullAddress" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Adresse complète
              </label>
              <input
                type="text"
                id="fullAddress"
                formControlName="fullAddress"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                placeholder="Ex: Route de Sangalkam, Rufisque"
              />
            </div>

            <!-- GPS Coordinates - Read only, filled by technician -->
            @if (isEditMode() && existingLand()?.location) {
              <div class="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Coordonnees GPS</span>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                    Renseigne par le technicien
                  </span>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <span class="text-xs text-gray-500">Latitude</span>
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ existingLand()!.location!.coordinates[1] }}</p>
                  </div>
                  <div>
                    <span class="text-xs text-gray-500">Longitude</span>
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ existingLand()!.location!.coordinates[0] }}</p>
                  </div>
                </div>
              </div>
            } @else if (!isEditMode()) {
              <div class="md:col-span-2 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div class="flex items-start gap-2">
                  <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-blue-800 dark:text-blue-300">Geolocalisation par le technicien</p>
                    <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Les coordonnees GPS seront relevees par le technicien lors de sa visite sur le terrain avec son capteur.
                    </p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Soil Parameters (read-only, filled by technician) -->
        @if (isEditMode() && hasSoilParameters()) {
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Parametres du sol
              </h2>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Renseigne par un technicien
              </span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Ces parametres sont renseignes exclusivement par un technicien lors de l'analyse de sol sur le terrain.
            </p>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              @if (existingLand()?.soilParameters; as sp) {
                <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span class="text-xs text-gray-500 dark:text-gray-400">pH</span>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ sp.ph }}</p>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span class="text-xs text-gray-500 dark:text-gray-400">Azote (N)</span>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ sp.npk.nitrogen }} mg/kg</p>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span class="text-xs text-gray-500 dark:text-gray-400">Phosphore (P)</span>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ sp.npk.phosphorus }} mg/kg</p>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span class="text-xs text-gray-500 dark:text-gray-400">Potassium (K)</span>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ sp.npk.potassium }} mg/kg</p>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span class="text-xs text-gray-500 dark:text-gray-400">Texture</span>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white capitalize">{{ sp.texture }}</p>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span class="text-xs text-gray-500 dark:text-gray-400">Humidite</span>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ sp.moisture }}%</p>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span class="text-xs text-gray-500 dark:text-gray-400">Drainage</span>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white capitalize">{{ sp.drainage }}</p>
                </div>
              }
            </div>
          </div>
        } @else if (!isEditMode()) {
          <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
            <div class="flex items-start gap-3">
              <svg class="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <h3 class="text-sm font-semibold text-amber-800 dark:text-amber-300">Analyse de sol automatique</h3>
                <p class="mt-1 text-sm text-amber-700 dark:text-amber-400">
                  Une demande d'analyse de sol sera automatiquement generee a la creation de cette annonce.
                  Un technicien sera affecte pour effectuer les mesures sur le terrain et renseigner les parametres du sol.
                </p>
              </div>
            </div>
          </div>
        }

        <!-- Images (read-only, added by technician) -->
        @if (isEditMode() && uploadedImages().length > 0) {
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Photos du terrain
              </h2>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                Prises par le technicien
              </span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              @for (image of uploadedImages(); track image.id; let i = $index) {
                <div class="relative aspect-square">
                  <img
                    [src]="image.preview"
                    [alt]="image.name"
                    class="w-full h-full object-cover rounded-lg"
                  />
                  @if (i === 0) {
                    <span class="absolute top-2 left-2 px-2 py-0.5 bg-agri-500 text-white text-xs font-medium rounded">
                      Principale
                    </span>
                  }
                </div>
              }
            </div>
          </div>
        } @else if (!isEditMode()) {
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div class="flex items-start gap-3">
              <svg class="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <div>
                <h3 class="text-sm font-semibold text-blue-800 dark:text-blue-300">Photos par le technicien</h3>
                <p class="mt-1 text-sm text-blue-600 dark:text-blue-400">
                  Les photos du terrain seront prises par le technicien lors de sa visite sur le terrain.
                </p>
              </div>
            </div>
          </div>
        }

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-4">
          <a
            routerLink="/admin/lands"
            class="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Annuler
          </a>
          <button
            type="submit"
            [disabled]="form.invalid || adminLandService.loading()"
            class="px-6 py-2.5 bg-agri-600 text-white font-medium rounded-lg hover:bg-agri-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            @if (adminLandService.loading()) {
              <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            }
            {{ isEditMode() ? 'Enregistrer les modifications' : "Publier l'annonce" }}
          </button>
        </div>
      </form>
      }
    </div>
  `
})
export class AdminLandFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private landService = inject(LandService);
  private soilAnalysisService = inject(SoilAnalysisRequestService);
  private authService = inject(AuthService);
  adminLandService = inject(AdminLandService);

  isEditMode = signal(false);
  landId = signal<string | null>(null);
  loadingLand = signal(false);
  existingLand = signal<Land | null>(null);
  hasSoilParameters = signal(false);
  isDragging = signal(false);
  uploadedImages = signal<UploadedImage[]>([]);
  showUrlInput = signal(false);
  imageUrl = '';

  // Geolocation state
  geoLoading = signal(false);
  geoError = signal<string | null>(null);
  geoSuccess = signal<string | null>(null);

  regions = [
    'Dakar', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack',
    'Kédougou', 'Kolda', 'Louga', 'Matam', 'Saint-Louis',
    'Sédhiou', 'Tambacounda', 'Thiès', 'Ziguinchor'
  ];

  form: FormGroup = this.fb.group({
    // Informations générales
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    type: ['RENT', Validators.required],
    status: ['AVAILABLE'],
    surface: [null, [Validators.required, Validators.min(0)]],
    price: [null, [Validators.required, Validators.min(0)]],
    priceUnit: ['FCFA'],
    // Adresse
    city: ['', Validators.required],
    region: ['', Validators.required],
    commune: ['', Validators.required],
    village: [''],
    fullAddress: ['']
    // Note: Les paramètres du sol ne sont PAS dans ce formulaire.
    // Seul un technicien peut les renseigner via une mission d'analyse.
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.landId.set(id);
      this.loadLand(id);
    }
  }

  loadLand(id: string): void {
    this.loadingLand.set(true);
    this.landService.getLandById(id).subscribe(land => {
      this.loadingLand.set(false);
      if (land) {
        this.existingLand.set(land);
        this.hasSoilParameters.set(!!land.soilParameters);

        this.form.patchValue({
          // Informations générales
          title: land.title,
          description: land.description,
          type: land.type,
          status: land.status,
          surface: land.surface,
          price: land.price,
          priceUnit: land.priceUnit || 'FCFA',
          // Adresse (la localisation GPS est renseignee par le technicien)
          city: land.address.city,
          region: land.address.region,
          commune: land.address.commune,
          village: land.address.village || '',
          fullAddress: land.address.fullAddress || ''
        });

        // Load existing images
        if (land.images && land.images.length > 0) {
          const existingImages: UploadedImage[] = land.images.map((url, index) => ({
            id: crypto.randomUUID(),
            name: `image-${index + 1}`,
            preview: url,
            url: url,
            uploading: false,
            progress: 100
          }));
          this.uploadedImages.set(existingImages);
        }
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return control ? control.invalid && control.touched : false;
  }

  // Geolocation methods
  getCurrentLocation(): void {
    if (!navigator.geolocation) {
      this.geoError.set('La geolocalisation n\'est pas supportee par votre navigateur.');
      return;
    }

    this.geoLoading.set(true);
    this.geoError.set(null);
    this.geoSuccess.set(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.form.patchValue({
          latitude: parseFloat(latitude.toFixed(6)),
          longitude: parseFloat(longitude.toFixed(6))
        });
        this.geoLoading.set(false);
        this.geoSuccess.set(`Position detectee: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);

        // Clear success message after 5 seconds
        setTimeout(() => this.geoSuccess.set(null), 5000);
      },
      (error) => {
        this.geoLoading.set(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.geoError.set('Acces a la localisation refuse. Veuillez autoriser l\'acces dans les parametres de votre navigateur.');
            break;
          case error.POSITION_UNAVAILABLE:
            this.geoError.set('Position non disponible. Verifiez que le GPS est active.');
            break;
          case error.TIMEOUT:
            this.geoError.set('Delai d\'attente depasse. Veuillez reessayer.');
            break;
          default:
            this.geoError.set('Erreur lors de la recuperation de la position.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  // Image upload methods
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  handleFiles(files: FileList): void {
    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB
    const currentImages = this.uploadedImages();

    if (currentImages.length >= maxFiles) {
      alert('Vous ne pouvez pas ajouter plus de 5 images');
      return;
    }

    const remainingSlots = maxFiles - currentImages.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} n'est pas une image valide`);
        return;
      }

      if (file.size > maxSize) {
        alert(`${file.name} dépasse la taille maximale de 5MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: UploadedImage = {
          id: crypto.randomUUID(),
          file,
          name: file.name,
          preview: e.target?.result as string,
          uploading: false,
          progress: 0
        };

        this.uploadedImages.update(images => [...images, newImage]);
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    this.uploadedImages.update(images => images.filter((_, i) => i !== index));
  }

  toggleUrlInput(): void {
    this.showUrlInput.update(v => !v);
  }

  addImageFromUrl(): void {
    if (!this.imageUrl.trim()) return;

    const maxFiles = 5;
    if (this.uploadedImages().length >= maxFiles) {
      alert('Vous ne pouvez pas ajouter plus de 5 images');
      return;
    }

    const newImage: UploadedImage = {
      id: crypto.randomUUID(),
      name: this.imageUrl.split('/').pop() || 'image',
      preview: this.imageUrl,
      url: this.imageUrl,
      uploading: false,
      progress: 100
    };

    this.uploadedImages.update(images => [...images, newImage]);
    this.imageUrl = '';
  }

  getImageUrls(): string[] {
    return this.uploadedImages().map(img => img.url || img.preview);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.adminLandService.clearMessages();
    const formValue = this.form.value;

    // Build address
    const address = {
      city: formValue.city,
      region: formValue.region,
      commune: formValue.commune,
      ...(formValue.village && { village: formValue.village }),
      ...(formValue.fullAddress && { fullAddress: formValue.fullAddress }),
      country: 'Sénégal'
    };

    if (this.isEditMode()) {
      // En mode édition: pas de soilParameters, pas de location, pas d'images
      // (tous renseignés par le technicien)
      const updateData: UpdateLandDto = {
        title: formValue.title,
        description: formValue.description,
        surfaceHectares: formValue.surface,
        type: formValue.type,
        price: formValue.price,
        priceUnit: formValue.priceUnit,
        address,
        status: formValue.status
      };

      this.adminLandService.updateLand(this.landId()!, updateData).subscribe({
        next: () => {
          this.router.navigate(['/admin/lands']);
        }
      });
    } else {
      // Création: pas de soilParameters, location, ni images
      // (seul un technicien peut les renseigner via une mission d'analyse)
      const createData: CreateLandDto = {
        title: formValue.title,
        description: formValue.description,
        surfaceHectares: formValue.surface,
        type: formValue.type,
        price: formValue.price,
        priceUnit: formValue.priceUnit,
        address
      };

      this.adminLandService.createLand(createData).subscribe({
        next: (land) => {
          // Auto-générer une demande d'analyse de sol liée à cette annonce
          if (land) {
            this.createAutoAnalysisRequest(land, formValue);
          }
          this.router.navigate(['/admin/lands']);
        }
      });
    }
  }

  /**
   * Auto-generate a soil analysis request when an owner creates a land listing.
   * The request is linked to the land via landId and origin 'land_listing'.
   */
  private createAutoAnalysisRequest(land: Land, formValue: any): void {
    const user = this.authService.user();
    const analysisRequest: CreateSoilAnalysisRequest = {
      userId: user?._id,
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      region: formValue.region,
      commune: formValue.commune,
      surface: formValue.surface,
      description: `Demande d'analyse automatique pour l'annonce: ${formValue.title}`,
      // Pas de coordonnees GPS : le technicien les relevera sur le terrain
      landId: land._id,
      origin: 'land_listing'
    };

    this.soilAnalysisService.submitRequest(analysisRequest).subscribe();
  }
}
