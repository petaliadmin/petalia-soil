import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { DEFAULT_API_CONFIG } from './api.config';
import {
  SoilAnalysisRequest,
  CreateSoilAnalysisRequest,
  SoilAnalysisStatus
} from '../models/soil-analysis-request.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SoilAnalysisRequestService {
  private http = inject(HttpClient);
  private apiUrl = `${DEFAULT_API_CONFIG.baseUrl}/soil-analysis-requests`;

  // State signals
  loading = signal(false);
  error = signal<string | null>(null);
  submitted = signal(false);
  lastRequest = signal<SoilAnalysisRequest | null>(null);

  /**
   * Submit a new soil analysis request
   */
  submitRequest(data: CreateSoilAnalysisRequest): Observable<SoilAnalysisRequest | null> {
    this.loading.set(true);
    this.error.set(null);
    this.submitted.set(false);

    return this.http.post<ApiResponse<SoilAnalysisRequest>>(this.apiUrl, data).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Erreur lors de la soumission');
      }),
      tap(request => {
        this.lastRequest.set(request);
        this.submitted.set(true);
        this.loading.set(false);
      }),
      catchError(error => {
        console.error('Error submitting soil analysis request:', error);
        // If API doesn't exist yet, simulate success for demo
        if (error.status === 404 || error.status === 0) {
          const mockRequest: SoilAnalysisRequest = {
            _id: 'mock_' + Date.now(),
            ...data,
            status: 'pending',
            createdAt: new Date().toISOString()
          };
          this.lastRequest.set(mockRequest);
          this.submitted.set(true);
          this.loading.set(false);
          return of(mockRequest);
        }
        this.error.set(error.message || 'Une erreur est survenue');
        this.loading.set(false);
        return of(null);
      })
    );
  }

  /**
   * Reset the form state
   */
  reset(): void {
    this.loading.set(false);
    this.error.set(null);
    this.submitted.set(false);
    this.lastRequest.set(null);
  }

  // ============ Admin Methods ============

  /**
   * Get all soil analysis requests (admin)
   */
  getAllRequests(): Observable<SoilAnalysisRequest[]> {
    return this.http.get<ApiResponse<SoilAnalysisRequest[]>>(this.apiUrl).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Erreur lors du chargement');
      }),
      catchError(error => {
        console.error('Error fetching soil analysis requests:', error);
        // Mock data for development
        if (error.status === 404 || error.status === 0) {
          return of(this.getMockRequests());
        }
        return of([]);
      })
    );
  }

  /**
   * Update request status (admin)
   */
  updateRequestStatus(id: string, status: SoilAnalysisStatus): Observable<SoilAnalysisRequest | null> {
    return this.http.patch<ApiResponse<SoilAnalysisRequest>>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }),
      catchError(error => {
        console.error('Error updating request status:', error);
        // Simulate success for demo
        if (error.status === 404 || error.status === 0) {
          return of({ _id: id, status } as SoilAnalysisRequest);
        }
        return of(null);
      })
    );
  }

  /**
   * Delete a request (admin)
   */
  deleteRequest(id: string): Observable<boolean> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.success),
      catchError(error => {
        console.error('Error deleting request:', error);
        // Simulate success for demo
        if (error.status === 404 || error.status === 0) {
          return of(true);
        }
        return of(false);
      })
    );
  }

  /**
   * Mock data for development
   */
  private getMockRequests(): SoilAnalysisRequest[] {
    return [
      {
        _id: 'mock_1',
        fullName: 'Amadou Diallo',
        email: 'amadou.diallo@email.com',
        phone: '+221 77 123 45 67',
        region: 'Thies',
        commune: 'Tivaouane',
        surface: 5.5,
        description: 'Parcelle destinee a la culture maraichere',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'mock_2',
        fullName: 'Fatou Sow',
        email: 'fatou.sow@email.com',
        phone: '+221 78 234 56 78',
        region: 'Saint-Louis',
        commune: 'Richard-Toll',
        surface: 12,
        description: 'Terrain pour riziculture',
        status: 'processing',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'mock_3',
        fullName: 'Moussa Ndiaye',
        email: 'moussa.ndiaye@email.com',
        phone: '+221 76 345 67 89',
        region: 'Kaolack',
        commune: 'Nioro du Rip',
        surface: 8,
        status: 'completed',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }
}
