import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../../shared/services/report.service';
import { LandService } from '../../../shared/services/land.service';
import { Land } from '../../../shared/models/land.model';

@Component({
  selector: 'app-report-preview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-3">
          <button
            (click)="goBack()"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Rapport d'analyse de sol
            </h1>
            @if (land()) {
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {{ land()!.title }} - {{ land()!.address.commune }}, {{ land()!.address.region }}
              </p>
            }
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- Preview in new tab -->
          <button
            (click)="openInNewTab()"
            [disabled]="reportService.loading()"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            Ouvrir
          </button>

          <!-- Download -->
          <button
            (click)="downloadPdf()"
            [disabled]="reportService.loading()"
            class="inline-flex items-center px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            @if (reportService.loading()) {
              <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Chargement...
            } @else {
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Telecharger PDF
            }
          </button>
        </div>
      </div>

      <!-- Error message -->
      @if (reportService.error()) {
        <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-sm text-red-700 dark:text-red-400">{{ reportService.error() }}</span>
          </div>
          <button (click)="reportService.clearError()" class="text-red-700 dark:text-red-400 hover:text-red-900">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }

      <!-- PDF Preview -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        @if (loadingPreview()) {
          <div class="flex flex-col items-center justify-center py-20">
            <div class="animate-spin w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full"></div>
            <p class="mt-4 text-gray-500 dark:text-gray-400">Chargement du rapport...</p>
          </div>
        } @else if (previewUrl()) {
          <iframe
            [src]="previewUrl()"
            class="w-full border-0"
            style="height: 85vh;"
            title="Apercu du rapport"
          ></iframe>
        } @else if (!reportService.loading()) {
          <div class="flex flex-col items-center justify-center py-20">
            <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Rapport indisponible
            </h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
              Le rapport d'analyse de sol n'est pas encore disponible pour cette parcelle.
              Veuillez patienter jusqu'a la fin de l'analyse.
            </p>
            <button
              (click)="loadPreview()"
              class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Reessayer
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class ReportPreviewComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private landService = inject(LandService);
  reportService = inject(ReportService);

  land = signal<Land | null>(null);
  previewUrl = signal<SafeResourceUrl | null>(null);
  loadingPreview = signal(false);

  private blobUrl: string | null = null;
  private landId = '';

  ngOnInit(): void {
    this.landId = this.route.snapshot.paramMap.get('id') || '';
    if (this.landId) {
      this.loadLandInfo();
      this.loadPreview();
    }
  }

  ngOnDestroy(): void {
    if (this.blobUrl) {
      window.URL.revokeObjectURL(this.blobUrl);
    }
  }

  loadLandInfo(): void {
    this.landService.getLandById(this.landId).subscribe(land => {
      this.land.set(land);
    });
  }

  loadPreview(): void {
    this.loadingPreview.set(true);
    this.previewUrl.set(null);

    this.reportService.getPreviewBlobUrl(this.landId).subscribe(url => {
      if (url) {
        this.blobUrl = url;
        this.previewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
      }
      this.loadingPreview.set(false);
    });
  }

  downloadPdf(): void {
    const land = this.land();
    const filename = land
      ? `rapport-sol-${land.address.commune}-${land.address.region}.pdf`
      : undefined;
    this.reportService.triggerDownload(this.landId, filename);
  }

  openInNewTab(): void {
    this.reportService.openPreview(this.landId);
  }

  goBack(): void {
    window.history.back();
  }
}
