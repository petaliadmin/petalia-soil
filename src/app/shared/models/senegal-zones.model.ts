import { ClimateType } from './crop.model';

/**
 * Senegal administrative regions
 */
export type SenegalRegion =
  | 'dakar'
  | 'thies'
  | 'diourbel'
  | 'fatick'
  | 'kaolack'
  | 'kaffrine'
  | 'louga'
  | 'matam'
  | 'saint_louis'
  | 'tambacounda'
  | 'kedougou'
  | 'kolda'
  | 'sedhiou'
  | 'ziguinchor';

/**
 * Agricultural zone type based on climate and geography
 */
export type AgriculturalZoneType =
  | 'niayes'              // Zone des Niayes (maraîchage)
  | 'groundnut_basin'     // Bassin arachidier
  | 'river_valley'        // Vallée du fleuve Sénégal
  | 'casamance'           // Casamance (zone forestière)
  | 'sylvo_pastoral'      // Zone sylvo-pastorale
  | 'oriental'            // Sénégal oriental
  | 'coastal';            // Zone côtière

/**
 * Agricultural zone with geographic and crop data
 */
export interface AgriculturalZone {
  id: string;
  name: string;
  type: AgriculturalZoneType;
  regions: SenegalRegion[];
  climate: ClimateType;
  description: string;

  // Climate data
  averageRainfall: number;        // mm/year
  rainySeasonStart: number;       // month (1-12)
  rainySeasonEnd: number;         // month (1-12)
  temperatureRange: [number, number]; // [min, max] °C

  // Soil characteristics
  dominantSoilTypes: string[];
  soilDescription: string;

  // Agriculture
  mainCrops: string[];            // Main crop IDs
  secondaryCrops: string[];       // Secondary crop IDs
  agriculturalPotential: 'high' | 'medium' | 'low';

  // Map data
  color: string;                  // Zone color for map
  bounds: [[number, number], [number, number]]; // SW and NE corners
  center: [number, number];       // [lat, lng]
}

/**
 * Zone type labels in French
 */
export const ZONE_TYPE_LABELS: Record<AgriculturalZoneType, string> = {
  niayes: 'Zone des Niayes',
  groundnut_basin: 'Bassin arachidier',
  river_valley: 'Vallée du fleuve Sénégal',
  casamance: 'Casamance',
  sylvo_pastoral: 'Zone sylvo-pastorale',
  oriental: 'Sénégal oriental',
  coastal: 'Zone côtière'
};

/**
 * Region labels in French
 */
export const REGION_LABELS: Record<SenegalRegion, string> = {
  dakar: 'Dakar',
  thies: 'Thiès',
  diourbel: 'Diourbel',
  fatick: 'Fatick',
  kaolack: 'Kaolack',
  kaffrine: 'Kaffrine',
  louga: 'Louga',
  matam: 'Matam',
  saint_louis: 'Saint-Louis',
  tambacounda: 'Tambacounda',
  kedougou: 'Kédougou',
  kolda: 'Kolda',
  sedhiou: 'Sédhiou',
  ziguinchor: 'Ziguinchor'
};

/**
 * Senegal geographic bounds
 */
export const SENEGAL_BOUNDS: [[number, number], [number, number]] = [
  [12.3, -17.6], // SW corner
  [16.7, -11.4]  // NE corner
];

/**
 * Senegal center coordinates
 */
export const SENEGAL_CENTER: [number, number] = [14.5, -14.5];
