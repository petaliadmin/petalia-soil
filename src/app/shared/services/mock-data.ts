import { Land, CropRecommendation } from '../models/land.model';
import { Owner } from '../models/owner.model';

/**
 * Mock owners data
 */
export const MOCK_OWNERS: Owner[] = [
  {
    _id: 'owner-1',
    fullName: 'Amadou',
    email: 'amadou.diallo@email.com',
    phone: '+221 77 123 45 67',
    whatsapp: '+221771234567',
    role: 'OWNER',
    verified: true,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    _id: 'owner-2',
    fullName: 'Fatou',
    email: 'fatou.ndiaye@email.com',
    phone: '+221 78 234 56 78',
    whatsapp: '+221782345678',
    role: 'OWNER',
    verified: true,
    createdAt: '2024-02-20T14:30:00Z'
  },
  {
    _id: 'owner-3',
    fullName: 'Moussa',
    email: 'moussa.sow@email.com',
    phone: '+221 76 345 67 89',
    whatsapp: '+221763456789',
    role: 'OWNER',
    verified: false,
    createdAt: '2024-03-10T09:15:00Z'
  },
  {
    _id: 'owner-4',
    fullName: 'Aissatou',
    email: 'aissatou.ba@email.com',
    phone: '+221 77 456 78 90',
    whatsapp: '+221774567890',
    role: 'OWNER',
    verified: true,
    createdAt: '2024-04-05T11:45:00Z' 
  }
];

/**
 * Recommended crops database
 */
export const CROPS_DATABASE: CropRecommendation[] = [
  { name: 'Riz', suitability: 'excellent', icon: '🌾', season: 'Hivernage' },
  { name: 'Maïs', suitability: 'excellent', icon: '🌽', season: 'Toute saison' },
  { name: 'Arachide', suitability: 'good', icon: '🥜', season: 'Saison sèche' },
  { name: 'Mil', suitability: 'excellent', icon: '🌿', season: 'Hivernage' },
  { name: 'Sorgho', suitability: 'good', icon: '🌱', season: 'Hivernage' },
  { name: 'Niébé', suitability: 'good', icon: '🫘', season: 'Toute saison' },
  { name: 'Tomate', suitability: 'excellent', icon: '🍅', season: 'Saison fraîche' },
  { name: 'Oignon', suitability: 'excellent', icon: '🧅', season: 'Saison sèche' },
  { name: 'Pomme de terre', suitability: 'moderate', icon: '🥔', season: 'Saison fraîche' },
  { name: 'Chou', suitability: 'good', icon: '🥬', season: 'Saison fraîche' },
  { name: 'Carotte', suitability: 'good', icon: '🥕', season: 'Saison fraîche' },
  { name: 'Pastèque', suitability: 'excellent', icon: '🍉', season: 'Saison chaude' },
  { name: 'Melon', suitability: 'good', icon: '🍈', season: 'Saison chaude' },
  { name: 'Manioc', suitability: 'excellent', icon: '🌿', season: 'Toute saison' },
  { name: 'Patate douce', suitability: 'good', icon: '🍠', season: 'Hivernage' }
];

/**
 * Mock lands data
 */
