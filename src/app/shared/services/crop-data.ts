import { Crop, CropCategory } from '../models/crop.model';
import { AgriculturalZone } from '../models/senegal-zones.model';

/**
 * Database of crops adapted to Senegal
 *
 * Sources:
 * - FAO (Food and Agriculture Organization): https://www.fao.org/faostat/
 * - ICRISAT (International Crops Research Institute for the Semi-Arid Tropics): https://www.icrisat.org/
 * - Global Yield Gap Atlas: https://www.yieldgap.org/senegal
 * - World Bank Climate Knowledge Portal: https://climateknowledgeportal.worldbank.org/country/senegal
 * - ISRA (Institut Sénégalais de Recherches Agricoles)
 * - Purdue University Crop Profiles: https://hort.purdue.edu/newcrop/
 */
export const CROPS_DATABASE: Crop[] = [
  // === CÉRÉALES ===
  {
    id: 'mil',
    name: 'Pearl Millet',
    nameFr: 'Mil',
    scientificName: 'Pennisetum glaucum',
    category: 'cereals',
    description: 'Céréale traditionnelle très résistante à la sécheresse, base de l\'alimentation au Sénégal. Sixième céréale mondiale en importance. Source: ICRISAT.',
    imageUrl: '/assets/crops/millet.jpg',
    soilRequirements: {
      // Source: ICRISAT, Organic Africa, Purdue University
      phMin: 5.5,
      phMax: 7.0,  // Optimal 6.0-7.0, peut aller jusqu'à 8.0
      textures: ['sandy', 'loamy'],
      moistureMin: 15,
      moistureMax: 45,
      nitrogenMin: 15,
      nitrogenMax: 50,
      drainageRequired: ['excellent', 'good', 'moderate']
    },
    climateRequirements: {
      // Source: ICRISAT - optimal 28-34°C, tolère jusqu'à 46°C
      temperatureMin: 21,  // Minimum pour tallage
      temperatureMax: 34,  // Optimal, tolère >40°C
      rainfallMin: 250,    // ICRISAT: 200-1500mm, idéal 250-700mm
      rainfallMax: 700,
      sunlightHours: 8,
      climateTypes: ['sahel', 'sudano_sahelian', 'sudanese']
    },
    waterNeeds: 'low',
    cultivationCycle: {
      seedingMonths: [6, 7],
      harvestMonths: [10, 11],
      cycleDuration: 90,  // 70-90 jours selon variétés
      season: 'rainy'
    },
    yieldInfo: {
      // Source: Global Yield Gap Atlas, ICRISAT
      averageYield: 700,   // Rendement moyen Afrique de l'Ouest
      optimalYield: 1500,  // Avec bonnes pratiques
      unit: 'kg/ha'
    },
    commonDiseases: ['Mildiou', 'Charbon', 'Ergot', 'Striga'],
    companionCrops: ['niebe', 'arachide'],
    tips: [
      'Semer après les premières pluies quand le sol atteint 23°C',
      'Espacement de 75-90cm entre les lignes',
      'Tolère les sols acides mieux que le sorgho',
      'Association mil/niébé recommandée par ICRISAT'
    ]
  },
  {
    id: 'sorgho',
    name: 'Sorghum',
    nameFr: 'Sorgho',
    scientificName: 'Sorghum bicolor',
    category: 'cereals',
    description: 'Céréale robuste adaptée aux zones semi-arides. Tolère la sécheresse grâce au trait "stay green". Source: ARC South Africa, FAO.',
    imageUrl: '/assets/crops/sorghum.jpg',
    soilRequirements: {
      // Source: ARC South Africa, NAADS Uganda
      phMin: 5.5,
      phMax: 7.5,  // Peut aller de 5.0 à 8.5
      textures: ['clay', 'loamy', 'sandy'],
      moistureMin: 20,
      moistureMax: 55,
      nitrogenMin: 20,
      nitrogenMax: 60,
      drainageRequired: ['excellent', 'good', 'moderate']
    },
    climateRequirements: {
      // Source: ARC - optimal 27-30°C, germination min 15°C
      temperatureMin: 21,
      temperatureMax: 30,  // >30°C limite le rendement
      rainfallMin: 400,
      rainfallMax: 800,    // Au-delà de 800mm, rendement stagne
      sunlightHours: 8,
      climateTypes: ['sahel', 'sudano_sahelian', 'sudanese', 'tropical_dry']
    },
    waterNeeds: 'medium',
    cultivationCycle: {
      seedingMonths: [6, 7],
      harvestMonths: [10, 11, 12],
      cycleDuration: 120,
      season: 'rainy'
    },
    yieldInfo: {
      // Source: Global Yield Gap Atlas
      averageYield: 900,
      optimalYield: 3000,  // Potentiel avec variétés améliorées
      unit: 'kg/ha'
    },
    commonDiseases: ['Anthracnose', 'Charbon', 'Striga'],
    companionCrops: ['niebe', 'arachide'],
    tips: [
      'Température sol minimum 15°C pour germination',
      'Rotation avec légumineuses recommandée',
      'Variétés "stay green" pour zones sèches',
      'Tolère sel et toxicité aluminium'
    ]
  },
  {
    id: 'mais',
    name: 'Maize',
    nameFr: 'Maïs',
    scientificName: 'Zea mays',
    category: 'cereals',
    description: 'Céréale à haut rendement nécessitant un bon apport en eau et fertilisation. Culture importante en Casamance et Sénégal Oriental.',
    imageUrl: '/assets/crops/maize.jpg',
    soilRequirements: {
      phMin: 5.8,
      phMax: 7.0,
      textures: ['loamy', 'clay'],
      moistureMin: 40,
      moistureMax: 70,
      nitrogenMin: 40,
      nitrogenMax: 100,
      phosphorusMin: 20,
      phosphorusMax: 50,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      temperatureMin: 18,
      temperatureMax: 32,
      rainfallMin: 600,
      rainfallMax: 1200,
      sunlightHours: 10,
      climateTypes: ['sudanese', 'tropical_humid', 'sudano_sahelian']
    },
    waterNeeds: 'high',
    cultivationCycle: {
      seedingMonths: [6, 7],
      harvestMonths: [9, 10],
      cycleDuration: 100,
      season: 'rainy'
    },
    yieldInfo: {
      // Source: FAO Senegal
      averageYield: 1800,
      optimalYield: 4500,
      unit: 'kg/ha'
    },
    commonDiseases: ['Foreur de tige', 'Rouille', 'Helminthosporiose'],
    companionCrops: ['haricot', 'courge'],
    tips: [
      'Exige une bonne fertilisation azotée',
      'Irrigation complémentaire souvent nécessaire',
      'Sensible au stress hydrique à la floraison'
    ]
  },
  {
    id: 'riz',
    name: 'Rice',
    nameFr: 'Riz',
    scientificName: 'Oryza sativa / Oryza glaberrima',
    category: 'cereals',
    description: 'Céréale principale cultivée en irrigué (Vallée du Fleuve) et pluvial (Casamance). Le Sénégal importe ~44% de ses besoins. Source: FAO, USDA.',
    imageUrl: '/assets/crops/rice.jpg',
    soilRequirements: {
      phMin: 5.5,
      phMax: 7.0,
      textures: ['clay', 'loamy'],
      moistureMin: 60,
      moistureMax: 100,
      nitrogenMin: 40,
      nitrogenMax: 100,
      drainageRequired: ['poor', 'moderate']  // Riz irrigué tolère mauvais drainage
    },
    climateRequirements: {
      temperatureMin: 20,
      temperatureMax: 35,
      rainfallMin: 1000,  // Pluvial Casamance
      rainfallMax: 2000,
      sunlightHours: 8,
      climateTypes: ['tropical_humid', 'sudanese']
    },
    waterNeeds: 'very_high',  // 1100-1250mm, jusqu'à 2500L/kg riz
    cultivationCycle: {
      seedingMonths: [6, 7, 8],
      harvestMonths: [10, 11, 12],
      cycleDuration: 120,
      season: 'rainy'
    },
    yieldInfo: {
      // Source: Tanzania/Africa data - pluvial 1-2 t/ha, irrigué 2.5-4 t/ha
      averageYield: 2500,  // Irrigué Sénégal
      optimalYield: 6000,  // Irrigué optimisé
      unit: 'kg/ha'
    },
    commonDiseases: ['Pyriculariose', 'Bactériose', 'Foreurs', 'Toxicité fer'],
    tips: [
      'Irrigué: Vallée du Fleuve Sénégal (70% production)',
      'Pluvial: Casamance (rendements plus faibles)',
      'Système SRI économise 50% eau',
      'Gestion eau critique pour rendement'
    ]
  },
  {
    id: 'fonio',
    name: 'Fonio',
    nameFr: 'Fonio',
    scientificName: 'Digitaria exilis',
    category: 'cereals',
    description: 'Céréale traditionnelle à cycle très court (60-70 jours), très nutritive et sans gluten. Adapté aux sols pauvres.',
    imageUrl: '/assets/crops/fonio.jpg',
    soilRequirements: {
      phMin: 5.0,
      phMax: 7.0,
      textures: ['sandy', 'loamy'],
      moistureMin: 20,
      moistureMax: 50,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      temperatureMin: 25,
      temperatureMax: 38,
      rainfallMin: 400,
      rainfallMax: 900,
      sunlightHours: 8,
      climateTypes: ['sudanese', 'sudano_sahelian']
    },
    waterNeeds: 'low',
    cultivationCycle: {
      seedingMonths: [6, 7],
      harvestMonths: [9, 10],
      cycleDuration: 70,
      season: 'rainy'
    },
    yieldInfo: {
      averageYield: 600,
      optimalYield: 1000,
      unit: 'kg/ha'
    },
    tips: [
      'Cycle très court (60-70 jours)',
      'Adapté aux sols pauvres et acides',
      'Ne nécessite pas d\'engrais',
      'Culture de sécurité alimentaire'
    ]
  },

  // === LÉGUMINEUSES ===
  {
    id: 'arachide',
    name: 'Groundnut',
    nameFr: 'Arachide',
    scientificName: 'Arachis hypogaea',
    category: 'legumes',
    description: 'Culture principale du Bassin Arachidier, représentant historiquement 60% du PIB agricole. Rendements limités par sécheresse et sols dégradés. Source: World Bank, ICRISAT.',
    imageUrl: '/assets/crops/groundnut.jpg',
    soilRequirements: {
      // Source: FAO, Purdue, Wikifarmer
      phMin: 5.8,  // Optimal 5.8-6.2
      phMax: 6.5,  // Acceptable 5.5-7.0
      textures: ['sandy', 'loamy'],  // Sols légers pour récolte
      moistureMin: 30,
      moistureMax: 55,
      phosphorusMin: 15,
      phosphorusMax: 40,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      // Source: FAO - optimal 25-30°C, germination >21°C sol
      temperatureMin: 25,
      temperatureMax: 30,  // >35°C détrimental
      rainfallMin: 400,    // Variétés hâtives 250-400mm
      rainfallMax: 700,    // Variétés tardives 500-1000mm
      sunlightHours: 8,
      climateTypes: ['sudanese', 'sudano_sahelian']
    },
    waterNeeds: 'medium',
    cultivationCycle: {
      seedingMonths: [6, 7],
      harvestMonths: [10, 11],
      cycleDuration: 100,  // 90-120 jours selon variété
      season: 'rainy'
    },
    yieldInfo: {
      // Source: ICRISAT - SSA moyenne 964 kg/ha, potentiel 3500 kg/ha
      averageYield: 950,
      optimalYield: 2500,
      unit: 'kg/ha'
    },
    commonDiseases: ['Cercosporiose', 'Rosette', 'Aflatoxines', 'Rouille'],
    companionCrops: ['mil', 'sorgho'],
    tips: [
      'Sols légers et bien drainés obligatoires',
      'Calcium 300-600 kg/ha pour formation gousses',
      'Rotation importante pour fertilité',
      'Fixe l\'azote atmosphérique (légumineuse)'
    ]
  },
  {
    id: 'niebe',
    name: 'Cowpea',
    nameFr: 'Niébé',
    scientificName: 'Vigna unguiculata',
    category: 'legumes',
    description: 'Légumineuse très nutritive, résistante à la sécheresse. Culture intercalaire traditionnelle avec mil/sorgho. Feuilles comestibles.',
    imageUrl: '/assets/crops/cowpea.jpg',
    soilRequirements: {
      phMin: 5.5,
      phMax: 7.5,
      textures: ['sandy', 'loamy', 'clay'],
      moistureMin: 20,
      moistureMax: 50,
      drainageRequired: ['excellent', 'good', 'moderate']
    },
    climateRequirements: {
      temperatureMin: 20,
      temperatureMax: 35,
      rainfallMin: 300,
      rainfallMax: 700,
      sunlightHours: 8,
      climateTypes: ['sahel', 'sudano_sahelian', 'sudanese']
    },
    waterNeeds: 'low',
    cultivationCycle: {
      seedingMonths: [7, 8],
      harvestMonths: [10, 11],
      cycleDuration: 75,
      season: 'rainy'
    },
    yieldInfo: {
      averageYield: 500,
      optimalYield: 1500,
      unit: 'kg/ha'
    },
    commonDiseases: ['Thrips', 'Pucerons', 'Bruches'],
    companionCrops: ['mil', 'sorgho', 'mais'],
    tips: [
      'Excellente culture de rotation',
      'Fixe l\'azote atmosphérique',
      'Feuilles comestibles (source protéines)',
      'Association mil/niébé traditionnelle'
    ]
  },

  // === TUBERCULES ===
  {
    id: 'manioc',
    name: 'Cassava',
    nameFr: 'Manioc',
    scientificName: 'Manihot esculenta',
    category: 'tubers',
    description: 'Tubercule résistant à la sécheresse, source importante de glucides. Culture de sécurité alimentaire. Cycle long (12-18 mois).',
    imageUrl: '/assets/crops/cassava.jpg',
    soilRequirements: {
      phMin: 5.0,
      phMax: 7.0,
      textures: ['sandy', 'loamy'],
      moistureMin: 30,
      moistureMax: 60,
      potassiumMin: 80,
      potassiumMax: 200,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      temperatureMin: 20,
      temperatureMax: 35,
      rainfallMin: 500,
      rainfallMax: 1500,
      sunlightHours: 8,
      climateTypes: ['tropical_humid', 'sudanese', 'tropical_dry']
    },
    waterNeeds: 'medium',
    cultivationCycle: {
      seedingMonths: [5, 6, 7],
      harvestMonths: [1, 2, 3, 10, 11, 12],
      cycleDuration: 365,
      season: 'both'
    },
    yieldInfo: {
      averageYield: 12000,
      optimalYield: 25000,
      unit: 'kg/ha'
    },
    commonDiseases: ['Mosaïque', 'Cochenilles', 'Bactériose'],
    tips: [
      'Cycle long (12-18 mois)',
      'Tolère les sols pauvres',
      'Multiplication par bouturage',
      'Fort besoin en potassium'
    ]
  },
  {
    id: 'patate_douce',
    name: 'Sweet Potato',
    nameFr: 'Patate douce',
    scientificName: 'Ipomoea batatas',
    category: 'tubers',
    description: 'Tubercule nutritif à cycle court (4 mois), riche en vitamines A et C. Variétés à chair orange riches en bêta-carotène.',
    imageUrl: '/assets/crops/sweet-potato.jpg',
    soilRequirements: {
      phMin: 5.5,
      phMax: 6.5,
      textures: ['sandy', 'loamy'],
      moistureMin: 40,
      moistureMax: 70,
      potassiumMin: 100,
      potassiumMax: 250,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      temperatureMin: 20,
      temperatureMax: 35,
      rainfallMin: 500,
      rainfallMax: 1000,
      sunlightHours: 8,
      climateTypes: ['tropical_humid', 'sudanese', 'sudano_sahelian']
    },
    waterNeeds: 'medium',
    cultivationCycle: {
      seedingMonths: [6, 7, 8],
      harvestMonths: [10, 11, 12],
      cycleDuration: 120,
      season: 'rainy'
    },
    yieldInfo: {
      averageYield: 8000,
      optimalYield: 18000,
      unit: 'kg/ha'
    },
    companionCrops: ['mais', 'niebe'],
    tips: [
      'Sols légers et meubles',
      'Buttage recommandé',
      'Variétés OFSP riches en vitamine A'
    ]
  },

  // === LÉGUMES (MARAÎCHAGE) ===
  {
    id: 'tomate',
    name: 'Tomato',
    nameFr: 'Tomate',
    scientificName: 'Solanum lycopersicum',
    category: 'vegetables',
    description: 'Légume-fruit principal du maraîchage sénégalais. Zone des Niayes produit 80% des légumes du pays. Culture de contre-saison. Source: MDPI Agriculture.',
    imageUrl: '/assets/crops/tomato.jpg',
    soilRequirements: {
      phMin: 6.0,
      phMax: 7.0,
      textures: ['loamy', 'sandy'],
      moistureMin: 50,
      moistureMax: 70,
      nitrogenMin: 40,
      nitrogenMax: 80,
      phosphorusMin: 30,
      phosphorusMax: 60,
      organicMatterMin: 2,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      temperatureMin: 18,
      temperatureMax: 28,  // Niayes: climat modéré par brise marine
      rainfallMin: 350,
      rainfallMax: 700,
      sunlightHours: 8,
      climateTypes: ['tropical_humid', 'sudanese', 'tropical_dry']
    },
    waterNeeds: 'high',
    cultivationCycle: {
      seedingMonths: [10, 11, 12, 1],
      harvestMonths: [1, 2, 3, 4],
      cycleDuration: 90,
      season: 'dry'
    },
    yieldInfo: {
      averageYield: 20000,
      optimalYield: 50000,
      unit: 'kg/ha'
    },
    commonDiseases: ['Mildiou', 'Alternariose', 'Nématodes', 'Mouche blanche'],
    incompatibleCrops: ['pomme_de_terre', 'aubergine'],
    tips: [
      'Culture de contre-saison (oct-avril)',
      'Irrigation régulière obligatoire',
      'Tuteurage nécessaire',
      'Zone Niayes idéale (climat frais)'
    ]
  },
  {
    id: 'oignon',
    name: 'Onion',
    nameFr: 'Oignon',
    scientificName: 'Allium cepa',
    category: 'vegetables',
    description: 'Culture maraîchère majeure de la zone des Niayes. Producteurs fournissent 50-65% de la production nationale de légumes frais. Source: MDPI Agriculture, Wikipedia.',
    imageUrl: '/assets/crops/onion.jpg',
    soilRequirements: {
      // Source: Niayes study - pH 7.0-8.0 sols neutres
      phMin: 6.0,
      phMax: 7.5,
      textures: ['loamy', 'sandy'],
      moistureMin: 40,
      moistureMax: 65,
      nitrogenMin: 30,
      nitrogenMax: 70,
      phosphorusMin: 25,
      phosphorusMax: 50,
      organicMatterMin: 2,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      // Niayes: température modérée par brise marine
      temperatureMin: 15,
      temperatureMax: 28,
      rainfallMin: 300,  // Niayes: 300-450mm/an
      rainfallMax: 500,
      sunlightHours: 10,
      climateTypes: ['tropical_dry', 'sudano_sahelian']
    },
    waterNeeds: 'medium',
    cultivationCycle: {
      seedingMonths: [10, 11, 12],
      harvestMonths: [3, 4, 5],
      cycleDuration: 150,
      season: 'dry'
    },
    yieldInfo: {
      averageYield: 22000,
      optimalYield: 45000,
      unit: 'kg/ha'
    },
    commonDiseases: ['Mildiou', 'Thrips', 'Pourriture'],
    tips: [
      'Culture de saison sèche (oct-mai)',
      'Sols légers bien drainés',
      'Zone des Niayes idéale',
      'Nappe phréatique peu profonde avantageuse'
    ]
  },
  {
    id: 'chou',
    name: 'Cabbage',
    nameFr: 'Chou',
    scientificName: 'Brassica oleracea',
    category: 'vegetables',
    description: 'Légume populaire cultivé en saison sèche dans la zone des Niayes. Préfère températures fraîches.',
    imageUrl: '/assets/crops/cabbage.jpg',
    soilRequirements: {
      phMin: 6.0,
      phMax: 7.5,
      textures: ['loamy', 'clay'],
      moistureMin: 50,
      moistureMax: 75,
      nitrogenMin: 50,
      nitrogenMax: 100,
      organicMatterMin: 2,
      drainageRequired: ['good', 'moderate']
    },
    climateRequirements: {
      temperatureMin: 15,
      temperatureMax: 25,
      rainfallMin: 400,
      rainfallMax: 700,
      sunlightHours: 6,
      climateTypes: ['tropical_dry', 'sudano_sahelian']
    },
    waterNeeds: 'high',
    cultivationCycle: {
      seedingMonths: [10, 11, 12],
      harvestMonths: [1, 2, 3, 4],
      cycleDuration: 90,
      season: 'dry'
    },
    yieldInfo: {
      averageYield: 28000,
      optimalYield: 55000,
      unit: 'kg/ha'
    },
    commonDiseases: ['Chenilles', 'Pucerons', 'Nervation noire'],
    tips: [
      'Préfère les températures fraîches',
      'Arrosage régulier',
      'Paillage recommandé',
      'Culture de saison sèche'
    ]
  },
  {
    id: 'carotte',
    name: 'Carrot',
    nameFr: 'Carotte',
    scientificName: 'Daucus carota',
    category: 'vegetables',
    description: 'Légume-racine cultivé dans les sols sableux de la zone des Niayes. Nécessite sols profonds et meubles.',
    imageUrl: '/assets/crops/carrot.jpg',
    soilRequirements: {
      phMin: 6.0,
      phMax: 7.0,
      textures: ['sandy', 'loamy'],
      moistureMin: 40,
      moistureMax: 65,
      potassiumMin: 80,
      potassiumMax: 150,
      organicMatterMin: 1.5,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      temperatureMin: 15,
      temperatureMax: 25,
      rainfallMin: 300,
      rainfallMax: 550,
      sunlightHours: 8,
      climateTypes: ['tropical_dry', 'sudano_sahelian']
    },
    waterNeeds: 'medium',
    cultivationCycle: {
      seedingMonths: [10, 11, 12],
      harvestMonths: [2, 3, 4],
      cycleDuration: 100,
      season: 'dry'
    },
    yieldInfo: {
      averageYield: 22000,
      optimalYield: 40000,
      unit: 'kg/ha'
    },
    commonDiseases: ['Mouche de la carotte', 'Nématodes', 'Alternariose'],
    tips: [
      'Sols profonds et meubles obligatoires',
      'Éviter les sols caillouteux',
      'Éclaircissage nécessaire',
      'Sols sableux de Niayes idéaux'
    ]
  },
  {
    id: 'haricot_vert',
    name: 'Green Bean',
    nameFr: 'Haricot vert',
    scientificName: 'Phaseolus vulgaris',
    category: 'vegetables',
    description: 'Légumineuse maraîchère cultivée pour l\'export (Europe) et le marché local. Culture d\'exportation importante.',
    imageUrl: '/assets/crops/green-bean.jpg',
    soilRequirements: {
      phMin: 6.0,
      phMax: 7.0,
      textures: ['loamy', 'sandy'],
      moistureMin: 40,
      moistureMax: 60,
      phosphorusMin: 20,
      phosphorusMax: 45,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      temperatureMin: 18,
      temperatureMax: 28,
      rainfallMin: 400,
      rainfallMax: 700,
      sunlightHours: 8,
      climateTypes: ['tropical_dry', 'sudano_sahelian', 'sudanese']
    },
    waterNeeds: 'medium',
    cultivationCycle: {
      seedingMonths: [10, 11, 12, 1],
      harvestMonths: [12, 1, 2, 3],
      cycleDuration: 60,
      season: 'dry'
    },
    yieldInfo: {
      averageYield: 7000,
      optimalYield: 12000,
      unit: 'kg/ha'
    },
    commonDiseases: ['Anthracnose', 'Rouille', 'Mouche'],
    tips: [
      'Cycle court (60 jours)',
      'Récoltes multiples possibles',
      'Culture d\'exportation vers Europe',
      'Contre-saison octobre-mars'
    ]
  },

  // === OLÉAGINEUX ===
  {
    id: 'sesame',
    name: 'Sesame',
    nameFr: 'Sésame',
    scientificName: 'Sesamum indicum',
    category: 'oilseeds',
    description: 'Culture oléagineuse adaptée aux zones semi-arides. Culture de diversification en expansion.',
    imageUrl: '/assets/crops/sesame.jpg',
    soilRequirements: {
      phMin: 5.5,
      phMax: 8.0,
      textures: ['sandy', 'loamy'],
      moistureMin: 25,
      moistureMax: 50,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      temperatureMin: 25,
      temperatureMax: 40,
      rainfallMin: 300,
      rainfallMax: 600,
      sunlightHours: 10,
      climateTypes: ['sahel', 'sudano_sahelian', 'sudanese']
    },
    waterNeeds: 'low',
    cultivationCycle: {
      seedingMonths: [7, 8],
      harvestMonths: [10, 11],
      cycleDuration: 90,
      season: 'rainy'
    },
    yieldInfo: {
      averageYield: 350,
      optimalYield: 700,
      unit: 'kg/ha'
    },
    tips: [
      'Résistant à la sécheresse',
      'Sols bien drainés obligatoires',
      'Culture de diversification',
      'Demande export croissante'
    ]
  },

  // === CULTURES INDUSTRIELLES ===
  {
    id: 'coton',
    name: 'Cotton',
    nameFr: 'Coton',
    scientificName: 'Gossypium hirsutum',
    category: 'industrial',
    description: 'Culture industrielle majeure du Sénégal Oriental pour la fibre textile. Demande main d\'oeuvre importante.',
    imageUrl: '/assets/crops/cotton.jpg',
    soilRequirements: {
      phMin: 5.5,
      phMax: 8.0,
      textures: ['loamy', 'clay'],
      moistureMin: 35,
      moistureMax: 60,
      nitrogenMin: 30,
      nitrogenMax: 80,
      drainageRequired: ['good', 'moderate']
    },
    climateRequirements: {
      temperatureMin: 20,
      temperatureMax: 38,
      rainfallMin: 600,
      rainfallMax: 1000,
      sunlightHours: 8,
      climateTypes: ['sudanese', 'sudano_sahelian']
    },
    waterNeeds: 'medium',
    cultivationCycle: {
      seedingMonths: [6, 7],
      harvestMonths: [11, 12, 1],
      cycleDuration: 150,
      season: 'rainy'
    },
    yieldInfo: {
      averageYield: 900,
      optimalYield: 1800,
      unit: 'kg/ha'
    },
    commonDiseases: ['Jassides', 'Pucerons', 'Chenilles'],
    tips: [
      'Culture exigeante en main d\'oeuvre',
      'Suivi phytosanitaire obligatoire',
      'Zone Sénégal Oriental',
      'Graines: sous-produit pour huile'
    ]
  },
  {
    id: 'canne_sucre',
    name: 'Sugarcane',
    nameFr: 'Canne à sucre',
    scientificName: 'Saccharum officinarum',
    category: 'industrial',
    description: 'Culture industrielle irriguée dans la Vallée du Fleuve Sénégal (Richard-Toll). Plantations extensives depuis construction barrages Diama/Manantali. Source: Britannica, EIB.',
    imageUrl: '/assets/crops/sugarcane.jpg',
    soilRequirements: {
      phMin: 5.5,
      phMax: 7.5,
      textures: ['loamy', 'clay'],
      moistureMin: 60,
      moistureMax: 85,
      nitrogenMin: 50,
      nitrogenMax: 120,
      drainageRequired: ['good', 'moderate']
    },
    climateRequirements: {
      temperatureMin: 20,
      temperatureMax: 38,
      rainfallMin: 1000,  // Irrigation obligatoire dans Vallée
      rainfallMax: 2000,
      sunlightHours: 8,
      climateTypes: ['tropical_humid', 'sudanese']
    },
    waterNeeds: 'very_high',
    cultivationCycle: {
      seedingMonths: [6, 7, 8],
      harvestMonths: [1, 2, 3, 4, 5],
      cycleDuration: 365,
      season: 'both'
    },
    yieldInfo: {
      averageYield: 70000,
      optimalYield: 120000,
      unit: 'kg/ha'
    },
    tips: [
      'Culture irriguée obligatoire',
      'Cycle pluriannuel (repousses)',
      'Richard-Toll: principale zone',
      'Barrages Diama/Manantali essentiels'
    ]
  },

  // === FRUITS ===
  {
    id: 'mangue',
    name: 'Mango',
    nameFr: 'Mangue',
    scientificName: 'Mangifera indica',
    category: 'fruits',
    description: 'Fruit tropical majeur à fort potentiel d\'exportation. Verger pérenne (production après 5 ans). Zones Niayes et Casamance.',
    imageUrl: '/assets/crops/mango.jpg',
    soilRequirements: {
      phMin: 5.5,
      phMax: 7.5,
      textures: ['loamy', 'sandy'],
      moistureMin: 30,
      moistureMax: 60,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      temperatureMin: 20,
      temperatureMax: 40,
      rainfallMin: 500,
      rainfallMax: 1500,
      sunlightHours: 8,
      climateTypes: ['tropical_humid', 'sudanese', 'sudano_sahelian']
    },
    waterNeeds: 'medium',
    cultivationCycle: {
      seedingMonths: [6, 7, 8],
      harvestMonths: [4, 5, 6, 7],
      cycleDuration: 1825,  // 5 ans avant production
      season: 'dry'
    },
    yieldInfo: {
      averageYield: 8000,
      optimalYield: 20000,
      unit: 'kg/ha'
    },
    commonDiseases: ['Anthracnose', 'Mouche des fruits', 'Cochenilles'],
    tips: [
      'Verger pérenne (25+ ans)',
      'Production significative après 5 ans',
      'Export vers Europe',
      'Traitement mouche des fruits crucial'
    ]
  },
  {
    id: 'banane',
    name: 'Banana',
    nameFr: 'Banane',
    scientificName: 'Musa spp.',
    category: 'fruits',
    description: 'Fruit tropical cultivé en Casamance (zone humide) et zones irriguées. Exige sols riches et humidité constante.',
    imageUrl: '/assets/crops/banana.jpg',
    soilRequirements: {
      phMin: 5.5,
      phMax: 7.0,
      textures: ['loamy', 'clay'],
      moistureMin: 50,
      moistureMax: 80,
      potassiumMin: 150,
      potassiumMax: 300,
      organicMatterMin: 2,
      drainageRequired: ['good', 'moderate']
    },
    climateRequirements: {
      temperatureMin: 20,
      temperatureMax: 35,
      rainfallMin: 1200,
      rainfallMax: 2500,
      sunlightHours: 8,
      climateTypes: ['tropical_humid']
    },
    waterNeeds: 'very_high',
    cultivationCycle: {
      seedingMonths: [5, 6, 7],
      harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      cycleDuration: 365,
      season: 'both'
    },
    yieldInfo: {
      averageYield: 22000,
      optimalYield: 45000,
      unit: 'kg/ha'
    },
    commonDiseases: ['Cercosporiose noire', 'Charançon', 'Fusariose'],
    tips: [
      'Irrigation nécessaire hors Casamance',
      'Sols riches et humides',
      'Fort besoin en potassium',
      'Culture pérenne'
    ]
  },
  {
    id: 'pasteque',
    name: 'Watermelon',
    nameFr: 'Pastèque',
    scientificName: 'Citrullus lanatus',
    category: 'fruits',
    description: 'Cucurbitacée à cycle court très rentable. Culture de contre-saison populaire. Sols sableux préférés.',
    imageUrl: '/assets/crops/watermelon.jpg',
    soilRequirements: {
      phMin: 6.0,
      phMax: 7.0,
      textures: ['sandy', 'loamy'],
      moistureMin: 40,
      moistureMax: 65,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      temperatureMin: 25,
      temperatureMax: 38,
      rainfallMin: 400,
      rainfallMax: 700,
      sunlightHours: 10,
      climateTypes: ['tropical_dry', 'sudanese', 'sudano_sahelian']
    },
    waterNeeds: 'medium',
    cultivationCycle: {
      seedingMonths: [11, 12, 1, 2],
      harvestMonths: [2, 3, 4, 5],
      cycleDuration: 90,
      season: 'dry'
    },
    yieldInfo: {
      averageYield: 25000,
      optimalYield: 50000,
      unit: 'kg/ha'
    },
    tips: [
      'Culture de contre-saison',
      'Sols sableux bien drainés',
      'Irrigation goutte-à-goutte efficace',
      'Très rentable'
    ]
  },

  // === NOUVELLES LÉGUMINEUSES ===
  {
    id: 'pois_bambara',
    name: 'Bambara Groundnut',
    nameFr: 'Pois Bambara (Voandzou)',
    scientificName: 'Vigna subterranea',
    category: 'legumes',
    description: 'Troisième légumineuse la plus importante en Afrique après l\'arachide et le niébé. Très résistante à la sécheresse, adaptée aux sols pauvres. Originaire d\'Afrique de l\'Ouest. Source: FAO, Crop Trust, WISC Extension.',
    imageUrl: '/assets/crops/bambara.jpg',
    soilRequirements: {
      // Source: FAO, NDA South Africa, Wisconsin Extension
      phMin: 5.0,
      phMax: 6.5,
      textures: ['sandy', 'loamy'],
      moistureMin: 20,
      moistureMax: 50,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      // Source: Crop Trust - 20-28°C optimal, 500-600mm rainfall
      temperatureMin: 20,
      temperatureMax: 28,
      rainfallMin: 500,
      rainfallMax: 600,
      sunlightHours: 8,
      climateTypes: ['sudanese', 'sudano_sahelian', 'tropical_dry']
    },
    waterNeeds: 'low',
    cultivationCycle: {
      seedingMonths: [6, 7],
      harvestMonths: [10, 11],
      cycleDuration: 120,
      season: 'rainy'
    },
    yieldInfo: {
      // Source: FAO - 600-1000 kg/ha, jusqu'à 3000 kg/ha au Nigeria
      averageYield: 800,
      optimalYield: 3000,
      unit: 'kg/ha'
    },
    commonDiseases: ['Cercosporiose', 'Pourriture des gousses'],
    companionCrops: ['mil', 'sorgho'],
    tips: [
      'Très tolérante à la sécheresse',
      'Adapté aux sols pauvres et peu fertiles',
      'Sensible aux excès d\'eau avant récolte',
      'Plante de jour court (<12h)',
      'Fixe l\'azote atmosphérique'
    ]
  },
  {
    id: 'soja',
    name: 'Soybean',
    nameFr: 'Soja',
    scientificName: 'Glycine max',
    category: 'legumes',
    description: 'Légumineuse oléagineuse riche en protéines. Culture en expansion en Afrique de l\'Ouest pour l\'alimentation animale et humaine. Source: Frontiers, MDPI, ScienceDirect.',
    imageUrl: '/assets/crops/soybean.jpg',
    soilRequirements: {
      // Source: Frontiers, Tandfonline - pH 5.2-6.5 optimal
      phMin: 5.5,
      phMax: 7.0,
      textures: ['loamy', 'clay'],
      moistureMin: 40,
      moistureMax: 70,
      nitrogenMin: 20,
      nitrogenMax: 50,
      phosphorusMin: 20,
      phosphorusMax: 45,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      // Source: MDPI, Frontiers - 20-30°C, 500-900mm
      temperatureMin: 20,
      temperatureMax: 30,
      rainfallMin: 500,
      rainfallMax: 900,
      sunlightHours: 8,
      climateTypes: ['sudanese', 'sudano_sahelian', 'tropical_humid']
    },
    waterNeeds: 'medium',
    cultivationCycle: {
      seedingMonths: [6, 7],
      harvestMonths: [10, 11],
      cycleDuration: 110,
      season: 'rainy'
    },
    yieldInfo: {
      // Source: Frontiers - Afrique 1.5 t/ha, optimal 2.4 t/ha
      averageYield: 1500,
      optimalYield: 2400,
      unit: 'kg/ha'
    },
    commonDiseases: ['Rouille', 'Cercosporiose', 'Fonte des semis'],
    companionCrops: ['mais'],
    tips: [
      'Inoculation avec Rhizobium recommandée',
      'Sensible à l\'acidité du sol (pH<5.2)',
      'Fixe l\'azote atmosphérique',
      'Culture en rotation bénéfique'
    ]
  },

  // === NOUVEAUX LÉGUMES ===
  {
    id: 'gombo',
    name: 'Okra',
    nameFr: 'Gombo',
    scientificName: 'Abelmoschus esculentus',
    category: 'vegetables',
    description: 'Légume-fruit tropical très populaire en Afrique de l\'Ouest. Résistant à la chaleur et à la sécheresse. Riche en fibres et vitamines. Source: Frontiers, AJOL, CABI.',
    imageUrl: '/assets/crops/okra.jpg',
    soilRequirements: {
      // Source: Frontiers, Wikipedia, Oklahoma State
      phMin: 5.8,
      phMax: 7.0,
      textures: ['loamy', 'sandy', 'clay'],
      moistureMin: 35,
      moistureMax: 65,
      nitrogenMin: 50,
      nitrogenMax: 150,
      phosphorusMin: 37,
      phosphorusMax: 112,
      organicMatterMin: 1.5,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      // Source: CABI, Frontiers - 25-32°C optimal
      temperatureMin: 25,
      temperatureMax: 35,
      rainfallMin: 600,
      rainfallMax: 1000,
      sunlightHours: 8,
      climateTypes: ['tropical_humid', 'sudanese', 'sudano_sahelian']
    },
    waterNeeds: 'medium',
    cultivationCycle: {
      seedingMonths: [5, 6, 7],
      harvestMonths: [8, 9, 10, 11],
      cycleDuration: 60,
      season: 'rainy'
    },
    yieldInfo: {
      // Source: Frontiers Ethiopia - jusqu'à 20 t/ha optimal
      averageYield: 8000,
      optimalYield: 20000,
      unit: 'kg/ha'
    },
    commonDiseases: ['Jaunisse des nervures', 'Oïdium', 'Pucerons'],
    tips: [
      'Récoltes multiples (tous les 2-3 jours)',
      'Tolère bien chaleur et sécheresse',
      'Espacement 50cm x 40cm recommandé',
      'Variété A. caillei adaptée Afrique Ouest'
    ]
  },
  {
    id: 'aubergine',
    name: 'Eggplant',
    nameFr: 'Aubergine',
    scientificName: 'Solanum melongena',
    category: 'vegetables',
    description: 'Légume-fruit de la famille des Solanacées, 5ème légume économique mondial. Variétés africaines S. aethiopicum et S. macrocarpon localement importantes. Source: PMC, ResearchGate, WorldVeg.',
    imageUrl: '/assets/crops/eggplant.jpg',
    soilRequirements: {
      // Source: ResearchGate, PMC
      phMin: 5.5,
      phMax: 7.0,
      textures: ['loamy', 'sandy'],
      moistureMin: 45,
      moistureMax: 70,
      nitrogenMin: 40,
      nitrogenMax: 80,
      phosphorusMin: 25,
      phosphorusMax: 50,
      organicMatterMin: 2,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      temperatureMin: 20,
      temperatureMax: 35,
      rainfallMin: 500,
      rainfallMax: 900,
      sunlightHours: 8,
      climateTypes: ['tropical_humid', 'sudanese', 'tropical_dry']
    },
    waterNeeds: 'high',
    cultivationCycle: {
      seedingMonths: [10, 11, 12, 1],
      harvestMonths: [2, 3, 4, 5],
      cycleDuration: 100,
      season: 'dry'
    },
    yieldInfo: {
      averageYield: 18000,
      optimalYield: 35000,
      unit: 'kg/ha'
    },
    commonDiseases: ['Flétrissement bactérien', 'Mildiou', 'Acariens'],
    incompatibleCrops: ['tomate', 'pomme_de_terre'],
    tips: [
      'Éviter rotation avec autres Solanacées',
      'Tuteurage recommandé',
      'Irrigation régulière nécessaire',
      'Culture de contre-saison'
    ]
  },
  {
    id: 'piment',
    name: 'Hot Pepper',
    nameFr: 'Piment',
    scientificName: 'Capsicum annuum / C. frutescens',
    category: 'vegetables',
    description: 'Condiment essentiel de la cuisine africaine. Cultivé dans diverses zones écologiques du niveau de la mer jusqu\'à 2000m. Source: Ghana MoFA, OpenAccessPub, Wiley.',
    imageUrl: '/assets/crops/hot-pepper.jpg',
    soilRequirements: {
      // Source: MoFA Ghana, OpenAccessPub Ethiopia
      phMin: 5.5,
      phMax: 6.8,
      textures: ['loamy', 'sandy'],
      moistureMin: 40,
      moistureMax: 65,
      nitrogenMin: 30,
      nitrogenMax: 70,
      phosphorusMin: 20,
      phosphorusMax: 45,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      // Source: OpenAccessPub - 15-32°C, optimal 18-30°C
      temperatureMin: 18,
      temperatureMax: 32,
      rainfallMin: 500,
      rainfallMax: 800,
      sunlightHours: 8,
      climateTypes: ['tropical_humid', 'sudanese', 'sudano_sahelian', 'tropical_dry']
    },
    waterNeeds: 'medium',
    cultivationCycle: {
      seedingMonths: [10, 11, 12],
      harvestMonths: [2, 3, 4, 5],
      cycleDuration: 90,
      season: 'dry'
    },
    yieldInfo: {
      averageYield: 5000,
      optimalYield: 12000,
      unit: 'kg/ha'
    },
    commonDiseases: ['Anthracnose', 'Virus mosaïque', 'Pucerons'],
    tips: [
      'Stress hydrique augmente la piquance',
      'Germination optimale 25-30°C',
      'Fleurs tombent si >29°C ou <15°C',
      'Récoltes multiples sur 3-4 mois'
    ]
  },
  {
    id: 'poivron',
    name: 'Sweet Pepper',
    nameFr: 'Poivron',
    scientificName: 'Capsicum annuum (var. grossum)',
    category: 'vegetables',
    description: 'Variété douce du piment, cultivée pour ses fruits charnus. Culture maraîchère de contre-saison dans la zone des Niayes.',
    imageUrl: '/assets/crops/sweet-pepper.jpg',
    soilRequirements: {
      phMin: 6.0,
      phMax: 7.0,
      textures: ['loamy', 'sandy'],
      moistureMin: 45,
      moistureMax: 70,
      nitrogenMin: 40,
      nitrogenMax: 80,
      phosphorusMin: 25,
      phosphorusMax: 50,
      organicMatterMin: 2,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      temperatureMin: 18,
      temperatureMax: 28,
      rainfallMin: 450,
      rainfallMax: 700,
      sunlightHours: 8,
      climateTypes: ['tropical_dry', 'sudanese', 'sudano_sahelian']
    },
    waterNeeds: 'high',
    cultivationCycle: {
      seedingMonths: [10, 11, 12],
      harvestMonths: [1, 2, 3, 4],
      cycleDuration: 85,
      season: 'dry'
    },
    yieldInfo: {
      averageYield: 15000,
      optimalYield: 35000,
      unit: 'kg/ha'
    },
    commonDiseases: ['Anthracnose', 'Mildiou', 'Nématodes'],
    incompatibleCrops: ['tomate', 'aubergine'],
    tips: [
      'Plus sensible au froid que le piment',
      'Irrigation régulière obligatoire',
      'Tuteurage recommandé',
      'Zones Niayes idéales'
    ]
  },
  {
    id: 'laitue',
    name: 'Lettuce',
    nameFr: 'Laitue',
    scientificName: 'Lactuca sativa',
    category: 'vegetables',
    description: 'Légume-feuille cultivé en contre-saison dans les zones fraîches. Nécessite températures modérées, sensible à la chaleur. Source: Farmer\'s Journal Africa, KZN DARD.',
    imageUrl: '/assets/crops/lettuce.jpg',
    soilRequirements: {
      // Source: KZN DARD South Africa, Farmer's Journal
      phMin: 5.5,
      phMax: 6.5,
      textures: ['loamy', 'sandy'],
      moistureMin: 50,
      moistureMax: 75,
      nitrogenMin: 30,
      nitrogenMax: 60,
      organicMatterMin: 2,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      // Source: Multiple - 15-21°C optimal, bolt >24°C
      temperatureMin: 15,
      temperatureMax: 21,
      rainfallMin: 300,
      rainfallMax: 500,
      sunlightHours: 6,
      climateTypes: ['tropical_dry']
    },
    waterNeeds: 'high',
    cultivationCycle: {
      seedingMonths: [11, 12, 1],
      harvestMonths: [1, 2, 3],
      cycleDuration: 60,
      season: 'dry'
    },
    yieldInfo: {
      averageYield: 20000,
      optimalYield: 35000,
      unit: 'kg/ha'
    },
    commonDiseases: ['Mildiou', 'Pourriture', 'Pucerons'],
    tips: [
      'Cultiver uniquement en saison fraîche',
      'Montaison rapide si >24°C',
      'Variétés feuilles plus tolérantes chaleur',
      'Réfrigérer graines avant semis si chaud',
      'Zone Niayes en décembre-février'
    ]
  },
  {
    id: 'courge',
    name: 'Pumpkin/Squash',
    nameFr: 'Courge/Potiron',
    scientificName: 'Cucurbita moschata / C. maxima',
    category: 'vegetables',
    description: 'Cucurbitacée polyvalente cultivée pour ses fruits et feuilles comestibles. Très répandue en Afrique tropicale. Source: Oklahoma State, Horticulture.org.za, Tropical Plants.',
    imageUrl: '/assets/crops/pumpkin.jpg',
    soilRequirements: {
      // Source: Oklahoma State, Horticulture SA
      phMin: 5.5,
      phMax: 7.0,
      textures: ['loamy', 'sandy'],
      moistureMin: 40,
      moistureMax: 65,
      potassiumMin: 75,
      potassiumMax: 150,
      organicMatterMin: 1.5,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      // Source: Multiple - 20-30°C optimal, sensible gel
      temperatureMin: 18,
      temperatureMax: 35,
      rainfallMin: 500,
      rainfallMax: 900,
      sunlightHours: 8,
      climateTypes: ['tropical_humid', 'sudanese', 'sudano_sahelian']
    },
    waterNeeds: 'medium',
    cultivationCycle: {
      seedingMonths: [6, 7, 8],
      harvestMonths: [9, 10, 11],
      cycleDuration: 100,
      season: 'rainy'
    },
    yieldInfo: {
      // Source: Tropical Plants - 5-15 t/ha, 30 t/ha amélioré
      averageYield: 12000,
      optimalYield: 30000,
      unit: 'kg/ha'
    },
    commonDiseases: ['Oïdium', 'Mildiou', 'Mouche des fruits'],
    companionCrops: ['mais', 'haricot'],
    tips: [
      'Feuilles aussi consommées (légume)',
      'Bonne conservation (3-6 mois)',
      'Température sol >18°C pour germination',
      'Association mais-courge-haricot traditionnelle'
    ]
  },

  // === NOUVEAUX FRUITS ===
  {
    id: 'papaye',
    name: 'Papaya',
    nameFr: 'Papaye',
    scientificName: 'Carica papaya',
    category: 'fruits',
    description: 'Fruit tropical à croissance rapide (production en 10-12 mois). Riche en papaïne et vitamines. Cultivé en Casamance et zones irriguées. Source: IFAS Florida, Agriculture Institute.',
    imageUrl: '/assets/crops/papaya.jpg',
    soilRequirements: {
      // Source: IFAS, Agriculture Institute, Kiran
      phMin: 5.5,
      phMax: 7.0,
      textures: ['loamy', 'sandy'],
      moistureMin: 40,
      moistureMax: 70,
      nitrogenMin: 30,
      nitrogenMax: 70,
      organicMatterMin: 2,
      drainageRequired: ['excellent', 'good']  // Très sensible à l'engorgement
    },
    climateRequirements: {
      // Source: Multiple - 20-35°C, optimal 25-30°C
      temperatureMin: 20,
      temperatureMax: 35,
      rainfallMin: 1000,
      rainfallMax: 1800,
      sunlightHours: 8,
      climateTypes: ['tropical_humid', 'sudanese']
    },
    waterNeeds: 'high',
    cultivationCycle: {
      seedingMonths: [5, 6, 7],
      harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      cycleDuration: 300,  // 10 mois avant première récolte
      season: 'both'
    },
    yieldInfo: {
      // Source: Agriculture Institute
      averageYield: 30000,
      optimalYield: 60000,
      unit: 'kg/ha'
    },
    commonDiseases: ['Virus mosaïque', 'Anthracnose', 'Phytophthora'],
    tips: [
      'Production dès 10-12 mois après semis',
      'Très sensible au froid (<10°C)',
      'Drainage parfait obligatoire',
      'Replanter tous les 3-4 ans',
      'Casamance et zones irriguées'
    ]
  },
  {
    id: 'melon',
    name: 'Melon',
    nameFr: 'Melon',
    scientificName: 'Cucumis melo',
    category: 'fruits',
    description: 'Cucurbitacée originaire d\'Afrique/Asie cultivée pour ses fruits sucrés. Culture de contre-saison rentable. Source: Virginia Tech, MDPI, Tropical Plants.',
    imageUrl: '/assets/crops/melon.jpg',
    soilRequirements: {
      // Source: Virginia Tech, Agroblog
      phMin: 6.0,
      phMax: 7.5,
      textures: ['sandy', 'loamy'],
      moistureMin: 35,
      moistureMax: 60,
      potassiumMin: 80,
      potassiumMax: 150,
      organicMatterMin: 1.5,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      // Source: Multiple - 25-32°C optimal
      temperatureMin: 25,
      temperatureMax: 35,
      rainfallMin: 400,
      rainfallMax: 700,
      sunlightHours: 10,
      climateTypes: ['tropical_dry', 'sudanese', 'sudano_sahelian']
    },
    waterNeeds: 'medium',
    cultivationCycle: {
      seedingMonths: [11, 12, 1, 2],
      harvestMonths: [2, 3, 4, 5],
      cycleDuration: 85,
      season: 'dry'
    },
    yieldInfo: {
      averageYield: 20000,
      optimalYield: 40000,
      unit: 'kg/ha'
    },
    commonDiseases: ['Oïdium', 'Fusariose', 'Pucerons'],
    tips: [
      'Température sol >20°C pour germination',
      'Irrigation goutte-à-goutte efficace',
      'Réduire eau à maturation (sucre)',
      'Culture de contre-saison rentable'
    ]
  },
  {
    id: 'anacarde',
    name: 'Cashew',
    nameFr: 'Anacarde (Noix de cajou)',
    scientificName: 'Anacardium occidentale',
    category: 'fruits',
    description: 'Arbre fruitier dont on récolte les noix. L\'Afrique de l\'Ouest est le premier producteur mondial de noix de cajou brutes. Culture pérenne importante pour l\'export. Source: African Cashew Alliance, OMICS, Science Publishing Group.',
    imageUrl: '/assets/crops/cashew.jpg',
    soilRequirements: {
      // Source: Gardenia, Science Publishing Group
      phMin: 5.5,
      phMax: 7.0,
      textures: ['sandy', 'loamy'],
      moistureMin: 25,
      moistureMax: 55,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      // Source: OMICS, Science Publishing Group
      temperatureMin: 20,
      temperatureMax: 38,
      rainfallMin: 500,   // Minimum viable
      rainfallMax: 1500,  // Peut aller jusqu'à 3500mm
      sunlightHours: 8,
      climateTypes: ['sudanese', 'sudano_sahelian', 'tropical_humid']
    },
    waterNeeds: 'low',
    cultivationCycle: {
      seedingMonths: [6, 7, 8],
      harvestMonths: [2, 3, 4, 5],
      cycleDuration: 1825,  // 5 ans avant production significative
      season: 'dry'
    },
    yieldInfo: {
      // Source: Science Publishing Group - Afrique 700 kg/ha, mondial 1300 kg/ha
      averageYield: 700,
      optimalYield: 1500,
      unit: 'kg/ha'
    },
    commonDiseases: ['Anthracnose', 'Oïdium', 'Cochenilles'],
    tips: [
      'Culture pérenne (30+ ans productifs)',
      'Production significative après 5 ans',
      'Tolère sols pauvres et sécheresse',
      'Période sèche nécessaire floraison',
      'Casamance et Sénégal Oriental',
      'Pomme de cajou aussi valorisable'
    ]
  },
  {
    id: 'agrumes',
    name: 'Citrus',
    nameFr: 'Agrumes (Orange, Citron)',
    scientificName: 'Citrus spp.',
    category: 'fruits',
    description: 'Arbres fruitiers produisant oranges, citrons, mandarines. Cultivés dans les zones à climat modéré ou irriguées. Source: FAO, Yara, EOLSS, Haifa Group.',
    imageUrl: '/assets/crops/citrus.jpg',
    soilRequirements: {
      // Source: FAO, Yara, Haifa
      phMin: 5.5,
      phMax: 7.5,
      textures: ['loamy', 'sandy'],
      moistureMin: 40,
      moistureMax: 70,
      nitrogenMin: 40,
      nitrogenMax: 100,
      drainageRequired: ['excellent', 'good']
    },
    climateRequirements: {
      // Source: FAO - 23-30°C optimal
      temperatureMin: 13,
      temperatureMax: 37,
      rainfallMin: 1000,
      rainfallMax: 2500,
      sunlightHours: 8,
      climateTypes: ['tropical_humid', 'sudanese', 'tropical_dry']
    },
    waterNeeds: 'high',
    cultivationCycle: {
      seedingMonths: [6, 7, 8],
      harvestMonths: [11, 12, 1, 2, 3],
      cycleDuration: 1460,  // 4 ans avant production
      season: 'both'
    },
    yieldInfo: {
      // Source: Yara
      averageYield: 15000,
      optimalYield: 35000,
      unit: 'kg/ha'
    },
    commonDiseases: ['Tristeza', 'Gommose', 'Cochenilles', 'Mouche des fruits'],
    tips: [
      'Culture pérenne (20+ ans)',
      'Période de repos nécessaire (stress hydrique)',
      'Irrigation obligatoire zones sèches',
      'Sensible au gel (<-4°C)',
      'Niayes et zones irriguées'
    ]
  },

  // === CULTURE INDUSTRIELLE SUPPLÉMENTAIRE ===
  {
    id: 'bissap',
    name: 'Roselle/Hibiscus',
    nameFr: 'Bissap (Hibiscus)',
    scientificName: 'Hibiscus sabdariffa',
    category: 'industrial',
    description: 'Plante dont les calices séchés produisent la boisson nationale du Sénégal. Cultivé des zones arides à équatoriales. Usage alimentaire, médicinal et textile. Source: FAO, ResearchGate, De Gruyter, Springer.',
    imageUrl: '/assets/crops/bissap.jpg',
    soilRequirements: {
      // Source: FAO Hibiscus Compendium
      phMin: 5.5,
      phMax: 8.0,
      textures: ['loamy', 'sandy', 'clay'],
      moistureMin: 30,
      moistureMax: 60,
      drainageRequired: ['excellent', 'good', 'moderate']
    },
    climateRequirements: {
      // Source: FAO - 130-250mm/mois premiers 3-4 mois
      temperatureMin: 20,
      temperatureMax: 38,
      rainfallMin: 400,
      rainfallMax: 1000,
      sunlightHours: 8,
      climateTypes: ['sahel', 'sudano_sahelian', 'sudanese', 'tropical_humid']
    },
    waterNeeds: 'medium',
    cultivationCycle: {
      seedingMonths: [6, 7],
      harvestMonths: [11, 12],
      cycleDuration: 150,
      season: 'rainy'
    },
    yieldInfo: {
      // Source: ResearchGate - calices séchés
      averageYield: 600,   // Calices séchés
      optimalYield: 1200,
      unit: 'kg/ha'
    },
    commonDiseases: ['Pourriture des racines', 'Fusariose'],
    tips: [
      'Plante de jour court (<12h)',
      'Période sèche nécessaire pour récolte',
      'Sols profonds pour racines pivotantes',
      'Sénégal, Mali, Soudan: producteurs majeurs',
      'Calices, feuilles et graines utilisés'
    ]
  },
  {
    id: 'jatropha',
    name: 'Jatropha',
    nameFr: 'Jatropha (Pourghère)',
    scientificName: 'Jatropha curcas',
    category: 'industrial',
    description: 'Arbuste oléagineux pour biocarburant. Programme national lancé en 2006 au Sénégal. Pousse sur sols marginaux. Usage : huile, savon, médecine traditionnelle. Source: FAO, Veolia Foundation, Springer.',
    imageUrl: '/assets/crops/jatropha.jpg',
    soilRequirements: {
      // Source: FAO, FOSFA - pousse presque partout
      phMin: 5.5,
      phMax: 8.5,  // Préfère sols alcalins
      textures: ['sandy', 'loamy', 'clay'],
      moistureMin: 15,
      moistureMax: 50,
      drainageRequired: ['excellent', 'good', 'moderate']
    },
    climateRequirements: {
      // Source: FAO - zones tropicales/subtropicales
      temperatureMin: 20,
      temperatureMax: 40,
      rainfallMin: 600,
      rainfallMax: 1500,
      sunlightHours: 8,
      climateTypes: ['sahel', 'sudano_sahelian', 'sudanese', 'tropical_dry']
    },
    waterNeeds: 'low',
    cultivationCycle: {
      seedingMonths: [6, 7],
      harvestMonths: [11, 12, 1],
      cycleDuration: 730,  // 2 ans avant production
      season: 'both'
    },
    yieldInfo: {
      // Source: FAO - variable selon conditions
      averageYield: 1500,   // Graines
      optimalYield: 5000,
      unit: 'kg/ha'
    },
    tips: [
      'Très résistant sécheresse',
      'Pousse sur sols dégradés/marginaux',
      'Espacement 6m x 3m recommandé Sénégal',
      'Association avec cultures vivrières possible',
      'Toxique - non comestible',
      'Bassin Arachidier Sud'
    ]
  }
];

