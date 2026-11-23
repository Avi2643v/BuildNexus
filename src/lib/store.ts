import { create } from 'zustand';

export type UserRole = 'CONTRACTOR' | 'LABORER' | 'SUPPLIER' | 'DELIVERY_AGENT' | 'ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
  maskedGovtId?: string;
  isVerified: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  avatar?: string;
  city: string;
  rating?: number;
  bio?: string;
  // Labour specific
  trade?: string;
  isSardar?: boolean;
  teamSize?: number;
  ratePerSqFt?: number;
  dailyWage?: number;
  // Builder specific
  licenseType?: string;
  projectsCompleted?: number;
  totalSqFtBuilt?: string;
  areasWorked?: string[];
  specializations?: string[];
  company?: string;
}

export interface CartItemStore {
  materialId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  supplierId: string;
  supplierName: string;
  image: string;
  negotiatedPrice?: number;
  isCustomRateForContractor?: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface SiteStockItem {
  id: string;
  materialId: string;
  name: string;
  unit: string;
  totalAllocated: number;
  currentStock: number;
  dailyBurnRate: number;
  reorderLevel: number;
  image: string;
  supplierName: string;
  price: number;
  negotiatedPrice?: number;
  lastUpdated: string;
  siteLocation?: string;
}

export interface LabourBookingOffer {
  id: string;
  contractorName: string;
  contractorRating: number;
  contractorMobileMasked: string;
  siteLocation: string;
  tradeRequired: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  shiftTiming: string;
  workAreaSqFt: number; // Total site area contracted (sq.ft)
  ratePerSqFt: number; // Offered rate as per sq.ft (₹/sq.ft)
  totalWage: number; // Total payout = workAreaSqFt * ratePerSqFt
  dailyWageOffered?: number; // legacy fallback
  status: 'OFFER_RECEIVED' | 'ACCEPTED' | 'COUNTERED' | 'DECLINED';
  counterRatePerSqFt?: number; // Worker counter offer (₹/sq.ft)
  counterWage?: number; // legacy fallback
  counterNotes?: string;
  companyCallScheduled: boolean;
  callScheduledTime: string;
}

export interface CustomerLabourSquadProfile {
  id: string;
  name: string;
  tradeTitle: string;
  tradeCategory: 'ELECTRICAL' | 'PLUMBING' | 'TILING' | 'MASONRY' | 'PAINTING';
  ratePerSqFt: number; // Transparent rate (₹/sq.ft)
  teamSize: number;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  licenseNumber: string;
  workingAreas: string[];
  avatar: string;
  mobileMasked: string;
  recentWorks: string;
  shiftTiming: string;
}

export interface SupplierRankingProfile {
  id: string;
  rank: number;
  name: string;
  companyName: string;
  tierBadge: string;
  fulfillmentRate: number; // e.g. 99.8%
  rating: number; // e.g. 4.96
  reviewsCount: number;
  annualDispatchedVolume: string; // e.g. "₹3.8 Cr Annual Dispatched"
  hubLocation: string; // e.g. "Dankuni Central Warehouse Yard, Hooghly"
  turnaroundTime: string; // e.g. "< 3.5 hrs Express to New Town"
  materialsSupplied: string[];
  stockAvailability: 'HIGH' | 'STABLE' | 'LIMITED';
  phoneMasked: string;
  avatar: string;
  specialOfferBadge?: string;
}

export interface BuilderRankingProfile {
  id: string;
  rank: number;
  name: string;
  companyName: string;
  creditTier: string; // e.g. "AAA Punctual Paymaster"
  promptPaymentScore: number; // e.g. 99.8%
  monthlyInwardSpend: string; // e.g. "₹45 Lakhs / month"
  rating: number; // e.g. 4.95
  projectsCompleted: number;
  totalSqFtBuilt: string; // e.g. "2.4 Lakh sq.ft"
  activeSites: string[];
  licenseType: string;
  avatar: string;
  phoneMasked: string;
}

export interface BuilderPublicProfile {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  license: string;
  onTimeDeliveryRate: number;
  projectsCompleted: number;
  totalSqFtBuilt: string;
  areasWorked: string[];
  specializations: string[];
  avatar: string;
  phoneMasked: string;
  establishedYear: number;
  projectBreakdown: string;
}

export interface MaterialNegotiationInquiry {
  id: string;
  builderId: string;
  builderName: string;
  builderSite: string;
  supplierId: string;
  supplierName: string;
  materialId: string;
  materialName: string;
  materialImage: string;
  unit: string;
  quantityRequested: number;
  standardPrice: number;
  builderProposedPrice: number;
  supplierChangedPrice?: number;
  status: 'INQUIRY_RECEIVED' | 'PRICE_CHANGED_BY_SUPPLIER' | 'AGREED_AND_LOCKED' | 'DECLINED';
  builderNote?: string;
  supplierNote?: string;
  lastUpdated: string;
}

export interface CustomerConsultationInquiry {
  id: string;
  builderId: string;
  customerName: string;
  customerPhone: string;
  projectLocation: string;
  projectDescription: string;
  scope: string;
  date: string;
  status: 'NEW_LEAD' | 'CONTACTED' | 'PROPOSAL_SENT';
}

export interface BuilderSurplusSellOffer {
  id: string;
  builderId: string;
  builderName: string;
  builderCompany: string;
  builderPhone: string;
  siteLocation: string;
  materialId?: string;
  materialName: string;
  category: 'CEMENT' | 'STEEL' | 'BRICKS' | 'TILES' | 'PAINT' | 'AGGREGATES' | 'OTHER';
  quantity: number;
  unit: string;
  condition: 'UNOPENED_FACTORY_SEALED' | 'EXCELLENT_SITE_STAGED' | 'PARTIAL_LOT';
  originalPurchasePrice: number;
  askingPricePerUnit: number;
  totalValuation: number;
  marketRetailPrice: number;
  discountPercentage: number;
  targetSupplierId: string;
  targetSupplierName: string;
  siteClearanceDeadline: string;
  materialImage: string;
  notes?: string;
  dateCreated: string;
  status: 'OPEN_TO_SUPPLIERS' | 'COUNTER_PROPOSED_BY_SUPPLIER' | 'DEAL_ACCEPTED' | 'PICKUP_DISPATCHED' | 'COMPLETED' | 'DECLINED';
  counterPricePerUnit?: number;
  counterSupplierId?: string;
  counterSupplierName?: string;
  counterNotes?: string;
  pickupScheduledDate?: string;
  paymentSettlementStatus?: 'PENDING' | 'ESCROW_HELD' | 'PAID_TO_BUILDER';
}

export interface SupplierMaterialShowcaseItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  unit: string;
  baseRate: number;
  marketMrp: number;
  stockCount: number;
  stockStatus: 'HIGH' | 'STABLE' | 'LIMITED';
  hubLocation: string;
  deliveryTime: string;
  specifications: string;
  tier1MinQty?: number;
  tier1Rate?: number;
  tier2MinQty?: number;
  tier2Rate?: number;
  image: string;
  isPublished: boolean;
}

interface AppState {
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;

  // Language
  language: 'en' | 'hi' | 'kn';
  setLanguage: (lang: 'en' | 'hi' | 'kn') => void;

