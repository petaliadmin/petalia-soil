import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map, catchError, throwError } from 'rxjs';
import { Land, LandType, LandStatus } from '../models/land.model';
import { SoilParameters } from '../models/soil-parameters.model';
import { API_CONFIG, DEFAULT_API_CONFIG } from './api.config';

/**
 * Create/Update land DTO matching API expectations
 */
export interface CreateLandDto {
  title: string;
  description: string;
  surfaceHectares: number;
  type: LandType;
  price: number;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: {
    region: string;
    city: string;
    district?: string;
  };
  soilParameters: {
    ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    texture: string;
    moisture?: number;
    organicMatter?: number;
  };
  images?: string[];
}

export interface UpdateLandDto {
  title?: string;
  description?: string;
  price?: number;
  status?: LandStatus;
  isAvailable?: boolean;
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
   * Clear messages
   */
  clearMessages(): void {
    this.errorSignal.set(null);
    this.successSignal.set(null);
  }
}