export const MOCK_LANDS: Land[] = [
  {
    _id: 'land-1',
    title: 'Terre fertile de la vallée du fleuve',
    description: 'Magnifique parcelle agricole située dans la vallée du fleuve Sénégal. Sol alluvial riche, idéal pour la riziculture et le maraîchage. Accès à l\'eau d\'irrigation garanti. Infrastructure existante avec système de pompage.',
    surface: 15,
    type: 'RENT',
    price: 500000,
    priceUnit: 'FCFA/an',
    status: 'AVAILABLE',
    location: {
      type: 'Point',
      coordinates: [-16.0172, 16.4893] // Saint-Louis region
    },
    address: {
      city: 'Richard Toll',
      region: 'Saint-Louis',
      commune: 'Richard Toll',
      village: 'Ndiangue',
      country: 'Sénégal'
    },
    soilParameters: {
      ph: 6.8,
      npk: { nitrogen: 45, phosphorus: 25, potassium: 180 },
      texture: 'loamy',
      moisture: 65,
      organicMatter: 3.2,
      drainage: 'good'
    },
    recommendedCrops: [
      { name: 'Riz', suitability: 'excellent', icon: '🌾', season: 'Hivernage' },
      { name: 'Tomate', suitability: 'excellent', icon: '🍅', season: 'Saison fraîche' },
      { name: 'Oignon', suitability: 'good', icon: '🧅', season: 'Saison sèche' }
    ],
    cultureHistory: [
      { year: 2023, crop: 'Riz', yield: '6 tonnes/ha' },
      { year: 2022, crop: 'Tomate', yield: '25 tonnes/ha' }
    ],
    owner: MOCK_OWNERS[0],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
    views: 245,
    favorites: 32,
    createdAt: '2024-06-15T08:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z'
  },
  {
    _id: 'land-2',
    title: 'Terrain agricole Casamance',
    description: 'Superbe terrain en Casamance avec sol argileux parfait pour la culture du riz paddy. Climat favorable et pluviométrie abondante. Zone très productive avec historique de bons rendements.',
    surface: 8,
    type: 'SALE',
    price: 12000000,
    priceUnit: 'FCFA',
    status: 'AVAILABLE',
    location: {
      type: 'Point',
      coordinates: [-16.2719, 12.5833] // Ziguinchor
    },
    address: {
      city: 'Ziguinchor',
      region: 'Ziguinchor',
      commune: 'Oussouye',
      country: 'Sénégal'
    },
    soilParameters: {
      ph: 5.8,
      npk: { nitrogen: 38, phosphorus: 18, potassium: 150 },
      texture: 'clay',
      moisture: 72,
      organicMatter: 4.1,
      drainage: 'moderate'
    },
    recommendedCrops: [
      { name: 'Riz', suitability: 'excellent', icon: '🌾', season: 'Hivernage' },
      { name: 'Manioc', suitability: 'good', icon: '🌿', season: 'Toute saison' },
      { name: 'Patate douce', suitability: 'good', icon: '🍠', season: 'Hivernage' }
    ],
    owner: MOCK_OWNERS[1],
    images: [
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
    views: 189,
    favorites: 28,
    createdAt: '2024-05-20T10:00:00Z',
    updatedAt: '2024-06-18T09:15:00Z'
  },
  {
    _id: 'land-3',
    title: 'Parcelle maraîchère Niayes',
    description: 'Parcelle dans la zone des Niayes, réputée pour le maraîchage. Sol sablonneux bien drainé avec nappe phréatique accessible. Proche des marchés de Dakar, idéal pour les cultures de contre-saison.',
    surface: 3,
    type: 'RENT',
    price: 350000,
    priceUnit: 'FCFA/an',
    status: 'AVAILABLE',
    location: {
      type: 'Point',
      coordinates: [-17.1547, 14.8167] // Thiès/Niayes
    },
    address: {
      city: 'Mboro',
      region: 'Thiès',
      commune: 'Mboro',
      village: 'Fass Boye',
      country: 'Sénégal'
    },
    soilParameters: {
      ph: 7.2,
      npk: { nitrogen: 28, phosphorus: 35, potassium: 210 },
      texture: 'sandy',
      moisture: 45,
      organicMatter: 1.8,
      drainage: 'excellent'
    },
    recommendedCrops: [
      { name: 'Oignon', suitability: 'excellent', icon: '🧅', season: 'Saison sèche' },
      { name: 'Carotte', suitability: 'excellent', icon: '🥕', season: 'Saison fraîche' },
      { name: 'Chou', suitability: 'good', icon: '🥬', season: 'Saison fraîche' },
      { name: 'Pomme de terre', suitability: 'good', icon: '🥔', season: 'Saison fraîche' }
    ],
    owner: MOCK_OWNERS[2],
    images: [
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400',
    views: 312,
    favorites: 45,
    createdAt: '2024-04-10T14:00:00Z',
    updatedAt: '2024-06-15T11:20:00Z'
  },
  {
    _id: 'land-4',
    title: 'Grande exploitation Tambacounda',
    description: 'Vaste exploitation agricole dans la région de Tambacounda. Sol limoneux profond adapté aux grandes cultures. Potentiel pour l\'agriculture mécanisée. Accès routier facilité.',
    surface: 50,
    type: 'SALE',
    price: 75000000,
    priceUnit: 'FCFA',
    status: 'AVAILABLE',
    location: {
      type: 'Point',
      coordinates: [-13.6673, 13.7707] // Tambacounda
    },
    address: {
      city: 'Tambacounda',
      region: 'Tambacounda',
      commune: 'Koumpentoum',
      country: 'Sénégal'
    },
    soilParameters: {
      ph: 6.5,
      npk: { nitrogen: 52, phosphorus: 22, potassium: 175 },
      texture: 'loamy',
      moisture: 55,
      organicMatter: 2.9,
      drainage: 'good'
    },
    recommendedCrops: [
      { name: 'Maïs', suitability: 'excellent', icon: '🌽', season: 'Toute saison' },
      { name: 'Arachide', suitability: 'excellent', icon: '🥜', season: 'Saison sèche' },
      { name: 'Mil', suitability: 'excellent', icon: '🌿', season: 'Hivernage' },
      { name: 'Sorgho', suitability: 'good', icon: '🌱', season: 'Hivernage' }
    ],
    cultureHistory: [
      { year: 2023, crop: 'Arachide', yield: '2.5 tonnes/ha' },
      { year: 2022, crop: 'Maïs', yield: '4 tonnes/ha' },
      { year: 2021, crop: 'Mil', yield: '1.8 tonnes/ha' }
    ],
    owner: MOCK_OWNERS[3],
    images: [
      'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?w=400',
    views: 156,
    favorites: 18,
    createdAt: '2024-03-25T09:30:00Z',
    updatedAt: '2024-06-10T16:45:00Z'
  },
  {
    _id: 'land-5',
    title: 'Verger et cultures Fatick',
    description: 'Terrain mixte avec verger existant (manguiers, agrumes) et espace pour cultures vivrières. Sol bien équilibré avec bon potentiel. Proximité de point d\'eau.',
    surface: 5,
    type: 'RENT',
    price: 400000,
    priceUnit: 'FCFA/an',
    status: 'AVAILABLE',
    location: {
      type: 'Point',
      coordinates: [-16.4167, 14.3333] // Fatick
    },
    address: {
      city: 'Fatick',
      region: 'Fatick',
      commune: 'Foundiougne',
      country: 'Sénégal'
    },
    soilParameters: {
      ph: 6.9,
      npk: { nitrogen: 42, phosphorus: 28, potassium: 195 },
      texture: 'loamy',
      moisture: 58,
      organicMatter: 3.5,
      drainage: 'good'
    },
    recommendedCrops: [
      { name: 'Pastèque', suitability: 'excellent', icon: '🍉', season: 'Saison chaude' },
      { name: 'Melon', suitability: 'excellent', icon: '🍈', season: 'Saison chaude' },
      { name: 'Niébé', suitability: 'good', icon: '🫘', season: 'Toute saison' }
    ],
    owner: MOCK_OWNERS[0],
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    views: 278,
    favorites: 52,
    createdAt: '2024-05-05T12:00:00Z',
    updatedAt: '2024-06-22T08:30:00Z'
  },
  {
    _id: 'land-6',
    title: 'Terrain irrigué Podor',
    description: 'Parcelle avec système d\'irrigation moderne sur les rives du fleuve. Infrastructure complète : canaux, pompes, magasin de stockage. Double culture possible.',
    surface: 20,
    type: 'SALE',
    price: 45000000,
    priceUnit: 'FCFA',
    status: 'AVAILABLE',
    location: {
      type: 'Point',
      coordinates: [-14.9500, 16.6500] // Podor
    },
    address: {
      city: 'Podor',
      region: 'Saint-Louis',
      commune: 'Podor',
      country: 'Sénégal'
    },
    soilParameters: {
      ph: 7.0,
      npk: { nitrogen: 55, phosphorus: 30, potassium: 200 },
      texture: 'silty',
      moisture: 70,
      organicMatter: 3.8,
      drainage: 'good'
    },
    recommendedCrops: [
      { name: 'Riz', suitability: 'excellent', icon: '🌾', season: 'Hivernage' },
      { name: 'Tomate', suitability: 'excellent', icon: '🍅', season: 'Saison fraîche' },
      { name: 'Oignon', suitability: 'excellent', icon: '🧅', season: 'Saison sèche' },
      { name: 'Maïs', suitability: 'good', icon: '🌽', season: 'Toute saison' }
    ],
    owner: MOCK_OWNERS[1],
    images: [
      'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=400',
    views: 198,
    favorites: 37,
    createdAt: '2024-06-01T07:00:00Z',
    updatedAt: '2024-06-25T10:00:00Z'
  },
  {
    _id: 'land-7',
    title: 'Parcelle bio Kédougou',
    description: 'Terrain vierge dans la région de Kédougou, jamais traité chimiquement. Idéal pour l\'agriculture biologique. Sol forestier riche en matière organique.',
    surface: 12,
    type: 'RENT',
    price: 300000,
    priceUnit: 'FCFA/an',
    status: 'AVAILABLE',
    location: {
      type: 'Point',
      coordinates: [-12.1747, 12.5605] // Kédougou
    },
    address: {
      city: 'Kédougou',
      region: 'Kédougou',
      commune: 'Saraya',
      country: 'Sénégal'
    },
    soilParameters: {
      ph: 6.2,
      npk: { nitrogen: 48, phosphorus: 20, potassium: 160 },
      texture: 'loamy',
      moisture: 62,
      organicMatter: 5.2,
      drainage: 'good'
    },
    recommendedCrops: [
      { name: 'Manioc', suitability: 'excellent', icon: '🌿', season: 'Toute saison' },
      { name: 'Maïs', suitability: 'good', icon: '🌽', season: 'Toute saison' },
      { name: 'Arachide', suitability: 'good', icon: '🥜', season: 'Saison sèche' }
    ],
    owner: MOCK_OWNERS[2],
    images: [
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400',
    views: 134,
    favorites: 21,
    createdAt: '2024-04-20T15:30:00Z',
    updatedAt: '2024-06-12T13:15:00Z'
  },
  {
    _id: 'land-8',
    title: 'Périmètre horticole Dakar',
    description: 'Parcelle horticole à proximité de Dakar, dans la zone de Sangalkam. Accès direct aux marchés urbains. Clôturée avec point d\'eau. Idéale pour production intensive.',
    surface: 2,
    type: 'RENT',
    price: 600000,
    priceUnit: 'FCFA/an',
    status: 'AVAILABLE',
    location: {
      type: 'Point',
      coordinates: [-17.2283, 14.7833] // Rufisque/Sangalkam
    },
    address: {
      city: 'Dakar',
      region: 'Dakar',
      commune: 'Sangalkam',
      country: 'Sénégal'
    },
    soilParameters: {
      ph: 7.1,
      npk: { nitrogen: 35, phosphorus: 40, potassium: 220 },
      texture: 'sandy',
      moisture: 40,
      organicMatter: 2.1,
      drainage: 'excellent'
    },
    recommendedCrops: [
      { name: 'Tomate', suitability: 'excellent', icon: '🍅', season: 'Saison fraîche' },
      { name: 'Chou', suitability: 'excellent', icon: '🥬', season: 'Saison fraîche' },
      { name: 'Carotte', suitability: 'good', icon: '🥕', season: 'Saison fraîche' },
      { name: 'Oignon', suitability: 'good', icon: '🧅', season: 'Saison sèche' }
    ],
    owner: MOCK_OWNERS[3],
    images: [
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400',
    views: 425,
    favorites: 67,
    createdAt: '2024-05-15T11:00:00Z',
    updatedAt: '2024-06-24T17:30:00Z'
  }
];

/**
 * Get unique regions from mock data
 */
export function getUniqueRegions(): string[] {
  const regions = MOCK_LANDS.map(land => land.address.region);
  return [...new Set(regions)].sort();
}

/**
 * Get unique crops from mock data
 */
export function getUniqueCrops(): string[] {
  const crops = MOCK_LANDS.flatMap(land =>
    land.recommendedCrops?.map(c => c.name) || []
  );
  return [...new Set(crops)].sort();
}
