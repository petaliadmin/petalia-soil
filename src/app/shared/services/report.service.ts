import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';
import { DEFAULT_API_CONFIG } from './api.config';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = DEFAULT_API_CONFIG.baseUrl;

  loading = signal(false);
  error = signal<string | null>(null);

  /**
   * Get the full URL for a land report PDF
   */
  getReportPdfUrl(landId: string): string {
    return `${this.baseUrl}/lands/${landId}/report/pdf`;
  }

  /**
   * Download the PDF report for a land as a Blob
   */
  downloadReportPdf(landId: string): Observable<Blob | null> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get(this.getReportPdfUrl(landId), {
      responseType: 'blob'
    }).pipe(
      tap(() => this.loading.set(false)),
      catchError(error => {
        console.error('Error downloading report PDF:', error);
        this.loading.set(false);
        this.error.set('Erreur lors du telechargement du rapport');
        return of(null);
      })
    );
  }

  /**
   * Trigger a PDF download in the browser
   */
  triggerDownload(landId: string, filename?: string): void {
    this.downloadReportPdf(landId).subscribe(blob => {
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `rapport-sol-${landId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    });
  }

  /**
   * Open PDF preview in a new browser tab
   */
  openPreview(landId: string): void {
    this.downloadReportPdf(landId).subscribe(blob => {
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        // Revoke after a delay to allow the tab to load
        setTimeout(() => window.URL.revokeObjectURL(url), 60000);
      }
    });
  }

  /**
   * Get the blob URL for embedding in an iframe
   */
  getPreviewBlobUrl(landId: string): Observable<string | null> {
    return new Observable(subscriber => {
      this.downloadReportPdf(landId).subscribe(blob => {
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          subscriber.next(url);
        } else {
          subscriber.next(null);
        }
        subscriber.complete();
      });
    });
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.error.set(null);
  }
}
