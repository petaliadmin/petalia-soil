import { Injectable, signal, computed } from '@angular/core';
import { SoilParameters, SoilTexture, DrainageQuality } from '../models/soil-parameters.model';
import { Crop, CropRecommendationResult, CropCategory, ClimateType } from '../models/crop.model';
import { AgriculturalZone, SenegalRegion } from '../models/senegal-zones.model';
import { CROPS_DATABASE, SENEGAL_AGRICULTURAL_ZONES, getCropById } from './crop-data';

/**
 * Input parameters for crop recommendations
 */
export interface RecommendationInput {
  soilParameters?: SoilParameters;
  region?: SenegalRegion;
  zone?: string;
  currentMonth?: number;
  preferredCategories?: CropCategory[];
  waterAvailability?: 'limited' | 'moderate' | 'abundant';
}

/**
 * Service for crop recommendations based on soil and climate parameters
 */
@Injectable({
  providedIn: 'root'
})
export class CropRecommendationService {

  // Signals for state management
  private _currentInput = signal<RecommendationInput | null>(null);
  private _recommendations = signal<CropRecommendationResult[]>([]);
  private _selectedZone = signal<AgriculturalZone | null>(null);
  private _isCalculating = signal(false);

  // Public readonly signals
  readonly currentInput = this._currentInput.asReadonly();
  readonly recommendations = this._recommendations.asReadonly();
  readonly selectedZone = this._selectedZone.asReadonly();
  readonly isCalculating = this._isCalculating.asReadonly();

  // Computed signals
  readonly topRecommendations = computed(() =>
    this._recommendations().filter(r => r.compatibilityScore >= 70)
  );

  readonly moderateRecommendations = computed(() =>
    this._recommendations().filter(r => r.compatibilityScore >= 50 && r.compatibilityScore < 70)
  );

  readonly allZones = signal(SENEGAL_AGRICULTURAL_ZONES);
  readonly allCrops = signal(CROPS_DATABASE);

  /**
   * Calculate crop recommendations based on input parameters
   */
  calculateRecommendations(input: RecommendationInput): CropRecommendationResult[] {
    this._isCalculating.set(true);
    this._currentInput.set(input);

    try {
      const recommendations: CropRecommendationResult[] = [];

      // Get zone if region is provided
      if (input.region) {
        const zone = SENEGAL_AGRICULTURAL_ZONES.find(z =>
          z.regions.includes(input.region!)
        );
        if (zone) {
          this._selectedZone.set(zone);
        }
      } else if (input.zone) {
        const zone = SENEGAL_AGRICULTURAL_ZONES.find(z => z.id === input.zone);
        if (zone) {
          this._selectedZone.set(zone);
        }
      }

      const currentMonth = input.currentMonth || new Date().getMonth() + 1;

      // Evaluate each crop
      for (const crop of CROPS_DATABASE) {
        // Filter by preferred categories if specified
        if (input.preferredCategories && input.preferredCategories.length > 0) {
          if (!input.preferredCategories.includes(crop.category)) {
            continue;
          }
        }

        const recommendation = this.evaluateCrop(crop, input, currentMonth);
        if (recommendation.compatibilityScore > 30) {
          recommendations.push(recommendation);
        }
      }

      // Sort by compatibility score
      recommendations.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      this._recommendations.set(recommendations);
      return recommendations;
    } finally {
      this._isCalculating.set(false);
    }
  }

  /**
   * Evaluate a single crop against input parameters
   */
  private evaluateCrop(
    crop: Crop,
    input: RecommendationInput,
    currentMonth: number
  ): CropRecommendationResult {
    const reasons: string[] = [];
    const warnings: string[] = [];

    let soilScore = 100;
    let climateScore = 100;
    let seasonScore = 100;

    // === SOIL EVALUATION ===
    if (input.soilParameters) {
      soilScore = this.evaluateSoil(crop, input.soilParameters, reasons, warnings);
    }

    // === CLIMATE/ZONE EVALUATION ===
    const zone = this._selectedZone();
    if (zone) {
      climateScore = this.evaluateClimate(crop, zone, reasons, warnings);
    }

    // === SEASON EVALUATION ===
    seasonScore = this.evaluateSeason(crop, currentMonth, reasons, warnings);

    // === WATER AVAILABILITY ===
    if (input.waterAvailability) {
      const waterScore = this.evaluateWater(crop, input.waterAvailability, reasons, warnings);
      soilScore = Math.min(soilScore, waterScore);
    }

    // Calculate overall score
    const compatibilityScore = Math.round(
      (soilScore * 0.4) + (climateScore * 0.35) + (seasonScore * 0.25)
    );

    return {
      crop,
      compatibilityScore,
      soilScore: Math.round(soilScore),
      climateScore: Math.round(climateScore),
      seasonScore: Math.round(seasonScore),
      reasons,
      warnings
    };
  }

