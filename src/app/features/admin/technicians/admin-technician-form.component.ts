import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Technician, CreateTechnicianDto, TechnicianStatus } from '../../../shared/models/technician.model';
import { TechnicianService } from '../../../shared/services/technician.service';
import { SENEGAL_REGIONS } from '../../../shared/models/soil-analysis-request.model';

@Component({
  selector: 'app-admin-technician-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-3xl mx-auto">
      <!-- Back Button -->
      <div class="mb-6">
        <a
          routerLink="/admin/technicians"
          class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Retour a la liste
        </a>
      </div>

      <!-- Loading State (Edit Mode) -->
      @if (loadingTechnician()) {
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
          <div class="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto"></div>
          <p class="mt-4 text-gray-500 dark:text-gray-400">Chargement du technicien...</p>
        </div>
      } @else {
        <!-- Form -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ isEditMode ? 'Modifier le technicien' : 'Nouveau technicien' }}
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ isEditMode ? 'Modifiez les informations du technicien' : 'Ajoutez un nouveau technicien a votre equipe' }}
            </p>
          </div>

          <!-- Error Message -->
          @if (errorMessage()) {
            <div class="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
              <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-sm text-red-700 dark:text-red-400">{{ errorMessage() }}</span>
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="p-6 space-y-6">
            <!-- Personal Information -->
            <div class="space-y-4">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <svg class="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Informations personnelles
              </h2>

              <div class="grid gap-4 sm:grid-cols-2">
                <!-- Full Name -->
                <div class="sm:col-span-2">
                  <label for="fullName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom complet <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    [(ngModel)]="formData.fullName"
                    name="fullName"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Entrez le nom complet"
                  />
                </div>

                <!-- Email -->
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    [(ngModel)]="formData.email"
                    name="email"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="email@exemple.com"
                  />
                </div>

                <!-- Phone -->
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Telephone <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    [(ngModel)]="formData.phone"
                    name="phone"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="+221 77 123 45 67"
                  />
                </div>

                <!-- WhatsApp -->
                <div>
                  <label for="whatsapp" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    [(ngModel)]="formData.whatsapp"
                    name="whatsapp"
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="+221 77 123 45 67"
                  />
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Laissez vide si identique au telephone</p>
                </div>

                <!-- Specialization -->
                <div>
                  <label for="specialization" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Specialisation
                  </label>
                  <input
                    type="text"
                    id="specialization"
                    [(ngModel)]="formData.specialization"
                    name="specialization"
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Ex: Analyse de sol, Cultures maraicheres..."
                  />
                </div>
              </div>
            </div>

            <!-- Coverage Regions -->
            <div class="space-y-4">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <svg class="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Zones de couverture <span class="text-red-500 ml-1">*</span>
              </h2>

              <p class="text-sm text-gray-500 dark:text-gray-400">
                Selectionnez les regions ou le technicien peut intervenir
              </p>

              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                @for (region of regions; track region) {
                  <label
                    class="flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors"
                    [class.border-amber-500]="isRegionSelected(region)"
                    [class.bg-amber-50]="isRegionSelected(region)"
                    [class.dark:bg-amber-900/20]="isRegionSelected(region)"
                    [class.border-gray-200]="!isRegionSelected(region)"
                    [class.dark:border-gray-600]="!isRegionSelected(region)"
                    [class.hover:border-amber-300]="!isRegionSelected(region)"
                  >
                    <input
                      type="checkbox"
                      [checked]="isRegionSelected(region)"
                      (change)="toggleRegion(region)"
                      class="sr-only"
                    />
                    <span
                      class="w-5 h-5 rounded border-2 flex items-center justify-center mr-2 transition-colors"
                      [class.bg-amber-500]="isRegionSelected(region)"
                      [class.border-amber-500]="isRegionSelected(region)"
                      [class.border-gray-300]="!isRegionSelected(region)"
                      [class.dark:border-gray-500]="!isRegionSelected(region)"
                    >
                      @if (isRegionSelected(region)) {
                        <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                        </svg>
                      }
                    </span>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ region }}</span>
                  </label>
                }
              </div>

              @if (formData.coverageRegions.length === 0 && submitted) {
                <p class="text-sm text-red-500">Veuillez selectionner au moins une region</p>
              }
            </div>

            <!-- Status (Edit Mode Only) -->
            @if (isEditMode) {
              <div class="space-y-4">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <svg class="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Statut
                </h2>

                <div class="flex flex-wrap gap-3">
                  <label
                    class="flex items-center px-4 py-2 rounded-lg border-2 cursor-pointer transition-colors"
                    [class.border-green-500]="formData.status === 'active'"
                    [class.bg-green-50]="formData.status === 'active'"
                    [class.dark:bg-green-900/20]="formData.status === 'active'"
                    [class.border-gray-200]="formData.status !== 'active'"
                    [class.dark:border-gray-600]="formData.status !== 'active'"
                  >
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      [(ngModel)]="formData.status"
                      class="sr-only"
                    />
                    <span class="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Actif</span>
                  </label>

                  <label
                    class="flex items-center px-4 py-2 rounded-lg border-2 cursor-pointer transition-colors"
                    [class.border-yellow-500]="formData.status === 'on_leave'"
                    [class.bg-yellow-50]="formData.status === 'on_leave'"
                    [class.dark:bg-yellow-900/20]="formData.status === 'on_leave'"
                    [class.border-gray-200]="formData.status !== 'on_leave'"
                    [class.dark:border-gray-600]="formData.status !== 'on_leave'"
                  >
                    <input
                      type="radio"
                      name="status"
                      value="on_leave"
                      [(ngModel)]="formData.status"
                      class="sr-only"
                    />
                    <span class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">En conge</span>
                  </label>

                  <label
                    class="flex items-center px-4 py-2 rounded-lg border-2 cursor-pointer transition-colors"
                    [class.border-gray-500]="formData.status === 'inactive'"
                    [class.bg-gray-100]="formData.status === 'inactive'"
                    [class.dark:bg-gray-700]="formData.status === 'inactive'"
                    [class.border-gray-200]="formData.status !== 'inactive'"
                    [class.dark:border-gray-600]="formData.status !== 'inactive'"
                  >
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      [(ngModel)]="formData.status"
                      class="sr-only"
                    />
                    <span class="w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Inactif</span>
                  </label>
                </div>
              </div>
            }

            <!-- Notes -->
            <div class="space-y-4">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <svg class="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Notes
              </h2>

              <textarea
                id="notes"
                [(ngModel)]="formData.notes"
                name="notes"
                rows="3"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                placeholder="Notes internes sur le technicien..."
              ></textarea>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                routerLink="/admin/technicians"
                class="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Annuler
              </a>
              <button
                type="submit"
                [disabled]="saving()"
                class="px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                @if (saving()) {
                  <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                }
                {{ isEditMode ? 'Enregistrer les modifications' : 'Creer le technicien' }}
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `
})
export class AdminTechnicianFormComponent implements OnInit {
  private service = inject(TechnicianService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Form data
  formData: CreateTechnicianDto & { status?: TechnicianStatus } = {
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    specialization: '',
    coverageRegions: [],
    status: 'active',
    notes: ''
  };

  regions = SENEGAL_REGIONS;

  // State
  isEditMode = false;
  technicianId: string | null = null;
  submitted = false;
  saving = signal(false);
  loadingTechnician = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.technicianId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.technicianId;

    if (this.isEditMode && this.technicianId) {
      this.loadTechnician(this.technicianId);
    }
  }

  loadTechnician(id: string): void {
    this.loadingTechnician.set(true);

    this.service.getTechnicianById(id).subscribe({
      next: (tech) => {
        if (tech) {
          this.formData = {
            fullName: tech.fullName,
            email: tech.email,
            phone: tech.phone,
            whatsapp: tech.whatsapp || '',
            specialization: tech.specialization || '',
            coverageRegions: [...tech.coverageRegions],
            status: tech.status,
            notes: tech.notes || ''
          };
        } else {
          this.errorMessage.set('Technicien non trouve');
        }
        this.loadingTechnician.set(false);
      },
      error: () => {
        this.errorMessage.set('Erreur lors du chargement du technicien');
        this.loadingTechnician.set(false);
      }
    });
  }

  isRegionSelected(region: string): boolean {
    return this.formData.coverageRegions.includes(region);
  }

  toggleRegion(region: string): void {
    const index = this.formData.coverageRegions.indexOf(region);
    if (index === -1) {
      this.formData.coverageRegions.push(region);
    } else {
      this.formData.coverageRegions.splice(index, 1);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage.set(null);

    // Validation
    if (!this.formData.fullName || !this.formData.email || !this.formData.phone) {
      this.errorMessage.set('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.formData.coverageRegions.length === 0) {
      this.errorMessage.set('Veuillez selectionner au moins une region de couverture');
      return;
    }

    this.saving.set(true);

    const data: CreateTechnicianDto = {
      fullName: this.formData.fullName,
      email: this.formData.email,
      phone: this.formData.phone,
      whatsapp: this.formData.whatsapp || undefined,
      specialization: this.formData.specialization || undefined,
      coverageRegions: this.formData.coverageRegions,
      status: this.formData.status,
      notes: this.formData.notes || undefined
    };

    if (this.isEditMode && this.technicianId) {
      this.service.updateTechnician(this.technicianId, data).subscribe({
        next: (tech) => {
          if (tech) {
            this.router.navigate(['/admin/technicians']);
          } else {
            this.errorMessage.set('Erreur lors de la mise a jour');
          }
          this.saving.set(false);
        },
        error: () => {
          this.errorMessage.set('Erreur lors de la mise a jour du technicien');
          this.saving.set(false);
        }
      });
    } else {
      this.service.createTechnician(data).subscribe({
        next: (tech) => {
          if (tech) {
            this.router.navigate(['/admin/technicians']);
          } else {
            this.errorMessage.set('Erreur lors de la creation');
          }
          this.saving.set(false);
        },
        error: () => {
          this.errorMessage.set('Erreur lors de la creation du technicien');
          this.saving.set(false);
        }
      });
    }
  }
}
