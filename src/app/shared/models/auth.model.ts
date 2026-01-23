/**
 * Authentication models for Petalia Soil API
 */

import { Owner, UserRole } from './owner.model';

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}

/**
 * Authentication response from API
 */
export interface AuthResponse {
  success: boolean;
  data: {
    access_token: string;
    user: AuthUser;
  };
  message?: string;
}

/**
 * Authenticated user data
 */
export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * JWT payload structure
 */
export interface JwtPayload {
  sub: string;       // User ID
  email: string;
  role: UserRole;
  iat: number;       // Issued at
  exp: number;       // Expiration
}

/**
 * Auth state
 */
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Storage keys
 */
export const AUTH_TOKEN_KEY = 'petalia_auth_token';
export const AUTH_USER_KEY = 'petalia_auth_user';

/**
 * Check if user has admin role
 */
export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === 'ADMIN';
}

/**
 * Check if user has owner role
 */
export function isOwner(user: AuthUser | null): boolean {
  return user?.role === 'OWNER' || user?.role === 'ADMIN';
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