  /**
   * Evaluate soil compatibility
   */
  private evaluateSoil(
    crop: Crop,
    soil: SoilParameters,
    reasons: string[],
    warnings: string[]
  ): number {
    let score = 100;
    const req = crop.soilRequirements;

    // pH evaluation
    if (soil.ph < req.phMin) {
      const diff = req.phMin - soil.ph;
      score -= diff * 15;
      if (diff > 1) {
        warnings.push(`Sol trop acide (pH ${soil.ph}, idéal: ${req.phMin}-${req.phMax})`);
      }
    } else if (soil.ph > req.phMax) {
      const diff = soil.ph - req.phMax;
      score -= diff * 15;
      if (diff > 1) {
        warnings.push(`Sol trop alcalin (pH ${soil.ph}, idéal: ${req.phMin}-${req.phMax})`);
      }
    } else {
      reasons.push('pH du sol adapté');
    }

    // Texture evaluation
    if (req.textures.includes(soil.texture)) {
      reasons.push(`Texture ${soil.texture} adaptée`);
    } else {
      score -= 20;
      warnings.push(`Texture ${soil.texture} non idéale`);
    }

    // Moisture evaluation
    if (soil.moisture < req.moistureMin) {
      score -= (req.moistureMin - soil.moisture) * 0.8;
      warnings.push('Humidité insuffisante');
    } else if (soil.moisture > req.moistureMax) {
      score -= (soil.moisture - req.moistureMax) * 0.5;
      warnings.push('Humidité excessive');
    }

    // Drainage evaluation
    if (req.drainageRequired.includes(soil.drainage)) {
      reasons.push('Drainage adapté');
    } else {
      score -= 15;
      warnings.push('Drainage non optimal');
    }

    // NPK evaluation
    if (soil.npk) {
      if (req.nitrogenMin && soil.npk.nitrogen < req.nitrogenMin) {
        score -= 10;
        warnings.push('Azote insuffisant');
      }
      if (req.phosphorusMin && soil.npk.phosphorus < req.phosphorusMin) {
        score -= 10;
        warnings.push('Phosphore insuffisant');
      }
      if (req.potassiumMin && soil.npk.potassium < req.potassiumMin) {
        score -= 10;
        warnings.push('Potassium insuffisant');
      }
    }

    return Math.max(0, score);
  }

