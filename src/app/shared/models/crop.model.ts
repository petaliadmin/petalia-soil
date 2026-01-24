/**
 * Crop category types
 */
export type CropCategory =
  | 'cereals'      // Céréales
  | 'legumes'      // Légumineuses
  | 'vegetables'   // Légumes
  | 'fruits'       // Fruits
  | 'tubers'       // Tubercules
  | 'oilseeds'     // Oléagineux
  | 'industrial'   // Cultures industrielles
  | 'fodder';      // Cultures fourragères

/**
 * Water needs level
 */
export type WaterNeeds = 'low' | 'medium' | 'high' | 'very_high';

/**
 * Climate type
 */
export type ClimateType =
  | 'tropical_humid'    // Tropical humide
  | 'tropical_dry'      // Tropical sec
  | 'sahel'             // Sahélien
  | 'sudanese'          // Soudanien
  | 'sudano_sahelian';  // Soudano-sahélien

/**
 * Season type
 */
export type SeasonType = 'rainy' | 'dry' | 'both';

/**
 * Ideal soil parameters range for a crop
 */
export interface IdealSoilParameters {
  phMin: number;
  phMax: number;
  textures: string[];           // Compatible soil textures
  moistureMin: number;
  moistureMax: number;
  nitrogenMin?: number;
  nitrogenMax?: number;
  phosphorusMin?: number;
  phosphorusMax?: number;
  potassiumMin?: number;
  potassiumMax?: number;
  organicMatterMin?: number;
  drainageRequired: string[];   // Acceptable drainage levels
}

/**
 * Climate requirements for a crop
 */
export interface ClimateRequirements {
  temperatureMin: number;       // °C
  temperatureMax: number;       // °C
  rainfallMin: number;          // mm/year
  rainfallMax: number;          // mm/year
  sunlightHours: number;        // hours/day
  climateTypes: ClimateType[];  // Compatible climates
}

/**
 * Cultivation cycle information
 */
export interface CultivationCycle {
  seedingMonths: number[];      // 1-12 (January = 1)
  harvestMonths: number[];      // 1-12
  cycleDuration: number;        // days
  season: SeasonType;
}

/**
 * Crop yield information
 */
export interface YieldInfo {
  averageYield: number;         // kg/hectare
  optimalYield: number;         // kg/hectare under optimal conditions
  unit: string;                 // kg, tonnes, etc.
}

/**
 * Complete crop model with all parameters
 */
export interface Crop {
  id: string;
  name: string;
  nameFr: string;
  scientificName: string;
  category: CropCategory;
  description: string;
  imageUrl?: string;

  // Requirements
  soilRequirements: IdealSoilParameters;
  climateRequirements: ClimateRequirements;
  waterNeeds: WaterNeeds;

  // Cultivation
  cultivationCycle: CultivationCycle;
  yieldInfo: YieldInfo;

  // Additional info
  commonDiseases?: string[];
  companionCrops?: string[];    // Good companion plants
  incompatibleCrops?: string[]; // Plants to avoid nearby
  tips?: string[];              // Cultivation tips
}

/**
 * Crop recommendation result with compatibility score
 */
export interface CropRecommendationResult {
  crop: Crop;
  compatibilityScore: number;   // 0-100
  soilScore: number;            // 0-100
  climateScore: number;         // 0-100
  seasonScore: number;          // 0-100
  reasons: string[];            // Why this crop is recommended
  warnings: string[];           // Potential issues
}

/**
 * Crop category labels in French
 */
export const CROP_CATEGORY_LABELS: Record<CropCategory, string> = {
  cereals: 'Céréales',
  legumes: 'Légumineuses',
  vegetables: 'Légumes',
  fruits: 'Fruits',
  tubers: 'Tubercules',
  oilseeds: 'Oléagineux',
  industrial: 'Cultures industrielles',
  fodder: 'Cultures fourragères'
};

/**
 * Water needs labels in French
 */
export const WATER_NEEDS_LABELS: Record<WaterNeeds, string> = {
  low: 'Faible',
  medium: 'Moyen',
  high: 'Élevé',
  very_high: 'Très élevé'
};

/**
 * Climate type labels in French
 */
export const CLIMATE_TYPE_LABELS: Record<ClimateType, string> = {
  tropical_humid: 'Tropical humide',
  tropical_dry: 'Tropical sec',
  sahel: 'Sahélien',
  sudanese: 'Soudanien',
  sudano_sahelian: 'Soudano-sahélien'
};

/**
 * Month names in French
 */
export const MONTH_NAMES_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

/**
 * Get months as readable string
 */
export function getMonthsLabel(months: number[]): string {
  return months.map(m => MONTH_NAMES_FR[m - 1]).join(', ');
}
