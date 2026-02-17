import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { SoilAnalysisRequestService } from '../../../shared/services/soil-analysis-request.service';
import { ReportService } from '../../../shared/services/report.service';
import { SoilAnalysisRequest, SOIL_ANALYSIS_STATUS_LABELS } from '../../../shared/models/soil-analysis-request.model';

@Component({
  selector: 'app-owner-my-requests',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Mes demandes d'analyse
          </h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Suivez l'etat de vos demandes d'analyse de sol
          </p>
        </div>
        <a
          routerLink="/demande-analyse"
          class="inline-flex items-center px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nouvelle demande
        </a>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div class="flex items-center">
            <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ myRequests().length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div class="flex items-center">
            <div class="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">En attente</p>
              <p class="text-xl font-bold text-amber-600 dark:text-amber-400">{{ getCountByStatus('pending') }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">En cours</p>
              <p class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ getCountByStatus('processing') }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Terminees</p>
              <p class="text-xl font-bold text-green-600 dark:text-green-400">{{ getCountByStatus('completed') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Requests List -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        @if (loading()) {
          <div class="p-8 text-center">
            <div class="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto"></div>
            <p class="mt-4 text-gray-500 dark:text-gray-400">Chargement de vos demandes...</p>
          </div>
        } @else if (myRequests().length === 0) {
          <div class="p-12 text-center">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune demande d'analyse
            </h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6">
              Faites analyser votre sol pour connaitre sa composition et recevoir des recommandations personnalisees.
            </p>
            <a
              routerLink="/demande-analyse"
              class="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
              </svg>
              Demander une analyse de sol
            </a>
          </div>
        } @else {
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            @for (request of myRequests(); track request._id) {
              <div class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div class="flex-1">
                    <div class="flex flex-wrap items-center gap-3 mb-2">
                      <span
                        class="px-3 py-1 text-xs font-medium rounded-full"
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
                        Demande du {{ request.createdAt | date:'dd MMMM yyyy' }}
                      </span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {{ request.commune }}, {{ request.region }}
                    </h3>
                    <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                        </svg>
                        {{ request.surface }} hectares
                      </span>
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                        {{ request.phone }}
                      </span>
                    </div>
                    @if (request.description) {
                      <p class="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {{ request.description }}
                      </p>
                    }
                  </div>
                  <div class="flex items-center gap-3">
                    @if (request.status === 'pending') {
                      <div class="flex items-center text-amber-600 dark:text-amber-400">
                        <svg class="w-5 h-5 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"/>
                        </svg>
                        <span class="text-sm font-medium">En attente</span>
                      </div>
                    } @else if (request.status === 'processing') {
                      <div class="flex items-center text-blue-600 dark:text-blue-400">
                        <svg class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span class="text-sm font-medium">En cours d'analyse</span>
                      </div>
                    } @else if (request.status === 'completed') {
                      <div class="flex items-center gap-2">
                        <!-- Preview report button -->
                        <button
                          (click)="viewReport(request)"
                          [disabled]="downloadingId() === request._id"
                          class="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <svg class="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          Voir le rapport
                        </button>
                        <!-- Download button -->
                        <button
                          (click)="downloadReport(request)"
                          [disabled]="downloadingId() === request._id"
                          class="p-2 text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                          title="Telecharger le rapport PDF"
                        >
                          @if (downloadingId() === request._id) {
                            <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          } @else {
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                          }
                        </button>
                      </div>
                    } @else if (request.status === 'cancelled') {
                      <span class="text-sm text-red-600 dark:text-red-400 font-medium">
                        Annulee
                      </span>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class OwnerMyRequestsComponent implements OnInit {
  private router = inject(Router);
  authService = inject(AuthService);
  soilAnalysisService = inject(SoilAnalysisRequestService);
  reportService = inject(ReportService);

  myRequests = signal<SoilAnalysisRequest[]>([]);
  loading = signal(false);
  downloadingId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadMyRequests();
  }

  loadMyRequests(): void {
    const user = this.authService.user();
    if (user) {
      this.loading.set(true);
      this.soilAnalysisService.getMyRequests(user._id, user.email).subscribe({
        next: (requests) => {
          this.myRequests.set(requests);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
    }
  }

  getCountByStatus(status: string): number {
    return this.myRequests().filter(r => r.status === status).length;
  }

  getStatusLabel(status: string): string {
    return SOIL_ANALYSIS_STATUS_LABELS[status as keyof typeof SOIL_ANALYSIS_STATUS_LABELS] || status;
  }

  /**
   * Navigate to report preview page if landId is available,
   * otherwise open preview directly via the report service
   */
  viewReport(request: SoilAnalysisRequest): void {
    if (request.landId) {
      this.router.navigate(['/admin/report', request.landId]);
    } else {
      // Fallback: use the request ID to find the associated land via mission
      this.reportService.openPreview(request._id!);
    }
  }

  /**
   * Download the report PDF
   */
  downloadReport(request: SoilAnalysisRequest): void {
    const id = request.landId || request._id!;
    this.downloadingId.set(request._id!);

    const filename = `rapport-sol-${request.commune}-${request.region}.pdf`;
    this.reportService.downloadReportPdf(id).subscribe(blob => {
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      this.downloadingId.set(null);
    });
  }
}
