import { SoilAnalysisRequest } from './soil-analysis-request.model';
import { Technician } from './technician.model';
import { SoilMeasurement } from './soil-measurement.model';
import { Land } from './land.model';

export type MissionStatus = 'assigned' | 'in_progress' | 'completed' | 'cancelled';

/**
 * Owner/requester contact info embedded in mission for technician access
 */
export interface MissionOwnerInfo {
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
}

/**
 * Land info embedded in mission (if a land listing exists)
 * For standalone requests, technician must fill this in
 */
export interface MissionLandInfo {
  _id?: string;
  title?: string;
  surface?: number;
  region?: string;
  commune?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Mission {
  _id: string;
  analysisRequest: SoilAnalysisRequest | string;
  technician: Technician | string;
  assignedBy: {
    _id: string;
    fullName: string;
    email: string;
  } | string;
  status: MissionStatus;
  scheduledDate: string;
  completedDate?: string;
  instructions?: string;
  technicianNotes?: string;
  attachments?: string[];

  // Owner/requester contact info (for technician to contact)
  ownerInfo?: MissionOwnerInfo;

  // Land info (populated if linked to a land listing, or filled by technician for standalone)
  landInfo?: MissionLandInfo;

  // Associated land (populated reference)
  land?: Land | string;

  // Soil measurement results (filled by technician only)
  soilMeasurement?: SoilMeasurement;

  createdAt: string;
  updatedAt?: string;
}

export interface CreateMissionDto {
  analysisRequestId: string;
  technicianId: string;
  scheduledDate: string;
  instructions?: string;
}

export interface UpdateMissionDto {
  status?: MissionStatus;
  scheduledDate?: string;
  completedDate?: string;
  instructions?: string;
  technicianNotes?: string;
  attachments?: string[];
  // Technician can add/update land info for standalone requests
  landInfo?: MissionLandInfo;
}

/**
 * DTO for technician to complete a mission with soil measurement
 */
export interface CompleteMissionDto {
  technicianNotes?: string;
  attachments?: string[];
  landInfo?: MissionLandInfo;
  soilMeasurement: {
    sensor: {
      type: string;
      model: string;
      serialNumber?: string;
    };
    location: {
      latitude: number;
      longitude: number;
      altitude?: number;
      accuracy?: number;
    };
    soilParameters: {
      ph: number;
      npk: {
        nitrogen: number;
        phosphorus: number;
        potassium: number;
      };
      texture: string;
      moisture: number;
      drainage: string;
      organicMatter?: number;
      salinity?: number;
      cec?: number;
    };
    measuredAt: string;
    notes?: string;
  };
}

export interface FilterMissionsDto {
  status?: MissionStatus;
  technicianId?: string;
  page?: number;
  limit?: number;
}

export const MISSION_STATUS_LABELS: Record<MissionStatus, string> = {
  assigned: 'Affectée',
  in_progress: 'En cours',
  completed: 'Terminée',
  cancelled: 'Annulée'
};

export const MISSION_STATUS_COLORS: Record<MissionStatus, { bg: string; text: string }> = {
  assigned: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-400' },
  in_progress: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-400' },
  completed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-400' },
  cancelled: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-400' }
};
