import { Location, Address } from './location.model';
import { SoilParameters } from './soil-parameters.model';
import { Owner } from './owner.model';

/**
 * Land listing type
 */
export type LandType = 'RENT' | 'SALE';

/**
 * Land listing status
 */
export type LandStatus = 'AVAILABLE' | 'PENDING' | 'SOLD' | 'RENTED';

/**
 * Crop recommendation based on soil analysis
 */
export interface CropRecommendation {
  name: string;
  suitability: 'excellent' | 'good' | 'moderate';
  icon?: string;
  season?: string;
  expectedYield?: string;
}

/**
 * Culture history entry
 */
export interface CultureHistory {
  year: number;
  crop: string;
  yield?: string;
  notes?: string;
}

/**
 * Main Land model
 * Represents an agricultural land parcel listing
 */
export interface Land {
  _id: string;
  title: string;
  description: string;
  surface: number;           // Surface in hectares
  type: LandType;            // RENT or SALE
  price: number;             // Price in local currency
  priceUnit?: string;        // Currency unit (e.g., 'FCFA')
  pricePerHectare?: number;  // Calculated price per hectare
  status: LandStatus;

  // Location
  location: Location;        // GeoJSON coordinates
  address: Address;          // Human-readable address

  // Soil data
  soilParameters: SoilParameters;

  // Recommendations (from API or generated)
  recommendedCrops?: CropRecommendation[];

  // History
  cultureHistory?: CultureHistory[];

  // Owner
  owner: Owner | string;     // Populated or just ID

  // Media
  images?: string[];
  thumbnail?: string;

  // Metadata
  views?: number;
  favorites?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Land summary for list views (lighter payload)
 */
export interface LandSummary {
  _id: string;
  title: string;
  surface: number;
  type: LandType;
  price: number;
  priceUnit?: string;
  status: LandStatus;
  location: Location;
  address: Address;
  soilParameters: Pick<SoilParameters, 'ph' | 'npk' | 'texture' | 'moisture'>;
  thumbnail?: string;
  createdAt: string;
}

/**
 * Filters for land search
 */
export interface LandFilters {
  type?: LandType;
  minSurface?: number;
  maxSurface?: number;
  minPrice?: number;
  maxPrice?: number;
  minPh?: number;
  maxPh?: number;
  texture?: string[];
  region?: string;
  recommendedCrop?: string;
  status?: LandStatus;
}

/**
 * Nearby search parameters
 */
export interface NearbySearchParams {
  latitude: number;
  longitude: number;
  radiusKm: number;
  filters?: LandFilters;
}

/**
 * Land type display labels
 */
export const LAND_TYPE_LABELS: Record<LandType, string> = {
  RENT: 'Location',
  SALE: 'Vente'
};

/**
 * Land status display labels
 */
export const LAND_STATUS_LABELS: Record<LandStatus, string> = {
  AVAILABLE: 'Disponible',
  PENDING: 'En attente',
  SOLD: 'Vendu',
  RENTED: 'Loué'
};

/**
 * Format price with currency
 */
export function formatPrice(price: number, unit: string = 'FCFA'): string {
  return `${price.toLocaleString('fr-FR')} ${unit}`;
}

/**
 * Format surface area
 */
export function formatSurface(surface: number): string {
  if (surface < 1) {
    return `${(surface * 10000).toLocaleString('fr-FR')} m²`;
  }
  return `${surface.toLocaleString('fr-FR')} ha`;
}
