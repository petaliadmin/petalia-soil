import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SoilAnalysisRequest, SoilAnalysisStatus, SOIL_ANALYSIS_STATUS_LABELS, SENEGAL_REGIONS } from '../../../shared/models/soil-analysis-request.model';
import { SoilAnalysisRequestService, FilterSoilAnalysisDto } from '../../../shared/services/soil-analysis-request.service';
import { Technician } from '../../../shared/models/technician.model';
import { TechnicianService } from '../../../shared/services/technician.service';
import { MissionService } from '../../../shared/services/mission.service';

@Component({
  selector: 'app-admin-soil-analysis-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Demandes d'analyse de sol
          </h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {{ totalCount() }} demande(s) au total
          </p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div class="flex flex-wrap items-center gap-4">
          <!-- Search -->
          <div class="flex-1 min-w-[200px]">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearch()"
              placeholder="Rechercher par nom, email..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
            />
          </div>

          <!-- Region Filter -->
          <select
            [(ngModel)]="filterRegion"
            (ngModelChange)="loadRequests()"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agri-500"
          >
            <option value="">Toutes les regions</option>
            @for (region of regions; track region) {
              <option [value]="region">{{ region }}</option>
            }
          </select>

          <!-- Status Filter -->
          <select
            [(ngModel)]="filterStatus"
            (ngModelChange)="loadRequests()"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agri-500"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="processing">En cours</option>
            <option value="completed">Termine</option>
            <option value="cancelled">Annule</option>
          </select>

          <!-- Clear Filters -->
          @if (searchQuery || filterStatus || filterRegion) {
            <button
              (click)="clearFilters()"
              class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Effacer les filtres
            </button>
          }
        </div>
      </div>

      <!-- Success/Error Messages -->
      @if (successMessage()) {
        <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-sm text-green-700 dark:text-green-400">{{ successMessage() }}</span>
          </div>
          <button (click)="successMessage.set(null)" class="text-green-700 dark:text-green-400 hover:text-green-900">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }

      @if (errorMessage()) {
        <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-sm text-red-700 dark:text-red-400">{{ errorMessage() }}</span>
          </div>
          <button (click)="errorMessage.set(null)" class="text-red-700 dark:text-red-400 hover:text-red-900">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }

      <!-- Loading -->
      @if (loading()) {
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
          <div class="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto"></div>
          <p class="mt-4 text-gray-500 dark:text-gray-400">Chargement des demandes...</p>
        </div>
      }

      <!-- Requests Table -->
      @if (!loading()) {
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          @if (requests().length === 0) {
            <div class="p-8 text-center">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucune demande trouvee
              </h3>
              <p class="text-gray-500 dark:text-gray-400">
                @if (searchQuery || filterStatus || filterRegion) {
                  Aucun resultat ne correspond a vos criteres de recherche.
                } @else {
                  Aucune demande d'analyse de sol pour le moment.
                }
              </p>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Demandeur
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Localisation
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Surface
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Statut
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Technicien
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  @for (request of requests(); track request._id) {
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td class="px-6 py-4">
                        <div class="flex items-center">
                          <div class="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <span class="text-amber-700 dark:text-amber-400 font-medium text-sm">
                              {{ getInitials(request.fullName) }}
                            </span>
                          </div>
                          <div class="ml-3">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">
                              {{ request.fullName }}
                            </div>
                            <div class="text-xs text-gray-500">{{ formatDate(request.createdAt) }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-gray-900 dark:text-white">{{ request.email }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ request.phone }}</div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-gray-900 dark:text-white">{{ request.commune }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ request.region }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {{ request.surface }} ha
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="relative">
                            <select
                              [value]="request.status"
                              (change)="onStatusChange(request, $event)"
                              [disabled]="updatingId() === request._id"
                              class="text-xs font-medium rounded-full pl-3 pr-7 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-amber-500 appearance-none"
                              [class.bg-yellow-100]="request.status === 'pending'"
                              [class.text-yellow-800]="request.status === 'pending'"
                              [class.dark:bg-yellow-900/30]="request.status === 'pending'"
                              [class.dark:text-yellow-400]="request.status === 'pending'"
                              [class.bg-blue-100]="request.status === 'processing'"
                              [class.text-blue-800]="request.status === 'processing'"
                              [class.dark:bg-blue-900/30]="request.status === 'processing'"
                              [class.dark:text-blue-400]="request.status === 'processing'"
                              [class.bg-green-100]="request.status === 'completed'"
                              [class.text-green-800]="request.status === 'completed'"
                              [class.dark:bg-green-900/30]="request.status === 'completed'"
                              [class.dark:text-green-400]="request.status === 'completed'"
                              [class.bg-gray-100]="request.status === 'cancelled'"
                              [class.text-gray-800]="request.status === 'cancelled'"
                              [class.dark:bg-gray-700]="request.status === 'cancelled'"
                              [class.dark:text-gray-400]="request.status === 'cancelled'"
                            >
                              <option value="pending">En attente</option>
                              <option value="processing">En cours</option>
                              <option value="completed">Termine</option>
                              <option value="cancelled">Annule</option>
                            </select>
                            <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-current opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                          </div>
                          @if (updatingId() === request._id) {
                            <span class="ml-2">
                              <svg class="animate-spin w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </span>
                          }
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        @if (request.status === 'pending') {
                          <button
                            (click)="openAssignModal(request)"
                            class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 rounded-full hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                          >
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                            </svg>
                            Affecter
                          </button>
                        } @else if (request.status === 'processing') {
                          <span class="text-sm text-blue-600 dark:text-blue-400">Mission en cours</span>
                        } @else if (request.status === 'completed') {
                          <span class="text-sm text-green-600 dark:text-green-400">Terminee</span>
                        } @else {
                          <span class="text-sm text-gray-500">-</span>
                        }
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div class="flex items-center justify-end space-x-1">
                          <!-- View Details -->
                          <button
                            (click)="viewDetails(request)"
                            class="p-2 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Voir les details"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                          </button>
                          <!-- Contact WhatsApp -->
                          <a
                            [href]="getWhatsAppLink(request)"
                            target="_blank"
                            class="p-2 text-green-500 hover:text-green-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Contacter via WhatsApp"
                          >
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          </a>
                          <!-- Delete -->
                          <button
                            (click)="confirmDelete(request)"
                            class="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Supprimer"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            @if (totalPages() > 1) {
              <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  Page {{ currentPage() }} sur {{ totalPages() }} ({{ totalCount() }} resultats)
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    (click)="goToPage(currentPage() - 1)"
                    [disabled]="currentPage() === 1"
                    class="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Precedent
                  </button>
                  @for (page of getPageNumbers(); track page) {
                    <button
                      (click)="goToPage(page)"
                      class="px-3 py-1.5 text-sm font-medium rounded-lg"
                      [class.bg-amber-600]="page === currentPage()"
                      [class.text-white]="page === currentPage()"
                      [class.border]="page !== currentPage()"
                      [class.border-gray-300]="page !== currentPage()"
                      [class.dark:border-gray-600]="page !== currentPage()"
                      [class.hover:bg-gray-50]="page !== currentPage()"
                      [class.dark:hover:bg-gray-700]="page !== currentPage()"
                    >
                      {{ page }}
                    </button>
                  }
                  <button
                    (click)="goToPage(currentPage() + 1)"
                    [disabled]="currentPage() === totalPages()"
                    class="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            }
          }
        </div>
      }

      <!-- Assign Technician Modal -->
      @if (requestToAssign()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
            <!-- Header (sticky) -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Affecter un technicien
              </h3>
              <button
                (click)="closeAssignModal()"
                class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto p-6">
              <!-- Request Info -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                <p class="text-sm text-gray-500 dark:text-gray-400">Demande de</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ requestToAssign()?.fullName }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {{ requestToAssign()?.commune }}, {{ requestToAssign()?.region }} - {{ requestToAssign()?.surface }} ha
                </p>
              </div>

              <!-- Toggle show all technicians -->
              <div class="flex items-center justify-between mb-4">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  @if (showAllTechnicians()) {
                    Tous les techniciens actifs
                  } @else {
                    Techniciens pour {{ requestToAssign()?.region }}
                  }
                </p>
                <button
                  (click)="toggleShowAllTechnicians()"
                  class="text-sm text-amber-600 dark:text-amber-400 hover:underline"
                >
                  {{ showAllTechnicians() ? 'Filtrer par region' : 'Voir tous les techniciens' }}
                </button>
              </div>

              <!-- Technician Selection -->
              @if (loadingTechnicians()) {
                <div class="text-center py-8">
                  <div class="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto"></div>
                  <p class="mt-2 text-sm text-gray-500">Chargement des techniciens...</p>
                </div>
              } @else if (availableTechnicians().length === 0) {
                <div class="text-center py-8">
                  <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <p class="text-gray-500 dark:text-gray-400 mb-3">
                    @if (showAllTechnicians()) {
                      Aucun technicien actif
                    } @else {
                      Aucun technicien disponible pour {{ requestToAssign()?.region }}
                    }
                  </p>
                  @if (!showAllTechnicians()) {
                    <button
                      (click)="toggleShowAllTechnicians()"
                      class="text-sm text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      Voir tous les techniciens actifs
                    </button>
                  }
                </div>
              } @else {
                <div class="space-y-3">
                  @for (tech of availableTechnicians(); track tech._id) {
                    <button
                      (click)="selectTechnician(tech)"
                      class="w-full flex items-center p-3 rounded-lg border-2 transition-colors"
                      [class.border-amber-500]="selectedTechnician()?._id === tech._id"
                      [class.bg-amber-50]="selectedTechnician()?._id === tech._id"
                      [class.dark:bg-amber-900/20]="selectedTechnician()?._id === tech._id"
                      [class.border-gray-200]="selectedTechnician()?._id !== tech._id"
                      [class.dark:border-gray-600]="selectedTechnician()?._id !== tech._id"
                      [class.hover:border-amber-300]="selectedTechnician()?._id !== tech._id"
                    >
                      <div class="w-10 h-10 rounded-full bg-agri-100 dark:bg-agri-900/30 flex items-center justify-center flex-shrink-0">
                        <span class="text-agri-700 dark:text-agri-400 font-medium text-sm">
                          {{ getInitials(tech.fullName) }}
                        </span>
                      </div>
                      <div class="ml-3 text-left flex-1 min-w-0">
                        <p class="font-medium text-gray-900 dark:text-white truncate">{{ tech.fullName }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {{ tech.specialization || 'Technicien' }} - {{ tech.completedMissions }} missions
                        </p>
                        <p class="text-xs text-gray-400 dark:text-gray-500 truncate">
                          {{ tech.coverageRegions.join(', ') }}
                        </p>
                      </div>
                      @if (selectedTechnician()?._id === tech._id) {
                        <svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      }
                    </button>
                  }
                </div>

                <!-- Scheduled Date -->
                <div class="mt-6">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date prevue de la mission
                  </label>
                  <input
                    type="datetime-local"
                    [(ngModel)]="scheduledDate"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <!-- Instructions -->
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Instructions (optionnel)
                  </label>
                  <textarea
                    [(ngModel)]="missionInstructions"
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 resize-none"
                    placeholder="Instructions pour le technicien..."
                  ></textarea>
                </div>
              }
            </div>

            <!-- Footer (sticky) -->
            <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                (click)="closeAssignModal()"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
              <button
                (click)="assignTechnician()"
                [disabled]="!selectedTechnician() || !scheduledDate || assigningMission()"
                class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                @if (assigningMission()) {
                  <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                }
                Affecter
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Details Modal -->
      @if (selectedRequest()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Details de la demande
              </h3>
              <button
                (click)="closeDetails()"
                class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Contact</h4>
                <div class="space-y-2">
                  <p class="text-gray-900 dark:text-white font-medium">{{ selectedRequest()?.fullName }}</p>
                  <p class="text-gray-600 dark:text-gray-300">{{ selectedRequest()?.email }}</p>
                  <p class="text-gray-600 dark:text-gray-300">{{ selectedRequest()?.phone }}</p>
                </div>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Parcelle</h4>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs text-gray-500">Region</p>
                    <p class="text-gray-900 dark:text-white font-medium">{{ selectedRequest()?.region }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Commune</p>
                    <p class="text-gray-900 dark:text-white font-medium">{{ selectedRequest()?.commune }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Surface</p>
                    <p class="text-gray-900 dark:text-white font-medium">{{ selectedRequest()?.surface }} ha</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Statut</p>
                    <p class="font-medium"
                       [class.text-yellow-600]="selectedRequest()?.status === 'pending'"
                       [class.text-blue-600]="selectedRequest()?.status === 'processing'"
                       [class.text-green-600]="selectedRequest()?.status === 'completed'">
                      {{ getStatusLabel(selectedRequest()?.status || 'pending') }}
                    </p>
                  </div>
                </div>
              </div>

              @if (selectedRequest()?.description) {
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Description</h4>
                  <p class="text-gray-600 dark:text-gray-300">{{ selectedRequest()?.description }}</p>
                </div>
              }
            </div>

            <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              @if (selectedRequest()?.status === 'pending') {
                <button
                  (click)="closeDetails(); openAssignModal(selectedRequest()!)"
                  class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Affecter un technicien
                </button>
              }
              <button
                (click)="closeDetails()"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Delete Confirmation Modal -->
      @if (requestToDelete()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div class="flex items-center mb-4">
              <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <h3 class="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
                Confirmer la suppression
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Etes-vous sur de vouloir supprimer la demande de <strong>{{ requestToDelete()?.fullName }}</strong> ?
            </p>
            <div class="flex justify-end space-x-3">
              <button
                (click)="cancelDelete()"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
              <button
                (click)="deleteRequest()"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminSoilAnalysisListComponent implements OnInit {
  private service = inject(SoilAnalysisRequestService);
  private technicianService = inject(TechnicianService);
  private missionService = inject(MissionService);

  // Data
  requests = signal<SoilAnalysisRequest[]>([]);
  availableTechnicians = signal<Technician[]>([]);
  regions = SENEGAL_REGIONS;

  // Pagination
  currentPage = signal(1);
  totalPages = signal(0);
  totalCount = signal(0);
  pageSize = 10;

  // UI State
  loading = signal(false);
  loadingTechnicians = signal(false);
  assigningMission = signal(false);
  updatingId = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showAllTechnicians = signal(false);

  // Modals
  selectedRequest = signal<SoilAnalysisRequest | null>(null);
  requestToDelete = signal<SoilAnalysisRequest | null>(null);
  requestToAssign = signal<SoilAnalysisRequest | null>(null);
  selectedTechnician = signal<Technician | null>(null);

  // Filters
  searchQuery = '';
  filterStatus: SoilAnalysisStatus | '' = '';
  filterRegion = '';

  // Mission form
  scheduledDate = '';
  missionInstructions = '';

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const filters: FilterSoilAnalysisDto = {
      page: this.currentPage(),
      limit: this.pageSize
    };

    if (this.filterStatus) filters.status = this.filterStatus;
    if (this.filterRegion) filters.region = this.filterRegion;

    this.service.getRequests(filters).subscribe({
      next: (response) => {
        let data = response.data;

        // Client-side search filter
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          data = data.filter(r =>
            r.fullName.toLowerCase().includes(query) ||
            r.email.toLowerCase().includes(query)
          );
        }

        this.requests.set(data);
        this.totalCount.set(response.total);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Erreur lors du chargement des demandes');
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadRequests();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterStatus = '';
    this.filterRegion = '';
    this.currentPage.set(1);
    this.loadRequests();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadRequests();
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    if (end - start < 4) {
      if (start === 1) end = Math.min(total, 5);
      else start = Math.max(1, total - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getStatusLabel(status: SoilAnalysisStatus): string {
    return SOIL_ANALYSIS_STATUS_LABELS[status] || status;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  getWhatsAppLink(request: SoilAnalysisRequest): string {
    const phone = request.phone.replace(/\s+/g, '').replace(/^\+/, '');
    const message = encodeURIComponent(
      `Bonjour ${request.fullName},\n\nNous avons bien recu votre demande d'analyse de sol pour votre parcelle de ${request.surface} ha a ${request.commune}, ${request.region}.\n\nCordialement,\nPetalia Soil`
    );
    return `https://wa.me/${phone}?text=${message}`;
  }

  onStatusChange(request: SoilAnalysisRequest, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value as SoilAnalysisStatus;

    if (newStatus === request.status) return;

    this.updatingId.set(request._id || '');

    this.service.updateRequestStatus(request._id!, newStatus).subscribe({
      next: () => {
        this.requests.update(list =>
          list.map(r => r._id === request._id ? { ...r, status: newStatus } : r)
        );
        this.successMessage.set('Statut mis a jour');
        this.updatingId.set(null);
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: () => {
        select.value = request.status;
        this.updatingId.set(null);
        this.errorMessage.set('Erreur lors de la mise a jour');
      }
    });
  }

  // Details Modal
  viewDetails(request: SoilAnalysisRequest): void {
    this.selectedRequest.set(request);
  }

  closeDetails(): void {
    this.selectedRequest.set(null);
  }

  // Delete Modal
  confirmDelete(request: SoilAnalysisRequest): void {
    this.requestToDelete.set(request);
  }

  cancelDelete(): void {
    this.requestToDelete.set(null);
  }

  deleteRequest(): void {
    const request = this.requestToDelete();
    if (!request?._id) return;

    this.service.deleteRequest(request._id).subscribe({
      next: () => {
        this.requests.update(list => list.filter(r => r._id !== request._id));
        this.totalCount.update(c => c - 1);
        this.successMessage.set('Demande supprimee');
        this.requestToDelete.set(null);
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: () => {
        this.errorMessage.set('Erreur lors de la suppression');
        this.requestToDelete.set(null);
      }
    });
  }

  // Assign Modal
  openAssignModal(request: SoilAnalysisRequest): void {
    this.requestToAssign.set(request);
    this.selectedTechnician.set(null);
    this.scheduledDate = '';
    this.missionInstructions = '';
    this.showAllTechnicians.set(false);
    this.loadAvailableTechnicians(request.region);
  }

  closeAssignModal(): void {
    this.requestToAssign.set(null);
    this.selectedTechnician.set(null);
    this.availableTechnicians.set([]);
    this.showAllTechnicians.set(false);
  }

  toggleShowAllTechnicians(): void {
    this.showAllTechnicians.update(v => !v);
    const request = this.requestToAssign();
    if (this.showAllTechnicians()) {
      this.loadAllActiveTechnicians();
    } else if (request) {
      this.loadAvailableTechnicians(request.region);
    }
  }

  loadAvailableTechnicians(region: string): void {
    this.loadingTechnicians.set(true);
    this.technicianService.getAvailableTechnicians(region).subscribe({
      next: (technicians) => {
        this.availableTechnicians.set(technicians);
        this.loadingTechnicians.set(false);
      },
      error: () => {
        this.availableTechnicians.set([]);
        this.loadingTechnicians.set(false);
      }
    });
  }

  loadAllActiveTechnicians(): void {
    this.loadingTechnicians.set(true);
    this.technicianService.getAllActiveTechnicians().subscribe({
      next: (technicians) => {
        this.availableTechnicians.set(technicians);
        this.loadingTechnicians.set(false);
      },
      error: () => {
        this.availableTechnicians.set([]);
        this.loadingTechnicians.set(false);
      }
    });
  }

  selectTechnician(tech: Technician): void {
    this.selectedTechnician.set(tech);
  }

  assignTechnician(): void {
    const request = this.requestToAssign();
    const technician = this.selectedTechnician();

    if (!request?._id || !technician?._id || !this.scheduledDate) return;

    this.assigningMission.set(true);

    this.missionService.createMission({
      analysisRequestId: request._id,
      technicianId: technician._id,
      scheduledDate: new Date(this.scheduledDate).toISOString(),
      instructions: this.missionInstructions || undefined
    }).subscribe({
      next: (mission) => {
        if (mission) {
          // Update request status locally
          this.requests.update(list =>
            list.map(r => r._id === request._id ? { ...r, status: 'processing' as SoilAnalysisStatus } : r)
          );
          this.successMessage.set(`Mission affectee a ${technician.fullName}`);
          this.closeAssignModal();
          setTimeout(() => this.successMessage.set(null), 3000);
        }
        this.assigningMission.set(false);
      },
      error: () => {
        this.errorMessage.set('Erreur lors de l\'affectation');
        this.assigningMission.set(false);
      }
    });
  }
}
