export type SoilAnalysisStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface SoilAnalysisRequest {
  _id?: string;

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

  // Metadata
  status: SoilAnalysisStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSoilAnalysisRequest {
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
}

export const SOIL_ANALYSIS_STATUS_LABELS: Record<SoilAnalysisStatus, string> = {
  pending: 'En attente',
  processing: 'En cours',
  completed: 'Termine',
  cancelled: 'Annule'
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
