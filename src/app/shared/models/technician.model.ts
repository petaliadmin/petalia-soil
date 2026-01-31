export type TechnicianStatus = 'active' | 'inactive' | 'on_leave';

export interface Technician {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  avatar?: string;
  specialization?: string;
  coverageRegions: string[];
  status: TechnicianStatus;
  completedMissions: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTechnicianDto {
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  avatar?: string;
  specialization?: string;
  coverageRegions: string[];
  status?: TechnicianStatus;
  notes?: string;
}

export interface UpdateTechnicianDto {
  fullName?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  avatar?: string;
  specialization?: string;
  coverageRegions?: string[];
  status?: TechnicianStatus;
  notes?: string;
}

export interface FilterTechniciansDto {
  status?: TechnicianStatus;
  region?: string;
  page?: number;
  limit?: number;
}

export const TECHNICIAN_STATUS_LABELS: Record<TechnicianStatus, string> = {
  active: 'Actif',
  inactive: 'Inactif',
  on_leave: 'En congé'
};
