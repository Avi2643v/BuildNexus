export interface UserPersona {
  id: string;
  name: string;
  role: 'CONTRACTOR' | 'LABORER' | 'SUPPLIER' | 'DELIVERY' | 'ADMIN';
  mobile: string;
  maskedId: string;
  avatar: string;
  verified: boolean;
}

export const DEMO_PERSONAS: UserPersona[] = [
  {
    id: 'u1',
    name: 'Rajesh Sharma (Apex Infra)',
    role: 'CONTRACTOR',
    mobile: '9876543210',
    maskedId: 'XXXX XXXX 4912',
    avatar: '👷‍♂️',
    verified: true,
  },
  {
    id: 'u2',
    name: 'Ramesh Sardar & 12-Man Squad',
    role: 'LABORER',
    mobile: '9876543211',
    maskedId: 'XXXX XXXX 8831',
    avatar: '🔨',
    verified: true,
  },
  {
    id: 'u3',
    name: 'Lakshmi Building Supplies',
    role: 'SUPPLIER',
    mobile: '9876543212',
    maskedId: 'XXXXX 1234 P',
    avatar: '🏭',
    verified: true,
  },
  {
    id: 'u4',
    name: 'Vikram Express Logistics',
    role: 'DELIVERY',
    mobile: '9876543213',
    maskedId: 'XXXX XXXX 9081',
    avatar: '🚚',
    verified: true,
  },
  {
    id: 'u5',
    name: 'BuildNexus Central Command',
    role: 'ADMIN',
    mobile: '9876543214',
    maskedId: 'XXXX XXXX 0001',
    avatar: '⚡',
    verified: true,
  },
];

export interface MaterialItem {
  id: string;
  name: string;
  category: 'Cement' | 'Steel' | 'Bricks' | 'Aggregates' | 'Sand';
  unit: string;
  basePrice: number;
  marketAvg: number;
  stock: number;
  rating: number;
  minOrder: number;
  supplier: string;
  supplierRating: number;
  deliveryTimeHours: number;
  burnRateDays: number; // Days of stock left on typical site
  priceComparisons: { supplier: string; price: number; distanceKm: number }[];
}

export const MOCK_MATERIALS: MaterialItem[] = [
  {
    id: 'mat-1',
    name: 'UltraTech Super 53 Grade Cement',
    category: 'Cement',
    unit: '50kg Bag',
    basePrice: 365,
    marketAvg: 395,
    stock: 2400,
    rating: 4.9,
    minOrder: 50,
    supplier: 'Lakshmi Building Supplies',
    supplierRating: 4.8,
    deliveryTimeHours: 3,
    burnRateDays: 3,
    priceComparisons: [
      { supplier: 'Lakshmi Supplies (BuildNexus)', price: 365, distanceKm: 4.2 },
      { supplier: 'City Cement Depot', price: 385, distanceKm: 8.5 },
      { supplier: 'National Traders', price: 395, distanceKm: 12.0 },
    ],
  },
  {
    id: 'mat-2',
    name: 'Tata Tiscon 550D TMT Rebar (12mm)',
    category: 'Steel',
    unit: 'Ton',
    basePrice: 62400,
    marketAvg: 66800,
    stock: 45,
    rating: 4.9,
    minOrder: 1,
    supplier: 'SteelHub Central Yard',
    supplierRating: 4.9,
    deliveryTimeHours: 5,
    burnRateDays: 6,
    priceComparisons: [
      { supplier: 'SteelHub Central (BuildNexus)', price: 62400, distanceKm: 6.1 },
      { supplier: 'Karnataka Steel Mart', price: 65200, distanceKm: 14.2 },
      { supplier: 'Apex Metal Corporation', price: 66800, distanceKm: 18.0 },
    ],
  },
  {
    id: 'mat-3',
    name: 'Kiln-Burned First Class Red Bricks',
    category: 'Bricks',
    unit: '1,000 Bricks',
    basePrice: 7800,
    marketAvg: 8900,
    stock: 120000,
    rating: 4.7,
    minOrder: 2,
    supplier: 'Venkateshwara Brick Kilns',
    supplierRating: 4.6,
    deliveryTimeHours: 6,
    burnRateDays: 4,
    priceComparisons: [
      { supplier: 'Venkateshwara Kilns (BuildNexus)', price: 7800, distanceKm: 11.0 },
      { supplier: 'Suburban Clay Traders', price: 8400, distanceKm: 9.3 },
      { supplier: 'Direct Roadside Yard', price: 8900, distanceKm: 5.2 },
    ],
  },
  {
    id: 'mat-4',
    name: 'M-Sand (Manufactured Concrete Sand)',
    category: 'Sand',
    unit: 'Ton (Tippers)',
    basePrice: 1150,
    marketAvg: 1350,
    stock: 800,
    rating: 4.8,
    minOrder: 10,
    supplier: 'GreenCrush Quarries',
    supplierRating: 4.7,
    deliveryTimeHours: 4,
    burnRateDays: 5,
    priceComparisons: [
      { supplier: 'GreenCrush Quarries (BuildNexus)', price: 1150, distanceKm: 15.0 },
      { supplier: 'Metro Sand Suppliers', price: 1280, distanceKm: 7.0 },
      { supplier: 'Unregulated Dealer', price: 1350, distanceKm: 12.0 },
    ],
  },
];

export interface LaborSquad {
  id: string;
  trade: string;
  leadName: string;
  squadSize: number;
  availableCount: number;
  dailyRatePerWorker: number;
  sardarCut: number;
  platformFee: number;
  verifiedSkillScore: number; // From CV Model (0.0 to 1.0)
  rating: number;
  experienceYears: number;
  skills: string[];
  location: string;
  distanceKm: number;
  recentAudit: string;
}

