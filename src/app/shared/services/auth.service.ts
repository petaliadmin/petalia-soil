import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  AuthUser,
  AuthState,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  isTokenExpired,
  isAdmin,
  isOwner
} from '../models/auth.model';
import { API_CONFIG, DEFAULT_API_CONFIG } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private config = inject(API_CONFIG, { optional: true }) ?? DEFAULT_API_CONFIG;
  private platformId = inject(PLATFORM_ID);

  // Reactive state
  private userSignal = signal<AuthUser | null>(null);
  private tokenSignal = signal<string | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Public readonly signals
  readonly user = this.userSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  // Computed signals
  readonly isAuthenticated = computed(() => {
    const token = this.tokenSignal();
    return token !== null && !isTokenExpired(token);
  });

  readonly isAdmin = computed(() => isAdmin(this.userSignal()));
  readonly isOwner = computed(() => isOwner(this.userSignal()));

  readonly authState = computed<AuthState>(() => ({
    user: this.userSignal(),
    token: this.tokenSignal(),
    isAuthenticated: this.isAuthenticated(),
    isLoading: this.loadingSignal(),
    error: this.errorSignal()
  }));

  constructor() {
    this.loadStoredAuth();
  }

  /**
   * Load authentication from localStorage
   */
  private loadStoredAuth(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedUser = localStorage.getItem(AUTH_USER_KEY);

      if (storedToken && storedUser && !isTokenExpired(storedToken)) {
        this.tokenSignal.set(storedToken);
        this.userSignal.set(JSON.parse(storedUser));
      } else {
        this.clearStoredAuth();
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      this.clearStoredAuth();
    }
  }

  /**
   * Store authentication data
   */
  private storeAuth(token: string, user: AuthUser): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear stored authentication
   */
  private clearStoredAuth(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }

  /**
   * Login user
   */
  login(credentials: LoginCredentials): Observable<AuthUser> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post<AuthResponse>(
      `${this.config.baseUrl}/auth/login`,
      credentials
    ).pipe(
      map(response => {
        console.log(response)
        if (response.success && response.data) {
          const { access_token, user } = response.data;
          this.tokenSignal.set(access_token);
          this.userSignal.set(user);
          this.storeAuth(access_token, user);
          this.loadingSignal.set(false);
          return user;
        }
        throw new Error(response.message || 'Échec de la connexion');
      }),
      catchError((error: HttpErrorResponse) => {
        const message = this.getErrorMessage(error);
        this.errorSignal.set(message);
        this.loadingSignal.set(false);
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Register new user
   */
  register(data: RegisterData): Observable<AuthUser> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post<AuthResponse>(
      `${this.config.baseUrl}/auth/register`,
      data
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          const { access_token, user } = response.data;
          this.tokenSignal.set(access_token);
          this.userSignal.set(user);
          this.storeAuth(access_token, user);
          this.loadingSignal.set(false);
          return user;
        }
        throw new Error(response.message || 'Échec de l\'inscription');
      }),
      catchError((error: HttpErrorResponse) => {
        const message = this.getErrorMessage(error);
        this.errorSignal.set(message);
        this.loadingSignal.set(false);
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.errorSignal.set(null);
    this.clearStoredAuth();
    this.router.navigate(['/']);
  }

  /**
   * Logout and redirect to login
   */
  logoutToLogin(): void {
    this.logout();
    this.router.navigate(['/admin/login']);
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.errorSignal.set(null);
  }

  /**
   * Get auth header value
   */
  getAuthHeader(): string | null {
    const token = this.tokenSignal();
    return token ? `Bearer ${token}` : null;
  }

  /**
   * Check if current user can edit a resource
   */
  canEdit(ownerId: string): boolean {
    const user = this.userSignal();
    if (!user) return false;
    return user.role === 'ADMIN' || user._id === ownerId;
  }

  /**
   * Get error message from HTTP error
   */
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Impossible de contacter le serveur. Vérifiez votre connexion.';
    }
    if (error.status === 401) {
      return 'Email ou mot de passe incorrect.';
    }
    if (error.status === 409) {
      return 'Cet email est déjà utilisé.';
    }
    if (error.status === 403) {
      return 'Accès non autorisé.';
    }
    if (error.error?.message) {
      return error.error.message;
    }
    return 'Une erreur est survenue. Veuillez réessayer.';
  }
}
