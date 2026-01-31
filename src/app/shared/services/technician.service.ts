import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { DEFAULT_API_CONFIG } from './api.config';
import {
  Technician,
  CreateTechnicianDto,
  UpdateTechnicianDto,
  FilterTechniciansDto,
  TechnicianStatus
} from '../models/technician.model';
import { PaginatedResponse, DEFAULT_PAGE, DEFAULT_LIMIT } from '../models/pagination.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TechnicianService {
  private http = inject(HttpClient);
  private apiUrl = `${DEFAULT_API_CONFIG.baseUrl}/technicians`;

  // State signals
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  technicians = signal<Technician[]>([]);
  totalCount = signal(0);
  currentPage = signal(DEFAULT_PAGE);
  totalPages = signal(0);

  /**
   * Get all technicians with optional filters and pagination
   */
  getTechnicians(filters?: FilterTechniciansDto): Observable<PaginatedResponse<Technician>> {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.region) params = params.set('region', filters.region);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<PaginatedResponse<Technician>>(this.apiUrl, { params }).pipe(
      tap(response => {
        if (response.success) {
          this.technicians.set(response.data);
          this.totalCount.set(response.total);
          this.currentPage.set(response.page);
          this.totalPages.set(response.totalPages);
        }
        this.loading.set(false);
      }),
      catchError(error => {
        console.error('Error fetching technicians:', error);
        this.loading.set(false);
        // Mock data for development
        if (error.status === 404 || error.status === 0) {
          const mockResponse = this.getMockPaginatedResponse(filters);
          this.technicians.set(mockResponse.data);
          this.totalCount.set(mockResponse.total);
          this.currentPage.set(mockResponse.page);
          this.totalPages.set(mockResponse.totalPages);
          return of(mockResponse);
        }
        this.error.set('Erreur lors du chargement des techniciens');
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
   * Get available technicians for a specific region
   */
  getAvailableTechnicians(region: string): Observable<Technician[]> {
    this.loading.set(true);

    return this.http.get<ApiResponse<Technician[]>>(`${this.apiUrl}/available`, {
      params: new HttpParams().set('region', region)
    }).pipe(
      map(response => response.success ? response.data : []),
      tap(() => this.loading.set(false)),
      catchError(error => {
        console.error('Error fetching available technicians:', error);
        this.loading.set(false);
        // Mock data for development
        if (error.status === 404 || error.status === 0) {
          return of(this.getMockTechnicians().filter(t =>
            t.status === 'active' && t.coverageRegions.includes(region)
          ));
        }
        return of([]);
      })
    );
  }

  /**
   * Get a technician by ID
   */
  getTechnicianById(id: string): Observable<Technician | null> {
    return this.http.get<ApiResponse<Technician>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.success ? response.data : null),
      catchError(error => {
        console.error('Error fetching technician:', error);
        // Mock data for development
        if (error.status === 404 || error.status === 0) {
          return of(this.getMockTechnicians().find(t => t._id === id) || null);
        }
        return of(null);
      })
    );
  }

  /**
   * Create a new technician
   */
  createTechnician(data: CreateTechnicianDto): Observable<Technician | null> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<ApiResponse<Technician>>(this.apiUrl, data).pipe(
      map(response => {
        if (response.success) {
          this.success.set('Technicien créé avec succès');
          return response.data;
        }
        throw new Error(response.message || 'Erreur lors de la création');
      }),
      tap(() => this.loading.set(false)),
      catchError(error => {
        console.error('Error creating technician:', error);
        this.loading.set(false);
        if (error.status === 409) {
          this.error.set('Cet email est déjà utilisé');
        } else {
          this.error.set(error.message || 'Erreur lors de la création du technicien');
        }
        return of(null);
      })
    );
  }

  /**
   * Update a technician
   */
  updateTechnician(id: string, data: UpdateTechnicianDto): Observable<Technician | null> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.patch<ApiResponse<Technician>>(`${this.apiUrl}/${id}`, data).pipe(
      map(response => {
        if (response.success) {
          this.success.set('Technicien mis à jour avec succès');
          return response.data;
        }
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }),
      tap(() => this.loading.set(false)),
      catchError(error => {
        console.error('Error updating technician:', error);
        this.loading.set(false);
        this.error.set(error.message || 'Erreur lors de la mise à jour du technicien');
        return of(null);
      })
    );
  }

  /**
   * Delete a technician
   */
  deleteTechnician(id: string): Observable<boolean> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.success) {
          this.success.set('Technicien supprimé avec succès');
          return true;
        }
        return false;
      }),
      tap(() => this.loading.set(false)),
      catchError(error => {
        console.error('Error deleting technician:', error);
        this.loading.set(false);
        this.error.set('Erreur lors de la suppression du technicien');
        return of(false);
      })
    );
  }

  /**
   * Clear messages
   */
  clearMessages(): void {
    this.error.set(null);
    this.success.set(null);
  }

  // ============ Mock Data for Development ============

  private getMockTechnicians(): Technician[] {
    return [
      {
        _id: 'tech_1',
        fullName: 'Amadou Ba',
        email: 'amadou.ba@petalia.sn',
        phone: '+221 77 888 99 00',
        whatsapp: '+221 77 888 99 00',
        specialization: 'Analyse de sol et fertilisation',
        coverageRegions: ['Thies', 'Dakar', 'Diourbel'],
        status: 'active',
        completedMissions: 12,
        notes: 'Expert en arachide',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'tech_2',
        fullName: 'Fatou Diop',
        email: 'fatou.diop@petalia.sn',
        phone: '+221 78 777 88 99',
        specialization: 'Cultures maraîchères',
        coverageRegions: ['Saint-Louis', 'Matam', 'Louga'],
        status: 'active',
        completedMissions: 8,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'tech_3',
        fullName: 'Moussa Seck',
        email: 'moussa.seck@petalia.sn',
        phone: '+221 76 666 77 88',
        specialization: 'Riziculture',
        coverageRegions: ['Kaolack', 'Fatick', 'Kaffrine'],
        status: 'on_leave',
        completedMissions: 15,
        notes: 'En congé jusqu\'au 15 février',
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'tech_4',
        fullName: 'Ousmane Ndiaye',
        email: 'ousmane.ndiaye@petalia.sn',
        phone: '+221 70 555 66 77',
        specialization: 'Arboriculture fruitière',
        coverageRegions: ['Ziguinchor', 'Kolda', 'Sedhiou'],
        status: 'active',
        completedMissions: 6,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  private getMockPaginatedResponse(filters?: FilterTechniciansDto): PaginatedResponse<Technician> {
    let data = this.getMockTechnicians();

    // Apply filters
    if (filters?.status) {
      data = data.filter(t => t.status === filters.status);
    }
    if (filters?.region) {
      data = data.filter(t => t.coverageRegions.includes(filters.region!));
    }

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
