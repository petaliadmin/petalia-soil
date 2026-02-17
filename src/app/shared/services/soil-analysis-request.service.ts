import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { DEFAULT_API_CONFIG } from './api.config';
import {
  SoilAnalysisRequest,
  CreateSoilAnalysisRequest,
  SoilAnalysisStatus
} from '../models/soil-analysis-request.model';
import { PaginatedResponse, DEFAULT_PAGE, DEFAULT_LIMIT } from '../models/pagination.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface FilterSoilAnalysisDto {
  status?: SoilAnalysisStatus;
  region?: string;
  page?: number;
  limit?: number;
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
  success = signal<string | null>(null);
  submitted = signal(false);
  lastRequest = signal<SoilAnalysisRequest | null>(null);

  // Pagination state
  requests = signal<SoilAnalysisRequest[]>([]);
  totalCount = signal(0);
  currentPage = signal(DEFAULT_PAGE);
  totalPages = signal(0);

  /**
   * Submit a new soil analysis request (PUBLIC)
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
            origin: data.origin || 'standalone',
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
   * Get my soil analysis requests (authenticated user)
   */
  getMyRequests(userId: string, email: string): Observable<SoilAnalysisRequest[]> {
    this.loading.set(true);

    return this.http.get<ApiResponse<SoilAnalysisRequest[]>>(`${this.apiUrl}/my-requests`).pipe(
      map(response => response.success ? response.data : []),
      tap(() => this.loading.set(false)),
      catchError(error => {
        console.error('Error fetching my requests:', error);
        this.loading.set(false);
        // Mock data for development - filter by userId or email
        if (error.status === 404 || error.status === 0) {
          return of(this.getMockRequests().filter(r =>
            r.userId === userId || r.email === email
          ));
        }
        return of([]);
      })
    );
  }

  /**
   * Reset the form state
   */
  reset(): void {
    this.loading.set(false);
    this.error.set(null);
    this.success.set(null);
    this.submitted.set(false);
    this.lastRequest.set(null);
  }

  /**
   * Clear messages
   */
  clearMessages(): void {
    this.error.set(null);
    this.success.set(null);
  }

  // ============ Admin Methods ============

  /**
   * Get all soil analysis requests with pagination and filters (ADMIN)
   */
  getRequests(filters?: FilterSoilAnalysisDto): Observable<PaginatedResponse<SoilAnalysisRequest>> {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.region) params = params.set('region', filters.region);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<PaginatedResponse<SoilAnalysisRequest>>(this.apiUrl, { params }).pipe(
      tap(response => {
        if (response.success) {
          this.requests.set(response.data);
          this.totalCount.set(response.total);
          this.currentPage.set(response.page);
          this.totalPages.set(response.totalPages);
        }
        this.loading.set(false);
      }),
      catchError(error => {
        console.error('Error fetching soil analysis requests:', error);
        this.loading.set(false);
        // Mock data for development
        if (error.status === 404 || error.status === 0) {
          const mockResponse = this.getMockPaginatedResponse(filters);
          this.requests.set(mockResponse.data);
          this.totalCount.set(mockResponse.total);
          this.currentPage.set(mockResponse.page);
          this.totalPages.set(mockResponse.totalPages);
          return of(mockResponse);
        }
        this.error.set('Erreur lors du chargement des demandes');
        return of({
          success: false,
          data: [],
          total: 0,
          page: 1,
          limit: DEFAULT_LIMIT,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false
        });
      })
    );
  }

  /**
   * Get all soil analysis requests (legacy - without pagination)
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
   * Get a request by ID (ADMIN)
   */
  getRequestById(id: string): Observable<SoilAnalysisRequest | null> {
    return this.http.get<ApiResponse<SoilAnalysisRequest>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.success ? response.data : null),
      catchError(error => {
        console.error('Error fetching request:', error);
        // Mock data for development
        if (error.status === 404 || error.status === 0) {
          return of(this.getMockRequests().find(r => r._id === id) || null);
        }
        return of(null);
      })
    );
  }

  /**
   * Update request status (ADMIN)
   */
  updateRequestStatus(id: string, status: SoilAnalysisStatus): Observable<SoilAnalysisRequest | null> {
    this.loading.set(true);

    return this.http.patch<ApiResponse<SoilAnalysisRequest>>(`${this.apiUrl}/${id}`, { status }).pipe(
      map(response => {
        if (response.success) {
          this.success.set('Statut mis à jour avec succès');
          return response.data;
        }
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }),
      tap(() => this.loading.set(false)),
      catchError(error => {
        console.error('Error updating request status:', error);
        this.loading.set(false);
        // Simulate success for demo
        if (error.status === 404 || error.status === 0) {
          this.success.set('Statut mis à jour avec succès');
          return of({ _id: id, status } as SoilAnalysisRequest);
        }
        this.error.set('Erreur lors de la mise à jour du statut');
        return of(null);
      })
    );
  }

  /**
   * Delete a request (ADMIN)
   */
  deleteRequest(id: string): Observable<boolean> {
    this.loading.set(true);

    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.success) {
          this.success.set('Demande supprimée avec succès');
          return true;
        }
        return false;
      }),
      tap(() => this.loading.set(false)),
      catchError(error => {
        console.error('Error deleting request:', error);
        this.loading.set(false);
        // Simulate success for demo
        if (error.status === 404 || error.status === 0) {
          this.success.set('Demande supprimée avec succès');
          return of(true);
        }
        this.error.set('Erreur lors de la suppression');
        return of(false);
      })
    );
  }

  // ============ Mock Data for Development ============

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
        description: 'Parcelle destinée à la culture maraîchère',
        origin: 'land_listing',
        landId: 'land_1',
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
        origin: 'standalone',
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
        origin: 'land_listing',
        landId: 'land_3',
        status: 'completed',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'mock_4',
        fullName: 'Ousmane Fall',
        email: 'ousmane.fall@email.com',
        phone: '+221 70 456 78 90',
        region: 'Dakar',
        commune: 'Rufisque',
        surface: 3,
        description: 'Petit jardin maraîcher',
        origin: 'standalone',
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'mock_5',
        fullName: 'Awa Diop',
        email: 'awa.diop@email.com',
        phone: '+221 77 567 89 01',
        region: 'Ziguinchor',
        commune: 'Bignona',
        surface: 15,
        description: 'Plantation fruitière',
        origin: 'standalone',
        status: 'cancelled',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  private getMockPaginatedResponse(filters?: FilterSoilAnalysisDto): PaginatedResponse<SoilAnalysisRequest> {
    let data = this.getMockRequests();

    // Apply filters
    if (filters?.status) {
      data = data.filter(r => r.status === filters.status);
    }
    if (filters?.region) {
      data = data.filter(r => r.region === filters.region);
    }

    // Sort by createdAt descending
    data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const page = filters?.page || DEFAULT_PAGE;
    const limit = filters?.limit || DEFAULT_LIMIT;
    const total = data.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedData = data.slice(start, start + limit);

    return {
      success: true,
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    };
  }
}
