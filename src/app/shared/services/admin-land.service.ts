import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map, catchError, throwError } from 'rxjs';
import { Land, LandType, LandStatus } from '../models/land.model';
import { SoilTexture, DrainageQuality } from '../models/soil-parameters.model';
import { API_CONFIG, DEFAULT_API_CONFIG } from './api.config';

/**
 * DTO pour les coordonnées GeoJSON
 */
export interface LocationDto {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

/**
 * DTO pour l'adresse d'une terre
 */
export interface AddressDto {
  city: string;
  region: string;
  commune: string;
  village?: string;
  fullAddress?: string;
  country?: string;
}

/**
 * DTO pour les valeurs NPK
 */
export interface NPKDto {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

/**
 * DTO pour les paramètres du sol
 */
export interface SoilParametersDto {
  ph: number;
  npk: NPKDto;
  texture: SoilTexture;
  moisture: number;
  drainage: DrainageQuality;
  organicMatter?: number;
  salinity?: number;
  cec?: number;
}

/**
 * DTO pour créer une nouvelle terre
 */
export interface CreateLandDto {
  title: string;
  description: string;
  surfaceHectares: number;
  type: LandType;
  price: number;
  priceUnit?: string;
  location: LocationDto;
  address?: AddressDto;
  soilParameters?: SoilParametersDto;
  images?: string[];
}

/**
 * DTO pour mettre à jour une terre
 */
export interface UpdateLandDto {
  title?: string;
  description?: string;
  surfaceHectares?: number;
  type?: LandType;
  price?: number;
  priceUnit?: string;
  location?: LocationDto;
  address?: AddressDto;
  soilParameters?: SoilParametersDto;
  status?: LandStatus;
  images?: string[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminLandService {
  private http = inject(HttpClient);
  private config = inject(API_CONFIG, { optional: true }) ?? DEFAULT_API_CONFIG;

  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private successSignal = signal<string | null>(null);

  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly success = this.successSignal.asReadonly();

  /**
   * Create a new land listing
   */
  createLand(data: CreateLandDto): Observable<Land> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.successSignal.set(null);

    return this.http.post<ApiResponse<Land>>(
      `${this.config.baseUrl}/lands`,
      data
    ).pipe(
      map(response => {
        this.loadingSignal.set(false);
        if (response.success) {
          this.successSignal.set('Terre créée avec succès');
          return response.data;
        }
        throw new Error(response.message || 'Erreur lors de la création');
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        const message = error.error?.message || 'Erreur lors de la création de la terre';
        this.errorSignal.set(message);
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Update an existing land
   */
  updateLand(id: string, data: UpdateLandDto): Observable<Land> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.successSignal.set(null);

    return this.http.patch<ApiResponse<Land>>(
      `${this.config.baseUrl}/lands/${id}`,
      data
    ).pipe(
      map(response => {
        this.loadingSignal.set(false);
        if (response.success) {
          this.successSignal.set('Terre mise à jour avec succès');
          return response.data;
        }
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        const message = error.error?.message || 'Erreur lors de la mise à jour';
        this.errorSignal.set(message);
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Delete a land listing
   */
  deleteLand(id: string): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.successSignal.set(null);

    return this.http.delete<ApiResponse<void>>(
      `${this.config.baseUrl}/lands/${id}`
    ).pipe(
      map(response => {
        this.loadingSignal.set(false);
        this.successSignal.set('Terre supprimée avec succès');
        return;
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        const message = error.error?.message || 'Erreur lors de la suppression';
        this.errorSignal.set(message);
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Set success message
   */
  setSuccess(message: string): void {
    this.successSignal.set(message);
  }

  /**
   * Set error message
   */
  setError(message: string): void {
    this.errorSignal.set(message);
  }

  /**
   * Clear messages
   */
  clearMessages(): void {
    this.errorSignal.set(null);
    this.successSignal.set(null);
  }
}
