import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Land } from '../models/land.model';
import { LandService } from './land.service';
import { AuthService } from './auth.service';

const FAVORITES_KEY = 'petalia_farmer_favorites';
const VISITED_KEY = 'petalia_farmer_visited';
const RENTED_KEY = 'petalia_farmer_rented';

export interface FarmerLandEntry {
  landId: string;
  addedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class FarmerService {
  private platformId = inject(PLATFORM_ID);
  private landService = inject(LandService);
  private authService = inject(AuthService);

  // Private signals for storage
  private favoritesSignal = signal<FarmerLandEntry[]>([]);
  private visitedSignal = signal<FarmerLandEntry[]>([]);
  private rentedSignal = signal<FarmerLandEntry[]>([]);

  // Public readonly signals
  readonly favorites = this.favoritesSignal.asReadonly();
  readonly visited = this.visitedSignal.asReadonly();
  readonly rented = this.rentedSignal.asReadonly();

  // Computed signals for land IDs
  readonly favoriteIds = computed(() => this.favoritesSignal().map(f => f.landId));
  readonly visitedIds = computed(() => this.visitedSignal().map(v => v.landId));
  readonly rentedIds = computed(() => this.rentedSignal().map(r => r.landId));

  // Computed signals for lands with full data
  readonly favoriteLands = computed(() => {
    const ids = this.favoriteIds();
    const allLands = this.landService.lands();
    return allLands.filter(land => ids.includes(land._id));
  });

  readonly visitedLands = computed(() => {
    const ids = this.visitedIds();
    const allLands = this.landService.lands();
    return allLands.filter(land => ids.includes(land._id));
  });

  readonly rentedLands = computed(() => {
    const ids = this.rentedIds();
    const allLands = this.landService.lands();
    return allLands.filter(land => ids.includes(land._id));
  });

  // Counts
  readonly favoritesCount = computed(() => this.favoritesSignal().length);
  readonly visitedCount = computed(() => this.visitedSignal().length);
  readonly rentedCount = computed(() => this.rentedSignal().length);

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Load data from localStorage
   */
  private loadFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const userId = this.authService.user()?._id;
      const suffix = userId ? `_${userId}` : '';

      const favorites = localStorage.getItem(FAVORITES_KEY + suffix);
      const visited = localStorage.getItem(VISITED_KEY + suffix);
      const rented = localStorage.getItem(RENTED_KEY + suffix);

      if (favorites) this.favoritesSignal.set(JSON.parse(favorites));
      if (visited) this.visitedSignal.set(JSON.parse(visited));
      if (rented) this.rentedSignal.set(JSON.parse(rented));
    } catch (error) {
      console.error('Error loading farmer data:', error);
    }
  }

  /**
   * Save data to localStorage
   */
  private saveToStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const userId = this.authService.user()?._id;
      const suffix = userId ? `_${userId}` : '';

      localStorage.setItem(FAVORITES_KEY + suffix, JSON.stringify(this.favoritesSignal()));
      localStorage.setItem(VISITED_KEY + suffix, JSON.stringify(this.visitedSignal()));
      localStorage.setItem(RENTED_KEY + suffix, JSON.stringify(this.rentedSignal()));
    } catch (error) {
      console.error('Error saving farmer data:', error);
    }
  }

  /**
   * Reload data when user changes
   */
  reloadForUser(): void {
    this.loadFromStorage();
  }

  // ===== FAVORITES =====

  /**
   * Check if a land is in favorites
   */
  isFavorite(landId: string): boolean {
    return this.favoriteIds().includes(landId);
  }

  /**
   * Add a land to favorites
   */
  addToFavorites(landId: string): void {
    if (this.isFavorite(landId)) return;

    const entry: FarmerLandEntry = {
      landId,
      addedAt: new Date().toISOString()
    };

    this.favoritesSignal.update(items => [...items, entry]);
    this.saveToStorage();
  }

  /**
   * Remove a land from favorites
   */
  removeFromFavorites(landId: string): void {
    this.favoritesSignal.update(items => items.filter(item => item.landId !== landId));
    this.saveToStorage();
  }

  /**
   * Toggle favorite status
   */
  toggleFavorite(landId: string): boolean {
    if (this.isFavorite(landId)) {
      this.removeFromFavorites(landId);
      return false;
    } else {
      this.addToFavorites(landId);
      return true;
    }
  }

  // ===== VISITED =====

  /**
   * Check if a land was visited
   */
  isVisited(landId: string): boolean {
    return this.visitedIds().includes(landId);
  }

  /**
   * Mark a land as visited
   */
  markAsVisited(landId: string): void {
    if (this.isVisited(landId)) {
      // Update timestamp if already visited
      this.visitedSignal.update(items =>
        items.map(item =>
          item.landId === landId
            ? { ...item, addedAt: new Date().toISOString() }
            : item
        )
      );
    } else {
      const entry: FarmerLandEntry = {
        landId,
        addedAt: new Date().toISOString()
      };
      this.visitedSignal.update(items => [...items, entry]);
    }
    this.saveToStorage();
  }

  /**
   * Remove from visited history
   */
  removeFromVisited(landId: string): void {
    this.visitedSignal.update(items => items.filter(item => item.landId !== landId));
    this.saveToStorage();
  }

  /**
   * Clear all visited history
   */
  clearVisitedHistory(): void {
    this.visitedSignal.set([]);
    this.saveToStorage();
  }

  // ===== RENTED =====

  /**
   * Check if a land is rented by the farmer
   */
  isRented(landId: string): boolean {
    return this.rentedIds().includes(landId);
  }

  /**
   * Add a land to rented list
   */
  addToRented(landId: string): void {
    if (this.isRented(landId)) return;

    const entry: FarmerLandEntry = {
      landId,
      addedAt: new Date().toISOString()
    };

    this.rentedSignal.update(items => [...items, entry]);
    this.saveToStorage();
  }

  /**
   * Remove a land from rented list
   */
  removeFromRented(landId: string): void {
    this.rentedSignal.update(items => items.filter(item => item.landId !== landId));
    this.saveToStorage();
  }

  // ===== CLEAR ALL =====

  /**
   * Clear all farmer data
   */
  clearAll(): void {
    this.favoritesSignal.set([]);
    this.visitedSignal.set([]);
    this.rentedSignal.set([]);
    this.saveToStorage();
  }
}
