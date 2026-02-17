export type SoilAnalysisStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

/**
 * Origin of the soil analysis request
 * - land_listing: auto-generated when an owner creates a land listing
 * - standalone: user requests analysis without an existing land listing
 */
export type SoilAnalysisOrigin = 'land_listing' | 'standalone';

export interface SoilAnalysisRequest {
  _id?: string;

  // User reference (if authenticated)
  userId?: string;

  // Contact information
  fullName: string;
  email: string;
  phone: string;

  // Plot information
  region: string;
  commune: string;
  surface: number;
  description?: string;

  // Location (optional)
  coordinates?: {
    latitude: number;
    longitude: number;
  };

  // Associated land (populated when analysis is completed, or set at creation for land_listing origin)
  landId?: string;

  // Origin: how the request was created
  origin: SoilAnalysisOrigin;

  // Metadata
  status: SoilAnalysisStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSoilAnalysisRequest {
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  region: string;
  commune: string;
  surface: number;
  description?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  landId?: string;
  origin?: SoilAnalysisOrigin;
}

export const SOIL_ANALYSIS_STATUS_LABELS: Record<SoilAnalysisStatus, string> = {
  pending: 'En attente',
  processing: 'En cours',
  completed: 'Termine',
  cancelled: 'Annule'
};

export const SOIL_ANALYSIS_ORIGIN_LABELS: Record<SoilAnalysisOrigin, string> = {
  land_listing: 'Annonce de terre',
  standalone: 'Demande directe'
};

export const SENEGAL_REGIONS = [
  'Dakar',
  'Thies',
  'Diourbel',
  'Fatick',
  'Kaolack',
  'Kaffrine',
  'Louga',
  'Saint-Louis',
  'Matam',
  'Tambacounda',
  'Kedougou',
  'Kolda',
  'Sedhiou',
  'Ziguinchor'
];