  /**
   * Evaluate climate compatibility
   */
  private evaluateClimate(
    crop: Crop,
    zone: AgriculturalZone,
    reasons: string[],
    warnings: string[]
  ): number {
    let score = 100;
    const req = crop.climateRequirements;

    // Climate type match
    if (req.climateTypes.includes(zone.climate)) {
      reasons.push(`Climat ${zone.climate} adapté`);
      score += 10; // Bonus for matching climate
    } else {
      score -= 25;
      warnings.push(`Climat ${zone.climate} non optimal`);
    }

    // Rainfall evaluation
    if (zone.averageRainfall < req.rainfallMin) {
      const deficit = req.rainfallMin - zone.averageRainfall;
      score -= deficit / 20;
      if (deficit > 200) {
        warnings.push(`Pluviométrie insuffisante (${zone.averageRainfall}mm vs ${req.rainfallMin}mm minimum)`);
      }
    } else if (zone.averageRainfall > req.rainfallMax) {
      score -= 10;
      warnings.push('Pluviométrie excessive');
    } else {
      reasons.push('Pluviométrie adaptée');
    }

    // Temperature evaluation
    const avgTemp = (zone.temperatureRange[0] + zone.temperatureRange[1]) / 2;
    if (avgTemp < req.temperatureMin) {
      score -= (req.temperatureMin - avgTemp) * 3;
    } else if (avgTemp > req.temperatureMax) {
      score -= (avgTemp - req.temperatureMax) * 3;
    }

    // Check if crop is in zone's main or secondary crops
    if (zone.mainCrops.includes(crop.id)) {
      reasons.push(`Culture principale de la zone ${zone.name}`);
      score += 15;
    } else if (zone.secondaryCrops.includes(crop.id)) {
      reasons.push(`Culture secondaire de la zone ${zone.name}`);
      score += 5;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Evaluate season compatibility
   */
  private evaluateSeason(
    crop: Crop,
    currentMonth: number,
    reasons: string[],
    warnings: string[]
  ): number {
    let score = 100;
    const cycle = crop.cultivationCycle;

    // Check if current month is good for seeding
    const monthsUntilSeeding = this.monthsUntil(currentMonth, cycle.seedingMonths);

    if (monthsUntilSeeding === 0) {
      reasons.push('Période de semis idéale');
      score = 100;
    } else if (monthsUntilSeeding <= 2) {
      reasons.push(`Semis possible dans ${monthsUntilSeeding} mois`);
      score = 90;
    } else if (monthsUntilSeeding <= 4) {
      score = 70;
      warnings.push(`Période de semis dans ${monthsUntilSeeding} mois`);
    } else {
      score = 50;
      warnings.push('Hors période de semis optimale');
    }

    return score;
  }

  /**
   * Evaluate water availability compatibility
   */
  private evaluateWater(
    crop: Crop,
    availability: 'limited' | 'moderate' | 'abundant',
    reasons: string[],
    warnings: string[]
  ): number {
    const needsMap = {
      low: ['limited', 'moderate', 'abundant'],
      medium: ['moderate', 'abundant'],
      high: ['abundant'],
      very_high: ['abundant']
    };

    const compatible = needsMap[crop.waterNeeds];

    if (compatible.includes(availability)) {
      reasons.push('Disponibilité en eau suffisante');
      return 100;
    } else {
      const gap = crop.waterNeeds === 'very_high' ? 40 :
                  crop.waterNeeds === 'high' ? 30 : 20;
      warnings.push(`Besoins en eau ${crop.waterNeeds} vs disponibilité ${availability}`);
      return 100 - gap;
    }
  }

  /**
   * Calculate months until target months
   */
  private monthsUntil(current: number, targets: number[]): number {
    let min = 12;
    for (const target of targets) {
      const diff = target >= current ? target - current : 12 - current + target;
      if (diff < min) min = diff;
    }
    return min;
  }

  /**
   * Get recommendations for a specific zone
   */
  getRecommendationsForZone(zoneId: string): CropRecommendationResult[] {
    const zone = SENEGAL_AGRICULTURAL_ZONES.find(z => z.id === zoneId);
    if (!zone) return [];

    return this.calculateRecommendations({
      zone: zoneId,
      currentMonth: new Date().getMonth() + 1
    });
  }

  /**
   * Get crops adapted to a specific zone
   */
  getCropsForZone(zoneId: string): Crop[] {
    const zone = SENEGAL_AGRICULTURAL_ZONES.find(z => z.id === zoneId);
    if (!zone) return [];

    const cropIds = [...zone.mainCrops, ...zone.secondaryCrops];
    return cropIds
      .map(id => getCropById(id))
      .filter((crop): crop is Crop => crop !== undefined);
  }

  /**
   * Get all zones where a crop can grow
   */
  getZonesForCrop(cropId: string): AgriculturalZone[] {
    return SENEGAL_AGRICULTURAL_ZONES.filter(zone =>
      zone.mainCrops.includes(cropId) || zone.secondaryCrops.includes(cropId)
    );
  }

  /**
   * Get ideal parameters for a crop
   */
  getIdealParameters(cropId: string): {
    soil: string[];
    climate: string[];
    cultivation: string[];
  } | null {
    const crop = getCropById(cropId);
    if (!crop) return null;

    return {
      soil: [
        `pH: ${crop.soilRequirements.phMin} - ${crop.soilRequirements.phMax}`,
        `Textures: ${crop.soilRequirements.textures.join(', ')}`,
        `Humidité: ${crop.soilRequirements.moistureMin}% - ${crop.soilRequirements.moistureMax}%`,
        `Drainage: ${crop.soilRequirements.drainageRequired.join(', ')}`
      ],
      climate: [
        `Température: ${crop.climateRequirements.temperatureMin}°C - ${crop.climateRequirements.temperatureMax}°C`,
        `Pluviométrie: ${crop.climateRequirements.rainfallMin}mm - ${crop.climateRequirements.rainfallMax}mm/an`,
        `Ensoleillement: ${crop.climateRequirements.sunlightHours}h/jour`
      ],
      cultivation: [
        `Durée du cycle: ${crop.cultivationCycle.cycleDuration} jours`,
        `Saison: ${crop.cultivationCycle.season === 'rainy' ? 'Saison des pluies' :
                   crop.cultivationCycle.season === 'dry' ? 'Saison sèche' : 'Toute l\'année'}`,
        `Rendement moyen: ${crop.yieldInfo.averageYield} ${crop.yieldInfo.unit}`,
        `Rendement optimal: ${crop.yieldInfo.optimalYield} ${crop.yieldInfo.unit}`
      ]
    };
  }

  /**
   * Clear current recommendations
   */
  clearRecommendations(): void {
    this._recommendations.set([]);
    this._currentInput.set(null);
    this._selectedZone.set(null);
  }
}
