import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { LandService } from '../../../shared/services/land.service';
import { AdminLandService, CreateLandDto, UpdateLandDto } from '../../../shared/services/admin-land.service';
import { Land, LandType, LandStatus } from '../../../shared/models/land.model';
import { SOIL_TEXTURES, DRAINAGE_QUALITIES } from '../../../shared/models/soil-parameters.model';

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

            <!-- Latitude -->
            <div>
              <label for="latitude" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Latitude *
              </label>
              <input
                type="number"
                id="latitude"
                formControlName="latitude"
                step="0.0001"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                placeholder="Ex: 16.4625"
                [class.border-red-500]="isFieldInvalid('latitude')"
              />
            </div>

            <!-- Longitude -->
            <div>
              <label for="longitude" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Longitude *
              </label>
              <input
                type="number"
                id="longitude"
                formControlName="longitude"
                step="0.0001"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                placeholder="Ex: -15.6983"
                [class.border-red-500]="isFieldInvalid('longitude')"
              />
            </div>
          </div>
        </div>

        <!-- Soil Parameters -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Paramètres du sol
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- pH -->
            <div>
              <label for="ph" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                pH du sol * <span class="text-gray-400">(0-14)</span>
              </label>
              <input
                type="number"
                id="ph"
                formControlName="ph"
                step="0.1"
                min="0"
                max="14"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                placeholder="Ex: 6.5"
                [class.border-red-500]="isFieldInvalid('ph')"
              />
            </div>

            <!-- Nitrogen -->
            <div>
              <label for="nitrogen" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Azote (N) mg/kg *
              </label>
              <input
                type="number"
                id="nitrogen"
                formControlName="nitrogen"
                min="0"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                placeholder="Ex: 45"
                [class.border-red-500]="isFieldInvalid('nitrogen')"
              />
            </div>

            <!-- Phosphorus -->
            <div>
              <label for="phosphorus" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Phosphore (P) mg/kg *
              </label>
              <input
                type="number"
                id="phosphorus"
                formControlName="phosphorus"
                min="0"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                placeholder="Ex: 30"
                [class.border-red-500]="isFieldInvalid('phosphorus')"
              />
            </div>

            <!-- Potassium -->
            <div>
              <label for="potassium" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Potassium (K) mg/kg *
              </label>
              <input
                type="number"
                id="potassium"
                formControlName="potassium"
                min="0"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                placeholder="Ex: 150"
                [class.border-red-500]="isFieldInvalid('potassium')"
              />
            </div>

            <!-- Texture -->
            <div>
              <label for="texture" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Texture du sol *
              </label>
              <select
                id="texture"
                formControlName="texture"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agri-500"
              >
                @for (texture of soilTextures; track texture.value) {
                  <option [value]="texture.value">{{ texture.label }}</option>
                }
              </select>
            </div>

            <!-- Moisture -->
            <div>
              <label for="moisture" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Humidité (%) * <span class="text-gray-400">(0-100)</span>
              </label>
              <input
                type="number"
                id="moisture"
                formControlName="moisture"
                min="0"
                max="100"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                placeholder="Ex: 35"
                [class.border-red-500]="isFieldInvalid('moisture')"
              />
            </div>

            <!-- Drainage -->
            <div>
              <label for="drainage" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Qualité du drainage *
              </label>
              <select
                id="drainage"
                formControlName="drainage"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agri-500"
              >
                @for (drainage of drainageQualities; track drainage.value) {
                  <option [value]="drainage.value">{{ drainage.label }}</option>
                }
              </select>
            </div>

            <!-- Organic Matter -->
            <div>
              <label for="organicMatter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Matière organique (%)
              </label>
              <input
                type="number"
                id="organicMatter"
                formControlName="organicMatter"
                min="0"
                step="0.1"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                placeholder="Ex: 3.5"
              />
            </div>

            <!-- Salinity -->
            <div>
              <label for="salinity" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Salinité (dS/m)
              </label>
              <input
                type="number"
                id="salinity"
                formControlName="salinity"
                min="0"
                step="0.1"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                placeholder="Ex: 0.5"
              />
            </div>

            <!-- CEC -->
            <div>
              <label for="cec" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                CEC (meq/100g)
              </label>
              <input
                type="number"
                id="cec"
                formControlName="cec"
                min="0"
                step="0.1"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                placeholder="Ex: 15"
              />
            </div>
          </div>
        </div>

        <!-- Images -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Images
          </h2>

          <!-- Upload Zone -->
          <div
            class="relative border-2 border-dashed rounded-xl p-8 text-center transition-colors"
            [class.border-gray-300]="!isDragging()"
            [class.dark:border-gray-600]="!isDragging()"
            [class.border-agri-500]="isDragging()"
            [class.bg-agri-50]="isDragging()"
            [class.dark:bg-agri-900/20]="isDragging()"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
          >
            <input
              type="file"
              id="imageUpload"
              multiple
              accept="image/*"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              (change)="onFileSelected($event)"
            />
            <div class="space-y-3">
              <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  Glissez vos images ici ou <span class="text-agri-600 dark:text-agri-400">parcourir</span>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  PNG, JPG, WEBP jusqu'à 5MB (max 5 images)
                </p>
              </div>
            </div>
          </div>

          <!-- Image Previews -->
          @if (uploadedImages().length > 0) {
            <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              @for (image of uploadedImages(); track image.id; let i = $index) {
                <div class="relative group aspect-square">
                  <img
                    [src]="image.preview"
                    [alt]="image.name"
                    class="w-full h-full object-cover rounded-lg"
                  />
                  <!-- Overlay -->
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <button
                      type="button"
                      (click)="removeImage(i)"
                      class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                  <!-- Upload progress -->
                  @if (image.uploading) {
                    <div class="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                      <div class="text-center">
                        <svg class="animate-spin w-6 h-6 text-white mx-auto" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p class="text-xs text-white mt-1">{{ image.progress }}%</p>
                      </div>
                    </div>
                  }
                  <!-- First image badge -->
                  @if (i === 0) {
                    <span class="absolute top-2 left-2 px-2 py-0.5 bg-agri-500 text-white text-xs font-medium rounded">
                      Principale
                    </span>
                  }
                </div>
              }
            </div>
          }

          <!-- URL Input Alternative -->
          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              (click)="toggleUrlInput()"
              class="text-sm text-agri-600 dark:text-agri-400 hover:underline flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
              {{ showUrlInput() ? 'Masquer' : 'Ajouter via URL' }}
            </button>

            @if (showUrlInput()) {
              <div class="mt-3 flex gap-2">
                <input
                  type="url"
                  [(ngModel)]="imageUrl"
                  [ngModelOptions]="{standalone: true}"
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  (click)="addImageFromUrl()"
                  class="px-4 py-2 bg-agri-600 text-white rounded-lg hover:bg-agri-700 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            }
          </div>
        </div>

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
    </div>
  `
})
export class AdminLandFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private landService = inject(LandService);
  adminLandService = inject(AdminLandService);

  isEditMode = signal(false);
  landId = signal<string | null>(null);
  isDragging = signal(false);
  uploadedImages = signal<UploadedImage[]>([]);
  showUrlInput = signal(false);
  imageUrl = '';

  regions = [
    'Dakar', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack',
    'Kédougou', 'Kolda', 'Louga', 'Matam', 'Saint-Louis',
    'Sédhiou', 'Tambacounda', 'Thiès', 'Ziguinchor'
  ];

  soilTextures = SOIL_TEXTURES;
  drainageQualities = DRAINAGE_QUALITIES;

  form: FormGroup = this.fb.group({
    // Informations générales
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    type: ['RENT', Validators.required],
    status: ['AVAILABLE'],
    surface: [null, [Validators.required, Validators.min(0)]],
    price: [null, [Validators.required, Validators.min(0)]],
    priceUnit: ['FCFA'],
    // Localisation - Coordonnées
    latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
    // Adresse
    city: ['', Validators.required],
    region: ['', Validators.required],
    commune: ['', Validators.required],
    village: [''],
    fullAddress: [''],
    // Paramètres du sol
    ph: [6.5, [Validators.required, Validators.min(0), Validators.max(14)]],
    nitrogen: [null, [Validators.required, Validators.min(0)]],
    phosphorus: [null, [Validators.required, Validators.min(0)]],
    potassium: [null, [Validators.required, Validators.min(0)]],
    texture: ['loamy', Validators.required],
    moisture: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
    drainage: ['good', Validators.required],
    organicMatter: [null, [Validators.min(0)]],
    salinity: [null, [Validators.min(0)]],
    cec: [null, [Validators.min(0)]]
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
    this.landService.getLandById(id).subscribe(land => {
      if (land) {
        this.form.patchValue({
          // Informations générales
          title: land.title,
          description: land.description,
          type: land.type,
          status: land.status,
          surface: land.surface,
          price: land.price,
          priceUnit: land.priceUnit || 'FCFA',
          // Localisation
          latitude: land.location.coordinates[1],
          longitude: land.location.coordinates[0],
          // Adresse
          city: land.address.city,
          region: land.address.region,
          commune: land.address.commune,
          village: land.address.village || '',
          fullAddress: land.address.fullAddress || '',
          // Paramètres du sol
          ph: land.soilParameters.ph,
          nitrogen: land.soilParameters.npk.nitrogen,
          phosphorus: land.soilParameters.npk.phosphorus,
          potassium: land.soilParameters.npk.potassium,
          texture: land.soilParameters.texture,
          moisture: land.soilParameters.moisture,
          drainage: land.soilParameters.drainage,
          organicMatter: land.soilParameters.organicMatter,
          salinity: land.soilParameters.salinity,
          cec: land.soilParameters.cec
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

    // Build soil parameters with nested NPK
    const soilParameters = {
      ph: formValue.ph,
      npk: {
        nitrogen: formValue.nitrogen,
        phosphorus: formValue.phosphorus,
        potassium: formValue.potassium
      },
      texture: formValue.texture,
      moisture: formValue.moisture,
      drainage: formValue.drainage,
      ...(formValue.organicMatter != null && { organicMatter: formValue.organicMatter }),
      ...(formValue.salinity != null && { salinity: formValue.salinity }),
      ...(formValue.cec != null && { cec: formValue.cec })
    };

    // Build address
    const address = {
      city: formValue.city,
      region: formValue.region,
      commune: formValue.commune,
      ...(formValue.village && { village: formValue.village }),
      ...(formValue.fullAddress && { fullAddress: formValue.fullAddress }),
      country: 'Sénégal'
    };

    // Build location
    const location = {
      type: 'Point' as const,
      coordinates: [formValue.longitude, formValue.latitude] as [number, number]
    };

    if (this.isEditMode()) {
      const updateData: UpdateLandDto = {
        title: formValue.title,
        description: formValue.description,
        surfaceHectares: formValue.surface,
        type: formValue.type,
        price: formValue.price,
        priceUnit: formValue.priceUnit,
        location,
        address,
        soilParameters,
        status: formValue.status,
        images: this.getImageUrls()
      };

      this.adminLandService.updateLand(this.landId()!, updateData).subscribe({
        next: () => {
          this.router.navigate(['/admin/lands']);
        }
      });
    } else {
      const createData: CreateLandDto = {
        title: formValue.title,
        description: formValue.description,
        surfaceHectares: formValue.surface,
        type: formValue.type,
        price: formValue.price,
        priceUnit: formValue.priceUnit,
        location,
        address,
        soilParameters,
        images: this.getImageUrls()
      };

      this.adminLandService.createLand(createData).subscribe({
        next: () => {
          this.router.navigate(['/admin/lands']);
        }
      });
    }
  }
}