/**
 * Agricultural zones of Senegal
 *
 * Sources:
 * - World Bank Climate Knowledge Portal
 * - MDPI Agriculture Journal: "Analysis and Diagnosis of the Agrarian System in the Niayes Region"
 * - Frontiers in Climate: "A 40-year remote sensing analysis of spatiotemporal temperature and rainfall patterns in Senegal"
 * - Springer: Regional Environmental Change, Theoretical and Applied Climatology
 * - Wikipedia: Agriculture in Senegal, Niayes
 * - FAO Country Profiles
 */
export const SENEGAL_AGRICULTURAL_ZONES: AgriculturalZone[] = [
  {
    id: 'niayes',
    name: 'Zone des Niayes',
    type: 'niayes',
    regions: ['dakar', 'thies', 'louga', 'saint_louis'],
    climate: 'tropical_dry',
    description: 'Bande côtière (100-280 km de long, 25-30 km de large) caractérisée par des dépressions inter-dunaires avec nappe phréatique affleurante. Produit 80% des légumes du Sénégal et 65% de la production agricole nationale. Climat modéré par la brise marine. Source: MDPI Agriculture.',
    // Source: MDPI, Wikipedia Niayes - 300-450mm/an, mais nappe phréatique compense
    averageRainfall: 350,
    rainySeasonStart: 7,
    rainySeasonEnd: 10,
    // Source: Niayes study - température modérée par brise marine
    temperatureRange: [18, 31],
    // Source: Niayes soil study - sandy to sandy loam, pH 7.0-8.0
    dominantSoilTypes: ['sandy', 'loamy'],
    soilDescription: 'Sols sableux à sablo-limoneux (dior), sols hydromorphes dans dépressions (xour), sols argileux (ban). pH neutre 7.0-8.0. Matière organique 0-2 g/kg.',
    mainCrops: ['tomate', 'oignon', 'carotte', 'chou', 'haricot_vert', 'laitue', 'poivron'],
    secondaryCrops: ['mangue', 'pasteque', 'melon', 'piment', 'aubergine', 'agrumes'],
    agriculturalPotential: 'high',
    color: '#4CAF50',
    bounds: [[14.4, -17.5], [15.9, -16.0]],
    center: [15.0, -16.8]
  },
  {
    id: 'bassin_arachidier',
    name: 'Bassin Arachidier',
    type: 'groundnut_basin',
    regions: ['diourbel', 'fatick', 'kaolack', 'kaffrine', 'thies'],
    climate: 'sudano_sahelian',
    description: 'Zone historique de production d\'arachide représentant jusqu\'à 60% du PIB et 80% des exportations agricoles. Déficit hydrique depuis les années 1970. Sols dégradés nécessitant rotation et agroforesterie. Source: World Bank, Springer.',
    // Source: Springer - variabilité pluviométrique, déficit depuis 1970s
    averageRainfall: 550,
    rainySeasonStart: 6,
    rainySeasonEnd: 10,
    temperatureRange: [22, 40],
    // Source: Springer - Arenosols (sols sableux grossiers)
    dominantSoilTypes: ['sandy', 'loamy'],
    soilDescription: 'Sols ferrugineux tropicaux (Arenosols), sols bruns subarides. Stock carbone 2.3-59.8 Mg C/ha (moy. 14.6). Dégradation identifiée comme contrainte majeure.',
    mainCrops: ['arachide', 'mil', 'sorgho', 'niebe', 'bissap'],
    secondaryCrops: ['mais', 'sesame', 'pasteque', 'pois_bambara', 'gombo', 'jatropha', 'courge'],
    agriculturalPotential: 'medium',
    color: '#FF9800',
    bounds: [[13.5, -16.8], [15.0, -14.5]],
    center: [14.3, -15.8]
  },
  {
    id: 'vallee_fleuve',
    name: 'Vallée du Fleuve Sénégal',
    type: 'river_valley',
    regions: ['saint_louis', 'matam'],
    climate: 'sahel',
    description: 'Zone irriguée le long du fleuve Sénégal. Barrages Diama et Manantali (1986) ont créé 240 000 ha irrigables. Produit 70% du riz national. Plantations de canne à sucre à Richard-Toll. Source: Britannica, EIB, World Bank.',
    // Source: Climate Knowledge Portal - zone sahélienne, <350mm
    averageRainfall: 280,
    rainySeasonStart: 7,
    rainySeasonEnd: 9,
    temperatureRange: [20, 45],
    dominantSoilTypes: ['clay', 'loamy'],
    soilDescription: 'Sols alluviaux fertiles, vertisols, sols hydromorphes. Risque de salinisation. Irrigation obligatoire.',
    mainCrops: ['riz', 'tomate', 'oignon', 'canne_sucre', 'poivron'],
    secondaryCrops: ['mais', 'patate_douce', 'gombo', 'aubergine', 'piment', 'melon'],
    agriculturalPotential: 'high',
    color: '#2196F3',
    bounds: [[14.8, -16.5], [16.7, -12.0]],
    center: [15.8, -14.0]
  },
  {
    id: 'casamance',
    name: 'Casamance',
    type: 'casamance',
    regions: ['ziguinchor', 'sedhiou', 'kolda'],
    climate: 'tropical_humid',
    description: 'Zone la plus humide du Sénégal (1000-1200 mm/an). Riziculture traditionnelle pluviale et de bas-fond. Sols diversifiés avec mangroves. Production riz locale couvre 30-40% consommation (vs 100% dans années 1950). Source: Springer, FAO, USDA.',
    // Source: Springer - 1000-1200mm/an
    averageRainfall: 1100,
    rainySeasonStart: 5,
    rainySeasonEnd: 11,
    temperatureRange: [20, 35],
    // Source: FAO - sols diversifiés
    dominantSoilTypes: ['clay', 'loamy'],
    soilDescription: 'Sols ferralitiques et sablo-argileux sur plateaux. Sols hydromorphes dans vallées. Sols de mangrove. Risque toxicité fer et salinité.',
    mainCrops: ['riz', 'arachide', 'mais', 'manioc', 'anacarde'],
    secondaryCrops: ['banane', 'mangue', 'papaye', 'gombo', 'agrumes', 'soja', 'courge'],
    agriculturalPotential: 'high',
    color: '#009688',
    bounds: [[12.3, -16.8], [13.5, -13.5]],
    center: [12.8, -15.5]
  },
  {
    id: 'zone_sylvopastorale',
    name: 'Zone Sylvo-pastorale (Ferlo)',
    type: 'sylvo_pastoral',
    regions: ['louga', 'matam', 'saint_louis'],
    climate: 'sahel',
    description: 'Zone sahélienne d\'élevage extensif transhumant. Agriculture limitée au mil en saison des pluies courte (45 jours au nord). Végétation de steppe et savane arbustive. Source: MDPI Atmosphere, Climate Knowledge Portal.',
    // Source: MDPI - saison pluies 45 jours au nord
    averageRainfall: 300,
    rainySeasonStart: 7,
    rainySeasonEnd: 9,
    temperatureRange: [22, 45],
    dominantSoilTypes: ['sandy'],
    soilDescription: 'Sols sableux ferrugineux, sols bruns subarides peu fertiles. Faible rétention eau.',
    mainCrops: ['mil', 'niebe', 'bissap'],
    secondaryCrops: ['sorgho', 'pois_bambara', 'sesame'],
    agriculturalPotential: 'low',
    color: '#FFC107',
    bounds: [[15.0, -16.0], [16.5, -13.0]],
    center: [15.8, -14.5]
  },
  {
    id: 'senegal_oriental',
    name: 'Sénégal Oriental',
    type: 'oriental',
    regions: ['tambacounda', 'kedougou'],
    climate: 'sudanese',
    description: 'Zone soudanienne avec savanes et forêts. Pluviométrie favorable (800-1000mm). Principal bassin cotonnier. Agriculture diversifiée avec fort potentiel. Sols ferrugineux tropicaux. Source: FAO, Climate Portal.',
    // Source: Climate Portal - gradient nord 350mm à sud 1000mm
    averageRainfall: 850,
    rainySeasonStart: 5,
    rainySeasonEnd: 10,
    temperatureRange: [22, 42],
    dominantSoilTypes: ['loamy', 'clay'],
    soilDescription: 'Sols ferrugineux tropicaux lessivés, sols ferralitiques dans le sud. Bonne fertilité naturelle.',
    mainCrops: ['coton', 'mais', 'sorgho', 'arachide', 'anacarde'],
    secondaryCrops: ['riz', 'manioc', 'fonio', 'sesame', 'soja', 'gombo', 'bissap', 'courge', 'papaye'],
    agriculturalPotential: 'high',
    color: '#8BC34A',
    bounds: [[12.5, -14.5], [15.0, -11.4]],
    center: [13.8, -13.0]
  }
];