export const MOCK_LABOR_SQUADS: LaborSquad[] = [
  {
    id: 'sq-1',
    trade: 'Master Masonry & Bricklaying',
    leadName: 'Ramesh Sardar Squad',
    squadSize: 8,
    availableCount: 8,
    dailyRatePerWorker: 800,
    sardarCut: 50,
    platformFee: 0, // 100% Fair Wage Guarantee!
    verifiedSkillScore: 0.94,
    rating: 4.9,
    experienceYears: 12,
    skills: ['English/Flemish Brick Bond', 'Plumb-line Precision', 'Mortar Proportioning'],
    location: 'Yeshwanthpur Industrial Cluster',
    distanceKm: 3.8,
    recentAudit: 'Video Verified: 94% Biomechanical Smoothness (Grade A+)',
  },
  {
    id: 'sq-2',
    trade: 'TMT Steel Bar-Benders & Tiers',
    leadName: 'Shankar Gowda & Crew',
    squadSize: 10,
    availableCount: 7,
    dailyRatePerWorker: 850,
    sardarCut: 50,
    platformFee: 0,
    verifiedSkillScore: 0.91,
    rating: 4.8,
    experienceYears: 9,
    skills: ['Bending Schedule (BBS) Execution', 'Column Cage Tying', 'Shear Wall Reinforcement'],
    location: 'Peenya 2nd Stage',
    distanceKm: 5.4,
    recentAudit: 'Video Verified: BBS Compliance 91% (Grade A)',
  },
  {
    id: 'sq-3',
    trade: 'Shuttering & Formwork Carpenters',
    leadName: 'Muniswamy Wood Squad',
    squadSize: 6,
    availableCount: 6,
    dailyRatePerWorker: 900,
    sardarCut: 60,
    platformFee: 0,
    verifiedSkillScore: 0.88,
    rating: 4.7,
    experienceYears: 14,
    skills: ['Plywood & Steel Shuttering', 'Level Checking', 'Prop Scaffolding'],
    location: 'Rajajinagar',
    distanceKm: 6.2,
    recentAudit: 'Video Verified: Rigidity & Level Index 88% (Grade A)',
  },
  {
    id: 'sq-4',
    trade: 'Ready-Mix Concrete Pourers & Vibrators',
    leadName: 'Bihari Bhai Concreting Squad',
    squadSize: 12,
    availableCount: 12,
    dailyRatePerWorker: 750,
    sardarCut: 50,
    platformFee: 0,
    verifiedSkillScore: 0.93,
    rating: 4.9,
    experienceYears: 8,
    skills: ['Needle Vibrator Compaction', 'Screed Leveling', 'Slump Maintenance'],
    location: 'Hebbal Flyover Junction',
    distanceKm: 4.1,
    recentAudit: 'High JIT Synchronization Score (18 Pours Zero-Honeycombing)',
  },
];

export interface KhataEntry {
  id: string;
  date: string;
  category: 'LABOR' | 'MATERIAL' | 'PETTY_CASH';
  title: string;
  entity: string;
  promisedAmount: number;
  paidAmount: number;
  status: 'SETTLED' | 'PENDING' | 'DISPUTE_RESOLVED';
  note: string;
}

export const MOCK_KHATA: KhataEntry[] = [
  {
    id: 'k-1',
    date: 'Today, 08:30 AM',
    category: 'LABOR',
    title: 'Daily Wage Advance — 8 Masons',
    entity: 'Ramesh Sardar Squad',
    promisedAmount: 6400,
    paidAmount: 6400,
    status: 'SETTLED',
    note: 'Paid via UPI. 0% deductions. All 8 workers present on 2nd Floor slab.',
  },
  {
    id: 'k-2',
    date: 'Yesterday, 04:15 PM',
    category: 'MATERIAL',
    title: 'UltraTech 53 Grade — 120 Bags',
    entity: 'Lakshmi Building Supplies',
    promisedAmount: 43800,
    paidAmount: 43800,
    status: 'SETTLED',
    note: 'Delivered at Central Yard Gate 2. Digital receipt #BN-8912.',
  },
  {
    id: 'k-3',
    date: '21 Nov, 11:00 AM',
    category: 'LABOR',
    title: 'Overtime Allowance (Column Casting)',
    entity: 'Shankar Gowda Bar-Benders',
    promisedAmount: 2550,
    paidAmount: 2550,
    status: 'SETTLED',
    note: '3 hours overtime verified via site CCTV punch audit.',
  },
];

export interface ActiveDelivery {
  id: string;
  orderNumber: string;
  material: string;
  quantity: string;
  origin: string;
  destination: string;
  driverName: string;
  driverMobile: string;
  truckNumber: string;
  etaMinutes: number;
  otpCode: string;
  status: 'AT_WAREHOUSE' | 'IN_TRANSIT' | 'ARRIVED_AT_SITE' | 'COMPLETED';
  batchAgeMinutes: number;
  maxShelfLifeMinutes: number;
}

export const MOCK_ACTIVE_DELIVERY: ActiveDelivery = {
  id: 'del-101',
  orderNumber: 'BN-ORD-9042',
  material: 'Ready-Mix Concrete (M25 Grade)',
  quantity: '7.5 m³ (1 Transit Mixer)',
  origin: 'BuildNexus Yeshwanthpur Staging Hub',
  destination: 'Site 4B, Koramangala 80ft Road',
  driverName: 'Vikram Singh',
  driverMobile: '9876543213',
  truckNumber: 'KA-04-E-8819',
  etaMinutes: 18,
  otpCode: '4921',
  status: 'IN_TRANSIT',
  batchAgeMinutes: 44,
  maxShelfLifeMinutes: 90,
};
