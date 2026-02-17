import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay, map, catchError } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  Land,
  LandSummary,
  LandFilters,
  NearbySearchParams,
  CropRecommendation,
  LandStatus
} from '../models/land.model';
import { getLatitude, getLongitude } from '../models/location.model';
import { SoilParameters, SoilTexture, DrainageQuality } from '../models/soil-parameters.model';
import { API_CONFIG, DEFAULT_API_CONFIG } from './api.config';
import { MOCK_LANDS, getUniqueRegions, getUniqueCrops } from './mock-data';

/**
 * Response structure from API (actual format from petalia-soil-api)
 */
interface ApiListResponse<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Single item response (may be direct data or wrapped)
 */
interface ApiSingleResponse<T> {
  data?: T;
  success?: boolean;
}

/**
 * Raw land data from API (before transformation)
 */
interface ApiLandRaw {
  _id: string;
  title: string;
  description: string;
  surface?: number;
  surfaceHectares?: number;
  type: 'RENT' | 'SALE';
  price: number;
  priceUnit?: string;
  isAvailable?: boolean;
  status?: LandStatus;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  address?: {
    region?: string;
    city?: string;
    commune?: string;
    village?: string;
    fullAddress?: string;
    country?: string;
  };
  region?: string;
  city?: string;
  soilParameters?: {
    ph: number;
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
    npk?: {
      nitrogen: number;
      phosphorus: number;
      potassium: number;
    };
    texture: string;
    moisture: number;
    organicMatter?: number;
    drainage?: string;
    salinity?: number;
    cec?: number;
  };
  recommendedCrops?: CropRecommendation[];
  cultureHistory?: any[];
  owner: any;
  images?: string[];
  thumbnail?: string;
  views?: number;
  favorites?: number;
  createdAt: string;
  updatedAt: string;
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

