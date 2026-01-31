import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { DEFAULT_API_CONFIG } from './api.config';
import {
  Mission,
  CreateMissionDto,
  UpdateMissionDto,
  FilterMissionsDto,
  MissionStatus
} from '../models/mission.model';
import { PaginatedResponse, DEFAULT_PAGE, DEFAULT_LIMIT } from '../models/pagination.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private http = inject(HttpClient);
  private apiUrl = `${DEFAULT_API_CONFIG.baseUrl}/missions`;

  // State signals
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  missions = signal<Mission[]>([]);
  totalCount = signal(0);
  currentPage = signal(DEFAULT_PAGE);
  totalPages = signal(0);

  /**
   * Get all missions with optional filters and pagination
   */
  getMissions(filters?: FilterMissionsDto): Observable<PaginatedResponse<Mission>> {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.technicianId) params = params.set('technicianId', filters.technicianId);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<PaginatedResponse<Mission>>(this.apiUrl, { params }).pipe(
      tap(response => {
        if (response.success) {
          this.missions.set(response.data);
          this.totalCount.set(response.total);
          this.currentPage.set(response.page);
          this.totalPages.set(response.totalPages);
        }
        this.loading.set(false);
      }),
      catchError(error => {
        console.error('Error fetching missions:', error);
        this.loading.set(false);
        // Mock data for development
        if (error.status === 404 || error.status === 0) {
          const mockResponse = this.getMockPaginatedResponse(filters);
          this.missions.set(mockResponse.data);
          this.totalCount.set(mockResponse.total);
          this.currentPage.set(mockResponse.page);
          this.totalPages.set(mockResponse.totalPages);
          return of(mockResponse);
        }
        this.error.set('Erreur lors du chargement des missions');
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
   * Get a mission by ID
   */
  getMissionById(id: string): Observable<Mission | null> {
    return this.http.get<ApiResponse<Mission>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.success ? response.data : null),
      catchError(error => {
        console.error('Error fetching mission:', error);
        return of(null);
      })
    );
  }

  /**
   * Get missions by technician ID
   */
  getMissionsByTechnician(technicianId: string): Observable<Mission[]> {
    return this.http.get<ApiResponse<Mission[]>>(`${this.apiUrl}/by-technician/${technicianId}`).pipe(
      map(response => response.success ? response.data : []),
      catchError(error => {
        console.error('Error fetching technician missions:', error);
        return of([]);
      })
    );
  }

  /**
   * Get mission by analysis request ID
   */
  getMissionByAnalysisRequest(analysisRequestId: string): Observable<Mission | null> {
    return this.http.get<ApiResponse<Mission>>(`${this.apiUrl}/by-analysis-request/${analysisRequestId}`).pipe(
      map(response => response.success ? response.data : null),
      catchError(error => {
        console.error('Error fetching mission by analysis request:', error);
        return of(null);
      })
    );
  }

  /**
   * Create a new mission (assign technician to analysis request)
   */
  createMission(data: CreateMissionDto): Observable<Mission | null> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<ApiResponse<Mission>>(this.apiUrl, data).pipe(
      map(response => {
        if (response.success) {
          this.success.set('Mission créée avec succès');
          return response.data;
        }
        throw new Error(response.message || 'Erreur lors de la création');
      }),
      tap(() => this.loading.set(false)),
      catchError(error => {
        console.error('Error creating mission:', error);
        this.loading.set(false);
        this.error.set(error.error?.message || 'Erreur lors de la création de la mission');
        return of(null);
      })
    );
  }

  /**
   * Update a mission
   */
  updateMission(id: string, data: UpdateMissionDto): Observable<Mission | null> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.patch<ApiResponse<Mission>>(`${this.apiUrl}/${id}`, data).pipe(
      map(response => {
        if (response.success) {
          this.success.set('Mission mise à jour avec succès');
          return response.data;
        }
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }),
      tap(() => this.loading.set(false)),
      catchError(error => {
        console.error('Error updating mission:', error);
        this.loading.set(false);
        this.error.set(error.message || 'Erreur lors de la mise à jour de la mission');
        return of(null);
      })
    );
  }

  /**
   * Update mission status
   */
  updateMissionStatus(id: string, status: MissionStatus): Observable<Mission | null> {
    return this.updateMission(id, { status });
  }

  /**
   * Complete a mission
   */
  completeMission(id: string, notes?: string): Observable<Mission | null> {
    return this.updateMission(id, {
      status: 'completed',
      completedDate: new Date().toISOString(),
      technicianNotes: notes
    });
  }

  /**
   * Cancel a mission
   */
  cancelMission(id: string): Observable<Mission | null> {
    return this.updateMission(id, { status: 'cancelled' });
  }

  /**
   * Delete a mission
   */
  deleteMission(id: string): Observable<boolean> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.success) {
          this.success.set('Mission supprimée avec succès');
          return true;
        }
        return false;
      }),
      tap(() => this.loading.set(false)),
      catchError(error => {
        console.error('Error deleting mission:', error);
        this.loading.set(false);
        this.error.set('Erreur lors de la suppression de la mission');
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

  private getMockMissions(): Mission[] {
    return [
      {
        _id: 'mission_1',
        analysisRequest: {
          _id: 'request_1',
          fullName: 'Amadou Diallo',
          email: 'amadou@email.com',
          phone: '+221 77 123 45 67',
          region: 'Thies',
          commune: 'Tivaouane',
          surface: 5.5,
          status: 'processing',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        technician: {
          _id: 'tech_1',
          fullName: 'Amadou Ba',
          email: 'amadou.ba@petalia.sn',
          phone: '+221 77 888 99 00',
          coverageRegions: ['Thies', 'Dakar'],
          status: 'active',
          completedMissions: 12,
          createdAt: new Date().toISOString()
        },
        assignedBy: {
          _id: 'admin_1',
          fullName: 'Admin User',
          email: 'admin@petalia.sn'
        },
        status: 'assigned',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        instructions: 'Prélever 3 échantillons à différents endroits',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'mission_2',
        analysisRequest: {
          _id: 'request_2',
          fullName: 'Fatou Sow',
          email: 'fatou@email.com',
          phone: '+221 78 234 56 78',
          region: 'Saint-Louis',
          commune: 'Richard-Toll',
          surface: 12,
          status: 'processing',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        technician: {
          _id: 'tech_2',
          fullName: 'Fatou Diop',
          email: 'fatou.diop@petalia.sn',
          phone: '+221 78 777 88 99',
          coverageRegions: ['Saint-Louis', 'Matam'],
          status: 'active',
          completedMissions: 8,
          createdAt: new Date().toISOString()
        },
        assignedBy: {
          _id: 'admin_1',
          fullName: 'Admin User',
          email: 'admin@petalia.sn'
        },
        status: 'in_progress',
        scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        instructions: 'Analyse complète du sol pour riziculture',
        technicianNotes: 'Échantillons prélevés, en cours d\'analyse',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'mission_3',
        analysisRequest: {
          _id: 'request_3',
          fullName: 'Moussa Ndiaye',
          email: 'moussa@email.com',
          phone: '+221 76 345 67 89',
          region: 'Kaolack',
          commune: 'Nioro du Rip',
          surface: 8,
          status: 'completed',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        technician: {
          _id: 'tech_3',
          fullName: 'Moussa Seck',
          email: 'moussa.seck@petalia.sn',
          phone: '+221 76 666 77 88',
          coverageRegions: ['Kaolack', 'Fatick'],
          status: 'on_leave',
          completedMissions: 15,
          createdAt: new Date().toISOString()
        },
        assignedBy: {
          _id: 'admin_1',
          fullName: 'Admin User',
          email: 'admin@petalia.sn'
        },
        status: 'completed',
        scheduledDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        completedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        technicianNotes: 'Analyse terminée. Sol de bonne qualité pour arachide.',
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  private getMockPaginatedResponse(filters?: FilterMissionsDto): PaginatedResponse<Mission> {
    let data = this.getMockMissions();

    // Apply filters
    if (filters?.status) {
      data = data.filter(m => m.status === filters.status);
    }
    if (filters?.technicianId) {
      data = data.filter(m => {
        const techId = typeof m.technician === 'string' ? m.technician : m.technician._id;
        return techId === filters.technicianId;
      });
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
