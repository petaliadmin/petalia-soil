/**
 * Soil texture types
 */
export type SoilTexture = 'sandy' | 'clay' | 'loamy' | 'silty' | 'peaty' | 'chalky';

/**
 * Drainage quality levels
 */
export type DrainageQuality = 'excellent' | 'good' | 'moderate' | 'poor';

/**
 * NPK (Nitrogen, Phosphorus, Potassium) values
 */
export interface NPK {
  nitrogen: number;    // N - mg/kg
  phosphorus: number;  // P - mg/kg
  potassium: number;   // K - mg/kg
}

/**
 * Complete soil parameters for agricultural land analysis
 */
export interface SoilParameters {
  ph: number;                    // pH level (0-14, ideal 6-7 for most crops)
  npk: NPK;                      // NPK values
  texture: SoilTexture;          // Soil texture type
  moisture: number;              // Moisture percentage (0-100)
  organicMatter?: number;        // Organic matter percentage
  drainage: DrainageQuality;     // Drainage quality
  salinity?: number;             // Salinity level (dS/m)
  cec?: number;                  // Cation Exchange Capacity (meq/100g)
}

/**
 * Soil texture display labels in French
 */
export const SOIL_TEXTURE_LABELS: Record<SoilTexture, string> = {
  sandy: 'Sableux',
  clay: 'Argileux',
  loamy: 'Limoneux',
  silty: 'Silteux',
  peaty: 'Tourbeux',
  chalky: 'Calcaire'
};

/**
 * Soil textures for form select options
 */
export const SOIL_TEXTURES: { value: SoilTexture; label: string }[] = [
  { value: 'sandy', label: 'Sableux' },
  { value: 'clay', label: 'Argileux' },
  { value: 'loamy', label: 'Limoneux' },
  { value: 'silty', label: 'Silteux' },
  { value: 'peaty', label: 'Tourbeux' },
  { value: 'chalky', label: 'Calcaire' }
];

/**
 * Drainage quality display labels in French
 */
export const DRAINAGE_LABELS: Record<DrainageQuality, string> = {
  excellent: 'Excellent',
  good: 'Bon',
  moderate: 'Moyen',
  poor: 'Faible'
};

/**
 * Get pH level description
 */
export function getPhDescription(ph: number): { label: string; color: string } {
  if (ph < 5.5) return { label: 'Très acide', color: 'text-red-600' };
  if (ph < 6.0) return { label: 'Acide', color: 'text-orange-600' };
  if (ph < 6.5) return { label: 'Légèrement acide', color: 'text-yellow-600' };
  if (ph <= 7.5) return { label: 'Neutre', color: 'text-green-600' };
  if (ph <= 8.0) return { label: 'Légèrement alcalin', color: 'text-blue-600' };
  return { label: 'Alcalin', color: 'text-purple-600' };
}

/**
 * Get NPK level quality
 */
export function getNpkQuality(value: number, type: 'nitrogen' | 'phosphorus' | 'potassium'): 'low' | 'medium' | 'high' {
  const thresholds = {
    nitrogen: { low: 20, high: 50 },
    phosphorus: { low: 10, high: 30 },
    potassium: { low: 100, high: 200 }
  };

  const t = thresholds[type];
  if (value < t.low) return 'low';
  if (value > t.high) return 'high';
  return 'medium';
}
