import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Technician, TechnicianStatus, TECHNICIAN_STATUS_LABELS, FilterTechniciansDto } from '../../../shared/models/technician.model';
import { TechnicianService } from '../../../shared/services/technician.service';
import { SENEGAL_REGIONS } from '../../../shared/models/soil-analysis-request.model';

@Component({
  selector: 'app-admin-technicians-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des techniciens
          </h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {{ totalCount() }} technicien(s) au total
          </p>
        </div>
        <a
          routerLink="/admin/technicians/new"
          class="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nouveau technicien
        </a>
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
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <!-- Region Filter -->
          <select
            [(ngModel)]="filterRegion"
            (ngModelChange)="loadTechnicians()"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Toutes les regions</option>
            @for (region of regions; track region) {
              <option [value]="region">{{ region }}</option>
            }
          </select>

          <!-- Status Filter -->
          <select
            [(ngModel)]="filterStatus"
            (ngModelChange)="loadTechnicians()"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="on_leave">En conge</option>
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
          <p class="mt-4 text-gray-500 dark:text-gray-400">Chargement des techniciens...</p>
        </div>
      }

      <!-- Technicians Grid -->
      @if (!loading()) {
        @if (technicians().length === 0) {
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun technicien trouve
            </h3>
            <p class="text-gray-500 dark:text-gray-400 mb-4">
              @if (searchQuery || filterStatus || filterRegion) {
                Aucun resultat ne correspond a vos criteres de recherche.
              } @else {
                Commencez par ajouter un technicien.
              }
            </p>
            @if (!searchQuery && !filterStatus && !filterRegion) {
              <a
                routerLink="/admin/technicians/new"
                class="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Ajouter un technicien
              </a>
            }
          </div>
        } @else {
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            @for (tech of technicians(); track tech._id) {
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <!-- Header with status -->
                <div class="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-full bg-agri-100 dark:bg-agri-900/30 flex items-center justify-center">
                      <span class="text-agri-700 dark:text-agri-400 font-semibold text-lg">
                        {{ getInitials(tech.fullName) }}
                      </span>
                    </div>
                    <div class="ml-3">
                      <h3 class="font-semibold text-gray-900 dark:text-white">{{ tech.fullName }}</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ tech.specialization || 'Technicien' }}</p>
                    </div>
                  </div>
                  <div class="relative">
                    <select
                      [value]="tech.status"
                      (change)="onStatusChange(tech, $event)"
                      [disabled]="updatingId() === tech._id"
                      class="text-xs font-medium rounded-full pl-3 pr-7 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-amber-500 appearance-none"
                      [class.bg-green-100]="tech.status === 'active'"
                      [class.text-green-800]="tech.status === 'active'"
                      [class.dark:bg-green-900/30]="tech.status === 'active'"
                      [class.dark:text-green-400]="tech.status === 'active'"
                      [class.bg-gray-100]="tech.status === 'inactive'"
                      [class.text-gray-800]="tech.status === 'inactive'"
                      [class.dark:bg-gray-700]="tech.status === 'inactive'"
                      [class.dark:text-gray-400]="tech.status === 'inactive'"
                      [class.bg-yellow-100]="tech.status === 'on_leave'"
                      [class.text-yellow-800]="tech.status === 'on_leave'"
                      [class.dark:bg-yellow-900/30]="tech.status === 'on_leave'"
                      [class.dark:text-yellow-400]="tech.status === 'on_leave'"
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                      <option value="on_leave">En conge</option>
                    </select>
                    <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-current opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>

                <!-- Content -->
                <div class="p-4 space-y-3">
                  <!-- Contact -->
                  <div class="space-y-2">
                    <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      {{ tech.email }}
                    </div>
                    <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                      {{ tech.phone }}
                    </div>
                  </div>

                  <!-- Regions -->
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Zones couvertes</p>
                    <div class="flex flex-wrap gap-1">
                      @for (region of tech.coverageRegions.slice(0, 3); track region) {
                        <span class="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                          {{ region }}
                        </span>
                      }
                      @if (tech.coverageRegions.length > 3) {
                        <span class="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                          +{{ tech.coverageRegions.length - 3 }}
                        </span>
                      }
                    </div>
                  </div>

                  <!-- Stats -->
                  <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div class="text-center">
                      <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ tech.completedMissions }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Missions</p>
                    </div>
                    <div class="flex items-center gap-1">
                      <!-- WhatsApp -->
                      @if (tech.whatsapp || tech.phone) {
                        <a
                          [href]="getWhatsAppLink(tech)"
                          target="_blank"
                          class="p-2 text-green-500 hover:text-green-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Contacter via WhatsApp"
                        >
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </a>
                      }
                      <!-- Edit -->
                      <a
                        [routerLink]="['/admin/technicians', tech._id, 'edit']"
                        class="p-2 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Modifier"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </a>
                      <!-- Delete -->
                      <button
                        (click)="confirmDelete(tech)"
                        class="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Supprimer"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Pagination -->
          @if (totalPages() > 1) {
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm px-6 py-4 flex items-center justify-between">
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
      }

      <!-- Delete Confirmation Modal -->
      @if (techToDelete()) {
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
              Etes-vous sur de vouloir supprimer le technicien <strong>{{ techToDelete()?.fullName }}</strong> ?
              Cette action est irreversible.
            </p>
            <div class="flex justify-end space-x-3">
              <button
                (click)="cancelDelete()"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
              <button
                (click)="deleteTechnician()"
                [disabled]="deleting()"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors flex items-center"
              >
                @if (deleting()) {
                  <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                }
                Supprimer
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminTechniciansListComponent implements OnInit {
  private service = inject(TechnicianService);

  // Data
  technicians = signal<Technician[]>([]);
  regions = SENEGAL_REGIONS;

  // Pagination
  currentPage = signal(1);
  totalPages = signal(0);
  totalCount = signal(0);
  pageSize = 12;

  // UI State
  loading = signal(false);
  deleting = signal(false);
  updatingId = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Filters
  searchQuery = '';
  filterStatus: TechnicianStatus | '' = '';
  filterRegion = '';

  // Delete modal
  techToDelete = signal<Technician | null>(null);

  ngOnInit(): void {
    this.loadTechnicians();
  }

  loadTechnicians(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const filters: FilterTechniciansDto = {
      page: this.currentPage(),
      limit: this.pageSize
    };

    if (this.filterStatus) filters.status = this.filterStatus;
    if (this.filterRegion) filters.region = this.filterRegion;

    this.service.getTechnicians(filters).subscribe({
      next: (response) => {
        let data = response.data;

        // Client-side search filter
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          data = data.filter(t =>
            t.fullName.toLowerCase().includes(query) ||
            t.email.toLowerCase().includes(query)
          );
        }

        this.technicians.set(data);
        this.totalCount.set(response.total);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Erreur lors du chargement des techniciens');
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadTechnicians();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterStatus = '';
    this.filterRegion = '';
    this.currentPage.set(1);
    this.loadTechnicians();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadTechnicians();
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

  getWhatsAppLink(tech: Technician): string {
    const phone = (tech.whatsapp || tech.phone).replace(/\s+/g, '').replace(/^\+/, '');
    return `https://wa.me/${phone}`;
  }

  onStatusChange(tech: Technician, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value as TechnicianStatus;

    if (newStatus === tech.status) return;

    this.updatingId.set(tech._id);

    this.service.updateTechnician(tech._id, { status: newStatus }).subscribe({
      next: () => {
        this.technicians.update(list =>
          list.map(t => t._id === tech._id ? { ...t, status: newStatus } : t)
        );
        this.successMessage.set('Statut mis a jour');
        this.updatingId.set(null);
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: () => {
        select.value = tech.status;
        this.updatingId.set(null);
        this.errorMessage.set('Erreur lors de la mise a jour');
      }
    });
  }

  confirmDelete(tech: Technician): void {
    this.techToDelete.set(tech);
  }

  cancelDelete(): void {
    this.techToDelete.set(null);
  }

  deleteTechnician(): void {
    const tech = this.techToDelete();
    if (!tech?._id) return;

    this.deleting.set(true);

    this.service.deleteTechnician(tech._id).subscribe({
      next: (success) => {
        if (success) {
          this.technicians.update(list => list.filter(t => t._id !== tech._id));
          this.totalCount.update(c => c - 1);
          this.successMessage.set('Technicien supprime');
          setTimeout(() => this.successMessage.set(null), 3000);
        }
        this.techToDelete.set(null);
        this.deleting.set(false);
      },
      error: () => {
        this.errorMessage.set('Erreur lors de la suppression');
        this.techToDelete.set(null);
        this.deleting.set(false);
      }
    });
  }
}