  // Cart
  cart: CartItemStore[];
  addToCart: (item: Omit<CartItemStore, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (materialId: string) => void;
  updateCartQty: (materialId: string, quantity: number) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;

  // Targeted Contractor Negotiated Rates (materialId -> Custom Rate for current contractor)
  contractorCustomRates: Record<string, number>;
  setContractorCustomRate: (materialId: string, rate: number) => void;

  // Two-Way Material Inquiries & Negotiation (Builder <-> Supplier)
  materialNegotiationInquiries: MaterialNegotiationInquiry[];
  supplierUpdateNegotiationPrice: (inquiryId: string, changedPrice: number, supplierNote?: string) => void;
  builderAcceptNegotiatedPrice: (inquiryId: string) => void;
  builderDeclineNegotiation: (inquiryId: string) => void;

  // Contractor Site Material Stock Tracker
  siteMaterialsStock: SiteStockItem[];
  logSiteMaterialConsumption: (id: string, unitsConsumed: number) => void;
  updateSiteMaterialStock: (id: string, currentStock: number, dailyBurnRate: number) => void;

  // Labour Booking Offers (for Labour Persona)
  labourBookingOffers: LabourBookingOffer[];
  respondToLabourOffer: (id: string, status: 'ACCEPTED' | 'DECLINED' | 'COUNTERED', counterRatePerSqFt?: number, notes?: string) => void;
  addLabourBookingOffer: (offer: Omit<LabourBookingOffer, 'id' | 'status' | 'companyCallScheduled' | 'callScheduledTime'>) => void;

  // Customer Labour Squad Directory (for Homeowner Persona)
  customerLabourSquads: CustomerLabourSquadProfile[];

  // Verified Builder Public Directory (for Customer Persona - NO PRICING SHOWN)
  builderPublicProfiles: BuilderPublicProfile[];
  updateBuilderProfileSettings: (builderId: string, data: Partial<BuilderPublicProfile>) => void;

  // Supplier Rankings for Builders
  supplierRankingProfiles: SupplierRankingProfile[];

  // Builder Rankings for Suppliers
  builderRankingProfiles: BuilderRankingProfile[];

  // Builder Surplus Material Sales to Suppliers (Builder -> Supplier Buyback)
  builderSurplusSellOffers: BuilderSurplusSellOffer[];
  addBuilderSurplusSellOffer: (offer: Omit<BuilderSurplusSellOffer, 'id' | 'dateCreated' | 'status' | 'discountPercentage' | 'totalValuation'>) => void;
  supplierCounterSurplusOffer: (offerId: string, counterPricePerUnit: number, supplierId: string, supplierName: string, notes?: string) => void;
  supplierAcceptSurplusOffer: (offerId: string, supplierId: string, supplierName: string, pickupDate?: string) => void;
  builderAcceptSupplierCounter: (offerId: string) => void;
  builderDeclineSupplierOffer: (offerId: string) => void;
  supplierDispatchPickup: (offerId: string) => void;
  completeSurplusBuyback: (offerId: string) => void;

  // Supplier Material Showcase & Live Rate Card (Supplier Catalog Window)
  supplierShowcaseMaterials: SupplierMaterialShowcaseItem[];
  updateSupplierMaterialRate: (materialId: string, newRate: number, volumeTiers?: { tier1MinQty?: number; tier1Rate?: number; tier2MinQty?: number; tier2Rate?: number }) => void;
  updateSupplierMaterialStock: (materialId: string, stockCount: number, stockStatus: 'HIGH' | 'STABLE' | 'LIMITED') => void;
  addSupplierShowcaseMaterial: (material: Omit<SupplierMaterialShowcaseItem, 'id'>) => void;
  toggleSupplierMaterialVisibility: (materialId: string) => void;

  // Customer Consultation Inquiries & Builder Leads
  customerConsultationInquiries: CustomerConsultationInquiry[];
  addCustomerConsultationInquiry: (inquiry: Omit<CustomerConsultationInquiry, 'id' | 'date' | 'status'>) => void;
  updateCustomerConsultationStatus: (id: string, status: 'NEW_LEAD' | 'CONTACTED' | 'PROPOSAL_SENT') => void;

  // Toast
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Onboarding & Theme
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (seen: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Auth defaults to null (app starts from login page)
  user: null,
  setUser: (user) => set({ user }),
  activeRole: 'CONTRACTOR',
  setActiveRole: (role) => set({ activeRole: role }),

  // i18n
  language: 'en',
  setLanguage: (language) => set({ language }),

  // Targeted Contractor Custom Locked Rates (Supplier locked rates for Rajesh Sharma)
  contractorCustomRates: {
    'mat-1': 365, // UltraTech PPC Cement catalog is 380, but locked to 365 for Rajesh
    'mat-2': 61,  // Tata Tiscon 550D Rebar catalog is 65, locked to 61 for Rajesh
  },
  setContractorCustomRate: (materialId, rate) =>
    set((state) => ({
      contractorCustomRates: {
        ...state.contractorCustomRates,
        [materialId]: rate,
      },
    })),

  // Cart
  cart: [
    {
      materialId: 'mat-1',
      name: 'UltraTech PPC Cement (50kg)',
      price: 380,
      negotiatedPrice: 365,
      isCustomRateForContractor: true,
      unit: 'bag',
      quantity: 50,
      supplierId: 'sup-1',
      supplierName: 'Lakshmi Building Supplies (Kolkata Hub)',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
    },
    {
      materialId: 'mat-2',
      name: 'Tata Tiscon 550D TMT Rebar (12mm)',
      price: 65,
      negotiatedPrice: 61,
      isCustomRateForContractor: true,
      unit: 'kg',
      quantity: 500,
      supplierId: 'sup-2',
      supplierName: 'Bengal TMT & Steel Hub (Durgapur Plant)',
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
    },
  ],
  addToCart: (newItem) =>
    set((state) => {
      // Check if custom rate exists for this material specifically for this contractor
      const customRate = state.contractorCustomRates[newItem.materialId];
      const negotiatedPrice = newItem.negotiatedPrice || customRate;
      const isCustomRateForContractor = !!customRate;

      const existing = state.cart.find((c) => c.materialId === newItem.materialId);
      const qtyToAdd = newItem.quantity || 1;

      if (existing) {
        return {
          cart: state.cart.map((c) =>
            c.materialId === newItem.materialId
              ? {
                  ...c,
                  quantity: c.quantity + qtyToAdd,
                  negotiatedPrice: negotiatedPrice || c.negotiatedPrice,
                  isCustomRateForContractor: isCustomRateForContractor || c.isCustomRateForContractor,
                }
              : c
          ),
          isCartDrawerOpen: true,
        };
      }
      return {
        cart: [
          ...state.cart,
          {
            ...newItem,
            quantity: qtyToAdd,
            negotiatedPrice,
            isCustomRateForContractor,
          },
        ],
        isCartDrawerOpen: true,
      };
    }),
  removeFromCart: (materialId) =>
    set((state) => ({
      cart: state.cart.filter((c) => c.materialId !== materialId),
    })),
  updateCartQty: (materialId, quantity) =>
    set((state) => ({
      cart: quantity <= 0
        ? state.cart.filter((c) => c.materialId !== materialId)
        : state.cart.map((c) => (c.materialId === materialId ? { ...c, quantity } : c)),
    })),
  clearCart: () => set({ cart: [] }),
  isCartDrawerOpen: false,
  setCartDrawerOpen: (isCartDrawerOpen) => set({ isCartDrawerOpen }),

  // Two-Way Material Inquiries & Demand Desk (Builder <-> Supplier)
  materialNegotiationInquiries: [
    {
      id: 'inq-1',
      builderId: 'user-contractor-1',
      builderName: 'Rajesh Sharma (Ramesh Constructions)',
      builderSite: 'Plot 42, Action Area II, New Town, Kolkata',
      supplierId: 'user-supplier-1',
      supplierName: 'Lakshmi Building Supplies (Kolkata Hub)',
      materialId: 'mat-1',
      materialName: 'UltraTech PPC Cement (50kg)',
      materialImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
      unit: 'bags',
      quantityRequested: 500,
      standardPrice: 380,
      builderProposedPrice: 350,
      supplierChangedPrice: 358,
      status: 'PRICE_CHANGED_BY_SUPPLIER',
      builderNote: 'Urgent foundation casting for G+4 building in New Town. Looking for volume discount.',
      supplierNote: 'We can deliver at ₹358/bag direct from Dankuni Central Warehouse Hub with free unloading.',
      lastUpdated: '10 mins ago',
    },
    {
      id: 'inq-2',
      builderId: 'user-contractor-2',
      builderName: 'Vikram Builders & Developers',
      builderSite: 'Sector V IT Park Block EP, Salt Lake, Kolkata',
      supplierId: 'user-supplier-1',
      supplierName: 'Lakshmi Building Supplies (Kolkata Hub)',
      materialId: 'mat-2',
      materialName: 'Tata Tiscon 550D TMT Rebar (12mm)',
      materialImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
      unit: 'tons',
      quantityRequested: 15,
      standardPrice: 65,
      builderProposedPrice: 59,
      status: 'INQUIRY_RECEIVED',
      builderNote: 'Commercial tech park column reinforcement. Need delivery within 48 hours.',
      lastUpdated: '25 mins ago',
    },
    {
      id: 'inq-3',
      builderId: 'user-contractor-1',
      builderName: 'Rajesh Sharma (Ramesh Constructions)',
      builderSite: 'City Centre II Project, Rajarhat, Kolkata',
      supplierId: 'user-supplier-1',
      supplierName: 'Lakshmi Building Supplies (Kolkata Hub)',
      materialId: 'mat-3',
      materialName: 'Red Wire Cut Solid Clay Bricks',
      materialImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
      unit: 'pcs',
      quantityRequested: 10000,
      standardPrice: 9.5,
      builderProposedPrice: 8.5,
      supplierChangedPrice: 8.8,
      status: 'AGREED_AND_LOCKED',
      builderNote: 'Boundary wall masonry work for Rajarhat villa project.',
      supplierNote: 'Agreed at ₹8.8/pc with direct transit staging.',
      lastUpdated: 'Yesterday',
    },
  ],
  supplierUpdateNegotiationPrice: (inquiryId, changedPrice, supplierNote) =>
    set((state) => {
      const inq = state.materialNegotiationInquiries.find((i) => i.id === inquiryId);
      if (!inq) return state;

      // Immediately set the contractor-specific custom rate so it binds to the builder!
      const updatedRates = {
        ...state.contractorCustomRates,
        [inq.materialId]: changedPrice,
      };

      // If item is already in cart, update its negotiated price live
      const updatedCart = state.cart.map((c) =>
        c.materialId === inq.materialId
          ? {
              ...c,
              negotiatedPrice: changedPrice,
              isCustomRateForContractor: true,
            }
          : c
      );

      return {
        contractorCustomRates: updatedRates,
        cart: updatedCart,
        materialNegotiationInquiries: state.materialNegotiationInquiries.map((i) =>
          i.id === inquiryId
            ? {
                ...i,
                supplierChangedPrice: changedPrice,
                supplierNote: supplierNote || i.supplierNote,
                status: 'PRICE_CHANGED_BY_SUPPLIER',
                lastUpdated: 'Just now (Supplier Price Changed)',
              }
            : i
        ),
      };
    }),
  builderAcceptNegotiatedPrice: (inquiryId) =>
    set((state) => {
      const inq = state.materialNegotiationInquiries.find((i) => i.id === inquiryId);
      if (!inq || !inq.supplierChangedPrice) return state;

      const agreedPrice = inq.supplierChangedPrice;
      const updatedRates = {
        ...state.contractorCustomRates,
        [inq.materialId]: agreedPrice,
      };

      // Ensure builder cart reflects this exact price
      const existingInCart = state.cart.find((c) => c.materialId === inq.materialId);
      let updatedCart = state.cart;
      if (existingInCart) {
        updatedCart = state.cart.map((c) =>
          c.materialId === inq.materialId
            ? {
                ...c,
                negotiatedPrice: agreedPrice,
                isCustomRateForContractor: true,
              }
            : c
        );
      } else {
        updatedCart = [
          ...state.cart,
          {
            materialId: inq.materialId,
            name: inq.materialName,
            price: inq.standardPrice,
            negotiatedPrice: agreedPrice,
            isCustomRateForContractor: true,
            unit: inq.unit,
            quantity: inq.quantityRequested,
            supplierId: inq.supplierId,
            supplierName: inq.supplierName,
            image: inq.materialImage,
          },
        ];
      }

      return {
        contractorCustomRates: updatedRates,
        cart: updatedCart,
        isCartDrawerOpen: true,
        materialNegotiationInquiries: state.materialNegotiationInquiries.map((i) =>
          i.id === inquiryId
            ? {
                ...i,
                status: 'AGREED_AND_LOCKED',
                lastUpdated: 'Just now (Agreed & Locked)',
              }
            : i
        ),
      };
    }),
  builderDeclineNegotiation: (inquiryId) =>
    set((state) => ({
      materialNegotiationInquiries: state.materialNegotiationInquiries.map((i) =>
        i.id === inquiryId
          ? {
              ...i,
              status: 'DECLINED',
              lastUpdated: 'Just now (Declined)',
            }
          : i
      ),
    })),

  // Contractor Site Material Stock Tracker
  siteMaterialsStock: [
    {
      id: 'stock-1',
      materialId: 'mat-1',
      name: 'UltraTech PPC Cement (50kg)',
      unit: 'bags',
      totalAllocated: 250,
      currentStock: 42,
      dailyBurnRate: 15,
      reorderLevel: 50,
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
      supplierName: 'Lakshmi Building Supplies',
      price: 380,
      negotiatedPrice: 365,
      lastUpdated: 'Today at 08:30 AM',
    },
    {
      id: 'stock-2',
      materialId: 'mat-2',
      name: 'Tata Tiscon 550D TMT Rebar (12mm)',
      unit: 'MT',
      totalAllocated: 12.5,
      currentStock: 1.8,
      dailyBurnRate: 0.6,
      reorderLevel: 2.5,
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
      supplierName: 'Karnataka Steel Hub',
      price: 58500,
      negotiatedPrice: 56900,
      lastUpdated: 'Yesterday at 05:45 PM',
    },
    {
      id: 'stock-3',
      materialId: 'mat-3',
      name: 'Manufactured M-Sand (Zone II, Washed)',
      unit: 'tons',
      totalAllocated: 60,
      currentStock: 9,
      dailyBurnRate: 3.5,
      reorderLevel: 15,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
      supplierName: 'Sri Balaji Aggregates & Sand',
      price: 1450,
      negotiatedPrice: 1410,
      lastUpdated: 'Today at 07:15 AM',
    },
    {
      id: 'stock-4',
      materialId: 'mat-4',
      name: '20mm Blue Metal Coarse Aggregate',
      unit: 'tons',
      totalAllocated: 45,
      currentStock: 18,
      dailyBurnRate: 2.8,
      reorderLevel: 12,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
      supplierName: 'Sri Balaji Aggregates & Sand',
      price: 1100,
      lastUpdated: 'Today at 09:00 AM',
    },
    {
      id: 'stock-5',
      materialId: 'mat-5',
      name: 'Aerocon AAC Lightweight Blocks',
      unit: 'pcs',
      totalAllocated: 3200,
      currentStock: 480,
      dailyBurnRate: 180,
      reorderLevel: 600,
      image: 'https://images.unsplash.com/photo-1584463699042-45a8e2cbce18?auto=format&fit=crop&w=400&q=80',
      supplierName: 'Lakshmi Building Supplies',
      price: 62,
      negotiatedPrice: 58,
      lastUpdated: 'Yesterday at 04:30 PM',
    },
  ],
  logSiteMaterialConsumption: (id, unitsConsumed) =>
    set((state) => ({
      siteMaterialsStock: state.siteMaterialsStock.map((item) =>
        item.id === id
          ? {
              ...item,
              currentStock: Math.max(0, item.currentStock - unitsConsumed),
              lastUpdated: 'Just now (Site Consumption Logged)',
            }
          : item
      ),
    })),
  updateSiteMaterialStock: (id, currentStock, dailyBurnRate) =>
    set((state) => ({
      siteMaterialsStock: state.siteMaterialsStock.map((item) =>
        item.id === id
          ? {
              ...item,
              currentStock,
              dailyBurnRate,
              lastUpdated: 'Just now',
            }
          : item
      ),
    })),

  // Labour Booking Offers (Work contracted as per sq.ft)
  labourBookingOffers: [
    {
      id: 'offer-lab-1',
      contractorName: 'Rajesh Builders & Infrastructure',
      contractorRating: 4.95,
      contractorMobileMasked: '98765XXXX0',
      siteLocation: 'Site #14, Action Area II, New Town, Kolkata, West Bengal',
      tradeRequired: 'Electrician (3-Phase Conduit, DB & Wiring Work)',
      startDate: '2026-10-14',
      endDate: '2026-10-18',
      durationDays: 5,
      shiftTiming: '08:30 AM - 05:30 PM (Day Shift)',
      workAreaSqFt: 2200,
      ratePerSqFt: 18,
      totalWage: 39600, // 2,200 sq.ft * ₹18/sq.ft
      status: 'OFFER_RECEIVED',
      companyCallScheduled: true,
      callScheduledTime: '13 Oct 2026, 04:00 PM',
    },
    {
      id: 'offer-lab-2',
      contractorName: 'Sovereign Concrete Constructions (Bengal Hub)',
      contractorRating: 4.88,
      contractorMobileMasked: '98451XXXX2',
      siteLocation: 'Sector V IT Park Block EP, Salt Lake, Kolkata, West Bengal',
      tradeRequired: 'Plumber & Sanitary Pipeline Specialist',
      startDate: '2026-10-16',
      endDate: '2026-10-19',
      durationDays: 4,
      shiftTiming: '09:00 AM - 06:00 PM (Day Shift)',
      workAreaSqFt: 1600,
      ratePerSqFt: 16,
      totalWage: 25600, // 1,600 sq.ft * ₹16/sq.ft
      status: 'OFFER_RECEIVED',
      companyCallScheduled: true,
      callScheduledTime: '15 Oct 2026, 11:30 AM',
    },
    {
      id: 'offer-lab-3',
      contractorName: 'Apex Bengal Developers',
      contractorRating: 4.8,
      contractorMobileMasked: '99002XXXX8',
      siteLocation: 'City Centre II Project, Rajarhat, Kolkata, West Bengal',
      tradeRequired: 'Master Tile & Granite Layer',
      startDate: '2026-10-20',
      endDate: '2026-10-25',
      durationDays: 6,
      shiftTiming: '08:00 AM - 05:00 PM (Day Shift)',
      workAreaSqFt: 2800,
      ratePerSqFt: 24,
      totalWage: 67200, // 2,800 sq.ft * ₹24/sq.ft
      status: 'ACCEPTED',
      companyCallScheduled: true,
      callScheduledTime: '19 Oct 2026, 02:00 PM',
    },
  ],
  respondToLabourOffer: (id, status, counterRatePerSqFt, notes) =>
    set((state) => ({
      labourBookingOffers: state.labourBookingOffers.map((offer) =>
        offer.id === id
          ? {
              ...offer,
              status,
              counterRatePerSqFt: counterRatePerSqFt || offer.counterRatePerSqFt,
              counterWage: counterRatePerSqFt ? Math.round(counterRatePerSqFt * (offer.workAreaSqFt || 1000)) : offer.counterWage,
              totalWage: counterRatePerSqFt ? Math.round(counterRatePerSqFt * (offer.workAreaSqFt || 1000)) : offer.totalWage,
              counterNotes: notes || offer.counterNotes,
            }
          : offer
      ),
    })),
  addLabourBookingOffer: (offer) =>
    set((state) => ({
      labourBookingOffers: [
        {
          ...offer,
          id: `offer-cust-${Date.now()}`,
          status: 'OFFER_RECEIVED',
          companyCallScheduled: true,
          callScheduledTime: 'Within 2 hours (BuildNexus Verification Call)',
        },
        ...state.labourBookingOffers,
      ],
    })),

  // Customer Labour Squad Directory (for Homeowner Persona)
  customerLabourSquads: [
    {
      id: 'cust-lab-1',
      name: 'Subhas Sardar & Squad',
      tradeTitle: 'Master Electrician & 3-Phase Conduit Specialist',
      tradeCategory: 'ELECTRICAL',
      ratePerSqFt: 18,
      teamSize: 6,
      rating: 4.96,
      reviewsCount: 148,
      experienceYears: 12,
      licenseNumber: 'WB Govt Licensed Electrical Supervisor #ES-49102',
      workingAreas: ['New Town', 'Salt Lake Sector V', 'Rajarhat', 'Action Area I & II'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      mobileMasked: '98765XXXX1',
      recentWorks: 'Concealed wiring for 28 luxury bungalows & tech apartments in New Town.',
      shiftTiming: '08:30 AM - 05:30 PM (Day Shift)',
    },
    {
      id: 'cust-lab-2',
      name: 'Pradip Halder & Team',
      tradeTitle: 'Master Tile, Italian Marble & Granite Layer',
      tradeCategory: 'TILING',
      ratePerSqFt: 24,
      teamSize: 8,
      rating: 4.92,
      reviewsCount: 112,
      experienceYears: 14,
      licenseNumber: 'Master Guild Certified Stone Mason #MG-8812',
      workingAreas: ['Alipore', 'Ballygunge', 'Behala', 'Gariahat', 'Jadavpur'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      mobileMasked: '98451XXXX6',
      recentWorks: 'Zero-joint Italian marble flooring & vitrified wall dados in South Kolkata villas.',
      shiftTiming: '08:00 AM - 05:00 PM (Day Shift)',
    },
    {
      id: 'cust-lab-3',
      name: 'Sukanta Mondal & Squad',
      tradeTitle: 'Sanitary Pipeline, CPVC & Bathroom Specialist',
      tradeCategory: 'PLUMBING',
      ratePerSqFt: 16,
      teamSize: 5,
      rating: 4.88,
      reviewsCount: 94,
      experienceYears: 10,
      licenseNumber: 'Certified Water Supply & Drainage Technician #P-3391',
      workingAreas: ['Howrah', 'Dankuni', 'Bally', 'Uttarpara', 'Kona Expressway'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      mobileMasked: '98311XXXX5',
      recentWorks: 'Complete overhead tank pressure pumps & concealed sanitary lines for duplexes.',
      shiftTiming: '09:00 AM - 06:00 PM (Day Shift)',
    },
    {
      id: 'cust-lab-4',
      name: 'Bikash Karmakar & Team',
      tradeTitle: 'Precision Brick Masonry & Plastering Squad',
      tradeCategory: 'MASONRY',
      ratePerSqFt: 22,
      teamSize: 7,
      rating: 4.85,
      reviewsCount: 82,
      experienceYears: 15,
      licenseNumber: 'Class-I Civil Masonry Squad #CMS-901',
      workingAreas: ['Barasat', 'Madhyamgram', 'Dum Dum', 'Airport Enclave'],
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      mobileMasked: '99002XXXX3',
      recentWorks: 'Perimeter brick walls, lintel beam casting, and smooth sand-cement plastering.',
      shiftTiming: '08:00 AM - 05:00 PM (Day Shift)',
    },
    {
      id: 'cust-lab-5',
      name: 'Debu Pal & Squad',
      tradeTitle: 'Exterior Waterproofing & Luxury Wall Painter',
      tradeCategory: 'PAINTING',
      ratePerSqFt: 12,
      teamSize: 6,
      rating: 4.89,
      reviewsCount: 104,
      experienceYears: 9,
      licenseNumber: 'Apex Certified Surface Applicator #PA-1102',
      workingAreas: ['Kolkata', 'New Town', 'Salt Lake', 'EM Bypass', 'Bhowanipore'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      mobileMasked: '98301XXXX8',
      recentWorks: 'Putty leveling, primer coat, and damp-proof silicone exterior painting.',
      shiftTiming: '08:30 AM - 05:30 PM (Day Shift)',
    },
  ],

  // Verified Builder Public Directory (for Customer Persona - NO PRICING SHOWN)
  builderPublicProfiles: [
    {
      id: 'builder-1',
      name: 'Rajesh Builders & Infrastructure',
      rating: 4.95,
      reviewsCount: 142,
      license: 'Class-A West Bengal Govt Registered Infrastructure Builder',
      onTimeDeliveryRate: 99.2,
      projectsCompleted: 38,
      totalSqFtBuilt: '2.4 Lakh sq.ft',
      areasWorked: ['New Town', 'Salt Lake Sector V', 'Rajarhat', 'Action Area II', 'EM Bypass'],
      specializations: ['Turnkey Luxury Villas', 'RCC Framed Structures', 'Commercial Tech Hubs', 'High-Rise Foundation'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phoneMasked: '98765XXXX0',
      establishedYear: 2012,
      projectBreakdown: '18 Luxury Bungalows, 8 Commercial Tech Hubs, 12 G+4 Residential Complexes in New Town & Kolkata',
    },
    {
      id: 'builder-2',
      name: 'Sovereign Concrete Constructions (Bengal Hub)',
      rating: 4.88,
      reviewsCount: 96,
      license: 'Class-A Registered Civil Engineering Contractor (WB PWD Licensed)',
      onTimeDeliveryRate: 98.4,
      projectsCompleted: 27,
      totalSqFtBuilt: '1.8 Lakh sq.ft',
      areasWorked: ['Alipore', 'Ballygunge', 'Behala', 'Gariahat', 'Jadavpur'],
      specializations: ['RCC Frame Specialist', 'Precast Concrete Structures', 'Heritage Renovations', 'Structural Retrofitting'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      phoneMasked: '98451XXXX2',
      establishedYear: 2015,
      projectBreakdown: '14 Heritage Renovations & Independent Houses, 6 Commercial Showrooms, 7 Multi-unit Complexes in South Kolkata',
    },
    {
      id: 'builder-3',
      name: 'Apex Bengal Developers & Contractors',
      rating: 4.82,
      reviewsCount: 84,
      license: 'Licensed Master Civil Builder & Structural Contractor',
      onTimeDeliveryRate: 97.6,
      projectsCompleted: 22,
      totalSqFtBuilt: '1.3 Lakh sq.ft',
      areasWorked: ['Howrah', 'Kalyani', 'Barasat', 'Madhyamgram', 'Dankuni'],
      specializations: ['Custom Residential Villas', 'Industrial Logistics Sheds', 'Architectural Civil Works'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      phoneMasked: '99002XXXX8',
      establishedYear: 2017,
      projectBreakdown: '12 Luxury Custom Homes, 5 Commercial Warehouses, 5 Industrial Sheds in Howrah & Hooghly Belt',
    },
    {
      id: 'builder-4',
      name: 'Pragati West Bengal Infrastructures',
      rating: 4.79,
      reviewsCount: 65,
      license: 'Class-B Certified Institutional & Industrial Builder (Asansol & Durgapur)',
      onTimeDeliveryRate: 96.8,
      projectsCompleted: 19,
      totalSqFtBuilt: '95,000 sq.ft',
      areasWorked: ['Durgapur', 'Asansol', 'Siliguri', 'Haldia'],
      specializations: ['Duplex Villas', 'Industrial Shed Civil Works', 'Commercial Office Fitouts'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      phoneMasked: '98801XXXX3',
      establishedYear: 2018,
      projectBreakdown: '10 Duplex Villas in Durgapur, 4 Commercial Tech Facilities, 5 Residential Layouts in Siliguri',
    },
  ],
  updateBuilderProfileSettings: (builderId, data) =>
    set((state) => ({
      builderPublicProfiles: state.builderPublicProfiles.map((p) =>
        p.id === builderId ? { ...p, ...data } : p
      ),
    })),

  // Customer Consultation Inquiries & Builder Leads
  customerConsultationInquiries: [
    {
      id: 'inq-lead-1',
      builderId: 'builder-1',
      customerName: 'Anirban Mukherjee',
      customerPhone: '98301XXXX5',
      projectLocation: 'Action Area II, New Town, Kolkata',
      projectDescription: 'Planning to construct a 4BHK Turnkey Luxury Villa (G+2, 3,200 sq.ft) with modern architectural finishes.',
      scope: 'Turnkey Luxury Villa Construction',
      date: 'Today at 10:15 AM',
      status: 'NEW_LEAD',
    },
    {
      id: 'inq-lead-2',
      builderId: 'builder-1',
      customerName: 'Dr. Debabrata Sen',
      customerPhone: '98312XXXX9',
      projectLocation: 'Sector V / Salt Lake Block AL',
      projectDescription: 'Interior civil retrofitting & structural expansion for commercial diagnostic center.',
      scope: 'Commercial Structural Renovation',
      date: 'Yesterday',
      status: 'CONTACTED',
    },
  ],
  addCustomerConsultationInquiry: (inquiry) =>
    set((state) => ({
      customerConsultationInquiries: [
        {
          ...inquiry,
          id: `inq-lead-${Date.now()}`,
          date: 'Just now',
          status: 'NEW_LEAD',
        },
        ...state.customerConsultationInquiries,
      ],
    })),
  updateCustomerConsultationStatus: (id, status) =>
    set((state) => ({
      customerConsultationInquiries: state.customerConsultationInquiries.map((inq) =>
        inq.id === id ? { ...inq, status } : inq
      ),
    })),

  // Supplier Rankings for Builders
  supplierRankingProfiles: [
    {
      id: 'sup-rank-1',
      rank: 1,
      name: 'Lakshmi Building Supplies',
      companyName: 'Lakshmi Building Supplies (Kolkata Hub)',
      tierBadge: 'Diamond Tier • #1 Volume Distributor',
      fulfillmentRate: 99.8,
      rating: 4.96,
      reviewsCount: 312,
      annualDispatchedVolume: '₹3.8 Cr Annual Dispatched',
      hubLocation: 'Dankuni Central Staging Yard & Hooghly Belt',
      turnaroundTime: '< 3.5 hrs Express to New Town & Salt Lake',
      materialsSupplied: ['UltraTech PPC Cement', 'Tata Tiscon 550D Rebar', 'AAC Blocks', 'Red Clay Bricks'],
      stockAvailability: 'HIGH',
      phoneMasked: '98765XXXX2',
      avatar: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=200&q=80',
      specialOfferBadge: 'Free Offloading at Action Area I & II Sites',
    },
    {
      id: 'sup-rank-2',
      rank: 2,
      name: 'Bengal TMT & Steel Hub',
      companyName: 'Bengal TMT & Steel Hub (Durgapur Plant Depot)',
      tierBadge: 'Platinum Tier • Direct Foundry Staging',
      fulfillmentRate: 99.4,
      rating: 4.92,
      reviewsCount: 228,
      annualDispatchedVolume: '₹2.9 Cr Annual Dispatched',
      hubLocation: 'Kona Expressway Staging Yard & Durgapur Railhead',
      turnaroundTime: '< 4 hrs Heavy Trailer Delivery',
      materialsSupplied: ['Tata Tiscon 550D Rebar', 'JSW NeoSteel Fe-550D', 'SAIL Structural Steel', 'Binding Wire'],
      stockAvailability: 'HIGH',
      phoneMasked: '98301XXXX7',
      avatar: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=200&q=80',
      specialOfferBadge: 'Mill Test Certificate Included on Dispatch',
    },
    {
      id: 'sup-rank-3',
      rank: 3,
      name: 'Hooghly River Sand & Aggregates',
      companyName: 'Hooghly River Sand & Blue Metal Aggregates',
      tierBadge: 'Gold Tier • Certified Grading',
      fulfillmentRate: 98.7,
      rating: 4.88,
      reviewsCount: 174,
      annualDispatchedVolume: '₹1.8 Cr Annual Dispatched',
      hubLocation: 'Howrah Riverfront Terminal & Kona Corridor',
      turnaroundTime: '< 5 hrs Tipper Truck Dispatch',
      materialsSupplied: ['Zone-II Washed River Sand', '20mm Blue Metal Aggregate', '10mm Down Aggregate', 'Stone Dust'],
      stockAvailability: 'STABLE',
      phoneMasked: '98311XXXX4',
      avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80',
      specialOfferBadge: 'Weighbridge Printout with every Tipper',
    },
    {
      id: 'sup-rank-4',
      rank: 4,
      name: 'Ambuja & ACC Eastern Distribution',
      companyName: 'Ambuja & ACC Eastern Distribution Hub',
      tierBadge: 'Silver Tier • Authorized Master Depot',
      fulfillmentRate: 98.2,
      rating: 4.84,
      reviewsCount: 146,
      annualDispatchedVolume: '₹1.4 Cr Annual Dispatched',
      hubLocation: 'Rajarhat Expressway Depot, North 24 Parganas',
      turnaroundTime: '< 4.5 hrs Dispatch',
      materialsSupplied: ['Ambuja Kawach Waterproof Cement', 'ACC Concrete+ Xtra', 'Waterproofing Compounds'],
      stockAvailability: 'HIGH',
      phoneMasked: '98450XXXX8',
      avatar: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=200&q=80',
    },
  ],

  // Builder Rankings for Suppliers
  builderRankingProfiles: [
    {
      id: 'bld-rank-1',
      rank: 1,
      name: 'Joyjit Debnath',
      companyName: 'Joyjit Constructions (New Town)',
      creditTier: 'AAA Tier • 0 Default Days',
      promptPaymentScore: 99.8,
      monthlyInwardSpend: '₹45 Lakhs / month',
      rating: 4.95,
      projectsCompleted: 38,
      totalSqFtBuilt: '2.4 Lakh sq.ft',
      activeSites: ['New Town Action Area II', 'Salt Lake Sector V', 'Rajarhat Villa Enclave'],
      licenseType: 'Class-A Registered Infrastructure Builder (WB PWD Licensed)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phoneMasked: '98765XXXX0',
    },
    {
      id: 'bld-rank-2',
      rank: 2,
      name: 'Niharika Sen',
      companyName: 'Sovereign Concrete Constructions (Bengal Hub)',
      creditTier: 'AA+ Tier • High Volume RCC Specialist',
      promptPaymentScore: 99.1,
      monthlyInwardSpend: '₹36 Lakhs / month',
      rating: 4.88,
      projectsCompleted: 27,
      totalSqFtBuilt: '1.8 Lakh sq.ft',
      activeSites: ['Alipore Multi-Story', 'Ballygunge Circular', 'Behala Enclave'],
      licenseType: 'Class-A Registered Civil Engineering Contractor (WB PWD)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      phoneMasked: '98451XXXX2',
    },
    {
      id: 'bld-rank-3',
      rank: 3,
      name: 'Pratik Mukherjee',
      companyName: 'Apex Bengal Developers & Contractors',
      creditTier: 'AA Tier • Verified Industrial & Villa Builder',
      promptPaymentScore: 98.4,
      monthlyInwardSpend: '₹28 Lakhs / month',
      rating: 4.82,
      projectsCompleted: 22,
      totalSqFtBuilt: '1.3 Lakh sq.ft',
      activeSites: ['Howrah Logistics Park', 'Dankuni Warehousing Bay', 'Kalyani Tech Hub'],
      licenseType: 'Licensed Master Civil Builder & Structural Contractor',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      phoneMasked: '99002XXXX8',
    },
    {
      id: 'bld-rank-4',
      rank: 4,
      name: 'Subrata Roy',
      companyName: 'Pragati West Bengal Infrastructures',
      creditTier: 'A+ Tier • Institutional Projects',
      promptPaymentScore: 97.5,
      monthlyInwardSpend: '₹22 Lakhs / month',
      rating: 4.79,
      projectsCompleted: 19,
      totalSqFtBuilt: '95,000 sq.ft',
      activeSites: ['Durgapur Steel Township', 'Asansol Commercial Center'],
      licenseType: 'Class-B Certified Institutional & Industrial Builder',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      phoneMasked: '98801XXXX3',
    },
  ],

  // Builder Surplus Material Sales to Suppliers (Builder -> Supplier Buyback)
  builderSurplusSellOffers: [
    {
      id: 'surplus-1',
      builderId: 'user-contractor-1',
      builderName: 'Rajesh Sharma',
      builderCompany: 'Joyjit Constructions (New Town)',
      builderPhone: '+91 98765 43210',
      siteLocation: 'Plot 42, Action Area II, New Town, Kolkata',
      materialId: 'mat-1',
      materialName: 'UltraTech PPC Cement (50kg)',
      category: 'CEMENT',
      quantity: 85,
      unit: 'bags',
      condition: 'UNOPENED_FACTORY_SEALED',
      originalPurchasePrice: 380,
      askingPricePerUnit: 325,
      totalValuation: 27625,
      marketRetailPrice: 380,
      discountPercentage: 14,
      targetSupplierId: 'ALL_SUPPLIERS',
      targetSupplierName: 'All Verified West Bengal Suppliers',
      siteClearanceDeadline: 'Within 48 Hours (Excavation starting)',
      materialImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
      notes: 'Slab cast completed yesterday. 85 unpunctured bags stored dry on elevated wooden pallets with plastic wraps.',
      dateCreated: 'Today at 09:15 AM',
      status: 'OPEN_TO_SUPPLIERS',
      paymentSettlementStatus: 'PENDING',
    },
    {
      id: 'surplus-2',
      builderId: 'user-contractor-2',
      builderName: 'Vikram Builders & Developers',
      builderCompany: 'Vikram Infrastructure Works',
      builderPhone: '+91 98301 44921',
      siteLocation: 'Sector V IT Park Block EP, Salt Lake, Kolkata',
      materialId: 'mat-2',
      materialName: 'Tata Tiscon 550D TMT Rebar (16mm)',
      category: 'STEEL',
      quantity: 2.4,
      unit: 'MT',
      condition: 'EXCELLENT_SITE_STAGED',
      originalPurchasePrice: 58500,
      askingPricePerUnit: 51000,
      totalValuation: 122400,
      marketRetailPrice: 58500,
      discountPercentage: 13,
      targetSupplierId: 'user-supplier-1',
      targetSupplierName: 'Lakshmi Building Supplies (Kolkata Hub)',
      siteClearanceDeadline: 'Within 3 Days',
      materialImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
      notes: 'Full factory straight lengths from tower podium casting. Stored in covered bay.',
      dateCreated: 'Yesterday at 04:30 PM',
      status: 'COUNTER_PROPOSED_BY_SUPPLIER',
      counterPricePerUnit: 49500,
      counterSupplierId: 'user-supplier-1',
      counterSupplierName: 'Lakshmi Building Supplies',
      counterNotes: 'We can dispatch our 10-ton flatbed today at 3:30 PM for reverse haul with immediate bank transfer.',
      paymentSettlementStatus: 'PENDING',
    },
    {
      id: 'surplus-3',
      builderId: 'user-contractor-3',
      builderName: 'Sree Venkateshwara Infra Group',
      builderCompany: 'Venkateshwara Civil Projects',
      builderPhone: '+91 98451 99201',
      siteLocation: 'Kona Expressway Logistics Complex, Howrah',
      materialId: 'mat-4',
      materialName: 'Kajaria Vitrified Floor Tiles (2x2 ft)',
      category: 'TILES',
      quantity: 420,
      unit: 'sq.ft',
      condition: 'UNOPENED_FACTORY_SEALED',
      originalPurchasePrice: 62,
      askingPricePerUnit: 48,
      totalValuation: 20160,
      marketRetailPrice: 62,
      discountPercentage: 23,
      targetSupplierId: 'user-supplier-1',
      targetSupplierName: 'Lakshmi Building Supplies',
      siteClearanceDeadline: 'Immediate',
      materialImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
      notes: '35 unopened sealed boxes (Ivory Glossy). Complete batch lot.',
      dateCreated: '2 days ago',
      status: 'DEAL_ACCEPTED',
      pickupScheduledDate: 'Tomorrow at 10:30 AM (Reverse Logistics Van)',
      paymentSettlementStatus: 'ESCROW_HELD',
    },
  ],
  addBuilderSurplusSellOffer: (offer) =>
    set((state) => {
      const discount = Math.round(
        ((offer.marketRetailPrice - offer.askingPricePerUnit) / offer.marketRetailPrice) * 100
      );
      const totalVal = Math.round(offer.quantity * offer.askingPricePerUnit);
      const newOffer: BuilderSurplusSellOffer = {
        ...offer,
        id: `surplus-${Date.now()}`,
        discountPercentage: Math.max(0, discount),
        totalValuation: totalVal,
        dateCreated: 'Just now',
        status: 'OPEN_TO_SUPPLIERS',
        paymentSettlementStatus: 'PENDING',
      };
      return {
        builderSurplusSellOffers: [newOffer, ...state.builderSurplusSellOffers],
      };
    }),
  supplierCounterSurplusOffer: (offerId, counterPricePerUnit, supplierId, supplierName, notes) =>
    set((state) => ({
      builderSurplusSellOffers: state.builderSurplusSellOffers.map((o) =>
        o.id === offerId
          ? {
              ...o,
              status: 'COUNTER_PROPOSED_BY_SUPPLIER',
              counterPricePerUnit,
              counterSupplierId: supplierId,
              counterSupplierName: supplierName,
              counterNotes: notes,
            }
          : o
      ),
    })),
  supplierAcceptSurplusOffer: (offerId, supplierId, supplierName, pickupDate) =>
    set((state) => ({
      builderSurplusSellOffers: state.builderSurplusSellOffers.map((o) =>
        o.id === offerId
          ? {
              ...o,
              status: 'DEAL_ACCEPTED',
              counterSupplierId: supplierId,
              counterSupplierName: supplierName,
              pickupScheduledDate: pickupDate || 'Scheduled within 24 Hours',
              paymentSettlementStatus: 'ESCROW_HELD',
            }
          : o
      ),
    })),
  builderAcceptSupplierCounter: (offerId) =>
    set((state) => ({
      builderSurplusSellOffers: state.builderSurplusSellOffers.map((o) => {
        if (o.id !== offerId) return o;
        const newPrice = o.counterPricePerUnit || o.askingPricePerUnit;
        return {
          ...o,
          askingPricePerUnit: newPrice,
          totalValuation: Math.round(o.quantity * newPrice),
          status: 'DEAL_ACCEPTED',
          pickupScheduledDate: 'Dispatched for Pickup within 24 Hours',
          paymentSettlementStatus: 'ESCROW_HELD',
        };
      }),
    })),
  builderDeclineSupplierOffer: (offerId) =>
    set((state) => ({
      builderSurplusSellOffers: state.builderSurplusSellOffers.map((o) =>
        o.id === offerId ? { ...o, status: 'DECLINED' } : o
      ),
    })),
  supplierDispatchPickup: (offerId) =>
    set((state) => ({
      builderSurplusSellOffers: state.builderSurplusSellOffers.map((o) =>
        o.id === offerId ? { ...o, status: 'PICKUP_DISPATCHED' } : o
      ),
    })),
  completeSurplusBuyback: (offerId) =>
    set((state) => ({
      builderSurplusSellOffers: state.builderSurplusSellOffers.map((o) =>
        o.id === offerId
          ? {
              ...o,
              status: 'COMPLETED',
              paymentSettlementStatus: 'PAID_TO_BUILDER',
            }
          : o
      ),
    })),

  // Supplier Material Showcase & Live Rate Card
  supplierShowcaseMaterials: [
    {
      id: 'showcase-1',
      name: 'UltraTech PPC Super Cement (50kg)',
      brand: 'UltraTech Cement',
      category: 'Cement',
      unit: 'bag',
      baseRate: 380,
      marketMrp: 410,
      stockCount: 2800,
      stockStatus: 'HIGH',
      hubLocation: 'Dankuni Central Staging Yard & Hooghly Belt',
      deliveryTime: '< 3.5 hrs Express Dispatch',
      specifications: 'IS 1489 (Part 1) Fly Ash Based PPC, 53 Grade equivalent 28-day strength, tamper-proof laminated packaging.',
      tier1MinQty: 100,
      tier1Rate: 368,
      tier2MinQty: 500,
      tier2Rate: 358,
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
      isPublished: true,
    },
    {
      id: 'showcase-2',
      name: 'Tata Tiscon 550D TMT Rebar (12mm)',
      brand: 'Tata Tiscon',
      category: 'Steel & TMT',
      unit: 'kg',
      baseRate: 65,
      marketMrp: 72,
      stockCount: 45,
      stockStatus: 'HIGH',
      hubLocation: 'Kona Expressway Staging Yard, Howrah',
      deliveryTime: '< 4 hrs Heavy Fleet',
      specifications: 'Fe-550D High Ductility, GreenPro Certified, Superior Earthquake Resistance, Mill Test Certificate stamped.',
      tier1MinQty: 500,
      tier1Rate: 63,
      tier2MinQty: 2500,
      tier2Rate: 61,
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
      isPublished: true,
    },
    {
      id: 'showcase-3',
      name: 'JSW NeoSteel 550D TMT Rebar (16mm)',
      brand: 'JSW Steel',
      category: 'Steel & TMT',
      unit: 'kg',
      baseRate: 63,
      marketMrp: 70,
      stockCount: 30,
      stockStatus: 'HIGH',
      hubLocation: 'Dankuni Central Depot, Hooghly',
      deliveryTime: '< 4 hrs Heavy Trailer',
      specifications: 'Primary steel billet rolled, 100% pure Fe-550D, high bond strength ribs, zero re-rolled scrap.',
      tier1MinQty: 500,
      tier1Rate: 61,
      tier2MinQty: 2000,
      tier2Rate: 59.5,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
      isPublished: true,
    },
    {
      id: 'showcase-4',
      name: 'Standard Red Clay Kiln Bricks (Class-I)',
      brand: 'Bengal Kilns Guild',
      category: 'Bricks & Blocks',
      unit: 'piece',
      baseRate: 9.5,
      marketMrp: 11.0,
      stockCount: 85000,
      stockStatus: 'HIGH',
      hubLocation: 'Howrah Staging Bay & Uluberia',
      deliveryTime: '< 5 hrs Tipper Dispatch',
      specifications: 'Wire-cut sharp edges, ringing metallic sound, water absorption < 15%, crushing strength > 10.5 N/mm².',
      tier1MinQty: 3000,
      tier1Rate: 9.0,
      tier2MinQty: 10000,
      tier2Rate: 8.6,
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
      isPublished: true,
    },
    {
      id: 'showcase-5',
      name: 'Manufactured M-Sand (Zone II, Triple Washed)',
      brand: 'Hooghly Riverfront Hub',
      category: 'Sand & M-Sand',
      unit: 'ton',
      baseRate: 1450,
      marketMrp: 1650,
      stockCount: 240,
      stockStatus: 'HIGH',
      hubLocation: 'Howrah Riverfront Terminal & Kona Corridor',
      deliveryTime: '< 4.5 hrs Tipper Truck',
      specifications: 'IS 383 (Zone II) compliant, triple-washed cubical particle shape, silt content < 2%, zero organic impurities.',
      tier1MinQty: 10,
      tier1Rate: 1400,
      tier2MinQty: 30,
      tier2Rate: 1350,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
      isPublished: true,
    },
    {
      id: 'showcase-6',
      name: '20mm Blue Metal Coarse Aggregate',
      brand: 'Bengal Quarry Group',
      category: 'Aggregates',
      unit: 'ton',
      baseRate: 1100,
      marketMrp: 1250,
      stockCount: 180,
      stockStatus: 'HIGH',
      hubLocation: 'Dankuni Staging Terminal',
      deliveryTime: '< 4 hrs Tipper Dispatch',
      specifications: 'Hard granite stone chips, impact value < 18%, flakiness index < 15%, washed dust-free for RCC slabs.',
      tier1MinQty: 10,
      tier1Rate: 1060,
      tier2MinQty: 30,
      tier2Rate: 1020,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
      isPublished: true,
    },
    {
      id: 'showcase-7',
      name: 'Aerocon AAC Lightweight Blocks (600x200x150mm)',
      brand: 'Aerocon Blocks',
      category: 'Bricks & Blocks',
      unit: 'piece',
      baseRate: 68,
      marketMrp: 78,
      stockCount: 4200,
      stockStatus: 'STABLE',
      hubLocation: 'Rajarhat Expressway Depot, North 24 Parganas',
      deliveryTime: '< 4.5 hrs Truck Dispatch',
      specifications: 'Autoclaved Aerated Concrete, thermal conductivity 0.16 W/m-K, 4-hour fire rating, precision dimension finish.',
      tier1MinQty: 500,
      tier1Rate: 65,
      tier2MinQty: 1500,
      tier2Rate: 62.5,
      image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80',
      isPublished: true,
    },
    {
      id: 'showcase-8',
      name: 'Kajaria Vitrified Floor Tiles (2x2 ft, Ivory Gloss)',
      brand: 'Kajaria Ceramics',
      category: 'Tiles & Flooring',
      unit: 'sq.ft',
      baseRate: 55,
      marketMrp: 68,
      stockCount: 3500,
      stockStatus: 'STABLE',
      hubLocation: 'Salt Lake Sector V Central Depot',
      deliveryTime: '< 3.5 hrs Express Van',
      specifications: 'Double charged vitrified tiles, nano polish stain resistance, water absorption < 0.05%, breakage-free strapped boxes.',
      tier1MinQty: 500,
      tier1Rate: 52,
      tier2MinQty: 2000,
      tier2Rate: 48.5,
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
      isPublished: true,
    },
    {
      id: 'showcase-9',
      name: 'Asian Paints Apex Weatherproof Emulsion (20L)',
      brand: 'Asian Paints',
      category: 'Paints & Finishes',
      unit: 'bucket',
      baseRate: 4200,
      marketMrp: 4850,
      stockCount: 65,
      stockStatus: 'STABLE',
      hubLocation: 'Kolkata Central Depot, Dankuni',
      deliveryTime: '< 3 hrs Express Delivery',
      specifications: 'Silicon modified exterior emulsion, anti-algal protection, 5-year performance warranty, factory sealed batch.',
      tier1MinQty: 5,
      tier1Rate: 4050,
      tier2MinQty: 15,
      tier2Rate: 3900,
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
      isPublished: true,
    },
  ],
  updateSupplierMaterialRate: (materialId, newRate, volumeTiers) =>
    set((state) => ({
      supplierShowcaseMaterials: state.supplierShowcaseMaterials.map((m) =>
        m.id === materialId
          ? {
              ...m,
              baseRate: newRate,
              tier1Rate: volumeTiers?.tier1Rate ?? m.tier1Rate,
              tier1MinQty: volumeTiers?.tier1MinQty ?? m.tier1MinQty,
              tier2Rate: volumeTiers?.tier2Rate ?? m.tier2Rate,
              tier2MinQty: volumeTiers?.tier2MinQty ?? m.tier2MinQty,
            }
          : m
      ),
    })),
  updateSupplierMaterialStock: (materialId, stockCount, stockStatus) =>
    set((state) => ({
      supplierShowcaseMaterials: state.supplierShowcaseMaterials.map((m) =>
        m.id === materialId ? { ...m, stockCount, stockStatus } : m
      ),
    })),
  addSupplierShowcaseMaterial: (material) =>
    set((state) => ({
      supplierShowcaseMaterials: [
        {
          ...material,
          id: `showcase-${Date.now()}`,
          isPublished: true,
        },
        ...state.supplierShowcaseMaterials,
      ],
    })),
  toggleSupplierMaterialVisibility: (materialId) =>
    set((state) => ({
      supplierShowcaseMaterials: state.supplierShowcaseMaterials.map((m) =>
        m.id === materialId ? { ...m, isPublished: !m.isPublished } : m
      ),
    })),
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  // Onboarding & Theme
  hasSeenOnboarding: false,
  setHasSeenOnboarding: (hasSeenOnboarding) => set({ hasSeenOnboarding }),
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));
