'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore, SiteStockItem, BuilderSurplusSellOffer } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatINR } from '@/lib/utils';
import { triggerConfetti } from '@/lib/confetti';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  RefreshCw,
  ShoppingCart,
  Calendar,
  Clock,
  Building2,
  ArrowRight,
  Flame,
  Plus,
  Minus,
  Sparkles,
  Info,
  ShieldCheck,
  DollarSign,
  Truck,
  Layers,
  MapPin,
  Check,
  X,
  PhoneCall,
} from 'lucide-react';

export default function SiteStockPage() {
  const {
    siteMaterialsStock,
    logSiteMaterialConsumption,
    updateSiteMaterialStock,
    builderSurplusSellOffers,
    addBuilderSurplusSellOffer,
    builderAcceptSupplierCounter,
    builderDeclineSupplierOffer,
    addToCart,
    setCartDrawerOpen,
    addToast,
    user,
  } = useAppStore();

  const [activeMainTab, setActiveMainTab] = useState<'MONITOR' | 'SURPLUS_OFFERS'>('MONITOR');

  const [selectedStockItem, setSelectedStockItem] = useState<SiteStockItem | null>(null);
  const [consumptionAmount, setConsumptionAmount] = useState('10');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Edit burn rate modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCurrentStock, setEditCurrentStock] = useState('42');
  const [editBurnRate, setEditBurnRate] = useState('15');

  // Sell Extra / Surplus Modal
  const [isSellSurplusModalOpen, setIsSellSurplusModalOpen] = useState(false);
  const [surplusMaterialName, setSurplusMaterialName] = useState('');
  const [surplusCategory, setSurplusCategory] = useState<'CEMENT' | 'STEEL' | 'BRICKS' | 'TILES' | 'PAINT' | 'AGGREGATES' | 'OTHER'>('CEMENT');
  const [surplusQuantity, setSurplusQuantity] = useState('25');
  const [surplusUnit, setSurplusUnit] = useState('bags');
  const [surplusCondition, setSurplusCondition] = useState<'UNOPENED_FACTORY_SEALED' | 'EXCELLENT_SITE_STAGED' | 'PARTIAL_LOT'>('UNOPENED_FACTORY_SEALED');
  const [surplusOriginalPrice, setSurplusOriginalPrice] = useState('380');
  const [surplusAskingPrice, setSurplusAskingPrice] = useState('325');
  const [surplusTargetSupplier, setSurplusTargetSupplier] = useState('ALL_SUPPLIERS');
  const [surplusSiteLocation, setSurplusSiteLocation] = useState('Plot 42, Action Area II, New Town, Kolkata');
  const [surplusDeadline, setSurplusDeadline] = useState('Within 48 Hours (Excavation starting)');
  const [surplusNotes, setSurplusNotes] = useState('Slab casting completed. Extra unopened bags stored safely on covered pallets.');
  const [surplusImage, setSurplusImage] = useState('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80');

  const mySurplusOffers = builderSurplusSellOffers.filter(
    (o) => o.builderId === (user?.id || 'user-contractor-1') || o.builderName.toLowerCase().includes('rajesh')
  );

  const handleOpenLogModal = (item: SiteStockItem) => {
    setSelectedStockItem(item);
    setConsumptionAmount(String(Math.round(item.dailyBurnRate)));
    setIsLogModalOpen(true);
  };

  const handleOpenEditModal = (item: SiteStockItem) => {
    setSelectedStockItem(item);
    setEditCurrentStock(String(item.currentStock));
    setEditBurnRate(String(item.dailyBurnRate));
    setIsEditModalOpen(true);
  };

  const handleOpenSellExtraModal = (item: SiteStockItem) => {
    setSelectedStockItem(item);
    setSurplusMaterialName(item.name);
    setSurplusUnit(item.unit);
    setSurplusImage(item.image);
    setSurplusOriginalPrice(String(item.price));
    // Default asking price to ~15% discount for rapid liquidation
    const discounted = Math.round(item.price * 0.85);
    setSurplusAskingPrice(String(discounted));
    // Default quantity to ~30-50% of available stock
    const defaultQty = Math.max(5, Math.round(item.currentStock * 0.4));
    setSurplusQuantity(String(defaultQty));

    // Guess category
    const lower = item.name.toLowerCase();
    if (lower.includes('cement')) setSurplusCategory('CEMENT');
    else if (lower.includes('rebar') || lower.includes('tmt') || lower.includes('steel')) setSurplusCategory('STEEL');
    else if (lower.includes('brick') || lower.includes('block')) setSurplusCategory('BRICKS');
    else if (lower.includes('tile')) setSurplusCategory('TILES');
    else if (lower.includes('aggregate') || lower.includes('sand')) setSurplusCategory('AGGREGATES');
    else setSurplusCategory('OTHER');

    setIsSellSurplusModalOpen(true);
  };

  const handleConfirmConsumption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockItem) return;
    const amount = parseFloat(consumptionAmount) || 0;
    logSiteMaterialConsumption(selectedStockItem.id, amount);
    addToast({
      title: 'Site Consumption Recorded',
      message: `Deducted ${amount} ${selectedStockItem.unit} of ${selectedStockItem.name}.`,
      type: 'success',
    });
    setIsLogModalOpen(false);
  };

  const handleConfirmEditStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockItem) return;
    const stock = parseFloat(editCurrentStock) || 0;
    const burn = parseFloat(editBurnRate) || 1;
    updateSiteMaterialStock(selectedStockItem.id, stock, burn);
    addToast({
      title: 'Stock Parameters Updated',
      message: `Updated stock to ${stock} ${selectedStockItem.unit} with ${burn}/day burn rate.`,
      type: 'success',
    });
    setIsEditModalOpen(false);
  };

  const handleQuickReorder = (item: SiteStockItem) => {
    const reorderQuantity = Math.max(
      10,
      Math.round(item.dailyBurnRate * 7) // 7-day replenishment batch
    );

    addToCart({
      materialId: item.materialId,
      name: item.name,
      price: item.price,
      negotiatedPrice: item.negotiatedPrice,
      unit: item.unit,
      quantity: reorderQuantity,
      supplierId: 'sup-1',
      supplierName: item.supplierName,
      image: item.image,
    });

    addToast({
      title: 'Replenishment Batch Added to Cart',
      message: `${reorderQuantity} ${item.unit} added at your locked negotiated rate.`,
      type: 'success',
    });
    setCartDrawerOpen(true);
  };

  const handleSubmitSurplusSellOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(surplusQuantity);
    const askPrice = parseFloat(surplusAskingPrice);
    const origPrice = parseFloat(surplusOriginalPrice);

    if (isNaN(qty) || qty <= 0 || isNaN(askPrice) || askPrice <= 0) {
      addToast({ title: 'Invalid Numbers', message: 'Enter a valid quantity and asking price', type: 'error' });
      return;
    }

    const targetSupplierName =
      surplusTargetSupplier === 'ALL_SUPPLIERS'
        ? 'All Verified West Bengal Suppliers'
        : surplusTargetSupplier === 'sup-1'
        ? 'Lakshmi Building Supplies (Kolkata Hub)'
        : 'Bengal TMT & Steel Hub';

    addBuilderSurplusSellOffer({
      builderId: user?.id || 'user-contractor-1',
      builderName: user?.name || 'Rajesh Sharma',
      builderCompany: 'Joyjit Constructions (New Town)',
      builderPhone: user?.mobile || '+91 98765 43210',
      siteLocation: surplusSiteLocation,
      materialId: selectedStockItem?.materialId || 'mat-custom',
      materialName: surplusMaterialName,
      category: surplusCategory,
      quantity: qty,
      unit: surplusUnit,
      condition: surplusCondition,
      originalPurchasePrice: origPrice || askPrice * 1.15,
      askingPricePerUnit: askPrice,
      marketRetailPrice: origPrice || askPrice * 1.15,
      targetSupplierId: surplusTargetSupplier,
      targetSupplierName,
      siteClearanceDeadline: surplusDeadline,
      materialImage: surplusImage,
      notes: surplusNotes,
    });

    triggerConfetti();
    addToast({
      title: 'Surplus Material Offer Published!',
      message: `Offered ${qty} ${surplusUnit} of ${surplusMaterialName} to suppliers. You will be notified when suppliers accept or propose buyback rates.`,
      type: 'success',
    });

    setIsSellSurplusModalOpen(false);
    setActiveMainTab('SURPLUS_OFFERS');
  };

  const handleAcceptCounterFromSupplier = (offerId: string) => {
    builderAcceptSupplierCounter(offerId);
    triggerConfetti();
    addToast({
      title: 'Supplier Counter-Offer Accepted!',
      message: 'Deal locked! Reverse logistics fleet dispatch will be coordinated by the supplier.',
      type: 'success',
    });
  };

  const handleDeclineCounterFromSupplier = (offerId: string) => {
    builderDeclineSupplierOffer(offerId);
    addToast({
      title: 'Counter-Offer Declined',
      message: 'The offer has been returned to open marketplace.',
      type: 'info',
    });
  };

  return (
    <div className="space-y-8 py-4 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-navy rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="orange" className="bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Flame className="w-3.5 h-3.5 mr-1" /> Site Stock &amp; Buyback Liquidation
              </Badge>
              <span className="text-xs text-slate-400 font-mono">West Bengal Construction Sites</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              Site Material Stock &amp; Surplus Sales
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Track site consumption burn rates before materials run out — or <strong className="text-white underline">sell your extra leftover materials directly to verified suppliers</strong> for instant buyback and reverse-logistics collection!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-2 shrink-0">
            <Button
              size="sm"
              variant="primary"
              className="text-xs shadow-glow"
              onClick={() => {
                const first = siteMaterialsStock[0];
                if (first) handleOpenSellExtraModal(first);
              }}
            >
              <DollarSign className="w-4 h-4 mr-1.5" /> Sell Extra Materials to Supplier
            </Button>
            <Link href="/sell">
              <Button size="sm" variant="outline" className="text-xs border-slate-600 text-white hover:bg-slate-800 w-full">
                <Layers className="w-4 h-4 mr-1.5" /> Supplier Liquidation Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveMainTab('MONITOR')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeMainTab === 'MONITOR'
              ? 'bg-brand-orange text-white shadow-glow'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" /> Site Stock Depletion &amp; Burn Tracker ({siteMaterialsStock.length})
        </button>
        <button
          onClick={() => setActiveMainTab('SURPLUS_OFFERS')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeMainTab === 'SURPLUS_OFFERS'
              ? 'bg-brand-orange text-white shadow-glow'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" /> My Extra Material Sell Offers to Suppliers ({mySurplusOffers.length})
        </button>
      </div>

      {/* TAB 1: SITE STOCK DEPLETION & BURN TRACKER */}
      {activeMainTab === 'MONITOR' && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Tracked Materials on Site</span>
                <Package className="w-4 h-4 text-brand-orange" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {siteMaterialsStock.length} Items
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Live site telemetry synced</p>
            </Card>

            <Card className="p-4 bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">Critical Stock Warning</span>
                <AlertTriangle className="w-4 h-4 text-brand-orange" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {
                  siteMaterialsStock.filter(
                    (item) => item.currentStock / item.dailyBurnRate <= 3
                  ).length
                }{' '}
                Materials
              </p>
              <p className="text-[11px] text-orange-700 dark:text-orange-300 mt-0.5">
                Will finish completely within 72 hours
              </p>
            </Card>

            <Card className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Supplier Buyback Active</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                {mySurplusOffers.length} Extra Lots
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                Liquidating surplus stock to verified suppliers
              </p>
            </Card>
          </div>

          {/* Main Stock Depletion List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-orange" /> Job Site Stock Status &amp; Time to Finish
              </h2>
              <span className="text-xs text-slate-500">Auto-calculated daily consumption</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {siteMaterialsStock.map((item) => {
                const daysRemaining = item.dailyBurnRate > 0 ? item.currentStock / item.dailyBurnRate : 999;
                const isCritical = daysRemaining <= 3;
                const isLow = daysRemaining > 3 && daysRemaining <= 7;
                const stockPercentage = Math.min(100, Math.round((item.currentStock / item.totalAllocated) * 100));

                return (
                  <Card
                    key={item.id}
                    className={`p-5 transition-all border-2 ${
                      isCritical
                        ? 'border-orange-500/50 bg-orange-50/20 dark:bg-orange-950/20'
                        : isLow
                        ? 'border-amber-400/50 bg-amber-50/10 dark:bg-amber-950/10'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      {/* Left: Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm"
                        />
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                              {item.name}
                            </h3>
                            {isCritical && (
                              <Badge variant="danger" size="sm" className="animate-pulse">
                                Finishing in {daysRemaining.toFixed(1)} Days
                              </Badge>
                            )}
                            {isLow && (
                              <Badge variant="warning" size="sm">
                                Finishes in {daysRemaining.toFixed(1)} Days
                              </Badge>
                            )}
                            {!isCritical && !isLow && (
                              <Badge variant="success" size="sm">
                                Safe Supply ({daysRemaining.toFixed(0)} Days Left)
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                            <span>
                              Supplier: <strong className="text-slate-800 dark:text-slate-200">{item.supplierName}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Burn Rate:{' '}
                              <strong className="text-brand-orange font-bold">
                                {item.dailyBurnRate} {item.unit} / day
                              </strong>
                            </span>
                            <span>•</span>
                            <span>Last Logged: {item.lastUpdated}</span>
                          </div>

                          {/* Progress bar */}
                          <div className="space-y-1 pt-1 max-w-md">
                            <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                              <span>Physical Count: {item.currentStock} {item.unit} remaining</span>
                              <span>{stockPercentage}% of Total {item.totalAllocated} {item.unit}</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isCritical
                                    ? 'bg-rose-500'
                                    : isLow
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${stockPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quick Actions */}
                      <div className="flex sm:flex-row lg:flex-col gap-2 shrink-0 w-full lg:w-auto">
                        <Button
                          size="sm"
                          variant="primary"
                          className="text-xs whitespace-nowrap shadow-sm"
                          onClick={() => handleQuickReorder(item)}
                        >
                          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                          Reorder Now ({formatINR(item.negotiatedPrice || item.price)})
                        </Button>

                        <div className="flex gap-2 w-full">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs flex-1 border-slate-300 dark:border-slate-700"
                            onClick={() => handleOpenLogModal(item)}
                          >
                            <TrendingDown className="w-3.5 h-3.5 mr-1 text-brand-orange" /> Log Usage
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs flex-1 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                            onClick={() => handleOpenSellExtraModal(item)}
                          >
                            <DollarSign className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Sell Extra
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY EXTRA MATERIAL SELL OFFERS TO SUPPLIERS */}
      {activeMainTab === 'SURPLUS_OFFERS' && (
        <div className="space-y-6">
          {/* Explanation Banner */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800 flex items-start gap-3.5 shadow-sm">
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-md shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs text-emerald-950 dark:text-emerald-200">
              <h4 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                Builder Surplus Liquidation &amp; Buyback Guarantee
                <Badge variant="verified">Live Supplier Network</Badge>
              </h4>
              <p className="leading-relaxed">
                When you have leftover factory-sealed or clean site-staged materials after finishing a slab or masonry phase, you can list them here. <span className="font-bold underline">Verified West Bengal suppliers buy back these extra materials at wholesale rates</span> and dispatch reverse-logistics trucks directly to your construction site!
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Active Surplus Sell Offers ({mySurplusOffers.length})
            </h3>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                const first = siteMaterialsStock[0];
                if (first) handleOpenSellExtraModal(first);
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Offer More Surplus to Suppliers
            </Button>
          </div>

          <div className="space-y-4">
            {mySurplusOffers.map((offer) => {
              const isAccepted = offer.status === 'DEAL_ACCEPTED';
              const isCounter = offer.status === 'COUNTER_PROPOSED_BY_SUPPLIER';
              const isDispatched = offer.status === 'PICKUP_DISPATCHED';
              const isCompleted = offer.status === 'COMPLETED';

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
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <img
                        src={offer.materialImage}
                        alt={offer.materialName}
                        className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                            {offer.materialName}
                          </h4>
                          <Badge variant="orange">{offer.category}</Badge>
                          <Badge variant="neutral">
                            {offer.condition === 'UNOPENED_FACTORY_SEALED'
                              ? 'Factory Sealed'
                              : 'Excellent Staged'}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                          Pickup Site: <span className="font-semibold text-slate-700 dark:text-slate-300">{offer.siteLocation}</span>
                        </p>
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
                          Supplier Counter Rate Proposed
                        </Badge>
                      )}
                      {isDispatched && (
                        <Badge variant="verified">
                          <Truck className="w-3.5 h-3.5" /> Pickup Truck Dispatched
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge variant="success">
                          <Check className="w-3.5 h-3.5" /> Buyback Complete &amp; Paid
                        </Badge>
                      )}
                      {offer.status === 'OPEN_TO_SUPPLIERS' && (
                        <Badge variant="orange" className="animate-pulse">
                          Open to Suppliers
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
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Your Asking Rate</span>
                      <p className="font-extrabold text-brand-orange text-sm">
                        {formatINR(offer.askingPricePerUnit)} / {offer.unit}
                        <span className="text-[10px] text-slate-400 font-normal"> (Orig: {formatINR(offer.originalPurchasePrice)})</span>
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Total Valuation</span>
                      <p className="font-black text-slate-900 dark:text-white text-sm">
                        {formatINR(offer.totalValuation)}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Target Supplier</span>
                      <p className="font-bold text-slate-700 dark:text-slate-300 line-clamp-1">
                        {offer.targetSupplierName}
                      </p>
                    </div>
                  </div>

                  {/* Supplier Counter Proposal Box */}
                  {isCounter && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border-2 border-blue-200 dark:border-blue-800 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-black uppercase text-blue-900 dark:text-blue-200">
                            Supplier Counter-Offer from {offer.counterSupplierName}:
                          </span>
                          <p className="text-sm font-black text-blue-800 dark:text-blue-100 mt-0.5">
                            Counter Rate: {formatINR(offer.counterPricePerUnit || 0)} / {offer.unit}{' '}
                            <span className="text-xs font-normal">
                              (Total Payout: {formatINR((offer.counterPricePerUnit || 0) * offer.quantity)})
                            </span>
                          </p>
                          {offer.counterNotes && (
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 italic">
                              &ldquo;{offer.counterNotes}&rdquo;
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleAcceptCounterFromSupplier(offer.id)}
                            leftIcon={<Check className="w-4 h-4" />}
                          >
                            Accept Counter Rate
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeclineCounterFromSupplier(offer.id)}
                            leftIcon={<X className="w-4 h-4" />}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scheduled Pickup Banner if deal locked */}
                  {(isAccepted || isDispatched || isCompleted) && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          Reverse Logistics Pickup: <strong className="font-bold">{offer.pickupScheduledDate || 'Scheduled within 24 Hours'}</strong>
                        </span>
                      </div>
                      <Badge variant="verified" size="sm">
                        Payout Escrow Guaranteed
                      </Badge>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: LOG USAGE */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title={`Log Site Consumption: ${selectedStockItem?.name || ''}`}
        description="Deduct materials used at the job site today to keep your stock depletion prediction accurate."
      >
        {selectedStockItem && (
          <form onSubmit={handleConfirmConsumption} className="space-y-4 pt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl flex justify-between text-xs">
              <span className="text-slate-500">Current Stock on Site:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {selectedStockItem.currentStock} {selectedStockItem.unit}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Quantity Consumed Today ({selectedStockItem.unit})
              </label>
              <Input
                type="number"
                step="any"
                value={consumptionAmount}
                onChange={(e) => setConsumptionAmount(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Confirm &amp; Deduct Stock
            </Button>
          </form>
        )}
      </Modal>

      {/* MODAL 2: EDIT STOCK */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Stock Parameters: ${selectedStockItem?.name || ''}`}
        description="Manually calibrate current physical count or expected daily burn rate."
      >
        {selectedStockItem && (
          <form onSubmit={handleConfirmEditStock} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Current Count on Site ({selectedStockItem.unit})
              </label>
              <Input
                type="number"
                step="any"
                value={editCurrentStock}
                onChange={(e) => setEditCurrentStock(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Daily Consumption Rate ({selectedStockItem.unit} / day)
              </label>
              <Input
                type="number"
                step="any"
                value={editBurnRate}
                onChange={(e) => setEditBurnRate(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Save Parameters
            </Button>
          </form>
        )}
      </Modal>

      {/* MODAL 3: SELL EXTRA / SURPLUS MATERIALS TO SUPPLIER */}
      <Modal
        isOpen={isSellSurplusModalOpen}
        onClose={() => setIsSellSurplusModalOpen(false)}
        title="Sell Extra Material to Suppliers (Surplus Buyback)"
        description="Offer leftover site material directly to verified suppliers. Suppliers pick up with reverse-logistics fleet."
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitSurplusSellOffer} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Material Name
              </label>
              <Input
                value={surplusMaterialName}
                onChange={(e) => setSurplusMaterialName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                value={surplusCategory}
                onChange={(e) => setSurplusCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              >
                <option value="CEMENT">Cement (PPC/OPC)</option>
                <option value="STEEL">TMT Rebar / Steel</option>
                <option value="BRICKS">Bricks &amp; AAC Blocks</option>
                <option value="TILES">Floor / Wall Tiles</option>
                <option value="AGGREGATES">Aggregates &amp; Sand</option>
                <option value="PAINT">Paints &amp; Primers</option>
                <option value="OTHER">Other Site Supplies</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Surplus Quantity to Sell
              </label>
              <Input
                type="number"
                step="any"
                value={surplusQuantity}
                onChange={(e) => setSurplusQuantity(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Unit
              </label>
              <Input
                value={surplusUnit}
                onChange={(e) => setSurplusUnit(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Condition
              </label>
              <select
                value={surplusCondition}
                onChange={(e) => setSurplusCondition(e.target.value as any)}
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
                Your Asking Buyback Price (₹ / {surplusUnit})
              </label>
              <Input
                type="number"
                step="any"
                value={surplusAskingPrice}
                onChange={(e) => setSurplusAskingPrice(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Supplier
              </label>
              <select
                value={surplusTargetSupplier}
                onChange={(e) => setSurplusTargetSupplier(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              >
                <option value="ALL_SUPPLIERS">Broadcast to All Top West Bengal Suppliers</option>
                <option value="sup-1">Lakshmi Building Supplies (Kolkata Hub)</option>
                <option value="sup-2">Bengal TMT &amp; Steel Hub (Durgapur Plant)</option>
                <option value="sup-3">Hooghly River Sand &amp; Aggregates</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Site Pickup Location (Kolkata / West Bengal)
            </label>
            <Input
              value={surplusSiteLocation}
              onChange={(e) => setSurplusSiteLocation(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Site Clearance Deadline
            </label>
            <Input
              value={surplusDeadline}
              onChange={(e) => setSurplusDeadline(e.target.value)}
              placeholder="e.g. Within 48 Hours"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Notes for Supplier Reverse Logistics
            </label>
            <textarea
              value={surplusNotes}
              onChange={(e) => setSurplusNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              rows={2}
            />
          </div>

          {/* Live Valuation Box */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 flex justify-between items-center">
            <div>
              <span className="font-extrabold text-sm text-emerald-900 dark:text-emerald-100">
                Total Buyback Valuation:
              </span>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                {surplusQuantity} {surplusUnit} × ₹{surplusAskingPrice}
              </p>
            </div>
            <span className="text-2xl font-black text-brand-orange">
              {formatINR((parseFloat(surplusQuantity) || 0) * (parseFloat(surplusAskingPrice) || 0))}
            </span>
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Publish Surplus Offer to Suppliers
          </Button>
        </form>
      </Modal>
    </div>
  );
}