/**
 * Get crop by ID
 */
export function getCropById(id: string): Crop | undefined {
  return CROPS_DATABASE.find(crop => crop.id === id);
}

/**
 * Get crops by category
 */
export function getCropsByCategory(category: CropCategory): Crop[] {
  return CROPS_DATABASE.filter(crop => crop.category === category);
}

/**
 * Get zone by ID
 */
export function getZoneById(id: string): AgriculturalZone | undefined {
  return SENEGAL_AGRICULTURAL_ZONES.find(zone => zone.id === id);
}

/**
 * Get zones by region
 */
export function getZonesByRegion(region: string): AgriculturalZone[] {
  return SENEGAL_AGRICULTURAL_ZONES.filter(zone =>
    zone.regions.includes(region as any)
  );
}

/**
 * Data sources and references
 */
export const DATA_SOURCES = {
  // Sources principales
  fao: 'https://www.fao.org/faostat/',
  icrisat: 'https://www.icrisat.org/',
  yieldGap: 'https://www.yieldgap.org/senegal',
  worldBank: 'https://climateknowledgeportal.worldbank.org/country/senegal',
  mdpiAgriculture: 'https://www.mdpi.com/2077-0472/7/7/59',
  springerNiayes: 'https://www.sciencedirect.com/science/article/abs/pii/S016719871530026X',
  purdueNewCrop: 'https://hort.purdue.edu/newcrop/',
  britannica: 'https://www.britannica.com/place/Senegal',
  organicAfrica: 'https://www.organic-africa.net/',

  // Sources ajoutées janvier 2026
  cropTrustBambara: 'https://www.croptrust.org/knowledge-hub/crops/crops/bambara-groundnut/',
  wisconsinBambara: 'https://cropsandsoils.extension.wisc.edu/bambara-groundnut/',
  faoHibiscus: 'https://www.fao.org/fileadmin/user_upload/inpho/docs/Post_Harvest_Compendium_-_Hibiscus.pdf',
  roselleSenegal: 'https://www.researchgate.net/publication/248855546',
  frontiersOkra: 'https://www.frontiersin.org/journals/sustainable-food-systems/articles/10.3389/fsufs.2025.1546995/',
  cabiOkra: 'https://www.cabidigitallibrary.org/doi/abs/10.1079/cabicompendium.1950',
  africanCashewAlliance: 'https://mail.africancashewalliance.com/',
  cashewYieldGap: 'https://www.sciencepublishinggroup.com/article/10.11648/10071078',
  ifasPapaya: 'https://edis.ifas.ufl.edu/publication/MG054',
  virginiaOkra: 'https://www.pubs.ext.vt.edu/SPES/spes-507/spes-507.html',
  ghanaPepper: 'https://mofa.gov.gh/site/images/pdf/production_guides/Pepper_Production.pdf',
  frontiersSoybean: 'https://www.frontiersin.org/journals/agronomy/articles/10.3389/fagro.2023.1219490/full',
  yaraAgriculture: 'https://www.yara.us/crop-nutrition/',
  oklahomaPumpkin: 'https://extension.okstate.edu/fact-sheets/squash-and-pumpkin-production.html',
  hortSouthAfrica: 'https://www.horticulture.org.za/'
};
