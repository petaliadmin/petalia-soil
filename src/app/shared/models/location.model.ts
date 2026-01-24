/**
 * Location model for geographic coordinates
 * Compatible with GeoJSON Point format from the API
 */
export interface Location {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

/**
 * Address details for a land parcel
 * Matches backend AddressDto structure
 */
export interface Address {
  city: string;
  region: string;
  commune: string;
  village?: string;
  fullAddress?: string;
  country?: string;
}

/**
 * Default country value
 */
export const DEFAULT_COUNTRY = 'Sénégal';

/**
 * Helper function to get latitude from Location
 */
export function getLatitude(location: Location): number {
  return location.coordinates[1];
}

/**
 * Helper function to get longitude from Location
 */
export function getLongitude(location: Location): number {
  return location.coordinates[0];
}

/**
 * Create a Location object from lat/lng
 */
export function createLocation(lat: number, lng: number): Location {
  return {
    type: 'Point',
    coordinates: [lng, lat]
  };
}
