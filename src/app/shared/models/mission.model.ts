import { SoilAnalysisRequest } from './soil-analysis-request.model';
import { Technician } from './technician.model';

export type MissionStatus = 'assigned' | 'in_progress' | 'completed' | 'cancelled';

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