    return this.http.get<ApiListResponse<ApiLandRaw[]>>(`${this.config.baseUrl}/lands`).pipe(
      map(response => {
        const rawData = response.data ?? [];
        const lands = this.transformApiLands(rawData);
        this.landsSignal.set(lands);
        this.loadingSignal.set(false);
        return lands;
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

    return this.http.get<ApiLandRaw | ApiSingleResponse<ApiLandRaw>>(`${this.config.baseUrl}/lands/${id}`).pipe(
      map(response => {
        // Handle both direct response and wrapped response formats
        const rawData = 'data' in response && response.data ? response.data : response as ApiLandRaw;
        const land = this.transformApiLand(rawData);
        this.selectedLandSignal.set(land);
        this.loadingSignal.set(false);
        return land;
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
        if (!land.location) return false;
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

    return this.http.get<ApiListResponse<ApiLandRaw[]>>(
      `${this.config.baseUrl}/lands/nearby`,
      { params: httpParams }
    ).pipe(
      map(response => {
        this.loadingSignal.set(false);
        const rawData = response.data ?? [];
        return this.transformApiLands(rawData);
      }),
      catchError(error => {
        this.errorSignal.set('Erreur lors de la recherche');
        this.loadingSignal.set(false);
        return of([]);
      })
    );
  }

  /**
   * Get lands owned by the current authenticated user
   * Uses GET /lands/my-lands endpoint
   */
  getMyLands(): Observable<Land[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    if (this.config.useMockData) {
      // In mock mode, return all lands (no owner filtering)
      return of(MOCK_LANDS).pipe(
        delay(500),
        map(lands => {
          this.loadingSignal.set(false);
          return lands;
        })
      );
    }

    return this.http.get<ApiListResponse<ApiLandRaw[]> | ApiLandRaw[]>(
      `${this.config.baseUrl}/lands/my-lands`
    ).pipe(
      map(response => {
        // Handle both wrapped and direct array response
        const rawData = Array.isArray(response) ? response : (response.data ?? []);
        const lands = this.transformApiLands(rawData);
        this.loadingSignal.set(false);
        return lands;
      }),
      catchError(error => {
        this.errorSignal.set('Erreur lors du chargement de vos terres');
        this.loadingSignal.set(false);
        console.error('Error loading my lands:', error);
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

    return this.http.get<CropRecommendation[] | ApiListResponse<CropRecommendation[]>>(
      `${this.config.baseUrl}/lands/${landId}/recommendations`
    ).pipe(
      map(response => {
        // Handle both direct array and wrapped response formats
        if (Array.isArray(response)) {
          return response;
        }
        return response.data ?? [];
      }),
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
   * Update land status (AVAILABLE, PENDING, SOLD, RENTED)
   */
  updateLandStatus(landId: string, status: LandStatus): Observable<Land | null> {
    if (this.config.useMockData) {
      // Update local state for mock
      this.landsSignal.update(lands =>
        lands.map(land =>
          land._id === landId ? { ...land, status } : land
        )
      );
      const updatedLand = this.landsSignal().find(l => l._id === landId) || null;
      return of(updatedLand).pipe(delay(300));
    }

    return this.http.patch<ApiSingleResponse<ApiLandRaw>>(
      `${this.config.baseUrl}/lands/${landId}`,
      { status }
    ).pipe(
      map(response => {
        const rawData = response.data ?? response as unknown as ApiLandRaw;
        const land = this.transformApiLand(rawData);
        // Update local state
        this.landsSignal.update(lands =>
          lands.map(l => l._id === landId ? land : l)
        );
        if (this.selectedLandSignal()?._id === landId) {
          this.selectedLandSignal.set(land);
        }
        return land;
      }),
      catchError(error => {
        console.error('Error updating land status:', error);
        this.errorSignal.set('Erreur lors de la mise à jour du statut');
        return of(null);
      })
    );
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
      if (filters.minPh && land.soilParameters && land.soilParameters.ph < filters.minPh) {
        return false;
      }
      if (filters.maxPh && land.soilParameters && land.soilParameters.ph > filters.maxPh) {
        return false;
      }

      // Texture filter
      if (filters.texture?.length && land.soilParameters && !filters.texture.includes(land.soilParameters.texture)) {
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

  /**
   * Transform raw API data to frontend Land model
   */
  private transformApiLand(raw: ApiLandRaw): Land {
    // Handle status - convert from isAvailable boolean if needed
    let status: LandStatus = 'AVAILABLE';
    if (raw.status) {
      status = raw.status;
    } else if (raw.isAvailable !== undefined) {
      status = raw.isAvailable ? 'AVAILABLE' : 'SOLD';
    }

    // Handle surface - support both 'surface' and 'surfaceHectares' fields
    const surface = raw.surface ?? raw.surfaceHectares ?? 0;

    // Default soil parameters
    const defaultSoilParams = {
      ph: 7,
      npk: { nitrogen: 0, phosphorus: 0, potassium: 0 },
      texture: 'loamy' as SoilTexture,
      moisture: 50,
      drainage: 'good' as DrainageQuality
    };

    // Build soil parameters if available
    let soilParameters: SoilParameters = defaultSoilParams;
    if (raw.soilParameters) {
      // Handle NPK - convert from flat fields to nested object if needed
      const npk = raw.soilParameters.npk ?? {
        nitrogen: raw.soilParameters.nitrogen ?? 0,
        phosphorus: raw.soilParameters.phosphorus ?? 0,
        potassium: raw.soilParameters.potassium ?? 0
      };

      // Normalize texture to lowercase (backend uses lowercase enum values)
      const texture = (raw.soilParameters.texture?.toLowerCase() ?? 'loamy') as SoilTexture;

      // Normalize drainage to lowercase
      const drainage = (raw.soilParameters.drainage?.toLowerCase() ?? 'good') as DrainageQuality;

      soilParameters = {
        ph: raw.soilParameters.ph ?? 7,
        npk,
        texture,
        moisture: raw.soilParameters.moisture ?? 50,
        organicMatter: raw.soilParameters.organicMatter,
        drainage,
        salinity: raw.soilParameters.salinity,
        cec: raw.soilParameters.cec
      };
    }

    // Handle address - build from flat fields if nested address not available
    const address = {
      region: raw.address?.region ?? raw.region ?? 'Non spécifié',
      city: raw.address?.city ?? raw.city ?? '',
      commune: raw.address?.commune ?? raw.address?.city ?? '',
      village: raw.address?.village,
      fullAddress: raw.address?.fullAddress ?? `${raw.city ?? ''}, ${raw.region ?? ''}`,
      country: raw.address?.country ?? 'Sénégal'
    };

    return {
      _id: raw._id,
      title: raw.title,
      description: raw.description,
      surface,
      type: raw.type,
      price: raw.price,
      priceUnit: raw.priceUnit ?? 'FCFA',
      pricePerHectare: surface > 0 ? Math.round(raw.price / surface) : undefined,
      status,
      location: raw.location,
      address,
      soilParameters,
      recommendedCrops: raw.recommendedCrops ?? [],
      cultureHistory: raw.cultureHistory ?? [],
      owner: raw.owner,
      images: raw.images ?? [],
      thumbnail: raw.thumbnail,
      views: raw.views ?? 0,
      favorites: raw.favorites ?? 0,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    };
  }

  /**
   * Transform array of raw API lands
   */
  private transformApiLands(rawLands: ApiLandRaw[]): Land[] {
    return rawLands.map(raw => this.transformApiLand(raw));
  }
}
