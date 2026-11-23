export interface LaborerItem {
  id: string;
  name: string;
  mobile: string;
  avatar?: string;
  rating: number;
  city: string;
  maskedGovtId?: string;
  laborProfile: {
    id: string;
    isSardar: boolean;
    teamName?: string;
    teamSize: number;
    fairWageGuarantee: boolean;
    dailyWage: number;
    ratePerSqFt: number;
    rateUnit: string;
    experienceYears: number;
    wageSplitDetails?: string;
    skills: { id: string; name: string }[];
    availability: { id: string; date: string; status: string; slotsAvailable: number; totalSlots?: number }[];
  };
}

export const DEMO_LABORERS: LaborerItem[] = [
  // --- ELECTRICIANS ---
  {
    id: 'user-laborer-elec-1',
    name: 'Subhas Sardar & Electrical Squad',
    mobile: '9876543301',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    city: 'Rajarhat & New Town, West Bengal',
    maskedGovtId: 'XXXX XXXX 3301',
    laborProfile: {
      id: 'lp-elec-1',
      isSardar: true,
      teamName: 'Subhas Sardar Electrical & Conduit Squad',
      teamSize: 8,
      fairWageGuarantee: true,
      dailyWage: 780,
      ratePerSqFt: 22,
      rateUnit: 'sq.ft',
      experienceYears: 9,
      skills: [
        { id: 'sk-e1', name: 'Electrician' },
        { id: 'sk-e2', name: 'Concealed Wiring' },
        { id: 'sk-e3', name: 'DB Dressing' },
        { id: 'sk-e4', name: 'Earthing & Protection' },
      ],
      availability: [
        { id: 'av-e1', date: '2026-10-11', status: 'AVAILABLE', slotsAvailable: 8, totalSlots: 8 },
        { id: 'av-e2', date: '2026-10-12', status: 'AVAILABLE', slotsAvailable: 8, totalSlots: 8 },
        { id: 'av-e3', date: '2026-10-13', status: 'PARTIAL', slotsAvailable: 4, totalSlots: 8 },
        { id: 'av-e4', date: '2026-10-14', status: 'AVAILABLE', slotsAvailable: 8, totalSlots: 8 },
      ],
    },
  },
  {
    id: 'user-laborer-elec-2',
    name: 'Amitava Ghosh Electrical Works',
    mobile: '9876543302',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    rating: 4.85,
    city: 'Salt Lake Sector V, Kolkata, West Bengal',
    maskedGovtId: 'XXXX XXXX 3302',
    laborProfile: {
      id: 'lp-elec-2',
      isSardar: false,
      teamSize: 4,
      fairWageGuarantee: true,
      dailyWage: 800,
      ratePerSqFt: 25,
      rateUnit: 'sq.ft',
      experienceYears: 7,
      skills: [
        { id: 'sk-e5', name: 'Electrician' },
        { id: 'sk-e6', name: '3-Phase Industrial Wiring' },
        { id: 'sk-e7', name: 'Inverter Setup' },
      ],
      availability: [
        { id: 'av-e5', date: '2026-10-11', status: 'AVAILABLE', slotsAvailable: 4, totalSlots: 4 },
        { id: 'av-e6', date: '2026-10-12', status: 'AVAILABLE', slotsAvailable: 4, totalSlots: 4 },
      ],
    },
  },
  {
    id: 'user-laborer-elec-3',
    name: 'Tapan Mondal Master Electrician',
    mobile: '9876543303',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 4.8,
    city: 'Garia & Jadavpur, Kolkata, West Bengal',
    maskedGovtId: 'XXXX XXXX 3303',
    laborProfile: {
      id: 'lp-elec-3',
      isSardar: false,
      teamSize: 5,
      fairWageGuarantee: true,
      dailyWage: 750,
      ratePerSqFt: 20,
      rateUnit: 'sq.ft',
      experienceYears: 10,
      skills: [
        { id: 'sk-e8', name: 'Electrician' },
        { id: 'sk-e9', name: 'Wall Grooving' },
        { id: 'sk-e10', name: 'Cable Pulling & MCB' },
      ],
      availability: [
        { id: 'av-e7', date: '2026-10-11', status: 'AVAILABLE', slotsAvailable: 5, totalSlots: 5 },
      ],
    },
  },

  // --- PLUMBERS ---
  {
    id: 'user-laborer-plumb-1',
    name: 'Sukanta Mondal & Sanitary Squad',
    mobile: '9876543311',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    city: 'Howrah & Central Kolkata, West Bengal',
    maskedGovtId: 'XXXX XXXX 3311',
    laborProfile: {
      id: 'lp-plumb-1',
      isSardar: true,
      teamName: 'Sukanta Mondal Sanitary & Piping Guild',
      teamSize: 6,
      fairWageGuarantee: true,
      dailyWage: 760,
      ratePerSqFt: 26,
      rateUnit: 'sq.ft',
      experienceYears: 11,
      skills: [
        { id: 'sk-p1', name: 'Plumber' },
        { id: 'sk-p2', name: 'Sanitary Fitting' },
        { id: 'sk-p3', name: 'CPVC Concealed Lines' },
        { id: 'sk-p4', name: 'Overhead Tank Manifold' },
      ],
      availability: [
        { id: 'av-p1', date: '2026-10-11', status: 'AVAILABLE', slotsAvailable: 6, totalSlots: 6 },
        { id: 'av-p2', date: '2026-10-12', status: 'AVAILABLE', slotsAvailable: 6, totalSlots: 6 },
      ],
    },
  },
  {
    id: 'user-laborer-plumb-2',
    name: 'Bhabani Das Plumbing Group',
    mobile: '9876543312',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    rating: 4.8,
    city: 'Behala & Alipore, Kolkata, West Bengal',
    maskedGovtId: 'XXXX XXXX 3312',
    laborProfile: {
      id: 'lp-plumb-2',
      isSardar: false,
      teamSize: 4,
      fairWageGuarantee: true,
      dailyWage: 720,
      ratePerSqFt: 24,
      rateUnit: 'sq.ft',
      experienceYears: 8,
      skills: [
        { id: 'sk-p5', name: 'Plumber' },
        { id: 'sk-p6', name: 'Drainage Laying' },
        { id: 'sk-p7', name: 'Kitchen Plumbing' },
      ],
      availability: [
        { id: 'av-p3', date: '2026-10-11', status: 'AVAILABLE', slotsAvailable: 4, totalSlots: 4 },
      ],
    },
  },
  {
    id: 'user-laborer-plumb-3',
    name: 'Dipak Roy Master Plumber',
    mobile: '9876543313',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    rating: 4.75,
    city: 'Dankuni & Hooghly Belt, West Bengal',
    maskedGovtId: 'XXXX XXXX 3313',
    laborProfile: {
      id: 'lp-plumb-3',
      isSardar: false,
      teamSize: 5,
      fairWageGuarantee: true,
      dailyWage: 700,
      ratePerSqFt: 22,
      rateUnit: 'sq.ft',
      experienceYears: 6,
      skills: [
        { id: 'sk-p8', name: 'Plumber' },
        { id: 'sk-p9', name: 'Septic Line Piping' },
        { id: 'sk-p10', name: 'Stormwater Sumps' },
      ],
      availability: [
        { id: 'av-p4', date: '2026-10-11', status: 'AVAILABLE', slotsAvailable: 5, totalSlots: 5 },
      ],
    },
  },

  // --- MASONS / BRICK LAYERS ---
  {
    id: 'user-laborer-mason-1',
    name: 'Ramesh Sardar & Cauvery Masonry Team',
    mobile: '9876543211',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 4.85,
    city: 'Kolkata & New Town, West Bengal',
    maskedGovtId: 'XXXX XXXX 8831',
    laborProfile: {
      id: 'lp-mason-1',
      isSardar: true,
      teamName: 'Cauvery Skilled Brick & Masonry Squad',
      teamSize: 15,
      fairWageGuarantee: true,
      dailyWage: 750,
      ratePerSqFt: 32,
      rateUnit: 'sq.ft',
      experienceYears: 12,
      skills: [
        { id: 'sk-m1', name: 'Mason / Brick Layer' },
        { id: 'sk-m2', name: 'Brick Jointer' },
        { id: 'sk-m3', name: 'Masala Mixer' },
        { id: 'sk-m4', name: 'Plastering' },
      ],
      availability: [
        { id: 'av-m1', date: '2026-10-11', status: 'AVAILABLE', slotsAvailable: 15, totalSlots: 15 },
        { id: 'av-m2', date: '2026-10-12', status: 'PARTIAL', slotsAvailable: 6, totalSlots: 15 },
      ],
    },
  },
  {
    id: 'user-laborer-mason-2',
    name: 'Bikash Karmakar & Bengal Masonry Team',
    mobile: '9876543322',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80',
    rating: 4.8,
    city: 'Barasat & Madhyamgram, West Bengal',
    maskedGovtId: 'XXXX XXXX 3322',
    laborProfile: {
      id: 'lp-mason-2',
      isSardar: true,
      teamName: 'Bikash Karmakar Precision Masonry Squad',
      teamSize: 10,
      fairWageGuarantee: true,
      dailyWage: 720,
      ratePerSqFt: 28,
      rateUnit: 'sq.ft',
      experienceYears: 9,
      skills: [
        { id: 'sk-m5', name: 'Mason / Brick Layer' },
        { id: 'sk-m6', name: 'AAC Block Layer' },
        { id: 'sk-m7', name: 'External Plaster' },
      ],
      availability: [
        { id: 'av-m3', date: '2026-10-11', status: 'AVAILABLE', slotsAvailable: 10, totalSlots: 10 },
      ],
    },
  },
  {
    id: 'user-laborer-mason-3',
    name: 'Nabin Maity Master Mason',
    mobile: '9876543323',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    city: 'Tollygunge & South Kolkata, West Bengal',
    maskedGovtId: 'XXXX XXXX 3323',
    laborProfile: {
      id: 'lp-mason-3',
      isSardar: false,
      teamSize: 6,
      fairWageGuarantee: true,
      dailyWage: 740,
      ratePerSqFt: 30,
      rateUnit: 'sq.ft',
      experienceYears: 14,
      skills: [
        { id: 'sk-m8', name: 'Mason / Brick Layer' },
        { id: 'sk-m9', name: 'Fly Ash Brick Masonry' },
        { id: 'sk-m10', name: 'Damp Proof Course' },
      ],
      availability: [
        { id: 'av-m4', date: '2026-10-11', status: 'AVAILABLE', slotsAvailable: 6, totalSlots: 6 },
      ],
    },
  },

  // --- BAR BENDER & STEEL FIXER ---
  {
    id: 'user-laborer-bar-1',
    name: 'Shankar Das & Rebar Fabrication Squad',
    mobile: '9876543331',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    city: 'Dankuni Logistics Park & Howrah, West Bengal',
    maskedGovtId: 'XXXX XXXX 3331',
    laborProfile: {
      id: 'lp-bar-1',
      isSardar: true,
      teamName: 'Shankar Das Heavy Rebar Fabrication Squad',
      teamSize: 12,
      fairWageGuarantee: true,
      dailyWage: 760,
      ratePerSqFt: 18,
      rateUnit: 'sq.ft',
      experienceYears: 13,
      skills: [
        { id: 'sk-b1', name: 'Bar Bender & Steel Fixer' },
        { id: 'sk-b2', name: 'Fe550D TMT Cutting & Bending' },
        { id: 'sk-b3', name: 'Column Footing Cage' },
        { id: 'sk-b4', name: 'Slab Reinforcement' },
      ],
      availability: [
        { id: 'av-b1', date: '2026-10-11', status: 'AVAILABLE', slotsAvailable: 12, totalSlots: 12 },
        { id: 'av-b2', date: '2026-10-12', status: 'AVAILABLE', slotsAvailable: 12, totalSlots: 12 },
      ],
    },
  },
  {
    id: 'user-laborer-bar-2',
    name: 'Gopal Barik Steel Binding Team',
    mobile: '9876543332',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    rating: 4.8,
    city: 'Kona Expressway, Howrah, West Bengal',
    maskedGovtId: 'XXXX XXXX 3332',
    laborProfile: {
      id: 'lp-bar-2',
      isSardar: true,
      teamName: 'Gopal Barik High-Rise Steel Binding Squad',
      teamSize: 8,
      fairWageGuarantee: true,
      dailyWage: 740,
      ratePerSqFt: 16,
      rateUnit: 'sq.ft',
      experienceYears: 8,
      skills: [
        { id: 'sk-b5', name: 'Bar Bender & Steel Fixer' },
        { id: 'sk-b6', name: 'Stirrup Ring Fabrication' },
        { id: 'sk-b7', name: 'Beam Cage Tying' },
      ],
      availability: [
        { id: 'av-b3', date: '2026-10-11', status: 'AVAILABLE', slotsAvailable: 8, totalSlots: 8 },
      ],
    },
  },
  {
    id: 'user-laborer-bar-3',
    name: 'Manik Sen Precision Bar Benders',
    mobile: '9876543333',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 4.85,
    city: 'Rajarhat Expressway, New Town, West Bengal',
    maskedGovtId: 'XXXX XXXX 3333',
    laborProfile: {
      id: 'lp-bar-3',
      isSardar: false,
      teamSize: 6,
      fairWageGuarantee: true,
      dailyWage: 750,
      ratePerSqFt: 19,
      rateUnit: 'sq.ft',
      experienceYears: 10,
      skills: [
        { id: 'sk-b8', name: 'Bar Bender & Steel Fixer' },
        { id: 'sk-b9', name: 'Shear Wall Rebar' },
        { id: 'sk-b10', name: 'Cantilever Beam Reinforcement' },
      ],
      availability: [
        { id: 'av-b4', date: '2026-10-11', status: 'AVAILABLE', slotsAvailable: 6, totalSlots: 6 },
      ],
    },
  },

  // --- BRICK JOINTERS ---
  {
    id: 'user-laborer-joint-1',
    name: 'Ananta Biswas Precision Brick Jointing',
    mobile: '9876543341',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    rating: 4.8,
    city: 'Shyambazar & North Kolkata, West Bengal',
    maskedGovtId: 'XXXX XXXX 3341',
    laborProfile: {
      id: 'lp-joint-1',
      isSardar: false,
      teamSize: 5,
      fairWageGuarantee: true,
      dailyWage: 750,
      ratePerSqFt: 14,
      rateUnit: 'sq.ft',
      experienceYears: 9,
      skills: [
        { id: 'sk-j1', name: 'Brick Jointer' },
        { id: 'sk-j2', name: 'Flemish Bond Pointing' },
        { id: 'sk-j3', name: 'Mortar Groove Scraping' },
      ],
      availability: [
        { id: 'av-j1', date: '2026-10-11', status: 'AVAILABLE', slotsAvailable: 5, totalSlots: 5 },
      ],
    },
  },
  {
    id: 'user-laborer-joint-2',
    name: 'Sanjoy Das Wall Jointing Guild',
    mobile: '9876543342',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    rating: 4.75,
    city: 'Salt Lake Sector 1, Kolkata, West Bengal',
    maskedGovtId: 'XXXX XXXX 3342',
    laborProfile: {
      id: 'lp-joint-2',
      isSardar: false,
      teamSize: 4,
      fairWageGuarantee: true,
      dailyWage: 710,
      ratePerSqFt: 12,
      rateUnit: 'sq.ft',
      experienceYears: 7,
      skills: [
        { id: 'sk-j4', name: 'Brick Jointer' },
        { id: 'sk-j5', name: 'Thin-bed AAC Jointing' },
        { id: 'sk-j6', name: 'Polymer Adhesive Mortar' },
      ],
      availability: [
        { id: 'av-j2', date: '2026-10-11', status: 'AVAILABLE', slotsAvailable: 4, totalSlots: 4 },
      ],
    },
  },
  {
    id: 'user-laborer-joint-3',
    name: 'Prakash Rao Structural Jointing Squad',
    mobile: '9876543343',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    city: 'Jadavpur & Kasba, Kolkata, West Bengal',
    maskedGovtId: 'XXXX XXXX 3343',
    laborProfile: {
      id: 'lp-joint-3',
      isSardar: true,
      teamName: 'Prakash Rao Heavy Block Jointing Squad',
      teamSize: 6,
      fairWageGuarantee: true,
      dailyWage: 730,
      ratePerSqFt: 15,
      rateUnit: 'sq.ft',
      experienceYears: 11,
      skills: [
        { id: 'sk-j7', name: 'Brick Jointer' },
        { id: 'sk-j8', name: 'Hollow Block Jointing' },
        { id: 'sk-j9', name: 'Mortar Keying' },
      ],
      availability: [
        { id: 'av-j3', date: '2026-10-11', status: 'AVAILABLE', slotsAvailable: 6, totalSlots: 6 },
      ],
    },
  },
];
