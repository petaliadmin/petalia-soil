import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LandService } from '../../../shared/services/land.service';
import { FarmerService } from '../../../shared/services/farmer.service';
import { AuthService } from '../../../shared/services/auth.service';
import { SoilAnalysisRequestService } from '../../../shared/services/soil-analysis-request.service';
import { Land, formatPrice, LAND_TYPE_LABELS } from '../../../shared/models/land.model';
import { SoilAnalysisRequest, SOIL_ANALYSIS_STATUS_LABELS } from '../../../shared/models/soil-analysis-request.model';

type TabType = 'requests' | 'favorites' | 'visited' | 'rented';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Mon espace
          </h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Bienvenue, {{ authService.user()?.fullName }}
          </p>
        </div>
        <div class="flex gap-3">
          <a
            routerLink="/demande-analyse"
            class="inline-flex items-center px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
            </svg>
            Demander une analyse
          </a>
          <a
            routerLink="/lands"
            class="inline-flex items-center px-4 py-2 bg-agri-600 text-white font-medium rounded-lg hover:bg-agri-700 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Explorer les terres
          </a>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <!-- Requests -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 cursor-pointer transition-all hover:shadow-md"
          [class.ring-2]="activeTab() === 'requests'"
          [class.ring-amber-500]="activeTab() === 'requests'"
          (click)="setTab('requests')"
        >
          <div class="flex items-center">
            <div class="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Demandes</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ myRequests().length }}</p>
            </div>
          </div>
        </div>

        <!-- Favorites -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 cursor-pointer transition-all hover:shadow-md"
          [class.ring-2]="activeTab() === 'favorites'"
          [class.ring-agri-500]="activeTab() === 'favorites'"
          (click)="setTab('favorites')"
        >
          <div class="flex items-center">
            <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Favoris</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ farmerService.favoritesCount() }}</p>
            </div>
          </div>
        </div>

        <!-- Visited -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 cursor-pointer transition-all hover:shadow-md"
          [class.ring-2]="activeTab() === 'visited'"
          [class.ring-agri-500]="activeTab() === 'visited'"
          (click)="setTab('visited')"
        >
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Consultees</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ farmerService.visitedCount() }}</p>
            </div>
          </div>
        </div>

        <!-- Rented -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 cursor-pointer transition-all hover:shadow-md"
          [class.ring-2]="activeTab() === 'rented'"
          [class.ring-agri-500]="activeTab() === 'rented'"
          (click)="setTab('rented')"
        >
          <div class="flex items-center">
            <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Louees</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ farmerService.rentedCount() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div class="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <nav class="flex -mb-px min-w-max">
            <button
              (click)="setTab('requests')"
              class="px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
              [class.border-amber-500]="activeTab() === 'requests'"
              [class.text-amber-600]="activeTab() === 'requests'"
              [class.dark:text-amber-400]="activeTab() === 'requests'"
              [class.border-transparent]="activeTab() !== 'requests'"
              [class.text-gray-500]="activeTab() !== 'requests'"
              [class.hover:text-gray-700]="activeTab() !== 'requests'"
              [class.dark:text-gray-400]="activeTab() !== 'requests'"
            >
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg>
                Mes demandes ({{ myRequests().length }})
              </span>
            </button>
            <button
              (click)="setTab('favorites')"
              class="px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
              [class.border-agri-500]="activeTab() === 'favorites'"
              [class.text-agri-600]="activeTab() === 'favorites'"
              [class.dark:text-agri-400]="activeTab() === 'favorites'"
              [class.border-transparent]="activeTab() !== 'favorites'"
              [class.text-gray-500]="activeTab() !== 'favorites'"
              [class.hover:text-gray-700]="activeTab() !== 'favorites'"
              [class.dark:text-gray-400]="activeTab() !== 'favorites'"
            >
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                Favoris ({{ farmerService.favoritesCount() }})
              </span>
            </button>
            <button
              (click)="setTab('visited')"
              class="px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
              [class.border-agri-500]="activeTab() === 'visited'"
              [class.text-agri-600]="activeTab() === 'visited'"
              [class.dark:text-agri-400]="activeTab() === 'visited'"
              [class.border-transparent]="activeTab() !== 'visited'"
              [class.text-gray-500]="activeTab() !== 'visited'"
              [class.hover:text-gray-700]="activeTab() !== 'visited'"
              [class.dark:text-gray-400]="activeTab() !== 'visited'"
            >
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                Consultees ({{ farmerService.visitedCount() }})
              </span>
            </button>
            <button
              (click)="setTab('rented')"
              class="px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
              [class.border-agri-500]="activeTab() === 'rented'"
              [class.text-agri-600]="activeTab() === 'rented'"
              [class.dark:text-agri-400]="activeTab() === 'rented'"
              [class.border-transparent]="activeTab() !== 'rented'"
              [class.text-gray-500]="activeTab() !== 'rented'"
              [class.hover:text-gray-700]="activeTab() !== 'rented'"
              [class.dark:text-gray-400]="activeTab() !== 'rented'"
            >
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Louees ({{ farmerService.rentedCount() }})
              </span>
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Requests Tab -->
          @if (activeTab() === 'requests') {
            @if (loadingRequests()) {
              <div class="text-center py-12">
                <div class="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto"></div>
                <p class="mt-4 text-gray-500 dark:text-gray-400">Chargement...</p>
              </div>
            } @else if (myRequests().length === 0) {
              <div class="text-center py-12">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Aucune demande d'analyse
                </h3>
                <p class="text-gray-500 dark:text-gray-400 mb-4">
                  Faites analyser votre sol pour connaitre sa composition.
                </p>
                <a
                  routerLink="/demande-analyse"
                  class="inline-flex items-center px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Demander une analyse
                </a>
              </div>
            } @else {
              <!-- Requests List -->
              <div class="space-y-4">
                @for (request of myRequests(); track request._id) {
                  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 sm:p-6">
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                          <span
                            class="px-2.5 py-1 text-xs font-medium rounded-full"
                            [class.bg-amber-100]="request.status === 'pending'"
                            [class.text-amber-800]="request.status === 'pending'"
                            [class.dark:bg-amber-900/30]="request.status === 'pending'"
                            [class.dark:text-amber-400]="request.status === 'pending'"
                            [class.bg-blue-100]="request.status === 'processing'"
                            [class.text-blue-800]="request.status === 'processing'"
                            [class.dark:bg-blue-900/30]="request.status === 'processing'"
                            [class.dark:text-blue-400]="request.status === 'processing'"
                            [class.bg-green-100]="request.status === 'completed'"
                            [class.text-green-800]="request.status === 'completed'"
                            [class.dark:bg-green-900/30]="request.status === 'completed'"
                            [class.dark:text-green-400]="request.status === 'completed'"
                            [class.bg-red-100]="request.status === 'cancelled'"
                            [class.text-red-800]="request.status === 'cancelled'"
                            [class.dark:bg-red-900/30]="request.status === 'cancelled'"
                            [class.dark:text-red-400]="request.status === 'cancelled'"
                          >
                            {{ getStatusLabel(request.status) }}
                          </span>
                          <span class="text-sm text-gray-500 dark:text-gray-400">
                            {{ request.createdAt | date:'dd/MM/yyyy' }}
                          </span>
                        </div>
                        <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                          {{ request.commune }}, {{ request.region }}
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          Surface : {{ request.surface }} ha
                        </p>
                        @if (request.description) {
                          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                            {{ request.description }}
                          </p>
                        }
                      </div>
                      <div class="flex items-center gap-2">
                        @if (request.status === 'pending') {
                          <span class="flex items-center text-sm text-amber-600 dark:text-amber-400">
                            <svg class="w-4 h-4 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10"/>
                            </svg>
                            En attente de traitement
                          </span>
                        } @else if (request.status === 'processing') {
                          <span class="flex items-center text-sm text-blue-600 dark:text-blue-400">
                            <svg class="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyse en cours
                          </span>
                        } @else if (request.status === 'completed') {
                          <button class="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            Voir les resultats
                          </button>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          } @else {
            <!-- Lands Tabs (favorites, visited, rented) -->
            @if (landService.loading()) {
              <div class="text-center py-12">
                <div class="animate-spin w-8 h-8 border-4 border-agri-600 border-t-transparent rounded-full mx-auto"></div>
                <p class="mt-4 text-gray-500 dark:text-gray-400">Chargement...</p>
              </div>
            } @else if (currentLands().length === 0) {
              <div class="text-center py-12">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {{ getEmptyMessage() }}
                </h3>
                <p class="text-gray-500 dark:text-gray-400 mb-4">
                  {{ getEmptySubMessage() }}
                </p>
                <a
                  routerLink="/lands"
                  class="inline-flex items-center px-4 py-2 bg-agri-600 text-white font-medium rounded-lg hover:bg-agri-700 transition-colors"
                >
                  Explorer les terres disponibles
                </a>
              </div>
            } @else {
              <!-- Lands Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (land of currentLands(); track land._id) {
                  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <!-- Image -->
                    <div class="relative aspect-video">
                      @if (land.thumbnail || land.images?.[0]) {
                        <img
                          [src]="land.thumbnail || land.images?.[0]"
                          [alt]="land.title"
                          class="w-full h-full object-cover"
                        />
                      } @else {
                        <div class="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                        </div>
                      }
                      <!-- Type Badge -->
                      <span
                        class="absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full"
                        [class.bg-blue-100]="land.type === 'RENT'"
                        [class.text-blue-800]="land.type === 'RENT'"
                        [class.bg-amber-100]="land.type === 'SALE'"
                        [class.text-amber-800]="land.type === 'SALE'"
                      >
                        {{ getTypeLabel(land.type) }}
                      </span>
                      <!-- Favorite Button -->
                      <button
                        (click)="toggleFavorite(land._id, $event)"
                        class="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
                      >
                        <svg
                          class="w-5 h-5"
                          [class.text-red-500]="farmerService.isFavorite(land._id)"
                          [class.fill-current]="farmerService.isFavorite(land._id)"
                          [class.text-gray-400]="!farmerService.isFavorite(land._id)"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                    </div>

                    <!-- Content -->
                    <div class="p-4">
                      <h3 class="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {{ land.title }}
                      </h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {{ land.address.city }}, {{ land.address.region }}
                      </p>
                      <div class="flex items-center justify-between mb-3">
                        <span class="text-lg font-bold text-agri-600 dark:text-agri-400">
                          {{ formatPrice(land.price) }}
                        </span>
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                          {{ land.surface }} ha
                        </span>
                      </div>
                      <!-- Soil Info -->
                      <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <span class="flex items-center">
                          <span
                            class="w-2 h-2 rounded-full mr-1"
                            [class.bg-green-500]="land.soilParameters.ph >= 6 && land.soilParameters.ph <= 7.5"
                            [class.bg-amber-500]="land.soilParameters.ph < 6 || land.soilParameters.ph > 7.5"
                          ></span>
                          pH {{ land.soilParameters.ph }}
                        </span>
                        <span>{{ land.soilParameters.moisture }}% humidite</span>
                      </div>
                      <!-- Actions -->
                      <div class="flex gap-2">
                        <a
                          [routerLink]="['/lands', land._id]"
                          class="flex-1 px-4 py-2 text-center text-sm font-medium bg-agri-600 text-white rounded-lg hover:bg-agri-700 transition-colors"
                        >
                          Voir details
                        </a>
                        @if (activeTab() === 'rented') {
                          <button
                            (click)="removeFromRented(land._id)"
                            class="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            title="Retirer de mes locations"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        }
                        @if (activeTab() === 'visited') {
                          <button
                            (click)="removeFromVisited(land._id)"
                            class="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                            title="Retirer de l'historique"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>

              <!-- Clear History Button (for visited tab) -->
              @if (activeTab() === 'visited' && farmerService.visitedCount() > 0) {
                <div class="mt-6 text-center">
                  <button
                    (click)="clearVisitedHistory()"
                    class="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    Effacer tout l'historique
                  </button>
                </div>
              }
            }
          }
        </div>
      </div>
    </div>
  `
})
export class FarmerDashboardComponent implements OnInit {
  landService = inject(LandService);
  farmerService = inject(FarmerService);
  authService = inject(AuthService);
  soilAnalysisService = inject(SoilAnalysisRequestService);

  activeTab = signal<TabType>('requests');
  currentLands = signal<Land[]>([]);
  myRequests = signal<SoilAnalysisRequest[]>([]);
  loadingRequests = signal(false);

  ngOnInit(): void {
    this.loadMyRequests();
    this.landService.loadLands().subscribe(() => {
      this.updateCurrentLands();
    });
  }

  loadMyRequests(): void {
    const user = this.authService.user();
    if (user) {
      this.loadingRequests.set(true);
      this.soilAnalysisService.getMyRequests(user._id, user.email).subscribe({
        next: (requests) => {
          this.myRequests.set(requests);
          this.loadingRequests.set(false);
        },
        error: () => {
          this.loadingRequests.set(false);
        }
      });
    }
  }

  setTab(tab: TabType): void {
    this.activeTab.set(tab);
    if (tab !== 'requests') {
      this.updateCurrentLands();
    }
  }

  updateCurrentLands(): void {
    const tab = this.activeTab();
    switch (tab) {
      case 'favorites':
        this.currentLands.set(this.farmerService.favoriteLands());
        break;
      case 'visited':
        this.currentLands.set(this.farmerService.visitedLands());
        break;
      case 'rented':
        this.currentLands.set(this.farmerService.rentedLands());
        break;
    }
  }

  getEmptyMessage(): string {
    const tab = this.activeTab();
    switch (tab) {
      case 'favorites':
        return 'Aucune terre en favoris';
      case 'visited':
        return 'Aucune terre consultee';
      case 'rented':
        return 'Aucune terre louee';
      default:
        return '';
    }
  }

  getEmptySubMessage(): string {
    const tab = this.activeTab();
    switch (tab) {
      case 'favorites':
        return 'Ajoutez des terres a vos favoris en cliquant sur le coeur.';
      case 'visited':
        return 'Les terres que vous consultez apparaitront ici.';
      case 'rented':
        return 'Les terres que vous louez apparaitront ici.';
      default:
        return '';
    }
  }

  getTypeLabel(type: string): string {
    return LAND_TYPE_LABELS[type as keyof typeof LAND_TYPE_LABELS] || type;
  }

  getStatusLabel(status: string): string {
    return SOIL_ANALYSIS_STATUS_LABELS[status as keyof typeof SOIL_ANALYSIS_STATUS_LABELS] || status;
  }

  formatPrice(price: number): string {
    return formatPrice(price);
  }

  toggleFavorite(landId: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.farmerService.toggleFavorite(landId);
    this.updateCurrentLands();
  }

  removeFromRented(landId: string): void {
    this.farmerService.removeFromRented(landId);
    this.updateCurrentLands();
  }

  removeFromVisited(landId: string): void {
    this.farmerService.removeFromVisited(landId);
    this.updateCurrentLands();
  }

  clearVisitedHistory(): void {
    if (confirm('Voulez-vous vraiment effacer tout l\'historique de visite ?')) {
      this.farmerService.clearVisitedHistory();
      this.updateCurrentLands();
    }
  }
}
