import { SoilParameters } from './soil-parameters.model';

/**
 * Soil sensor information used during measurement
 */
export interface SoilSensor {
  type: string;            // e.g., 'pH meter', 'NPK sensor', 'multi-parameter'
  model: string;           // e.g., 'Yara N-Sensor', 'HI98168'
  serialNumber?: string;   // Sensor serial number for traceability
}

/**
 * GPS location where the measurement was taken
 */
export interface MeasurementLocation {
  latitude: number;
  longitude: number;
  altitude?: number;       // Altitude in meters (optional)
  accuracy?: number;       // GPS accuracy in meters
}

/**
 * Soil measurement recorded by a technician during a mission
 * Contains sensor info, location, technician identity, and soil parameters
 */
export interface SoilMeasurement {
  _id?: string;

  // Mission reference
  missionId: string;

  // Sensor used for measurement
  sensor: SoilSensor;

  // GPS location of the measurement
  location: MeasurementLocation;

  // Technician who performed the measurement
  performedBy: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  };

  // Measured soil parameters (filled by technician only)
  soilParameters: SoilParameters;

  // Measurement metadata
  measuredAt: string;      // ISO date when measurement was taken
  notes?: string;          // Additional observations

  // Photos taken by technician on the field
  photos?: string[];       // Photo URLs of the terrain
  attachments?: string[];  // Other documents (reports, etc.)

  createdAt: string;
  updatedAt?: string;
}

/**
 * DTO for creating a soil measurement (technician submits results)
 */
export interface CreateSoilMeasurementDto {
  missionId: string;
  sensor: SoilSensor;
  location: MeasurementLocation;
  soilParameters: SoilParameters;
  measuredAt: string;
  notes?: string;
  photos?: string[];
  attachments?: string[];
}
