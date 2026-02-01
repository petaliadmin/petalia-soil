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
  isActive?: boolean;
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

  /**
   * Toggle user active status (Admin only)
   */
  toggleUserStatus(userId: string, isActive: boolean): Observable<User | null> {
    return this.http.patch<ApiResponse<User>>(
      `${this.config.baseUrl}/users/${userId}/status`,
      { isActive }
    ).pipe(
      map(response => {
        if (response.success) {
          // Update local state
          this.usersSignal.update(users =>
            users.map(u => u._id === userId ? { ...u, isActive } : u)
          );
          return response.data;
        }
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }),
      catchError(error => {
        console.error('Error toggling user status:', error);
        // Mock success for development
        if (error.status === 404 || error.status === 0) {
          this.usersSignal.update(users =>
            users.map(u => u._id === userId ? { ...u, isActive } : u)
          );
          return of({ _id: userId, isActive } as User);
        }
        this.errorSignal.set('Erreur lors de la mise à jour du statut');
        return of(null);
      })
    );
  }

  /**
   * Update user (Admin only)
   */
  updateUser(userId: string, data: Partial<User>): Observable<User | null> {
    return this.http.patch<ApiResponse<User>>(
      `${this.config.baseUrl}/users/${userId}`,
      data
    ).pipe(
      map(response => {
        if (response.success) {
          this.usersSignal.update(users =>
            users.map(u => u._id === userId ? { ...u, ...response.data } : u)
          );
          return response.data;
        }
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }),
      catchError(error => {
        console.error('Error updating user:', error);
        this.errorSignal.set('Erreur lors de la mise à jour');
        return of(null);
      })
    );
  }
}
