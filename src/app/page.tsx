'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore, UserRole, MaterialNegotiationInquiry, LabourBookingOffer, SiteStockItem, BuilderPublicProfile, CustomerLabourSquadProfile } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Rating } from '@/components/ui/Rating';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatINR } from '@/lib/utils';
import { triggerConfetti } from '@/lib/confetti';
import {
  Building2,
  Users,
  Store,
  Truck,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  Calendar,
  MessageSquare,
  Check,
  Calculator,
  ChevronDown,
  ChevronUp,
  Handshake,
  TrendingDown,
  TrendingUp,
  Lock,
  Key,
  Zap,
  Bot,
  MapPin,
  Clock,
  PhoneCall,
  Flame,
  ShoppingCart,
  Send,
  UserCheck,
  RefreshCw,
  XCircle,
  Briefcase,
  Sliders,
  DollarSign,
  Package,
  ShieldAlert,
  Boxes,
} from 'lucide-react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import kn from '@/locales/kn.json';

export default function LandingPage() {
  const {
    language,
    user,
    setUser,
    activeRole,
    setActiveRole,
    materialNegotiationInquiries,
    supplierUpdateNegotiationPrice,
    builderAcceptNegotiatedPrice,
    builderDeclineNegotiation,
    siteMaterialsStock,
    logSiteMaterialConsumption,
    labourBookingOffers,
    respondToLabourOffer,
    addLabourBookingOffer,
    customerLabourSquads,
    builderPublicProfiles,
    supplierRankingProfiles,
    builderRankingProfiles,
    customerConsultationInquiries,
    addCustomerConsultationInquiry,
    contractorCustomRates,
    cart,
    addToCart,
    setCartDrawerOpen,
    addToast,
  } = useAppStore();

  const router = useRouter();

  // If user is not authenticated, start the app from the login page
  useEffect(() => {
    if (!user) {
      router.replace('/auth/login');
    }
  }, [user, router]);

  const dictionaries = { en, hi, kn };
  const t = dictionaries[language];

  // Customer Filter State: All vs Builders vs Labour
  const [customerFilter, setCustomerFilter] = useState<'ALL' | 'BUILDERS' | 'LABOUR'>('ALL');

  if (!user) {
    return null;
  }

  // Customer Labour Squad Booking Modal State
  const [selectedLabourSquadForBook, setSelectedLabourSquadForBook] = useState<CustomerLabourSquadProfile | null>(null);
  const [custLabourAreaInput, setCustLabourAreaInput] = useState('1200');
  const [custLabourStartDate, setCustLabourStartDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [custLabourDurationDays, setCustLabourDurationDays] = useState('5');
  const [custLabourShiftTiming, setCustLabourShiftTiming] = useState('08:30 AM - 05:30 PM (Day Shift)');
  const [custLabourLocation, setCustLabourLocation] = useState('Action Area II, New Town, Kolkata');
  const [custLabourPhone, setCustLabourPhone] = useState('9830144912');
  const [custLabourNotes, setCustLabourNotes] = useState('Concealed wiring & electrical installation for 3BHK flat.');

  // Supplier Negotiation Modal State
  const [activeSupplierInquiry, setActiveSupplierInquiry] = useState<MaterialNegotiationInquiry | null>(null);
  const [supplierPriceInput, setSupplierPriceInput] = useState('');
  const [supplierNoteInput, setSupplierNoteInput] = useState('');

  // Labour Wage Counter-Offer Modal State
  const [activeLabourOffer, setActiveLabourOffer] = useState<LabourBookingOffer | null>(null);
  const [labourCounterWageInput, setLabourCounterWageInput] = useState('');
  const [labourCounterNoteInput, setLabourCounterNoteInput] = useState('');

  // Customer Consultation Request Modal State
  const [selectedBuilderForConsult, setSelectedBuilderForConsult] = useState<BuilderPublicProfile | null>(null);
  const [consultName, setConsultName] = useState('');
  const [consultPhone, setConsultPhone] = useState('');
  const [consultLocation, setConsultLocation] = useState('New Town, Kolkata');
  const [consultScope, setConsultScope] = useState('New Residential Villa Construction');

  // Builder Site Stock Consumption Modal
  const [activeStockItemToLog, setActiveStockItemToLog] = useState<SiteStockItem | null>(null);
  const [consumeAmount, setConsumeAmount] = useState('25');

  // ROI Cost Savings Calculator State
  const [monthlySpend, setMonthlySpend] = useState(600000); // 6 Lakh INR default
  const estimatedSavings = Math.round(monthlySpend * 0.14);
  const extraWorkerTakehome = Math.round(monthlySpend * 0.22);

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Persona Quick Switch Profiles
  const personaCards = [
    {
      role: 'CONTRACTOR' as UserRole,
      title: 'Contractor / Builder',
      subtitle: 'Joyjit Constructions (New Town)',
      desc: 'Negotiate supplier bulk deals, monitor site stock depletion & hire skilled workers.',
      icon: Building2,
      accent: 'from-orange-500 to-amber-600',
      badgeColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
      activeBorder: 'border-brand-orange ring-2 ring-brand-orange/30',
      userSetup: {
        id: 'user-contractor-1',
        name: 'Joyjit Debnath',
        company: 'Joyjit Constructions',
        mobile: '9876543210',
        role: 'CONTRACTOR' as UserRole,
        maskedGovtId: 'XXXX XXXX 4912',
        isVerified: true,
        status: 'APPROVED' as const,
        city: 'Kolkata (New Town & Salt Lake)',
        rating: 4.95,
      },
    },
    {
      role: 'SUPPLIER' as UserRole,
      title: 'Material Supplier',
      subtitle: 'Lakshmi Building Supplies (Dankuni Hub)',
      desc: 'See builders who want material from you, negotiate prices & lock custom builder rates.',
      icon: Store,
      accent: 'from-purple-500 to-indigo-600',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      activeBorder: 'border-purple-500 ring-2 ring-purple-500/30',
      userSetup: {
        id: 'user-supplier-1',
        name: 'Lakshmi Building Supplies',
        company: 'Dankuni Central Yard',
        mobile: '9876543212',
        role: 'SUPPLIER' as UserRole,
        maskedGovtId: 'XXXXX 1234 P',
        isVerified: true,
        status: 'APPROVED' as const,
        city: 'Dankuni & Hooghly, West Bengal',
        rating: 4.9,
      },
    },
    {
      role: 'LABORER' as UserRole,
      title: 'Labour / Specialized Worker',
      subtitle: 'Subhas Sardar (Master Electrician • ₹18/sq.ft)',
      desc: 'Incoming work bookings window as per sq.ft area, shift timings, rate per sq.ft negotiation & company call confirmation.',
      icon: Users,
      accent: 'from-emerald-500 to-teal-600',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/30',
      userSetup: {
        id: 'user-laborer-1',
        name: 'Subhas Sardar',
        trade: 'Master Electrician & Wiring',
        mobile: '9876543211',
        role: 'LABORER' as UserRole,
        maskedGovtId: 'XXXX XXXX 8831',
        isVerified: true,
        status: 'APPROVED' as const,
        city: 'Howrah & Kolkata, West Bengal',
        rating: 4.88,
        ratePerSqFt: 18,
      },
    },
    {
      role: 'CUSTOMER' as UserRole,
      title: 'Homeowner / Customer',
      subtitle: 'Anirban Mukherjee (Property Owner)',
      desc: 'Browse verified West Bengal builders, reputation, past completed areas. Zero pricing shown.',
      icon: ShieldCheck,
      accent: 'from-blue-500 to-cyan-600',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/30',
      userSetup: {
        id: 'user-customer-1',
        name: 'Anirban Mukherjee',
        mobile: '9876543215',
        role: 'CUSTOMER' as UserRole,
        maskedGovtId: 'XXXX XXXX 5521',
        isVerified: true,
        status: 'APPROVED' as const,
        city: 'Salt Lake Sector V, Kolkata',
        rating: 5.0,
      },
    },
    {
      role: 'ADMIN' as UserRole,
      title: 'BuildNexus Admin',
      subtitle: 'Platform Super Admin & Audits',
      desc: 'Central control: Deal escrow verifications, Net Zero permits, Dankuni yard logistics & dispute settlement.',
      icon: ShieldAlert,
      accent: 'from-rose-500 to-red-700',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/30',
      userSetup: {
        id: 'user-admin-1',
        name: 'BuildNexus Staff Admin',
        company: 'BuildNexus Central Operations',
        mobile: '9876543214',
        role: 'ADMIN' as UserRole,
        maskedGovtId: 'XXXX XXXX 0001',
        isVerified: true,
        status: 'APPROVED' as const,
        city: 'Kolkata Central HQ, West Bengal',
        rating: 5.0,
      },
    },
  ];

  const handleSelectPersona = (p: typeof personaCards[0]) => {
    setActiveRole(p.role);
    setUser(p.userSetup as any);
    addToast({
      title: `Switched to ${p.title} Interface`,
      message: `Now viewing the custom interface for ${p.subtitle}.`,
      type: 'info',
    });
  };

  // Supplier submits price change for builder
  const handleSupplierSubmitNegotiation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSupplierInquiry) return;
    const price = parseFloat(supplierPriceInput);
    if (isNaN(price) || price <= 0) {
      addToast({ title: 'Invalid Price', message: 'Please enter a valid rate', type: 'error' });
      return;
    }
    supplierUpdateNegotiationPrice(activeSupplierInquiry.id, price, supplierNoteInput);
    triggerConfetti();
    addToast({
      title: 'Price Negotiated & Locked for Builder!',
      message: `Updated rate to ${formatINR(price)}/${activeSupplierInquiry.unit} for ${activeSupplierInquiry.builderName}. This changed value will be shown to the builder!`,
      type: 'success',
    });
    setActiveSupplierInquiry(null);
  };

  // Labour counter rate per sq.ft submission
  const handleLabourSubmitCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLabourOffer) return;
    const ratePerSqFt = parseFloat(labourCounterWageInput);
    if (isNaN(ratePerSqFt) || ratePerSqFt <= 0) {
      addToast({ title: 'Invalid Rate', message: 'Enter a valid rate per sq.ft amount', type: 'error' });
      return;
    }
    respondToLabourOffer(activeLabourOffer.id, 'COUNTERED', ratePerSqFt, labourCounterNoteInput);
    triggerConfetti();
    const totalEst = Math.round(ratePerSqFt * activeLabourOffer.workAreaSqFt);
    addToast({
      title: 'Counter Rate per Sq.Ft Dispatched',
      message: `Proposed ₹${ratePerSqFt}/sq.ft (Est. Total: ${formatINR(totalEst)} for ${activeLabourOffer.workAreaSqFt} sq.ft) to ${activeLabourOffer.contractorName}. Company verification call remains scheduled.`,
      type: 'success',
    });
    setActiveLabourOffer(null);
  };

  // Customer consultation submission
  const handleCustomerSubmitConsult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBuilderForConsult) return;
    addCustomerConsultationInquiry({
      builderId: selectedBuilderForConsult.id,
      customerName: consultName || user?.name || 'Anirban Mukherjee',
      customerPhone: consultPhone || '9830144912',
      projectLocation: consultLocation || 'New Town, Kolkata',
      projectDescription: consultScope,
      scope: consultScope,
    });
    triggerConfetti();
    addToast({
      title: 'Consultation Request Sent!',
      message: `Your inquiry has been routed to ${selectedBuilderForConsult.name}. They will contact you shortly for site visit. Zero pricing revealed.`,
      type: 'success',
    });
    setSelectedBuilderForConsult(null);
  };

  // Customer labour booking submission (as per sq.ft)
  const handleCustomerSubmitLabourBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLabourSquadForBook) return;

    const area = parseFloat(custLabourAreaInput);
    if (isNaN(area) || area <= 0) {
      addToast({ title: 'Invalid Area', message: 'Please enter a valid work area in sq.ft', type: 'error' });
      return;
    }

    const duration = parseInt(custLabourDurationDays, 10) || 4;
    const totalPayout = Math.round(area * selectedLabourSquadForBook.ratePerSqFt);

    addLabourBookingOffer({
      contractorName: `${user?.name || 'Anirban Mukherjee'} (Homeowner)`,
      contractorRating: 5.0,
      contractorMobileMasked: custLabourPhone ? custLabourPhone.slice(0, 5) + 'XXXX' + custLabourPhone.slice(-1) : '98301XXXX2',
      siteLocation: custLabourLocation,
      tradeRequired: selectedLabourSquadForBook.tradeTitle,
      startDate: custLabourStartDate,
      endDate: new Date(new Date(custLabourStartDate).getTime() + duration * 86400000).toISOString().split('T')[0],
      durationDays: duration,
      shiftTiming: custLabourShiftTiming,
      workAreaSqFt: area,
      ratePerSqFt: selectedLabourSquadForBook.ratePerSqFt,
      totalWage: totalPayout,
    });

    triggerConfetti();
    addToast({
      title: 'Labour Squad Booking Dispatched!',
      message: `Booked ${selectedLabourSquadForBook.name} for ${area.toLocaleString()} sq.ft at ₹${selectedLabourSquadForBook.ratePerSqFt}/sq.ft (Total: ${formatINR(totalPayout)}). BuildNexus verification call scheduled.`,
      type: 'success',
    });
    setSelectedLabourSquadForBook(null);
  };

  // Builder site stock consumption submit
  const handleConsumeStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStockItemToLog) return;
    const val = parseFloat(consumeAmount);
    if (isNaN(val) || val <= 0) return;
    logSiteMaterialConsumption(activeStockItemToLog.id, val);
    addToast({
      title: 'Site Stock Consumption Updated',
      message: `Logged ${val} ${activeStockItemToLog.unit} of ${activeStockItemToLog.name} consumed on site.`,
      type: 'success',
    });
    setActiveStockItemToLog(null);
  };

  const marketTickers = [
    { name: 'TMT Steel Fe-550D', rate: '₹58,500/MT', change: '-2.7%', trend: 'DOWN', note: 'AI: Wait to buy' },
    { name: 'UltraTech PPC Cement', rate: '₹380/bag', change: '+3.4%', trend: 'UP', note: 'AI: Strong buy' },
    { name: 'M-Sand (Washed)', rate: '₹1,450/Ton', change: '0.0%', trend: 'STABLE', note: 'AI: Accumulate' },
    { name: 'Red Kiln Bricks (WB)', rate: '₹9.50/pc', change: '-1.1%', trend: 'DOWN', note: 'AI: Dankuni Stock Steady' },
  ];

  const brandLogos = [
    { name: 'UltraTech Cement', tag: 'Dankuni Depot' },
    { name: 'JSW Neosteel', tag: 'Fe-550D TMT' },
    { name: 'Tata Tiscon', tag: 'Super Ductile' },
    { name: 'ACC Super Gold', tag: 'Concrete Grade' },
    { name: 'Asian Paints', tag: 'Apex Exterior' },
    { name: 'Kajaria Ceramics', tag: 'Vitrified Tiles' },
  ];

  const faqs = [
    {
      q: 'How does two-way price negotiation work between suppliers and builders?',
      a: 'When a supplier negotiates a price, the updated rate is locked specifically for that builder. On the builder login, the changed price is immediately displayed with total project savings and can be accepted directly into the cart with live recalculation.',
    },
    {
      q: 'How does site material stock depletion tracking work for contractors?',
      a: 'The contractor dashboard monitors live on-site inventory, daily burn rates, and computes exactly how many days remain before stock runs out, preventing sudden construction stoppages.',
    },
    {
      q: 'How does BuildNexus handle labour booking and wage negotiation?',
      a: 'Specialized workers (electricians, masons, bar benders) receive dated job booking windows with daily wages and shift timings. Workers can accept, deny, or propose a counter wage. Upon acceptance, the BuildNexus company team places a confirmation phone call to verify shift dates and site safety.',
    },
    {
      q: 'Why are prices hidden when customers view contractors?',
      a: 'Civil architecture and construction vary by custom structural design and site blueprints. Customer view showcases contractor reputation, verified completed square footage, and West Bengal areas worked without disclosing bulk wholesale prices.',
    },
  ];

  return (
    <div className="space-y-12 py-4">
      {/* 1. REAL-TIME WEST BENGAL COMMODITY TICKER BAR */}
      <div className="backdrop-blur-xl bg-slate-900/90 text-white rounded-2xl p-3 border border-slate-800 shadow-lg flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 shrink-0 px-2 border-r border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">
            West Bengal ConTech Ticker
          </span>
        </div>
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar text-xs">
          {marketTickers.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0">
              <span className="font-semibold text-slate-300">{item.name}:</span>
              <span className="font-extrabold text-white">{item.rate}</span>
              <span
                className={`text-[11px] font-black flex items-center gap-0.5 ${
                  item.trend === 'DOWN' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {item.trend === 'DOWN' ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {item.change}
              </span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 border border-slate-700 font-medium">
                {item.note}
              </span>
            </div>
          ))}
        </div>
        <Link
          href="/ai?tab=forecast"
          className="shrink-0 text-xs text-brand-orange font-bold hover:underline flex items-center gap-1"
        >
          AI Price Forecast <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* =========================================================================
          2. DEDICATED ROLE DASHBOARDS (CONTRACTOR / SUPPLIER / LABOUR / HOMEOWNER / ADMIN)
      ========================================================================= */}

      {/* -------------------------------------------------------------------------
          PERSONA A: CONTRACTOR / BUILDER COMMAND CENTER
      ------------------------------------------------------------------------- */}
      {activeRole === 'CONTRACTOR' && (
        <section className="space-y-8 animate-fadeIn">
          {/* Builder Modern Executive Command Deck */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            {/* Top Identity & Badges Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500/10 text-brand-orange border border-orange-500/20 inline-flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> Contractor Hub
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> WB PWD Licensed Class-A
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Builder Command Center: <span className="text-brand-orange">{user?.company || 'Joyjit Constructions'}</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
                  Active Sites: <strong className="text-slate-800 dark:text-slate-200">New Town Action Area II</strong>, <strong className="text-slate-800 dark:text-slate-200">Salt Lake Sector V</strong> &amp; <strong className="text-slate-800 dark:text-slate-200">Rajarhat Villa Enclave</strong>. Manage procurement, accept negotiated supplier rates, track site material stock horizons, and hire verified trade squads.
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2.5 text-emerald-800 dark:text-emerald-200 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Account Standing</p>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-300">Verified &amp; Escrow Protected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <Link href="/marketplace" className="group p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex flex-col justify-between space-y-2">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black">Buy Materials</p>
                  <p className="text-[10px] text-orange-100">Live Supplier Catalog</p>
                </div>
              </Link>

              <Link href="/sell" className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-amber-500/60 hover:shadow-md hover:scale-[1.02] transition-all flex flex-col justify-between space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">Sell Extra Materials</p>
                  <p className="text-[10px] text-slate-500">Supplier Buyback Desk</p>
                </div>
              </Link>

              <Link href="/stock" className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-orange-500/60 hover:shadow-md hover:scale-[1.02] transition-all flex flex-col justify-between space-y-2">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-brand-orange flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">Stock Monitor</p>
                  <p className="text-[10px] text-slate-500">Site Burn Horizons</p>
                </div>
              </Link>

              <Link href="/labour" className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-500/60 hover:shadow-md hover:scale-[1.02] transition-all flex flex-col justify-between space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">Hire Labour</p>
                  <p className="text-[10px] text-slate-500">Per Sq.Ft Trade Squads</p>
                </div>
              </Link>

              <Link href="/delivery" className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-cyan-500/60 hover:shadow-md hover:scale-[1.02] transition-all flex flex-col justify-between space-y-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">Fleet Telematics</p>
                  <p className="text-[10px] text-slate-500">Dankuni Staging &amp; OTP</p>
                </div>
              </Link>
            </div>
          </div>

          {/* BUILDER SECTION 1: SUPPLIER NEGOTIATIONS & CHANGED RATES DESK ("VICE VERSA") */}
          <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Handshake className="w-5 h-5 text-brand-orange" />
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Supplier Negotiations &amp; Changed Price Desk (Vice Versa View)
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  When suppliers negotiate and change values for your orders, the new price is reflected below. Accept directly into your cart to trigger dynamic recalculation and instant savings.
                </p>
              </div>

              <Badge variant="orange" className="shrink-0">
                {materialNegotiationInquiries.length} Active Deals
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {materialNegotiationInquiries.map((inq) => {
                const isChangedBySupplier = inq.status === 'PRICE_CHANGED_BY_SUPPLIER';
                const isAgreed = inq.status === 'AGREED_AND_LOCKED';
                const activePrice = inq.supplierChangedPrice || inq.standardPrice;
                const savingsPerUnit = inq.standardPrice - activePrice;
                const totalSavings = Math.round(savingsPerUnit * inq.quantityRequested);

                return (
                  <Card
                    key={inq.id}
                    className={`relative overflow-hidden backdrop-blur-md transition-all border ${
                      isChangedBySupplier
                        ? 'border-brand-orange bg-orange-50/30 dark:bg-orange-950/20 shadow-lg'
                        : isAgreed
                        ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="p-5 space-y-4">
                      {/* Top Supplier & Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Supplier Depot
                          </span>
                          <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                            {inq.supplierName}
                          </h4>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-brand-orange" /> {inq.builderSite}
                          </p>
                        </div>

                        <Badge
                          variant={isChangedBySupplier ? 'orange' : isAgreed ? 'verified' : 'default'}
                          size="sm"
                          className="shrink-0"
                        >
                          {isChangedBySupplier
                            ? '⚡ Price Changed by Supplier'
                            : isAgreed
                            ? '✓ Locked in Cart'
                            : inq.status}
                        </Badge>
                      </div>

                      {/* Material Details */}
                      <div className="flex items-center gap-3 p-3 bg-white/70 dark:bg-slate-800/70 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                        <img
                          src={inq.materialImage}
                          alt={inq.materialName}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {inq.materialName}
                          </h5>
                          <p className="text-[11px] text-slate-500">
                            Requested: <strong>{inq.quantityRequested.toLocaleString()} {inq.unit}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Pricing Comparison & Strike-through */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl space-y-2 border border-slate-200/40 dark:border-slate-700/40">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Catalog Standard Price:</span>
                          <span className="line-through text-slate-400 font-semibold">
                            {formatINR(inq.standardPrice)} / {inq.unit}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-700 dark:text-slate-300 font-bold">
                            Supplier's Changed Rate:
                          </span>
                          <span className="text-sm font-black text-brand-orange">
                            {formatINR(activePrice)} / {inq.unit}
                          </span>
                        </div>

                        {totalSavings > 0 && (
                          <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                            <span className="flex items-center gap-1">
                              <TrendingDown className="w-3.5 h-3.5" /> Total Cart Savings:
                            </span>
                            <span>Save {formatINR(totalSavings)}</span>
                          </div>
                        )}
                      </div>

                      {/* Supplier Note */}
                      {inq.supplierNote && (
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-blue-50/70 dark:bg-blue-950/30 p-2.5 rounded-xl border border-blue-200/50 dark:border-blue-900/50">
                          <strong>Supplier Note:</strong> "{inq.supplierNote}"
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="pt-2 flex flex-col gap-2">
                        {isChangedBySupplier && (
                          <Button
                            size="sm"
                            variant="primary"
                            className="w-full text-xs"
                            onClick={() => {
                              builderAcceptNegotiatedPrice(inq.id);
                              triggerConfetti();
                              addToast({
                                title: 'Negotiated Price Accepted & Cart Updated!',
                                message: `Locked ${formatINR(activePrice)}/${inq.unit} into your cart. Total calculation updated with ${formatINR(totalSavings)} in savings!`,
                                type: 'success',
                              });
                            }}
                          >
                            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> Accept Changed Value &amp; Add to Cart
                          </Button>
                        )}

                        {isAgreed && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-xs text-emerald-600 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50"
                            onClick={() => setCartDrawerOpen(true)}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> View in Cart ({formatINR(activePrice)} Locked)
                          </Button>
                        )}

                        <div className="flex gap-2">
                          <Link href="/chat" className="flex-1">
                            <Button size="sm" variant="ghost" className="w-full text-[11px]">
                              <MessageSquare className="w-3 h-3 mr-1" /> Discuss in Chat
                            </Button>
                          </Link>
                          {isChangedBySupplier && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-[11px] text-rose-500 hover:bg-rose-50"
                              onClick={() => {
                                builderDeclineNegotiation(inq.id);
                                addToast({ title: 'Offer Declined', message: 'Supplier has been notified.', type: 'info' });
                              }}
                            >
                              Decline
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* BUILDER SECTION: VERIFIED SUPPLIER RANKINGS (West Bengal Top Volume & Turnaround) */}
          <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-orange" />
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    West Bengal Verified Supplier Rankings (Procurement League)
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Top-rated material suppliers ranked by on-time fulfillment rate, dispatched volume, stock availability, and verified West Bengal transit staging.
                </p>
              </div>

              <Badge variant="orange" className="shrink-0">
                Top 4 Verified Hubs
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {supplierRankingProfiles.map((sup) => (
                <div
                  key={sup.id}
                  className="backdrop-blur-md bg-white/60 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-4 hover:shadow-lg hover:border-brand-orange/60 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange to-amber-500 text-white font-black flex items-center justify-center text-sm shadow-md">
                        #{sup.rank}
                      </div>
                      <Badge variant="verified" size="sm" className="text-[10px]">
                        {sup.fulfillmentRate}% On-Time
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                        {sup.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-brand-orange mt-0.5">
                        {sup.tierBadge}
                      </p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{sup.hubLocation}</span>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 text-[11px] space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Volume:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{sup.annualDispatchedVolume}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Transit Speed:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{sup.turnaroundTime}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Core Materials Supplied:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {sup.materialsSupplied.slice(0, 2).map((m, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 truncate max-w-full"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-col gap-1.5">
                    <Link href="/marketplace">
                      <Button size="sm" variant="primary" className="w-full text-xs">
                        <Store className="w-3.5 h-3.5 mr-1" /> View Catalog &amp; Deals
                      </Button>
                    </Link>
                    <Link href="/delivery">
                      <Button size="sm" variant="outline" className="w-full text-[11px]">
                        <Truck className="w-3.5 h-3.5 mr-1 text-cyan-500" /> Track Supplier Fleet
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BUILDER SECTION: INBOUND LOGISTICS & LIVE FLEET TELEMETRY */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-brand-orange animate-bounce" />
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Live Inbound Fleet Delivery &amp; Site Arrival Guard
                  </h3>
                </div>
                <p className="text-xs text-slate-300">
                  Real-time telemetry of materials arriving at your active New Town / Kolkata construction bays with OTP protection.
                </p>
              </div>

              <Link href="/delivery">
                <Button size="sm" variant="primary" className="text-xs">
                  Open Central Delivery Hub <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Route & Progress */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-white">
                      Consignment #ORD-WB-8492: 500 Bags UltraTech PPC Cement
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Carrier: <strong>Vikram Express 10-Wheeler Flatbed (WB-19-J-8412)</strong>
                    </p>
                  </div>
                  <Badge variant="orange" className="bg-orange-500/20 text-orange-400 border-orange-500/40">
                    ETA: ~16 Mins (44 km/h)
                  </Badge>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-3">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Origin: Dankuni Central Yard</span>
                    <span>Transit: Belghoria Tollway Cleared</span>
                    <span className="text-emerald-400 font-bold">Site: New Town Plot 42</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 via-orange-500 to-emerald-400 h-full w-3/4 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Delivery OTP Security Badge */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/40 flex flex-col justify-between space-y-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold">
                  <Key className="w-4 h-4" />
                  <span>Site Reception OTP Code</span>
                </div>
                <div className="text-3xl font-black text-amber-400 font-mono tracking-widest bg-slate-950 py-2 rounded-xl border border-amber-500/30">
                  4921
                </div>
                <p className="text-[10px] text-slate-400">
                  Hand over code to driver Vikramjit Roy after verifying bag physical seals.
                </p>
              </div>
            </div>
          </div>

          {/* BUILDER SECTION 2: SITE STOCK MONITOR ("HOW MUCH MATERIAL IS STOCKED BEFORE IT FINISHES FINALLY") */}
          <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Site Material Stock Depletion Horizon
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Track how much material is stocked before it finishes finally at your active West Bengal construction sites.
                </p>
              </div>

              <Link href="/stock">
                <Button size="sm" variant="outline" className="text-xs">
                  Full Inventory Manager <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {siteMaterialsStock.map((stock) => {
                const daysRemaining = stock.dailyBurnRate > 0 ? (stock.currentStock / stock.dailyBurnRate).toFixed(1) : '∞';
                const isCritical = parseFloat(daysRemaining) <= 2;
                const isWarning = parseFloat(daysRemaining) > 2 && parseFloat(daysRemaining) <= 5;
                const percentage = Math.min(100, Math.round((stock.currentStock / (stock.reorderLevel * 2)) * 100));

                return (
                  <div
                    key={stock.id}
                    className="p-5 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          {stock.siteLocation || 'New Town Smart Site #4'}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                          {stock.name}
                        </h4>
                      </div>
                      <Badge
                        variant={isCritical ? 'danger' : isWarning ? 'orange' : 'verified'}
                        size="sm"
                        className="shrink-0"
                      >
                        {isCritical ? '⚠️ Depleting Fast' : isWarning ? 'Moderate' : 'Healthy'}
                      </Badge>
                    </div>

                    {/* Stock Metrics */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="text-slate-500">Current Stock:</span>
                        <span className="font-extrabold text-base text-slate-900 dark:text-white">
                          {stock.currentStock} {stock.unit}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline text-[11px] text-slate-500">
                        <span>Daily Site Burn:</span>
                        <span>{stock.dailyBurnRate} {stock.unit}/day</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Days Until Finished Countdown */}
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                        isCritical
                          ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 text-rose-700 dark:text-rose-300 font-extrabold'
                          : isWarning
                          ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 text-amber-800 dark:text-amber-200 font-bold'
                          : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-200 font-bold'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Until Finished:
                      </span>
                      <span className="text-sm font-black">{daysRemaining} Days</span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="primary"
                        className="flex-1 text-xs"
                        onClick={() => {
                          const customRate = contractorCustomRates[stock.materialId] || stock.price;
                          addToCart({
                            materialId: stock.materialId,
                            name: stock.name,
                            price: stock.price,
                            negotiatedPrice: customRate,
                            isCustomRateForContractor: customRate < stock.price,
                            unit: stock.unit,
                            quantity: Math.round(stock.dailyBurnRate * 7),
                            supplierId: 'supplier-dankuni-1',
                            supplierName: stock.supplierName,
                            image: stock.image,
                          });
                          setCartDrawerOpen(true);
                          addToast({
                            title: 'Reorder Added to Cart',
                            message: `Added 7-day safety batch of ${stock.name} at your locked supplier rate.`,
                            type: 'success',
                          });
                        }}
                      >
                        Reorder Now
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs px-2"
                        title="Record daily site consumption"
                        onClick={() => {
                          setActiveStockItemToLog(stock);
                          setConsumeAmount(String(Math.round(stock.dailyBurnRate)));
                        }}
                      >
                        Log Use
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------
          PERSONA B: MATERIAL SUPPLIER COMMAND CENTER
      ------------------------------------------------------------------------- */}
      {activeRole === 'SUPPLIER' && (
        <section className="space-y-8 animate-fadeIn">
          {/* Supplier Modern Executive Command Deck */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            {/* Top Identity & Badges Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 inline-flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5" /> Material Supplier Hub
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-brand-orange border border-orange-500/20 inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Dankuni Central Staging Yard
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Supplier Hub: <span className="text-purple-600 dark:text-purple-400">Lakshmi Building Supplies</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
                  Serving Kolkata, Howrah, Hooghly &amp; Durgapur industrial construction corridors. Update live catalog rate decks, negotiate directly with builders, buy back excess materials, and monitor outbound dispatch convoys.
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs flex items-center gap-2.5 text-purple-900 dark:text-purple-200 font-bold">
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Depot Security</p>
                    <p className="text-xs font-bold text-purple-600 dark:text-purple-300">GST &amp; BIS Quality Certified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/marketplace" className="group p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex flex-col justify-between space-y-2">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black">My Live Rate Deck</p>
                  <p className="text-[10px] text-purple-100">Live Wholesale Slabs &amp; Pricing</p>
                </div>
              </Link>

              <Link href="/sell" className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-500/60 hover:shadow-md hover:scale-[1.02] transition-all flex flex-col justify-between space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">Builder Buyback Desk</p>
                  <p className="text-[10px] text-slate-500">Buy Surplus Concrete &amp; Rebar</p>
                </div>
              </Link>

              <Link href="/delivery" className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-cyan-500/60 hover:shadow-md hover:scale-[1.02] transition-all flex flex-col justify-between space-y-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">Transit Fleet &amp; Tolls</p>
                  <p className="text-[10px] text-slate-500">Fastag Deductions (100% Buyer Paid)</p>
                </div>
              </Link>
            </div>
          </div>

          {/* SUPPLIER SECTION: BUILDERS WHO WANT MATERIAL FROM YOU */}
          <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Builders Who Want Material from You (Live Demand &amp; Negotiation Desk)
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Contractors and builders actively requesting cement, steel, and bricks from your Dankuni Depot. Negotiate with them directly; once submitted, the changed value will be displayed on the builder's portal!
                </p>
              </div>

              <Badge variant="verified">
                {materialNegotiationInquiries.length} Active Builder Inquiries
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {materialNegotiationInquiries.map((inq) => {
                const isChanged = inq.status === 'PRICE_CHANGED_BY_SUPPLIER';
                const isLocked = inq.status === 'AGREED_AND_LOCKED';

                return (
                  <Card
                    key={inq.id}
                    className={`backdrop-blur-md border transition-all ${
                      isChanged
                        ? 'border-purple-400 bg-purple-50/30 dark:bg-purple-950/20'
                        : isLocked
                        ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="p-5 space-y-4">
                      {/* Builder Profile */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                            Builder Inquiry
                          </span>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {inq.builderName}
                          </h4>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-purple-500" /> Site: {inq.builderSite}
                          </p>
                        </div>

                        <Badge
                          variant={isChanged ? 'orange' : isLocked ? 'verified' : 'default'}
                          size="sm"
                          className="shrink-0"
                        >
                          {isChanged ? 'Price Updated' : isLocked ? 'Agreed & Locked' : 'Pending Quote'}
                        </Badge>
                      </div>

                      {/* Material Requested */}
                      <div className="flex items-center gap-3 p-3 bg-white/70 dark:bg-slate-800/70 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                        <img
                          src={inq.materialImage}
                          alt={inq.materialName}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {inq.materialName}
                          </h5>
                          <p className="text-[11px] text-slate-500">
                            Requested Volume: <strong>{inq.quantityRequested.toLocaleString()} {inq.unit}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Price Negotiations Breakdown */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl space-y-1.5 border border-slate-200/40 dark:border-slate-700/40 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Catalog Rate:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {formatINR(inq.standardPrice)} / {inq.unit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Builder's Proposed Target:</span>
                          <span className="font-bold text-amber-600 dark:text-amber-400">
                            {formatINR(inq.builderProposedPrice)} / {inq.unit}
                          </span>
                        </div>
                        {inq.supplierChangedPrice && (
                          <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                            <span className="font-bold text-purple-600 dark:text-purple-400">
                              Your Changed Price:
                            </span>
                            <span className="font-black text-slate-900 dark:text-white">
                              {formatINR(inq.supplierChangedPrice)} / {inq.unit}
                            </span>
                          </div>
                        )}
                      </div>

                      {inq.builderNote && (
                        <p className="text-[11px] text-slate-500 italic">
                          "Builder Note: {inq.builderNote}"
                        </p>
                      )}

                      {/* Interactive Negotiate Button */}
                      <div className="pt-2">
                        <Button
                          size="sm"
                          variant="primary"
                          className="w-full text-xs bg-purple-600 hover:bg-purple-700"
                          onClick={() => {
                            setActiveSupplierInquiry(inq);
                            setSupplierPriceInput(String(inq.supplierChangedPrice || inq.builderProposedPrice));
                            setSupplierNoteInput(inq.supplierNote || 'Special bulk rate confirmed with direct transit from Dankuni.');
                          }}
                        >
                          <Sliders className="w-3.5 h-3.5 mr-1.5" />
                          {isChanged ? 'Update Negotiated Rate' : 'Negotiate & Change Price for this Builder'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* SUPPLIER SECTION: VERIFIED BUILDER RANKINGS & CREDIT DESK */}
          <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    West Bengal Verified Builder Rankings (Creditworthiness &amp; Volume League)
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Leading contractors and builders in West Bengal ranked by prompt payment track record, monthly material inward volume, completed square footage, and site credit tiers.
                </p>
              </div>

              <Badge variant="verified" className="shrink-0">
                Top 4 Ranked Builders
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {builderRankingProfiles.map((bld) => (
                <div
                  key={bld.id}
                  className="backdrop-blur-md bg-white/60 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-4 hover:shadow-lg hover:border-purple-500/60 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                        #{bld.rank}
                      </div>
                      <Badge variant="verified" size="sm" className="text-[10px]">
                        {bld.promptPaymentScore}% Punctual Pay
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                        {bld.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                        {bld.companyName}
                      </p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                        {bld.creditTier}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 text-[11px] space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Monthly Inward:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{bld.monthlyInwardSpend}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Built Area:</span>
                        <span className="font-bold text-brand-orange">{bld.totalSqFtBuilt}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Active Sites:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {bld.activeSites.slice(0, 2).map((site, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 truncate max-w-full"
                          >
                            {site}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-col gap-1.5">
                    <Link href="/sell">
                      <Button size="sm" variant="primary" className="w-full text-xs bg-purple-600 hover:bg-purple-700">
                        <DollarSign className="w-3.5 h-3.5 mr-1" /> Lock Special Rate
                      </Button>
                    </Link>
                    <Link href="/delivery">
                      <Button size="sm" variant="outline" className="w-full text-[11px]">
                        <Truck className="w-3.5 h-3.5 mr-1 text-cyan-500" /> Dispatch Delivery
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUPPLIER SECTION: OUTBOUND FLEET TRANSIT & LOGISTICS */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-slate-950 via-purple-950/60 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-purple-900/60 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-purple-400 animate-bounce" />
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Outbound Dispatch Fleet &amp; Dankuni Yard Staging
                  </h3>
                </div>
                <p className="text-xs text-slate-300">
                  Track outbound vehicle consignments dispatched to builders across New Town, Salt Lake, and Howrah.
                </p>
              </div>

              <Link href="/delivery">
                <Button size="sm" variant="primary" className="text-xs bg-purple-600 hover:bg-purple-500">
                  Manage Outbound Fleet <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                <span className="text-[10px] text-purple-400 uppercase font-black">Outbound Unit #1</span>
                <h4 className="font-extrabold text-sm text-white">500 Bags UltraTech Cement</h4>
                <p className="text-slate-400">Recipient: Joyjit Constructions (New Town Site #4)</p>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-amber-400 font-bold">In-Transit (~16 Mins)</span>
                  <span className="text-slate-500">WB-19-J-8412</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                <span className="text-[10px] text-purple-400 uppercase font-black">Outbound Unit #2</span>
                <h4 className="font-extrabold text-sm text-white">15 MT Tata Tiscon Rebar</h4>
                <p className="text-slate-400">Recipient: Joyjit Constructions (Salt Lake IT Park)</p>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-cyan-400 font-bold">Picked Up (~45 Mins)</span>
                  <span className="text-slate-500">WB-29-B-6109</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                <span className="text-[10px] text-emerald-400 uppercase font-black">Completed Unit</span>
                <h4 className="font-extrabold text-sm text-white">10,000 Red Clay Bricks</h4>
                <p className="text-slate-400">Recipient: Joyjit Constructions (Rajarhat Villa)</p>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-emerald-400 font-bold">Delivered &amp; Signed</span>
                  <span className="text-slate-500">OTP Verified</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------
          PERSONA C: LABOURER / SPECIALIZED WORKER COMMAND CENTER
      ------------------------------------------------------------------------- */}
      {activeRole === 'LABORER' && (
        <section className="space-y-8 animate-fadeIn">
          {/* Labourer Welcome Header */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-900/60 shadow-2xl flex flex-col xl:flex-row xl:items-center justify-between gap-6 overflow-hidden">
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="verified" size="sm" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 whitespace-nowrap">
                  <Users className="w-3.5 h-3.5 mr-1 shrink-0" /> Specialized Worker Portal
                </Badge>
                <Badge variant="orange" size="sm" className="whitespace-nowrap">
                  100% Direct Fair Wage Guarantee
                </Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                Worker Hub: <span className="text-emerald-300">{user?.name || 'Subhas Sardar'}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Trade: <strong>Master Electrician &amp; Conduit Specialist (Govt Licensed)</strong>. View builders who want to book you, review shift timings and dates, negotiate wages, and receive official company phone verification calls.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 xl:pt-0">
              <Link href="/labour">
                <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-500 whitespace-nowrap">
                  <Briefcase className="w-4 h-4 mr-1.5" /> My Jobs &amp; Bookings
                </Button>
              </Link>
            </div>
          </div>

          {/* LABOUR SECTION: INCOMING WORK BOOKINGS WINDOW */}
          <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Who Wants to Book You (Incoming Work Booking Requests)
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Direct work booking requests from verified West Bengal contractors calculated as per square foot (sq.ft). Shift dates, timings, and rates per sq.ft are shown. Propose counter offers if needed!
                </p>
              </div>

              {/* Company Call Guarantee Notification */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-200 font-bold shrink-0">
                <PhoneCall className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>BuildNexus Team Call Guarantee on Acceptance</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {labourBookingOffers.map((offer) => {
                const isAccepted = offer.status === 'ACCEPTED';
                const isCountered = offer.status === 'COUNTERED';
                const isDeclined = offer.status === 'DECLINED';
                const effectiveRate = offer.counterRatePerSqFt || offer.ratePerSqFt;

                return (
                  <Card
                    key={offer.id}
                    className={`backdrop-blur-md border transition-all ${
                      isAccepted
                        ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                        : isCountered
                        ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/20'
                        : isDeclined
                        ? 'border-slate-300 opacity-60'
                        : 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/10'
                    }`}
                  >
                    <div className="p-5 space-y-4">
                      {/* Contractor Information */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Contractor Booking Offer (Per Sq.Ft Basis)
                          </span>
                          <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                            {offer.contractorName}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <Rating rating={offer.contractorRating} />
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-brand-orange" /> {offer.siteLocation}
                            </span>
                          </div>
                        </div>

                        <Badge
                          variant={isAccepted ? 'verified' : isCountered ? 'orange' : isDeclined ? 'default' : 'danger'}
                          size="sm"
                        >
                          {isAccepted
                            ? '✓ Booking Accepted'
                            : isCountered
                            ? `💬 Countered: ₹${effectiveRate}/sq.ft`
                            : isDeclined
                            ? 'Declined'
                            : 'Offer Received'}
                        </Badge>
                      </div>

                      {/* Shift Timing, Dates, Area & Trade Required */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
                        <div className="space-y-1">
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">
                            Specialization Trade
                          </span>
                          <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-amber-500" /> {offer.tradeRequired}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">
                            Contracted Work Area
                          </span>
                          <p className="font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5" /> {offer.workAreaSqFt.toLocaleString()} sq.ft
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">
                            Shift Timings
                          </span>
                          <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-blue-500" /> {offer.shiftTiming}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">
                            Booking Dates
                          </span>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                            {offer.startDate} to {offer.endDate} ({offer.durationDays} Days)
                          </p>
                        </div>
                      </div>

                      {/* Pricing Details As Per Sq.Ft */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex items-center justify-between border border-slate-200/40 dark:border-slate-700/40">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Rate As Per Sq.Ft
                          </span>
                          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                            ₹{effectiveRate} <span className="text-xs font-semibold text-slate-500">/ sq.ft</span>
                          </p>
                          <span className="text-[10px] text-slate-500">
                            Work: {offer.workAreaSqFt.toLocaleString()} sq.ft
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Total Contract Value
                          </span>
                          <p className="text-base font-extrabold text-slate-900 dark:text-white">
                            {formatINR(offer.totalWage)}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            ₹{effectiveRate} × {offer.workAreaSqFt.toLocaleString()} sq.ft
                          </span>
                        </div>
                      </div>

                      {/* Call Scheduled Banner */}
                      {offer.companyCallScheduled && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-2.5 text-xs text-blue-800 dark:text-blue-200">
                          <PhoneCall className="w-4 h-4 text-blue-600 shrink-0" />
                          <div>
                            <p className="font-bold">Official Company Verification Call Scheduled</p>
                            <p className="text-[11px] text-blue-600 dark:text-blue-300">
                              Our West Bengal supervisor will call your registered phone to confirm shift dates and site coordinates.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons: Accept / Counter / Deny */}
                      {!isAccepted && !isDeclined && (
                        <div className="pt-2 flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => {
                              respondToLabourOffer(offer.id, 'ACCEPTED');
                              triggerConfetti();
                              addToast({
                                title: 'Booking Accepted!',
                                message: `Confirmed job with ${offer.contractorName} at ₹${effectiveRate}/sq.ft for ${offer.workAreaSqFt} sq.ft. BuildNexus team will call you shortly to confirm your booking dates.`,
                                type: 'success',
                              });
                            }}
                          >
                            <Check className="w-3.5 h-3.5 mr-1" /> Accept Booking
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-amber-400 text-amber-700 dark:text-amber-400 hover:bg-amber-50"
                            onClick={() => {
                              setActiveLabourOffer(offer);
                              setLabourCounterWageInput(String(offer.ratePerSqFt + 4));
                              setLabourCounterNoteInput('Proposing updated rate for certified specialist execution.');
                            }}
                          >
                            <DollarSign className="w-3.5 h-3.5 mr-1" /> Negotiate Rate (₹/sq.ft)
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs text-rose-500 hover:bg-rose-50"
                            onClick={() => {
                              respondToLabourOffer(offer.id, 'DECLINED');
                              addToast({ title: 'Booking Declined', message: 'Offer denied.', type: 'info' });
                            }}
                          >
                            Deny
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------
          PERSONA D: HOMEOWNER / NORMAL CUSTOMER COMMAND CENTER
      ------------------------------------------------------------------------- */}
      {activeRole === 'CUSTOMER' && (
        <section className="space-y-8 animate-fadeIn">
          {/* Customer Modern Executive Command Deck */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            {/* Top Identity & Badges Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Homeowner &amp; Client Solution Portal
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
                    Verified West Bengal Network
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Hire Verified <span className="text-blue-600 dark:text-blue-400">Builders</span> &amp; <span className="text-emerald-600 dark:text-emerald-400">Labour Squads</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
                  Choose <strong className="text-slate-800 dark:text-slate-200">Turnkey Registered Builders</strong> for structural blueprints &amp; villa construction, or book <strong className="text-slate-800 dark:text-slate-200">Specialized Trade Squads</strong> (Electricians, Plumbers, Tile Layers, Masons, Painters) contracted strictly on a transparent <strong>per sq.ft area</strong> basis.
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs flex items-center gap-2.5 text-blue-900 dark:text-blue-200 font-bold">
                  <Award className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Escrow Protection</p>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-300">Zero Hidden Brokerage</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/contractors" className="group p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex flex-col justify-between space-y-2">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black">Turnkey Builders Directory</p>
                  <p className="text-[10px] text-blue-100">Browse verified projects, ratings &amp; book site visit</p>
                </div>
              </Link>

              <Link href="/labour" className="group p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex flex-col justify-between space-y-2">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black">Book Labour Squads (Per Sq.Ft)</p>
                  <p className="text-[10px] text-emerald-100">Electricians, Plumbers, Tile Layers with direct wage guarantee</p>
                </div>
              </Link>
            </div>
          </div>

          {/* DUAL CATEGORY SWITCHER TABS: ALL / BUILDERS / LABOUR */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 w-fit">
            <button
              onClick={() => setCustomerFilter('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                customerFilter === 'ALL'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-brand-orange" />
              <span>All Options ({builderPublicProfiles.length + customerLabourSquads.length})</span>
            </button>

            <button
              onClick={() => setCustomerFilter('BUILDERS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                customerFilter === 'BUILDERS'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Turnkey Builders ({builderPublicProfiles.length})</span>
            </button>

            <button
              onClick={() => setCustomerFilter('LABOUR')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                customerFilter === 'LABOUR'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Skilled Labour Squads ({customerLabourSquads.length})</span>
            </button>
          </div>

          {/* CUSTOMER SECTION 1: VERIFIED BUILDERS SHOWCASE (STRICTLY NO PRICING) */}
          {(customerFilter === 'ALL' || customerFilter === 'BUILDERS') && (
            <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      Option 1: Verified West Bengal Builders (Turnkey Civil Construction)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    For complete home construction, multi-story buildings, and RCC structures. <strong>Zero material pricing is displayed</strong> to maintain architectural design confidentiality.
                  </p>
                </div>

                <Badge variant="verified">
                  {builderPublicProfiles.length} Certified WB Builders
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {builderPublicProfiles.map((builder) => (
                  <Card
                    key={builder.id}
                    hoverable
                    className="backdrop-blur-md border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between p-5 space-y-5"
                  >
                    <div className="space-y-4">
                      {/* Header: Avatar, Name, Rating */}
                      <div className="flex items-center gap-3">
                        <Avatar name={builder.name} src={builder.avatar} isVerified size="md" />
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                            {builder.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium truncate">
                            {builder.license}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Rating rating={builder.rating} />
                            <span className="text-[10px] text-slate-400">({builder.reviewsCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* How Much Worked Metrics */}
                      <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-xs border border-slate-100 dark:border-slate-700/50">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Delivered
                          </span>
                          <p className="text-xs font-black text-brand-orange">
                            {builder.projectsCompleted} Projects
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Built Area
                          </span>
                          <p className="text-xs font-black text-blue-600 dark:text-blue-400">
                            {builder.totalSqFtBuilt}
                          </p>
                        </div>
                      </div>

                      {/* In Which Areas Worked */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-orange" /> Working Areas:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {builder.areasWorked.slice(0, 3).map((area, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Specializations */}
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Specializations:
                        </span>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                          {builder.specializations.join(' • ')}
                        </p>
                      </div>
                    </div>

                    {/* Consultation Request Action */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        size="sm"
                        variant="primary"
                        className="w-full text-xs bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          setSelectedBuilderForConsult(builder);
                          setConsultName(user?.name || 'Homeowner');
                        }}
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Book Builder Consultation
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* CUSTOMER SECTION 2: VERIFIED SKILLED LABOUR SQUADS (AS PER SQ.FT BOOKINGS) */}
          {(customerFilter === 'ALL' || customerFilter === 'LABOUR') && (
            <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      Option 2: Verified Skilled Labour &amp; Trade Squads (Book As Per Sq.Ft)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    For individual trade executions (electric wiring, tile laying, sanitary plumbing, masonry, painting). <strong>Transparent wages computed strictly per sq.ft area</strong> with 100% direct fair wages &amp; company call verification.
                  </p>
                </div>

                <Badge variant="verified" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  {customerLabourSquads.length} Certified Trade Squads
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customerLabourSquads.map((squad) => {
                  const est1000SqFtPayout = squad.ratePerSqFt * 1200;

                  return (
                    <Card
                      key={squad.id}
                      hoverable
                      className="backdrop-blur-md border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between p-6 space-y-5 group hover:border-emerald-500/60 transition-all"
                    >
                      <div className="space-y-4">
                        {/* Squad Head Avatar & Trade */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <Avatar name={squad.name} src={squad.avatar} isVerified size="md" />
                            <div>
                              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                                {squad.name}
                              </h4>
                              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                {squad.tradeTitle}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <Rating rating={squad.rating} />
                                <span className="text-[10px] text-slate-400">({squad.reviewsCount} reviews)</span>
                              </div>
                            </div>
                          </div>

                          <Badge variant="verified" size="sm" className="text-[10px]">
                            {squad.teamSize} Workers
                          </Badge>
                        </div>

                        {/* Transparent Rate As Per Sq.Ft Card */}
                        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/60 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                              Transparent Wage Rate
                            </span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                ₹{squad.ratePerSqFt}
                              </span>
                              <span className="text-xs font-semibold text-slate-500">
                                / sq.ft area
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-400 block">
                              For 1,200 sq.ft Flat
                            </span>
                            <span className="text-sm font-black text-slate-900 dark:text-white">
                              {formatINR(est1000SqFtPayout)}
                            </span>
                          </div>
                        </div>

                        {/* License & Experience */}
                        <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                          <p className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{squad.licenseNumber}</span>
                          </p>
                          <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>Shift: {squad.shiftTiming} • {squad.experienceYears}+ Yrs Exp</span>
                          </p>
                        </div>

                        {/* Service Areas */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                            Service Coverage in West Bengal:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {squad.workingAreas.map((area, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Recent Work description */}
                        <p className="text-[11px] text-slate-500 italic bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                          "{squad.recentWorks}"
                        </p>
                      </div>

                      {/* Direct Booking Action */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                        <Button
                          size="sm"
                          variant="primary"
                          className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 font-bold"
                          onClick={() => {
                            setSelectedLabourSquadForBook(squad);
                            setCustLabourLocation('Action Area II, New Town, Kolkata');
                          }}
                        >
                          <Briefcase className="w-3.5 h-3.5 mr-1.5" /> Book This Labour Squad (₹{squad.ratePerSqFt}/sq.ft)
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* -------------------------------------------------------------------------
          PERSONA E: BUILDNEXUS ADMIN / PLATFORM CONTROLLER COMMAND CENTER
      ------------------------------------------------------------------------- */}
      {activeRole === 'ADMIN' && (
        <section className="space-y-8 animate-fadeIn">
          {/* Admin Modern Executive Command Deck */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            {/* Top Identity & Badges Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 inline-flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" /> Super Admin Hub
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white dark:bg-slate-800 border border-slate-700 inline-flex items-center gap-1.5">
                    BuildNexus Central Command
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Platform Admin Command: <span className="text-rose-600 dark:text-rose-400">BuildNexus Central Operations</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
                  Supervisory governance over <strong className="text-slate-800 dark:text-slate-200">West Bengal material transit corridors</strong>, contractor creditworthiness, Dankuni &amp; Kona staging depots, Fastag toll audits, deal escrow approvals, and dispute settlement.
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs flex items-center gap-2.5 text-rose-900 dark:text-rose-200 font-bold">
                  <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Super Admin Access</p>
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-300">Level 4 Root Clearance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/admin" className="group p-4 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex flex-col justify-between space-y-2">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black">Full Admin Console</p>
                  <p className="text-[10px] text-rose-100">Approvals, escrow audits &amp; disputes</p>
                </div>
              </Link>

              <Link href="/delivery" className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-cyan-500/60 hover:shadow-md hover:scale-[1.02] transition-all flex flex-col justify-between space-y-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">Fleet Telematics &amp; Tolls</p>
                  <p className="text-[10px] text-slate-500">Live Fastag transit corridor audit</p>
                </div>
              </Link>

              <Link href="/stock" className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-amber-500/60 hover:shadow-md hover:scale-[1.02] transition-all flex flex-col justify-between space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">Depot Staging Stocks</p>
                  <p className="text-[10px] text-slate-500">Dankuni &amp; Kona inventory levels</p>
                </div>
              </Link>
            </div>
          </div>

          {/* ADMIN KPI STRIP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">Active WB Deals Escrow</span>
                <Handshake className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400">₹84,25,000</p>
              <p className="text-[11px] text-emerald-600 font-bold">14 Deals in Transit Verification</p>
            </Card>

            <Card className="p-5 bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">Fastag Toll Collection</span>
                <Truck className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">100% Buyer Paid</p>
              <p className="text-[11px] text-slate-500">NH-19 Dankuni &amp; Belghoria Cleared</p>
            </Card>

            <Card className="p-5 bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">Verified PWD Builders</span>
                <Building2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">142 Licensed</p>
              <p className="text-[11px] text-emerald-600 font-bold">0 Active Non-Compliance Cases</p>
            </Card>

            <Card className="p-5 bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">Supplier Hubs Online</span>
                <Store className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400">28 Staging Yards</p>
              <p className="text-[11px] text-purple-600 font-bold">Dankuni &amp; Kona Expressway Active</p>
            </Card>
          </div>

          {/* ADMIN SECTION: LIVE AUDIT FEED & DISPATCH ESCROWS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Order & Toll Escrow Audits */}
            <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-rose-500" />
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Live Deal Audits &amp; Toll Allocations
                  </h3>
                </div>
                <Badge variant="verified">Audit Stream Active</Badge>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-900 dark:text-white">Joyjit Const. ↔ Lakshmi Building Supplies</span>
                    <Badge variant="verified" size="sm">Audit Passed</Badge>
                  </div>
                  <p className="text-slate-500">
                    500 Bags UltraTech Cement • Dankuni to New Town Action Area II
                  </p>
                  <div className="flex justify-between items-center text-[11px] pt-1 text-slate-600 dark:text-slate-400 border-t border-slate-200/40 dark:border-slate-700/40">
                    <span>Deal Value: <strong>₹1,82,500</strong></span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">Toll: ₹450 (NH-19 Paid by Builder)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-900 dark:text-white">Bengal Infra Buildcon ↔ TMT Steel Yard</span>
                    <Badge variant="orange" size="sm">Verification Pending</Badge>
                  </div>
                  <p className="text-slate-500">
                    25 MT JSW Fe-550D Rebar • Kona Expressway to Rajarhat
                  </p>
                  <div className="flex justify-between items-center text-[11px] pt-1 text-slate-600 dark:text-slate-400 border-t border-slate-200/40 dark:border-slate-700/40">
                    <span>Deal Value: <strong>₹14,20,000</strong></span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">Toll: ₹680 (Vidyasagar Setu Paid by Builder)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Super Admin Actions */}
            <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Platform Master Controls
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Execute super admin overrides across pricing corridors, driver compliance checks, and emergency staging re-routings.
                </p>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <Link href="/admin">
                    <Button size="sm" variant="outline" className="w-full text-xs justify-start">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Approve KYC &amp; PWD
                    </Button>
                  </Link>
                  <Link href="/delivery">
                    <Button size="sm" variant="outline" className="w-full text-xs justify-start">
                      <Truck className="w-3.5 h-3.5 mr-1.5 text-cyan-500" /> Dispatch Corridors
                    </Button>
                  </Link>
                  <Link href="/stock">
                    <Button size="sm" variant="outline" className="w-full text-xs justify-start">
                      <Boxes className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> Dankuni Yard Stock
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button size="sm" variant="outline" className="w-full text-xs justify-start">
                      <Store className="w-3.5 h-3.5 mr-1.5 text-purple-500" /> Live Rate Decks
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200 space-y-1">
                <p className="font-extrabold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  BuildNexus Regulatory Compliance
                </p>
                <p className="text-[11px] text-rose-700 dark:text-rose-300">
                  All transacted freight complies with West Bengal Motor Vehicles Rules and NETC Fastag electronic toll collection protocols.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          4. VERIFIED DIRECT MATERIAL PARTNERS TICKER
      ========================================================================= */}
      <section className="space-y-3 pt-4">
        <p className="text-center text-xs font-extrabold uppercase tracking-widest text-slate-400">
          Direct Certified Material Partners • West Bengal Logistics Corridors
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {brandLogos.map((b) => (
            <div
              key={b.name}
              className="px-4 py-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2 hover:border-brand-orange transition-colors"
            >
              <Building2 className="w-4 h-4 text-brand-orange" />
              <div>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                  {b.name}
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">{b.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          5. INTERACTIVE ROI COST SAVINGS CALCULATOR
      ========================================================================= */}
      <section className="backdrop-blur-xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="orange" className="bg-orange-500/20 text-orange-400">
            <Calculator className="w-3.5 h-3.5 mr-1" /> Financial Advantage
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black">
            Calculate How Much You Save with BuildNexus
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Estimate project procurement spend and calculate middleman markup savings across West Bengal sites.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6 bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-300 uppercase">Estimated Monthly Project Spend</span>
              <span className="text-2xl font-black text-brand-orange">{formatINR(monthlySpend)}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={5000000}
              step={50000}
              value={monthlySpend}
              onChange={(e) => setMonthlySpend(parseInt(e.target.value, 10))}
              className="w-full accent-brand-orange h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>₹1 Lakh (Small Site)</span>
              <span>₹25 Lakh (Medium Project)</span>
              <span>₹50 Lakh (Commercial Hub)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-700">
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-emerald-500/30 space-y-1">
              <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4" /> Builder Cost Saved (Zero Broker Cut)
              </span>
              <p className="text-3xl font-black text-white">{formatINR(estimatedSavings)}</p>
              <p className="text-[11px] text-slate-400">Direct supplier negotiation + transparent volume pricing.</p>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-orange-500/30 space-y-1">
              <span className="text-xs font-bold uppercase text-brand-orange flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Extra Direct Wage Delivered to Laborers
              </span>
              <p className="text-3xl font-black text-white">{formatINR(extraWorkerTakehome)}</p>
              <p className="text-[11px] text-slate-400">100% fair pay delivered without multi-tier contractor cuts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FREQUENTLY ASKED QUESTIONS ACCORDION
      ========================================================================= */}
      <section className="backdrop-blur-xl bg-slate-50/80 dark:bg-slate-900/80 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <Badge variant="verified">West Bengal Operations</Badge>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between"
              >
                <span>{faq.q}</span>
                {openFaqIdx === idx ? (
                  <ChevronUp className="w-4 h-4 text-brand-orange shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaqIdx === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700/60 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          MODALS
      ========================================================================= */}

      {/* SUPPLIER NEGOTIATION MODAL */}
      <Modal
        isOpen={!!activeSupplierInquiry}
        onClose={() => setActiveSupplierInquiry(null)}
        title="Negotiate &amp; Change Price for Builder"
        maxWidth="md"
      >
        {activeSupplierInquiry && (
          <form onSubmit={handleSupplierSubmitNegotiation} className="space-y-4 pt-2">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">Contractor / Builder:</span>
                <span className="text-slate-900 dark:text-white">{activeSupplierInquiry.builderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Material Requested:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {activeSupplierInquiry.quantityRequested} {activeSupplierInquiry.unit} of {activeSupplierInquiry.materialName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Standard Catalog Rate:</span>
                <span className="line-through text-slate-400">
                  {formatINR(activeSupplierInquiry.standardPrice)} / {activeSupplierInquiry.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Builder's Proposed Rate:</span>
                <span className="font-bold text-amber-600">
                  {formatINR(activeSupplierInquiry.builderProposedPrice)} / {activeSupplierInquiry.unit}
                </span>
              </div>
            </div>

            <Input
              label={`Your Changed Price (₹ per ${activeSupplierInquiry.unit})`}
              type="number"
              step="any"
              value={supplierPriceInput}
              onChange={(e) => setSupplierPriceInput(e.target.value)}
              placeholder="e.g. 365"
              required
            />

            <Input
              label="Supplier Confirmation Note (Visible to Builder)"
              value={supplierNoteInput}
              onChange={(e) => setSupplierNoteInput(e.target.value)}
              placeholder="e.g. Bulk discount approved with Dankuni yard staging."
            />

            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800 text-[11px] text-purple-900 dark:text-purple-300">
              💡 <strong>Instant Reflection:</strong> When you submit, this price will be uniquely locked for {activeSupplierInquiry.builderName}. The builder will see this changed value and can accept it directly into their cart.
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveSupplierInquiry(null)} className="w-1/3">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1 bg-purple-600 hover:bg-purple-700">
                Lock &amp; Send Changed Value to Builder
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* LABOUR COUNTER-OFFER MODAL */}
      <Modal
        isOpen={!!activeLabourOffer}
        onClose={() => setActiveLabourOffer(null)}
        title="Propose Counter Rate as per Sq.Ft"
        maxWidth="md"
      >
        {activeLabourOffer && (
          <form onSubmit={handleLabourSubmitCounter} className="space-y-4 pt-2">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
              <p><strong>Builder:</strong> {activeLabourOffer.contractorName} ({activeLabourOffer.siteLocation})</p>
              <p><strong>Work Trade:</strong> {activeLabourOffer.tradeRequired}</p>
              <p><strong>Contracted Area:</strong> {activeLabourOffer.workAreaSqFt.toLocaleString()} sq.ft</p>
              <p><strong>Offered Rate:</strong> ₹{activeLabourOffer.ratePerSqFt} / sq.ft (Total {formatINR(activeLabourOffer.totalWage)})</p>
            </div>

            <Input
              label="Your Counter Proposed Rate (₹ / sq.ft)"
              type="number"
              step="any"
              value={labourCounterWageInput}
              onChange={(e) => setLabourCounterWageInput(e.target.value)}
              placeholder="e.g. 22"
              required
            />

            {parseFloat(labourCounterWageInput) > 0 && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex justify-between items-center">
                <span>Calculated Total Contract Value:</span>
                <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                  {formatINR(Math.round(parseFloat(labourCounterWageInput) * activeLabourOffer.workAreaSqFt))}
                </span>
              </div>
            )}

            <Input
              label="Note for Builder (e.g. includes specialized conduit piping & testing)"
              value={labourCounterNoteInput}
              onChange={(e) => setLabourCounterNoteInput(e.target.value)}
              placeholder="e.g. Rate includes high-grade wiring tools and testing."
            />

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveLabourOffer(null)} className="w-1/3">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                Submit Counter Rate (₹/sq.ft)
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* CUSTOMER BUILDER CONSULTATION MODAL */}
      <Modal
        isOpen={!!selectedBuilderForConsult}
        onClose={() => setSelectedBuilderForConsult(null)}
        title={`Request Consultation with ${selectedBuilderForConsult?.name}`}
        maxWidth="md"
      >
        {selectedBuilderForConsult && (
          <form onSubmit={handleCustomerSubmitConsult} className="space-y-4 pt-2">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-300">
              <p className="font-bold">Verified Builder Credentials:</p>
              <p>• {selectedBuilderForConsult.projectsCompleted} Projects Delivered ({selectedBuilderForConsult.totalSqFtBuilt})</p>
              <p>• Operating in: {selectedBuilderForConsult.areasWorked.join(', ')}</p>
              <p className="text-[10px] text-blue-600 mt-1">*Zero pricing is disclosed in advance.</p>
            </div>

            <Input
              label="Your Name"
              value={consultName}
              onChange={(e) => setConsultName(e.target.value)}
              required
            />

            <Input
              label="Contact Phone"
              value={consultPhone}
              onChange={(e) => setConsultPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              required
            />

            <Input
              label="Project Location in West Bengal"
              value={consultLocation}
              onChange={(e) => setConsultLocation(e.target.value)}
              required
            />

            <Input
              label="Project Scope / Details"
              value={consultScope}
              onChange={(e) => setConsultScope(e.target.value)}
              required
            />

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setSelectedBuilderForConsult(null)} className="w-1/3">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Send Consultation Request
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* CUSTOMER LABOUR SQUAD BOOKING MODAL (AS PER SQ.FT) */}
      <Modal
        isOpen={!!selectedLabourSquadForBook}
        onClose={() => setSelectedLabourSquadForBook(null)}
        title={`Book ${selectedLabourSquadForBook?.name} (${selectedLabourSquadForBook?.tradeTitle})`}
        maxWidth="md"
      >
        {selectedLabourSquadForBook && (
          <form onSubmit={handleCustomerSubmitLabourBooking} className="space-y-4 pt-2">
            {/* Squad Snapshot Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {selectedLabourSquadForBook.name}
                  </h4>
                  <p className="text-emerald-700 dark:text-emerald-300 font-bold">
                    {selectedLabourSquadForBook.tradeTitle}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Fixed Rate</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    ₹{selectedLabourSquadForBook.ratePerSqFt}
                  </span>
                  <span className="text-[10px] text-slate-500"> / sq.ft</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                • License: {selectedLabourSquadForBook.licenseNumber} • Squad Size: {selectedLabourSquadForBook.teamSize} Workers
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Homeowner / Client Name"
                value={user?.name || 'Anirban Mukherjee'}
                disabled
              />

              <Input
                label="Contact Mobile"
                value={custLabourPhone}
                onChange={(e) => setCustLabourPhone(e.target.value)}
                placeholder="e.g. 9830144912"
                required
              />
            </div>

            <Input
              label="Site Address in West Bengal"
              value={custLabourLocation}
              onChange={(e) => setCustLabourLocation(e.target.value)}
              placeholder="e.g. Action Area II, New Town / Salt Lake Block CF"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Work Area in Sq.Ft (e.g. Flat/Site Area)"
                type="number"
                value={custLabourAreaInput}
                onChange={(e) => setCustLabourAreaInput(e.target.value)}
                placeholder="e.g. 1200"
                min="100"
                required
              />

              <Input
                label="Preferred Start Date"
                type="date"
                value={custLabourStartDate}
                onChange={(e) => setCustLabourStartDate(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Duration in Days (Estimated)"
                type="number"
                value={custLabourDurationDays}
                onChange={(e) => setCustLabourDurationDays(e.target.value)}
                min="1"
                required
              />

              <Select
                label="Shift Timing"
                value={custLabourShiftTiming}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCustLabourShiftTiming(e.target.value)}
                options={[
                  { value: '08:30 AM - 05:30 PM (Day Shift)', label: '08:30 AM - 05:30 PM (Standard Day Shift)' },
                  { value: '09:00 AM - 06:00 PM (Day Shift)', label: '09:00 AM - 06:00 PM (Day Shift)' },
                  { value: '08:00 AM - 05:00 PM (Early Shift)', label: '08:00 AM - 05:00 PM (Early Shift)' },
                ]}
              />
            </div>

            <Input
              label="Work Scope & Specific Instructions"
              value={custLabourNotes}
              onChange={(e) => setCustLabourNotes(e.target.value)}
              placeholder="e.g. Concealed 3-phase conduit wiring, DB box dressing for 3BHK flat"
            />

            {/* Live Transparent Wage Calculation Box */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Rate Calculation:</span>
                <span className="font-mono text-slate-300">
                  {custLabourAreaInput || 0} sq.ft × ₹{selectedLabourSquadForBook.ratePerSqFt}/sq.ft
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-200">Total Contract Value:</span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {formatINR(Math.round((parseFloat(custLabourAreaInput) || 0) * selectedLabourSquadForBook.ratePerSqFt))}
                </span>
              </div>

              <p className="text-[10px] text-amber-300/90 pt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero broker cut • 100% direct fair wage • BuildNexus verification phone call included.</span>
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setSelectedLabourSquadForBook(null)} className="w-1/3 text-xs">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-xs font-bold">
                Confirm &amp; Dispatch Labour Booking
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* SITE STOCK LOG CONSUMPTION MODAL */}
      <Modal
        isOpen={!!activeStockItemToLog}
        onClose={() => setActiveStockItemToLog(null)}
        title="Record Site Material Consumption"
        maxWidth="sm"
      >
        {activeStockItemToLog && (
          <form onSubmit={handleConsumeStock} className="space-y-4 pt-2">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Recording daily use for <strong>{activeStockItemToLog.name}</strong> at <strong>{activeStockItemToLog.siteLocation || 'New Town Smart Site #4'}</strong>.
            </div>

            <Input
              label={`Amount Consumed (${activeStockItemToLog.unit})`}
              type="number"
              step="any"
              value={consumeAmount}
              onChange={(e) => setConsumeAmount(e.target.value)}
              required
            />

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveStockItemToLog(null)} className="w-1/3">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                Log Consumption
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
