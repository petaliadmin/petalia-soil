import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay, map, catchError } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  Land,
  LandSummary,
  LandFilters,
  NearbySearchParams,
  CropRecommendation
} from '../models/land.model';
import { getLatitude, getLongitude } from '../models/location.model';
import { API_CONFIG, DEFAULT_API_CONFIG } from './api.config';
import { MOCK_LANDS, getUniqueRegions, getUniqueCrops } from './mock-data';

/**
 * Response structure from API
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LandService {
  private http = inject(HttpClient);
  private config = inject(API_CONFIG, { optional: true }) ?? DEFAULT_API_CONFIG;

  // Reactive state with signals
  private landsSignal = signal<Land[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private selectedLandSignal = signal<Land | null>(null);
  private filtersSignal = signal<LandFilters>({});

  // Public readonly signals
  readonly lands = this.landsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly selectedLand = this.selectedLandSignal.asReadonly();
  readonly filters = this.filtersSignal.asReadonly();

  // Computed signals
  readonly filteredLands = computed(() => {
    const allLands = this.landsSignal();
    const currentFilters = this.filtersSignal();
    return this.applyFilters(allLands, currentFilters);
  });

  readonly availableRegions = signal<string[]>(getUniqueRegions());
  readonly availableCrops = signal<string[]>(getUniqueCrops());

  readonly landsCount = computed(() => this.filteredLands().length);

  readonly rentLands = computed(() =>
    this.filteredLands().filter(l => l.type === 'RENT')
  );

  readonly saleLands = computed(() =>
    this.filteredLands().filter(l => l.type === 'SALE')
  );

  /**
   * Load all available lands
   */
  loadLands(): Observable<Land[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    if (this.config.useMockData) {
      return of(MOCK_LANDS).pipe(
        delay(500), // Simulate network delay
        map(lands => {
          this.landsSignal.set(lands);
          this.loadingSignal.set(false);
          return lands;
        })
      );
    }

    return this.http.get<ApiResponse<Land[]>>(`${this.config.baseUrl}/lands`).pipe(
      map(response => {
        this.landsSignal.set(response.data);
        this.loadingSignal.set(false);
        return response.data;
      }),
      catchError(error => {
        this.errorSignal.set('Erreur lors du chargement des terres');
        this.loadingSignal.set(false);
        console.error('Error loading lands:', error);
        return of([]);
      })
    );
  }

  /**
   * Get a single land by ID
   */
  getLandById(id: string): Observable<Land | null> {
    this.loadingSignal.set(true);

    if (this.config.useMockData) {
      const land = MOCK_LANDS.find(l => l._id === id) || null;
      return of(land).pipe(
        delay(300),
        map(l => {
          this.selectedLandSignal.set(l);
          this.loadingSignal.set(false);
          return l;
        })
      );
    }

    return this.http.get<ApiResponse<Land>>(`${this.config.baseUrl}/lands/${id}`).pipe(
      map(response => {
        this.selectedLandSignal.set(response.data);
        this.loadingSignal.set(false);
        return response.data;
      }),
      catchError(error => {
        this.errorSignal.set('Terre non trouvée');
        this.loadingSignal.set(false);
        console.error('Error loading land:', error);
        return of(null);
      })
    );
  }

  /**
   * Search lands nearby a location
   */
  searchNearby(params: NearbySearchParams): Observable<Land[]> {
    this.loadingSignal.set(true);

    if (this.config.useMockData) {
      // Simple distance calculation for mock data
      const filtered = MOCK_LANDS.filter(land => {
        const distance = this.calculateDistance(
          params.latitude,
          params.longitude,
          getLatitude(land.location),
          getLongitude(land.location)
        );
        return distance <= params.radiusKm;
      });

      return of(filtered).pipe(
        delay(400),
        map(lands => {
          this.loadingSignal.set(false);
          return this.applyFilters(lands, params.filters || {});
        })
      );
    }

    const httpParams = new HttpParams()
      .set('latitude', params.latitude.toString())
      .set('longitude', params.longitude.toString())
      .set('radius', params.radiusKm.toString());

    return this.http.get<ApiResponse<Land[]>>(
      `${this.config.baseUrl}/lands/nearby`,
      { params: httpParams }
    ).pipe(
      map(response => {
        this.loadingSignal.set(false);
        return response.data;
      }),
      catchError(error => {
        this.errorSignal.set('Erreur lors de la recherche');
        this.loadingSignal.set(false);
        return of([]);
      })
    );
  }

  /**
   * Get crop recommendations for a land
   */
  getRecommendations(landId: string): Observable<CropRecommendation[]> {
    if (this.config.useMockData) {
      const land = MOCK_LANDS.find(l => l._id === landId);
      return of(land?.recommendedCrops || []).pipe(delay(200));
    }

    return this.http.get<ApiResponse<CropRecommendation[]>>(
      `${this.config.baseUrl}/lands/${landId}/recommendations`
    ).pipe(
      map(response => response.data),
      catchError(() => of([]))
    );
  }

  /**
   * Update filters
   */
  setFilters(filters: LandFilters): void {
    this.filtersSignal.set(filters);
  }

  /**
   * Update a single filter
   */
  updateFilter<K extends keyof LandFilters>(key: K, value: LandFilters[K]): void {
    this.filtersSignal.update(current => ({
      ...current,
      [key]: value
    }));
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.filtersSignal.set({});
  }

  /**
   * Clear selected land
   */
  clearSelectedLand(): void {
    this.selectedLandSignal.set(null);
  }

  /**
   * Apply filters to lands array
   */
  private applyFilters(lands: Land[], filters: LandFilters): Land[] {
    return lands.filter(land => {
      // Type filter
      if (filters.type && land.type !== filters.type) {
        return false;
      }

      // Surface filters
      if (filters.minSurface && land.surface < filters.minSurface) {
        return false;
      }
      if (filters.maxSurface && land.surface > filters.maxSurface) {
        return false;
      }

      // Price filters
      if (filters.minPrice && land.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && land.price > filters.maxPrice) {
        return false;
      }

      // pH filters
      if (filters.minPh && land.soilParameters.ph < filters.minPh) {
        return false;
      }
      if (filters.maxPh && land.soilParameters.ph > filters.maxPh) {
        return false;
      }

      // Texture filter
      if (filters.texture?.length && !filters.texture.includes(land.soilParameters.texture)) {
        return false;
      }

      // Region filter
      if (filters.region && land.address.region !== filters.region) {
        return false;
      }

      // Recommended crop filter
      if (filters.recommendedCrop) {
        const hasCrop = land.recommendedCrops?.some(
          c => c.name.toLowerCase() === filters.recommendedCrop!.toLowerCase()
        );
        if (!hasCrop) return false;
      }

      // Status filter
      if (filters.status && land.status !== filters.status) {
        return false;
      }

      return true;
    });
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(
    lat1: number, lon1: number,
    lat2: number, lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
