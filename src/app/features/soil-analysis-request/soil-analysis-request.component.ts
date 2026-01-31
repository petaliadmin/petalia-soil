import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SoilAnalysisRequestService } from '../../shared/services/soil-analysis-request.service';
import {
  CreateSoilAnalysisRequest,
  SENEGAL_REGIONS
} from '../../shared/models/soil-analysis-request.model';

@Component({
  selector: 'app-soil-analysis-request',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Hero Section -->
      <div class="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
          <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
            </svg>
            <span class="text-white text-sm font-medium">Service d'analyse professionnelle</span>
          </div>

          <h1 class="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Demande d'analyse de sol
          </h1>
          <p class="text-lg md:text-xl text-amber-100 max-w-2xl mx-auto">
            Obtenez une analyse complete de votre sol pour optimiser vos cultures.
            Nos experts se deplacent sur votre parcelle.
          </p>
        </div>
      </div>

      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        @if (service.submitted()) {
          <!-- Success Message -->
          <div class="card p-8 md:p-12 text-center">
            <div class="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Demande envoyee avec succes !
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Nous avons bien recu votre demande d'analyse de sol. Notre equipe vous contactera
              dans les plus brefs delais pour planifier l'intervention.
            </p>
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-8">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                Recapitulatif de votre demande
              </h3>
              <div class="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p class="text-xs text-gray-500">Nom</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ service.lastRequest()?.fullName }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Region</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ service.lastRequest()?.region }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Commune</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ service.lastRequest()?.commune }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Surface</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ service.lastRequest()?.surface }} ha</p>
                </div>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button (click)="resetForm()" class="btn-outline">
                Nouvelle demande
              </button>
              <a routerLink="/" class="btn-primary">
                Retour a l'accueil
              </a>
            </div>
          </div>
        } @else {
          <!-- Form -->
          <div class="card p-6 md:p-8">
            <form (ngSubmit)="onSubmit()" #analysisForm="ngForm">
              <!-- Contact Information -->
              <div class="mb-8">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  Vos coordonnees
                </h2>

                <div class="grid md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <label for="fullName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      [(ngModel)]="formData.fullName"
                      required
                      class="input-field"
                      placeholder="Votre nom complet"
                    />
                  </div>

                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      [(ngModel)]="formData.email"
                      required
                      email
                      class="input-field"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Telephone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      [(ngModel)]="formData.phone"
                      required
                      class="input-field"
                      placeholder="+221 77 000 00 00"
                    />
                  </div>
                </div>
              </div>

              <!-- Plot Information -->
              <div class="mb-8">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                    </svg>
                  </div>
                  Informations sur la parcelle
                </h2>

                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label for="region" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Region *
                    </label>
                    <select
                      id="region"
                      name="region"
                      [(ngModel)]="formData.region"
                      required
                      class="input-field"
                    >
                      <option value="">Selectionnez une region</option>
                      @for (region of regions; track region) {
                        <option [value]="region">{{ region }}</option>
                      }
                    </select>
                  </div>

                  <div>
                    <label for="commune" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Commune *
                    </label>
                    <input
                      type="text"
                      id="commune"
                      name="commune"
                      [(ngModel)]="formData.commune"
                      required
                      class="input-field"
                      placeholder="Nom de la commune"
                    />
                  </div>

                  <div>
                    <label for="surface" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Surface (hectares) *
                    </label>
                    <input
                      type="number"
                      id="surface"
                      name="surface"
                      [(ngModel)]="formData.surface"
                      required
                      min="0.1"
                      step="0.1"
                      class="input-field"
                      placeholder="Ex: 5.5"
                    />
                  </div>

                  <div class="md:col-span-2">
                    <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description (optionnel)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      [(ngModel)]="formData.description"
                      rows="4"
                      class="input-field resize-none"
                      placeholder="Decrivez votre parcelle, vos objectifs, les cultures envisagees..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Error Message -->
              @if (service.error()) {
                <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-sm text-red-600 dark:text-red-400">{{ service.error() }}</p>
                  </div>
                </div>
              }

              <!-- Submit Button -->
              <div class="flex flex-col sm:flex-row gap-4 justify-end">
                <a routerLink="/" class="btn-outline justify-center">
                  Annuler
                </a>
                <button
                  type="submit"
                  [disabled]="!analysisForm.valid || service.loading()"
                  class="btn-primary justify-center"
                  [class.opacity-50]="!analysisForm.valid || service.loading()"
                  [class.cursor-not-allowed]="!analysisForm.valid || service.loading()"
                >
                  @if (service.loading()) {
                    <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  } @else {
                    <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Envoyer ma demande
                  }
                </button>
              </div>
            </form>
          </div>

          <!-- Info Cards -->
          <div class="grid md:grid-cols-3 gap-6 mt-8">
            <div class="card p-6 text-center">
              <div class="w-12 h-12 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Optimisez vos rendements</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Connaissez les parametres de votre sol (pH, NPK, texture) pour maximiser vos cultures
              </p>
            </div>

            <div class="card p-6 text-center">
              <div class="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Valorisez vos terres</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Mettez vos terres en vente ou en location avec des donnees fiables et certifiees
              </p>
            </div>

            <div class="card p-6 text-center">
              <div class="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Recommandations IA</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Beneficiez de conseils personnalises par intelligence artificielle pour vos cultures
              </p>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class SoilAnalysisRequestComponent {
  service = inject(SoilAnalysisRequestService);

  regions = SENEGAL_REGIONS;

  formData: CreateSoilAnalysisRequest = {
    fullName: '',
    email: '',
    phone: '',
    region: '',
    commune: '',
    surface: 0,
    description: ''
  };

  onSubmit(): void {
    if (this.formData.fullName && this.formData.email && this.formData.phone &&
        this.formData.region && this.formData.commune && this.formData.surface > 0) {
      this.service.submitRequest(this.formData).subscribe();
    }
  }

  resetForm(): void {
    this.formData = {
      fullName: '',
      email: '',
      phone: '',
      region: '',
      commune: '',
      surface: 0,
      description: ''
    };
    this.service.reset();
  }
}
