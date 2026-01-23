import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Owner, UserRole } from '../models/owner.model';
import { API_CONFIG, DEFAULT_API_CONFIG } from './api.config';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private config = inject(API_CONFIG, { optional: true }) ?? DEFAULT_API_CONFIG;

  private usersSignal = signal<User[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly users = this.usersSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /**
   * Load all users (Admin only)
   */
  loadUsers(): Observable<User[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<ApiResponse<User[]>>(
      `${this.config.baseUrl}/users`
    ).pipe(
      map(response => {
        this.loadingSignal.set(false);
        if (response.success) {
          this.usersSignal.set(response.data);
          return response.data;
        }
        throw new Error(response.message || 'Erreur lors du chargement');
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        const message = error.error?.message || 'Erreur lors du chargement des utilisateurs';
        this.errorSignal.set(message);
        return of([]);
      })
    );
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): Observable<User | null> {
    return this.http.get<ApiResponse<User>>(
      `${this.config.baseUrl}/users/${id}`
    ).pipe(
      map(response => response.success ? response.data : null),
      catchError(() => of(null))
    );
  }

  /**
   * Get users count by role
   */
  getUsersByRole(role: UserRole): User[] {
    return this.usersSignal().filter(u => u.role === role);
  }

  /**
   * Get role label in French
   */
  getRoleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
      ADMIN: 'Administrateur',
      OWNER: 'Propriétaire',
      FARMER: 'Agriculteur'
    };
    return labels[role] || role;
  }
}
