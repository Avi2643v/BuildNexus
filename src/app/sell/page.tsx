'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppStore, BuilderSurplusSellOffer } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatINR } from '@/lib/utils';
import { triggerConfetti } from '@/lib/confetti';
import {
  PlusCircle,
  Tag,
  Eye,
  DollarSign,
  Package,
  Sparkles,
  CheckCircle2,
  Trash2,
  Edit,
  Building2,
  Layers,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Percent,
  MessageSquare,
  Clock,
  MapPin,
  Send,
  Sliders,
  Check,
  X,
  Truck,
  TrendingDown,
  PhoneCall,
  Calendar,
  Filter,
} from 'lucide-react';

interface SalesListingItem {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  condition: string;
  status: string;
  image: string;
  city: string;
}

export default function SellPage() {
  const {
    user,
    activeRole,
    contractorCustomRates,
    setContractorCustomRate,
    materialNegotiationInquiries,
    supplierUpdateNegotiationPrice,
    builderSurplusSellOffers,
    addBuilderSurplusSellOffer,
    supplierAcceptSurplusOffer,
    supplierCounterSurplusOffer,
    builderAcceptSupplierCounter,
    builderDeclineSupplierOffer,
    supplierDispatchPickup,
    completeSurplusBuyback,
    addToast,
  } = useAppStore();

  const isContractor = activeRole === 'CONTRACTOR';

  const [activeTab, setActiveTab] = useState<'BUILDER_SURPLUS_BUYBACK' | 'BUILDER_DEMAND' | 'CUSTOM_RATES' | 'SURPLUS'>('BUILDER_SURPLUS_BUYBACK');
  const [selectedSurplusCategory, setSelectedSurplusCategory] = useState('ALL');

  const [listings, setListings] = useState<SalesListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New Surplus Listing Modal State (for standard listing)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('steel');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('100');
  const [condition, setCondition] = useState('SURPLUS');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Supplier Negotiation Modal with Builder (Outbound Demand)
  const [activeNegotiationInquiry, setActiveNegotiationInquiry] = useState<any>(null);
  const [changedPriceInput, setChangedPriceInput] = useState('');
  const [supplierNoteInput, setSupplierNoteInput] = useState('');

  // Contractor-Specific Custom Price Modal State
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState('user-contractor-1');
  const [selectedMaterial, setSelectedMaterial] = useState('mat-1');
  const [negotiatedRateInput, setNegotiatedRateInput] = useState('340');

  // Supplier Accept Buyback Modal State
  const [acceptingSurplusOffer, setAcceptingSurplusOffer] = useState<BuilderSurplusSellOffer | null>(null);
  const [pickupDateInput, setPickupDateInput] = useState('Today at 04:00 PM (Returning 10-Ton Fleet)');
  const [pickupVehicleInput, setPickupVehicleInput] = useState('10-Ton Flatbed Truck (Returning Fleet)');

  // Supplier Counter Buyback Rate Modal State
  const [counteringSurplusOffer, setCounteringSurplusOffer] = useState<BuilderSurplusSellOffer | null>(null);
  const [counterRateInput, setCounterRateInput] = useState('');
  const [counterNotesInput, setCounterNotesInput] = useState('');

  // Builder Create Surplus Modal State
  const [isBuilderCreateSurplusModalOpen, setIsBuilderCreateSurplusModalOpen] = useState(false);
  const [bldMaterialName, setBldMaterialName] = useState('UltraTech PPC Cement (50kg)');
  const [bldCategory, setBldCategory] = useState<'CEMENT' | 'STEEL' | 'BRICKS' | 'TILES' | 'PAINT' | 'AGGREGATES' | 'OTHER'>('CEMENT');
  const [bldQuantity, setBldQuantity] = useState('50');
  const [bldUnit, setBldUnit] = useState('bags');
  const [bldCondition, setBldCondition] = useState<'UNOPENED_FACTORY_SEALED' | 'EXCELLENT_SITE_STAGED' | 'PARTIAL_LOT'>('UNOPENED_FACTORY_SEALED');
  const [bldAskingPrice, setBldAskingPrice] = useState('325');
  const [bldRetailPrice, setBldRetailPrice] = useState('380');
  const [bldSiteLocation, setBldSiteLocation] = useState('Plot 42, Action Area II, New Town, Kolkata');
  const [bldTargetSupplier, setBldTargetSupplier] = useState('ALL_SUPPLIERS');
  const [bldDeadline, setBldDeadline] = useState('Within 48 Hours');
  const [bldNotes, setBldNotes] = useState('Slab casting completed. Extra unopened bags stored dry on covered pallets.');

  const catalogMaterials = [
    { id: 'mat-1', name: 'UltraTech PPC Cement (50kg)', defaultPrice: 380, unit: 'bag' },
    { id: 'mat-2', name: 'JSW Neosteel TMT Rebars 12mm Fe550D', defaultPrice: 62, unit: 'kg' },
    { id: 'mat-3', name: 'Standard Red Clay Kiln Bricks', defaultPrice: 9.5, unit: 'piece' },
    { id: 'mat-4', name: 'Kajaria Vitrified Floor Tiles (2x2 ft)', defaultPrice: 55, unit: 'sq.ft' },
    { id: 'mat-5', name: 'Asian Paints Apex Exterior Emulsion (20L)', defaultPrice: 4200, unit: 'bucket' },
  ];

  const contractorsList = [
    { id: 'user-contractor-1', name: 'Rajesh Sharma (Joyjit Constructions)', city: 'Kolkata (New Town)' },
    { id: 'user-contractor-2', name: 'Vikram Builders & Developers', city: 'Salt Lake Sector V' },
    { id: 'user-contractor-3', name: 'Sree Venkateshwara Infra Group', city: 'Howrah & Durgapur' },
  ];

  const filteredSurplusOffers = builderSurplusSellOffers.filter((offer) => {
    if (selectedSurplusCategory === 'ALL') return true;
    return offer.category === selectedSurplusCategory;
  });

  const totalBuybackValuation = builderSurplusSellOffers.reduce((acc, o) => acc + o.totalValuation, 0);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      addToast({
        title: 'Listing Published',
        message: 'Warehouse surplus inventory published in marketplace.',
        type: 'success',
      });
      setIsModalOpen(false);
      setName('');
      setPrice('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveContractorRate = (e: React.FormEvent) => {
    e.preventDefault();
    const rateVal = parseFloat(negotiatedRateInput);
    if (isNaN(rateVal) || rateVal <= 0) {
      addToast({ title: 'Invalid Rate', message: 'Please enter a valid rate', type: 'error' });
      return;
    }

    setContractorCustomRate(selectedMaterial, rateVal);
    const matObj = catalogMaterials.find((m) => m.id === selectedMaterial);
    const contractorObj = contractorsList.find((c) => c.id === selectedContractor);

    addToast({
      title: 'Contractor Price Locked!',
      message: `Locked rate of ${formatINR(rateVal)}/${matObj?.unit} applied for ${contractorObj?.name}. Their cart will automatically reflect this rate!`,
      type: 'success',
    });
    setIsRateModalOpen(false);
  };

  const handleSupplierSubmitNegotiation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNegotiationInquiry) return;
    const priceVal = parseFloat(changedPriceInput);
    if (isNaN(priceVal) || priceVal <= 0) {
      addToast({ title: 'Invalid Price', message: 'Enter a valid price', type: 'error' });
      return;
    }

    supplierUpdateNegotiationPrice(activeNegotiationInquiry.id, priceVal, supplierNoteInput);
    triggerConfetti();

    addToast({
      title: 'Negotiated Value Changed & Sent!',
      message: `Updated rate to ${formatINR(priceVal)} for ${activeNegotiationInquiry.builderName}. Their cart immediately reflects this changed value!`,
      type: 'success',
    });

    setActiveNegotiationInquiry(null);
    setChangedPriceInput('');
    setSupplierNoteInput('');
  };

  // Supplier accepts buyback deal from builder
  const handleConfirmSupplierAcceptBuyback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptingSurplusOffer) return;

    supplierAcceptSurplusOffer(
      acceptingSurplusOffer.id,
      user?.id || 'user-supplier-1',
      user?.name || 'Lakshmi Building Supplies',
      pickupDateInput
    );

    triggerConfetti();
    addToast({
      title: 'Surplus Buyback Deal Locked!',
      message: `Deal confirmed at ${formatINR(acceptingSurplusOffer.askingPricePerUnit)}/${acceptingSurplusOffer.unit}. Reverse fleet collection scheduled for ${pickupDateInput}.`,
      type: 'success',
    });

    setAcceptingSurplusOffer(null);
  };

  // Supplier submits counter offer to builder
  const handleConfirmSupplierCounterBuyback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counteringSurplusOffer) return;
    const rate = parseFloat(counterRateInput);
    if (isNaN(rate) || rate <= 0) {
      addToast({ title: 'Invalid Rate', message: 'Enter a valid counter price', type: 'error' });
      return;
    }

    supplierCounterSurplusOffer(
      counteringSurplusOffer.id,
      rate,
      user?.id || 'user-supplier-1',
      user?.name || 'Lakshmi Building Supplies',
      counterNotesInput || 'Ready for immediate reverse haul pickup.'
    );

    addToast({
      title: 'Counter Buyback Proposal Sent!',
      message: `Proposed ${formatINR(rate)}/${counteringSurplusOffer.unit} to ${counteringSurplusOffer.builderName}. Builder will be notified for confirmation.`,
      type: 'success',
    });

    setCounteringSurplusOffer(null);
    setCounterRateInput('');
    setCounterNotesInput('');
  };

  // Builder publishes new surplus offer
  const handleBuilderSubmitSurplusOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(bldQuantity);
    const askPrice = parseFloat(bldAskingPrice);
    const retPrice = parseFloat(bldRetailPrice);

    if (isNaN(qty) || qty <= 0 || isNaN(askPrice) || askPrice <= 0) {
      addToast({ title: 'Invalid Numbers', message: 'Enter valid quantity and price', type: 'error' });
      return;
    }

    addBuilderSurplusSellOffer({
      builderId: user?.id || 'user-contractor-1',
      builderName: user?.name || 'Rajesh Sharma',
      builderCompany: 'Joyjit Constructions (New Town)',
      builderPhone: user?.mobile || '+91 98765 43210',
      siteLocation: bldSiteLocation,
      materialName: bldMaterialName,
      category: bldCategory,
      quantity: qty,
      unit: bldUnit,
      condition: bldCondition,
      originalPurchasePrice: retPrice || askPrice * 1.15,
      askingPricePerUnit: askPrice,
      marketRetailPrice: retPrice || askPrice * 1.15,
      targetSupplierId: bldTargetSupplier,
      targetSupplierName:
        bldTargetSupplier === 'ALL_SUPPLIERS'
          ? 'All Verified West Bengal Suppliers'
          : 'Lakshmi Building Supplies',
      siteClearanceDeadline: bldDeadline,
      materialImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
      notes: bldNotes,
    });

    triggerConfetti();
    addToast({
      title: 'Surplus Material Offer Published!',
      message: `Listed ${qty} ${bldUnit} for buyback. Suppliers have been notified for site collection.`,
      type: 'success',
    });

    setIsBuilderCreateSurplusModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            {isContractor
              ? 'Builder Surplus Material Liquidation Hub'
              : 'Supplier Demand & Surplus Buyback Portal'}
            <Badge variant="verified">West Bengal B2B Network</Badge>
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate dark:text-slate-400 mt-1">
            {isContractor
              ? 'Sell extra leftover site materials to verified suppliers • Recover capital & schedule reverse fleet pickups'
              : 'Buy back extra materials from active builder sites • Live price negotiation desk • Locked contractor rates'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isContractor ? (
            <Button
              onClick={() => setIsBuilderCreateSurplusModalOpen(true)}
              variant="primary"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Sell Extra Site Materials to Suppliers
            </Button>
          ) : (
            <>
              {activeTab === 'CUSTOM_RATES' && (
                <Button
                  onClick={() => setIsRateModalOpen(true)}
                  variant="primary"
                  leftIcon={<PlusCircle className="w-4 h-4" />}
                >
                  Lock New Contractor Rate
                </Button>
              )}
              {activeTab === 'SURPLUS' && (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  variant="primary"
                  leftIcon={<PlusCircle className="w-4 h-4" />}
                >
                  List Warehouse Stock
                </Button>
              )}
              {activeTab === 'BUILDER_SURPLUS_BUYBACK' && (
                <Badge variant="orange" className="p-2">
                  <Truck className="w-4 h-4 mr-1.5" /> Reverse Fleet Dispatch Ready
                </Badge>
              )}
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('BUILDER_SURPLUS_BUYBACK')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'BUILDER_SURPLUS_BUYBACK'
              ? 'bg-brand-orange text-white shadow-glow'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          {isContractor ? 'My Extra Material Sell Offers' : 'Buy Extra Materials from Builders'} ({builderSurplusSellOffers.length})
        </button>

        <button
          onClick={() => setActiveTab('BUILDER_DEMAND')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'BUILDER_DEMAND'
              ? 'bg-brand-orange text-white shadow-glow'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Building2 className="w-4 h-4" />
          {isContractor ? 'My Material Inquiries to Suppliers' : 'Builders Who Want Material'} ({materialNegotiationInquiries.length})
        </button>

        {!isContractor && (
          <>
            <button
              onClick={() => setActiveTab('CUSTOM_RATES')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'CUSTOM_RATES'
                  ? 'bg-brand-orange text-white shadow-glow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Percent className="w-4 h-4" /> Locked Contractor Rates
            </button>
            <button
              onClick={() => setActiveTab('SURPLUS')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'SURPLUS'
                  ? 'bg-brand-orange text-white shadow-glow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Layers className="w-4 h-4" /> Warehouse Surplus Stock
            </button>
          </>
        )}
      </div>

      {/* TAB 1: BUILDER SURPLUS BUYBACK DESK (MAIN NEW SYSTEM) */}
      {activeTab === 'BUILDER_SURPLUS_BUYBACK' && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800 flex items-start gap-3.5 shadow-sm">
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-md shrink-0">
              <Truck className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1 text-xs text-emerald-950 dark:text-emerald-200">
              <h4 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                {isContractor
                  ? 'Builder Surplus Liquidation to Suppliers'
                  : 'Builder Surplus Material Buyback Desk & Reverse Logistics'}
                <Badge variant="verified">Direct Site Collection</Badge>
              </h4>
              <p className="leading-relaxed">
                {isContractor
                  ? 'Finished your slab or foundation? Do not let expensive cement, TMT rebars, or bricks sit idle on site. Sell them directly to verified West Bengal suppliers at wholesale liquidation rates with direct site pickup!'
                  : 'Active builders have certified unopened or site-staged materials from completed project phases. Buy back materials at wholesale discounts (10% - 25% below mill rate) and use returning delivery fleet for empty backhaul pickups.'}
              </p>
            </div>
          </div>

          {/* Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-slate-900 text-white border-slate-800 p-5 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Buyback Lots Available</span>
              <p className="text-2xl font-black text-brand-orange">
                {builderSurplusSellOffers.length} Site Lots
              </p>
              <p className="text-[11px] text-slate-400">West Bengal job sites</p>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500">Total Available Valuation</span>
              <p className="text-2xl font-black text-emerald-600">
                {formatINR(totalBuybackValuation)}
              </p>
              <p className="text-[11px] text-slate-400">Capital recovery volume</p>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500">Wholesale Margin Savings</span>
              <p className="text-2xl font-black text-blue-600">14% - 23% OFF</p>
              <p className="text-[11px] text-slate-400">Below standard factory retail rate</p>
            </Card>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['ALL', 'CEMENT', 'STEEL', 'BRICKS', 'TILES', 'AGGREGATES'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedSurplusCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedSurplusCategory === cat
                    ? 'bg-brand-orange text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Surplus Offers Cards Grid */}
          <div className="space-y-4">
            {filteredSurplusOffers.map((offer) => {
              const isAccepted = offer.status === 'DEAL_ACCEPTED';
              const isCounter = offer.status === 'COUNTER_PROPOSED_BY_SUPPLIER';
              const isDispatched = offer.status === 'PICKUP_DISPATCHED';
              const isCompleted = offer.status === 'COMPLETED';
              const isOpen = offer.status === 'OPEN_TO_SUPPLIERS';

              return (
                <Card
                  key={offer.id}
                  className={`p-5 space-y-4 border-2 transition-all ${
                    isAccepted
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : isCounter
                      ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20'
                      : isDispatched
                      ? 'border-purple-500 bg-purple-50/20 dark:bg-purple-950/20'
                      : isCompleted
                      ? 'border-emerald-600 opacity-80'
                      : 'border-slate-200 dark:border-slate-800 hover:border-brand-orange/60 shadow-sm'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-start gap-3">
                      <img
                        src={offer.materialImage}
                        alt={offer.materialName}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                            {offer.materialName}
                          </h3>
                          <Badge variant="orange">{offer.category}</Badge>
                          <Badge variant="neutral">
                            {offer.condition === 'UNOPENED_FACTORY_SEALED'
                              ? 'Factory Sealed'
                              : 'Excellent Site Staged'}
                          </Badge>
                        </div>

                        <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                          <span>
                            Builder: <strong className="text-slate-800 dark:text-slate-200">{offer.builderName}</strong> ({offer.builderCompany})
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-brand-orange" />
                            {offer.siteLocation}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {isAccepted && (
                        <Badge variant="success">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Buyback Deal Locked
                        </Badge>
                      )}
                      {isCounter && (
                        <Badge variant="info">
                          Counter-Rate Proposed ({formatINR(offer.counterPricePerUnit || 0)}/{offer.unit})
                        </Badge>
                      )}
                      {isDispatched && (
                        <Badge variant="verified">
                          <Truck className="w-3.5 h-3.5" /> Reverse Fleet Dispatched
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge variant="success">
                          <Check className="w-3.5 h-3.5" /> Buyback Completed
                        </Badge>
                      )}
                      {isOpen && (
                        <Badge variant="orange" className="animate-pulse">
                          Open for Supplier Buyback
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Pricing Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Surplus Quantity</span>
                      <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                        {offer.quantity} {offer.unit}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Asking Buyback Rate</span>
                      <p className="font-extrabold text-brand-orange text-sm">
                        {formatINR(offer.askingPricePerUnit)} / {offer.unit}
                        <span className="text-[10px] text-emerald-600 font-bold ml-1">
                          ({offer.discountPercentage}% OFF)
                        </span>
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Total Buyback Value</span>
                      <p className="font-black text-slate-900 dark:text-white text-sm">
                        {formatINR(offer.totalValuation)}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Clearance Deadline</span>
                      <p className="font-bold text-slate-700 dark:text-slate-300 line-clamp-1">
                        {offer.siteClearanceDeadline}
                      </p>
                    </div>
                  </div>

                  {/* Site Notes */}
                  {offer.notes && (
                    <div className="p-3 bg-slate-100 dark:bg-slate-800/70 rounded-xl text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-slate-900 dark:text-white">Site Storage Condition: </span>
                      &ldquo;{offer.notes}&rdquo;
                    </div>
                  )}

                  {/* Supplier Counter Notes Display */}
                  {isCounter && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-xs text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                      <span className="font-bold">Proposed Counter from {offer.counterSupplierName}: </span>
                      {formatINR(offer.counterPricePerUnit || 0)} / {offer.unit} — &ldquo;{offer.counterNotes}&rdquo;
                    </div>
                  )}

                  {/* Scheduled Pickup Banner if deal locked */}
                  {(isAccepted || isDispatched || isCompleted) && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          Reverse Fleet Collection: <strong className="font-bold">{offer.pickupScheduledDate || 'Scheduled within 24 Hours'}</strong>
                        </span>
                      </div>
                      <Badge variant="verified" size="sm">
                        Escrow Payout Guaranteed
                      </Badge>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap gap-2 justify-end">
                    {/* For SUPPLIER: */}
                    {!isContractor && (
                      <>
                        {isOpen && (
                          <>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => {
                                setAcceptingSurplusOffer(offer);
                                setPickupDateInput('Today at 03:30 PM (Returning 10-Ton Fleet)');
                              }}
                              leftIcon={<CheckCircle2 className="w-4 h-4" />}
                            >
                              Accept Buyback &amp; Schedule Reverse Fleet
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setCounteringSurplusOffer(offer);
                                setCounterRateInput(String(Math.round(offer.askingPricePerUnit * 0.95)));
                              }}
                              leftIcon={<DollarSign className="w-4 h-4" />}
                            >
                              Propose Counter Rate
                            </Button>
                          </>
                        )}

                        {isAccepted && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => {
                              supplierDispatchPickup(offer.id);
                              addToast({
                                title: 'Fleet Dispatched!',
                                message: `Returning delivery truck dispatched to ${offer.siteLocation} for reverse haul.`,
                                type: 'success',
                              });
                            }}
                            leftIcon={<Truck className="w-4 h-4" />}
                          >
                            Dispatch Reverse Logistics Truck
                          </Button>
                        )}

                        {isDispatched && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => {
                              completeSurplusBuyback(offer.id);
                              triggerConfetti();
                              addToast({
                                title: 'Buyback Completed & Stock Added!',
                                message: `${offer.quantity} ${offer.unit} of ${offer.materialName} added to warehouse inventory. Payout released to builder.`,
                                type: 'success',
                              });
                            }}
                            leftIcon={<Check className="w-4 h-4" />}
                          >
                            Confirm Collection &amp; Release Payout
                          </Button>
                        )}
                      </>
                    )}

                    {/* For CONTRACTOR: */}
                    {isContractor && isCounter && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => {
                            builderAcceptSupplierCounter(offer.id);
                            triggerConfetti();
                            addToast({
                              title: 'Counter Rate Accepted!',
                              message: 'Deal locked! Supplier will dispatch reverse logistics truck.',
                              type: 'success',
                            });
                          }}
                          leftIcon={<Check className="w-4 h-4" />}
                        >
                          Accept Supplier Counter Rate
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            builderDeclineSupplierOffer(offer.id);
                            addToast({
                              title: 'Counter Declined',
                              message: 'Offer restored to open status.',
                              type: 'info',
                            });
                          }}
                          leftIcon={<X className="w-4 h-4" />}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: BUILDERS WHO WANT MATERIAL FROM ME (OUTBOUND SALES & NEGOTIATION) */}
      {activeTab === 'BUILDER_DEMAND' && (
        <div className="space-y-6">
          <div className="p-4 bg-orange-50 dark:bg-orange-950/40 rounded-2xl border border-orange-200 dark:border-orange-800 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
            <div className="text-xs text-orange-950 dark:text-orange-200 space-y-1">
              <p className="font-bold">Live Contractor Demand &amp; Negotiation Engine:</p>
              <p>
                Builders and contractors listed below want to purchase materials from you for their construction sites in West Bengal.
                You can review their requested quantities and proposed rates. When you click <span className="font-bold underline">&ldquo;Negotiate &amp; Change Value&rdquo;</span>,
                your updated price will immediately reflect in that builder&apos;s cart and checkout live with strike-through calculation!
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {materialNegotiationInquiries.map((inq) => {
              const isAgreed = inq.status === 'AGREED_AND_LOCKED';
              const isChanged = inq.status === 'PRICE_CHANGED_BY_SUPPLIER';

              return (
                <Card
                  key={inq.id}
                  className={`p-5 space-y-4 border-2 transition-all ${
                    isAgreed
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : isChanged
                      ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-brand-orange'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          Builder: {inq.builderName}
                        </span>
                        <Badge variant="verified">Verified Builder</Badge>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                        Target Site: <span className="font-semibold text-slate-800 dark:text-slate-200">{inq.builderSite}</span>
                      </p>
                    </div>

                    <div>
                      {isAgreed && (
                        <Badge variant="success">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Deal Locked &amp; Applied in Builder Cart
                        </Badge>
                      )}
                      {isChanged && (
                        <Badge variant="info">
                          Price Changed to {formatINR(inq.supplierChangedPrice || 0)} (Sent to Builder)
                        </Badge>
                      )}
                      {inq.status === 'INQUIRY_RECEIVED' && (
                        <Badge variant="orange" className="animate-pulse">
                          Pending Supplier Negotiation
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Requested Material</span>
                      <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{inq.materialName}</p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Required Quantity</span>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {inq.quantityRequested} {inq.unit}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Standard vs Proposed</span>
                      <p className="font-bold text-slate-700 dark:text-slate-300">
                        Std: <span className="line-through">{formatINR(inq.standardPrice)}</span> • Proposed: <span className="text-brand-orange font-black">{formatINR(inq.builderProposedPrice)}</span>
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Your Negotiated Value</span>
                      <p className="font-extrabold text-emerald-600 text-sm">
                        {inq.supplierChangedPrice ? formatINR(inq.supplierChangedPrice) : 'Not Set Yet'}
                        <span className="text-[10px] text-slate-400 font-normal"> / {inq.unit}</span>
                      </p>
                    </div>
                  </div>

                  {inq.builderNote && (
                    <div className="p-3 bg-slate-100 dark:bg-slate-800/70 rounded-xl text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-slate-900 dark:text-white">Builder&apos;s Requirement: </span>
                      &ldquo;{inq.builderNote}&rdquo;
                    </div>
                  )}

                  {inq.supplierNote && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                      <span className="font-bold">Your Offer Note to Builder: </span>
                      &ldquo;{inq.supplierNote}&rdquo; (Rate: {formatINR(inq.supplierChangedPrice || 0)} / {inq.unit})
                    </div>
                  )}

                  {!isContractor && (
                    <div className="pt-2 flex flex-wrap gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          setActiveNegotiationInquiry(inq);
                          setChangedPriceInput(String(inq.supplierChangedPrice || inq.builderProposedPrice + 5));
                          setSupplierNoteInput(inq.supplierNote || 'Special volume rate locked for your West Bengal site.');
                        }}
                        leftIcon={<DollarSign className="w-4 h-4" />}
                      >
                        {isChanged || isAgreed ? 'Modify Negotiated Value' : 'Negotiate & Change Value for this Builder'}
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CONTRACTOR-SPECIFIC NEGOTIATED RATES */}
      {activeTab === 'CUSTOM_RATES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalogMaterials.map((mat) => {
              const lockedRate = contractorCustomRates[mat.id];
              const hasDiscount = lockedRate !== undefined && lockedRate < mat.defaultPrice;
              const discountAmt = hasDiscount ? mat.defaultPrice - lockedRate : 0;
              const discountPct = hasDiscount ? Math.round((discountAmt / mat.defaultPrice) * 100) : 0;

              return (
                <Card key={mat.id} className="p-5 flex flex-col justify-between space-y-4 border-2 border-slate-200 dark:border-slate-800">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Target Material
                      </span>
                      {hasDiscount ? (
                        <Badge variant="verified">Locked Deal Active</Badge>
                      ) : (
                        <Badge variant="neutral">Standard Catalog Rate</Badge>
                      )}
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2">
                      {mat.name}
                    </h3>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Standard Catalog Price:</span>
                        <span className="line-through">{formatINR(mat.defaultPrice)} / {mat.unit}</span>
                      </div>
                      <div className="flex justify-between items-baseline font-bold">
                        <span className="text-slate-700 dark:text-slate-200">Contractor Locked Price:</span>
                        <span className="text-base text-brand-orange font-black">
                          {formatINR(lockedRate || mat.defaultPrice)} / {mat.unit}
                        </span>
                      </div>
                      {hasDiscount && (
                        <div className="flex justify-between text-[11px] text-emerald-600 font-extrabold pt-1 border-t border-slate-200 dark:border-slate-700">
                          <span>Individual Savings:</span>
                          <span>-{formatINR(discountAmt)} ({discountPct}% OFF)</span>
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-brand-orange" />
                      <span>Applied to: <span className="font-semibold text-slate-700 dark:text-slate-300">Rajesh Sharma (Joyjit Constructions)</span></span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedMaterial(mat.id);
                        setNegotiatedRateInput(String(lockedRate || mat.defaultPrice - 20));
                        setIsRateModalOpen(true);
                      }}
                      leftIcon={<Edit className="w-3.5 h-3.5" />}
                    >
                      Update Locked Rate
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: WAREHOUSE SURPLUS STOCK */}
      {activeTab === 'SURPLUS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-slate-900 text-white border-slate-800 p-5 space-y-1">
              <span className="text-xs font-bold uppercase text-slate-400">Total Warehouse Surplus</span>
              <p className="text-2xl font-black text-brand-orange">4 Items Available</p>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 space-y-1">
              <span className="text-xs font-bold uppercase text-slate-500">Warehouse Yard</span>
              <p className="text-2xl font-black text-emerald-600">Dankuni Staging Yard</p>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 space-y-1">
              <span className="text-xs font-bold uppercase text-slate-500">Fleet Dispatch</span>
              <p className="text-2xl font-black text-blue-600">Ready for Delivery</p>
            </Card>
          </div>
        </div>
      )}

      {/* MODAL: SUPPLIER ACCEPT BUYBACK & SCHEDULE REVERSE LOGISTICS FLEET */}
      <Modal
        isOpen={!!acceptingSurplusOffer}
        onClose={() => setAcceptingSurplusOffer(null)}
        title={`Accept Buyback: ${acceptingSurplusOffer?.materialName || ''}`}
        description="Lock this surplus buyback deal and coordinate returning fleet collection from the builder's job site."
        maxWidth="lg"
      >
        {acceptingSurplusOffer && (
          <form onSubmit={handleConfirmSupplierAcceptBuyback} className="space-y-4 pt-2">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Builder &amp; Company:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {acceptingSurplusOffer.builderName} ({acceptingSurplusOffer.builderCompany})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Job Site Address:</span>
                <span className="font-bold text-slate-900 dark:text-white">{acceptingSurplusOffer.siteLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Surplus Quantity:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {acceptingSurplusOffer.quantity} {acceptingSurplusOffer.unit}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-1 border-t border-slate-200 dark:border-slate-700">
                <span className="font-extrabold text-slate-700 dark:text-slate-200">Total Buyback Payout:</span>
                <span className="text-xl font-black text-brand-orange">{formatINR(acceptingSurplusOffer.totalValuation)}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Scheduled Pickup Window
              </label>
              <Input
                value={pickupDateInput}
                onChange={(e) => setPickupDateInput(e.target.value)}
                placeholder="e.g. Today at 04:00 PM (Returning 10-Ton Fleet)"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Assigned Reverse Logistics Fleet
              </label>
              <select
                value={pickupVehicleInput}
                onChange={(e) => setPickupVehicleInput(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              >
                <option value="10-Ton Flatbed Truck (Returning Fleet)">10-Ton Flatbed Truck (Returning Fleet)</option>
                <option value="5-Ton Tata 407 (Express Van)">5-Ton Tata 407 (Express Van)</option>
                <option value="Tri-Axle Heavy Trailer">Tri-Axle Heavy Trailer</option>
              </select>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
              BuildNexus reverse logistics will dispatch this vehicle when ready. Payout is safely held in escrow until driver confirms receipt at builder site.
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Confirm Buyback Deal &amp; Lock Pickup ({formatINR(acceptingSurplusOffer.totalValuation)})
            </Button>
          </form>
        )}
      </Modal>

      {/* MODAL: SUPPLIER COUNTER BUYBACK RATE */}
      <Modal
        isOpen={!!counteringSurplusOffer}
        onClose={() => setCounteringSurplusOffer(null)}
        title="Propose Counter Buyback Rate"
        description="Propose a revised buyback price to the builder. The builder can review and accept your counter offer."
      >
        {counteringSurplusOffer && (
          <form onSubmit={handleConfirmSupplierCounterBuyback} className="space-y-4 pt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Material:</span>
                <span className="font-bold text-slate-900 dark:text-white">{counteringSurplusOffer.materialName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quantity:</span>
                <span className="font-bold">{counteringSurplusOffer.quantity} {counteringSurplusOffer.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Builder Asking Rate:</span>
                <span className="font-bold text-brand-orange">
                  {formatINR(counteringSurplusOffer.askingPricePerUnit)} / {counteringSurplusOffer.unit}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Your Counter Buyback Rate (₹ / {counteringSurplusOffer.unit})
              </label>
              <Input
                type="number"
                step="any"
                value={counterRateInput}
                onChange={(e) => setCounterRateInput(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Supplier Note to Builder (Terms &amp; Logistics)
              </label>
              <textarea
                value={counterNotesInput}
                onChange={(e) => setCounterNotesInput(e.target.value)}
                placeholder="e.g. Can dispatch our flatbed today at 3:30 PM with instant bank transfer."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                rows={2}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Send Counter Buyback Rate
            </Button>
          </form>
        )}
      </Modal>

      {/* MODAL: BUILDER PUBLISH SURPLUS OFFER */}
      <Modal
        isOpen={isBuilderCreateSurplusModalOpen}
        onClose={() => setIsBuilderCreateSurplusModalOpen(false)}
        title="Sell Extra Material to Suppliers"
        description="Offer surplus factory-sealed or staged materials to verified suppliers for rapid cash buyback."
        maxWidth="lg"
      >
        <form onSubmit={handleBuilderSubmitSurplusOffer} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Material Name
              </label>
              <Input
                value={bldMaterialName}
                onChange={(e) => setBldMaterialName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                value={bldCategory}
                onChange={(e) => setBldCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              >
                <option value="CEMENT">Cement (PPC/OPC)</option>
                <option value="STEEL">TMT Rebar / Steel</option>
                <option value="BRICKS">Bricks &amp; AAC Blocks</option>
                <option value="TILES">Floor / Wall Tiles</option>
                <option value="AGGREGATES">Aggregates &amp; Sand</option>
                <option value="PAINT">Paints &amp; Finishes</option>
                <option value="OTHER">Other Site Supplies</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Surplus Quantity
              </label>
              <Input
                type="number"
                step="any"
                value={bldQuantity}
                onChange={(e) => setBldQuantity(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Unit
              </label>
              <Input
                value={bldUnit}
                onChange={(e) => setBldUnit(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Condition
              </label>
              <select
                value={bldCondition}
                onChange={(e) => setBldCondition(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              >
                <option value="UNOPENED_FACTORY_SEALED">Unopened Factory Sealed</option>
                <option value="EXCELLENT_SITE_STAGED">Excellent Site Staged</option>
                <option value="PARTIAL_LOT">Partial Usable Lot</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Your Asking Buyback Price (₹ / {bldUnit})
              </label>
              <Input
                type="number"
                step="any"
                value={bldAskingPrice}
                onChange={(e) => setBldAskingPrice(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Supplier
              </label>
              <select
                value={bldTargetSupplier}
                onChange={(e) => setBldTargetSupplier(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              >
                <option value="ALL_SUPPLIERS">Broadcast to All Top West Bengal Suppliers</option>
                <option value="sup-1">Lakshmi Building Supplies (Kolkata Hub)</option>
                <option value="sup-2">Bengal TMT &amp; Steel Hub (Durgapur Plant)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Site Pickup Location (Kolkata / West Bengal)
            </label>
            <Input
              value={bldSiteLocation}
              onChange={(e) => setBldSiteLocation(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Clearance Deadline
            </label>
            <Input
              value={bldDeadline}
              onChange={(e) => setBldDeadline(e.target.value)}
              placeholder="e.g. Within 48 Hours"
            />
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 flex justify-between items-center">
            <div>
              <span className="font-extrabold text-sm text-emerald-900 dark:text-emerald-100">
                Total Buyback Valuation:
              </span>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                {bldQuantity} {bldUnit} × ₹{bldAskingPrice}
              </p>
            </div>
            <span className="text-2xl font-black text-brand-orange">
              {formatINR((parseFloat(bldQuantity) || 0) * (parseFloat(bldAskingPrice) || 0))}
            </span>
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Publish Surplus Offer to Suppliers
          </Button>
        </form>
      </Modal>

      {/* MODAL: SUPPLIER NEGOTIATE & CHANGE VALUE FOR BUILDER (OUTBOUND DEMAND) */}
      <Modal
        isOpen={!!activeNegotiationInquiry}
        onClose={() => setActiveNegotiationInquiry(null)}
        title={`Negotiate with ${activeNegotiationInquiry?.builderName}`}
        description="Change the value for this specific builder. Once updated, the builder's cart and checkout will immediately reflect this changed rate."
      >
        {activeNegotiationInquiry && (
          <form onSubmit={handleSupplierSubmitNegotiation} className="space-y-4 pt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Material:</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeNegotiationInquiry.materialName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Requested Volume:</span>
                <span className="font-bold">{activeNegotiationInquiry.quantityRequested} {activeNegotiationInquiry.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Standard Catalog Rate:</span>
                <span className="line-through">{formatINR(activeNegotiationInquiry.standardPrice)} / {activeNegotiationInquiry.unit}</span>
              </div>
              <div className="flex justify-between text-brand-orange font-bold">
                <span>Builder Proposed Target:</span>
                <span>{formatINR(activeNegotiationInquiry.builderProposedPrice)} / {activeNegotiationInquiry.unit}</span>
              </div>
            </div>

            <Input
              label={`Your Negotiated Changed Value (₹ / ${activeNegotiationInquiry.unit})`}
              type="number"
              step="any"
              value={changedPriceInput}
              onChange={(e) => setChangedPriceInput(e.target.value)}
              required
              helperText="This rate will be locked for this builder and reflected in their cart with full strike-through savings."
            />

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Terms / Note to Builder
              </label>
              <textarea
                value={supplierNoteInput}
                onChange={(e) => setSupplierNoteInput(e.target.value)}
                placeholder="e.g. Special rate locked for single truckload dispatch from Dankuni Central Warehouse Hub."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                rows={3}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Apply Changed Value &amp; Send to Builder Cart
            </Button>
          </form>
        )}
      </Modal>

      {/* MODAL: LOCK CONTRACTOR-SPECIFIC RATE */}
      <Modal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        title="Lock Individual Negotiated Rate"
        description="Set a private rate for a specific contractor. Only this contractor will see this rate in their cart and checkout."
      >
        <form onSubmit={handleSaveContractorRate} className="space-y-4 pt-2">
          <Select
            label="Select Contractor"
            value={selectedContractor}
            onChange={(e) => setSelectedContractor(e.target.value)}
            options={contractorsList.map((c) => ({
              value: c.id,
              label: `${c.name} (${c.city})`,
            }))}
          />

          <Select
            label="Select Material"
            value={selectedMaterial}
            onChange={(e) => {
              setSelectedMaterial(e.target.value);
              const found = catalogMaterials.find((m) => m.id === e.target.value);
              if (found) setNegotiatedRateInput(String(found.defaultPrice - 20));
            }}
            options={catalogMaterials.map((m) => ({
              value: m.id,
              label: `${m.name} (Std: ${formatINR(m.defaultPrice)}/${m.unit})`,
            }))}
          />

          <Input
            label="Negotiated Locked Rate (₹)"
            type="number"
            value={negotiatedRateInput}
            onChange={(e) => setNegotiatedRateInput(e.target.value)}
            required
            helperText="This rate will be locked for the chosen contractor's cart and live checkout calculations."
          />

          <Button type="submit" variant="primary" className="w-full">
            Confirm &amp; Lock Rate for Contractor
          </Button>
        </form>
      </Modal>

      {/* CREATE WAREHOUSE SURPLUS LISTING MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="List Leftover / Warehouse Stock"
        description="List surplus construction stock. BuildNexus Central Warehouse verifies condition upon dispatch."
      >
        <form onSubmit={handleCreateListing} className="space-y-4 pt-2">
          <Input
            label="Material Name & Grade"
            placeholder="e.g. Leftover JSW TMT 10mm Cut Pieces"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'steel', label: 'Steel & TMT' },
                { value: 'cement', label: 'Cement' },
                { value: 'bricks', label: 'Bricks & Blocks' },
                { value: 'tiles', label: 'Tiles & Flooring' },
                { value: 'paint', label: 'Paints & Finishes' },
              ]}
            />

            <Select
              label="Material Condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              options={[
                { value: 'SURPLUS', label: 'Surplus Unused' },
                { value: 'NEW', label: 'Brand New Sealed' },
                { value: 'USED', label: 'Slightly Used / Cut' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Asking Price / Unit (₹)"
              placeholder="e.g. 48"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              required
            />

            <Input
              label="Quantity Available"
              placeholder="e.g. 350"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              type="number"
              required
            />
          </div>

          <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
            Publish Surplus Listing
          </Button>
        </form>
      </Modal>
    </div>
  );
}
