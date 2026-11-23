'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppStore, SupplierMaterialShowcaseItem } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { Modal } from '@/components/ui/Modal';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatINR } from '@/lib/utils';
import { triggerConfetti } from '@/lib/confetti';
import {
  Search,
  Filter,
  ShoppingCart,
  MessageSquare,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  ShieldCheck,
  Building2,
  ArrowUpDown,
  X,
  Upload,
  Plus,
  Zap,
  Calculator,
  TrendingUp,
  Tag,
  DollarSign,
  Package,
  Clock,
  MapPin,
  Edit,
  Eye,
  EyeOff,
  Layers,
  Truck,
  Check,
} from 'lucide-react';

interface MaterialItem {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  rating: number;
  deliveryEtaDays: number;
  image: string;
  brand: string;
  city: string;
  isVerifiedSupplier: boolean;
  isContractorListing: boolean;
  condition?: string;
  isBoosted: boolean;
  supplier: {
    id: string;
    name: string;
    rating: number;
    city: string;
    isVerified: boolean;
  };
}

export default function MarketplacePage() {
  const {
    user,
    activeRole,
    addToCart,
    addToast,
    supplierShowcaseMaterials,
    updateSupplierMaterialRate,
    updateSupplierMaterialStock,
    addSupplierShowcaseMaterial,
    toggleSupplierMaterialVisibility,
  } = useAppStore();

  const isSupplier = activeRole === 'SUPPLIER';

  // ==========================================
  // SUPPLIER SHOWCASE STATE (WHEN ROLE === SUPPLIER)
  // ==========================================
  const [selectedShowcaseCategory, setSelectedShowcaseCategory] = useState('ALL');
  const [showcaseSearchQuery, setShowcaseSearchQuery] = useState('');

  // Edit Rate Modal State
  const [editingRateMaterial, setEditingRateMaterial] = useState<SupplierMaterialShowcaseItem | null>(null);
  const [editBaseRateInput, setEditBaseRateInput] = useState('');
  const [editTier1MinQtyInput, setEditTier1MinQtyInput] = useState('100');
  const [editTier1RateInput, setEditTier1RateInput] = useState('');
  const [editTier2MinQtyInput, setEditTier2MinQtyInput] = useState('500');
  const [editTier2RateInput, setEditTier2RateInput] = useState('');

  // Edit Stock Modal State
  const [editingStockMaterial, setEditingStockMaterial] = useState<SupplierMaterialShowcaseItem | null>(null);
  const [editStockCountInput, setEditStockCountInput] = useState('');
  const [editStockStatusInput, setEditStockStatusInput] = useState<'HIGH' | 'STABLE' | 'LIMITED'>('HIGH');

  // Add Material Modal State
  const [isAddShowcaseModalOpen, setIsAddShowcaseModalOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addBrand, setAddBrand] = useState('UltraTech');
  const [addCategory, setAddCategory] = useState('Cement');
  const [addUnit, setAddUnit] = useState('bag');
  const [addBaseRate, setAddBaseRate] = useState('380');
  const [addMarketMrp, setAddMarketMrp] = useState('410');
  const [addStockCount, setAddStockCount] = useState('1000');
  const [addStockStatus, setAddStockStatus] = useState<'HIGH' | 'STABLE' | 'LIMITED'>('HIGH');
  const [addHubLocation, setAddHubLocation] = useState('Dankuni Central Staging Yard & Hooghly Belt');
  const [addDeliveryTime, setAddDeliveryTime] = useState('< 3.5 hrs Express Dispatch');
  const [addSpecs, setAddSpecs] = useState('IS Certified, Grade 53 equivalent, moisture-proof packing.');
  const [addImage, setAddImage] = useState('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80');

  // ==========================================
  // CONTRACTOR / CUSTOMER MARKETPLACE STATE
  // ==========================================
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortOption, setSortOption] = useState('boosted');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [comparingMaterial, setComparingMaterial] = useState<MaterialItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'cement', label: 'Cement' },
    { id: 'steel', label: 'Steel & TMT' },
    { id: 'bricks', label: 'Bricks & Blocks' },
    { id: 'sand', label: 'M-Sand & Sand' },
    { id: 'aggregates', label: 'Aggregates & Jelly' },
    { id: 'tiles', label: 'Tiles & Flooring' },
    { id: 'paint', label: 'Paints & Finishes' },
    { id: 'plumbing', label: 'Plumbing & Pipes' },
    { id: 'electrical', label: 'Electrical Wiring' },
  ];

  const fetchMaterials = async () => {
    if (isSupplier) return;
    setIsLoading(true);
    try {
      let url = `/api/materials?category=${selectedCategory}&search=${searchQuery}`;
      if (sortOption === 'price_asc') url += '&sort=price_asc';
      if (sortOption === 'price_desc') url += '&sort=price_desc';
      if (sortOption === 'rating') url += '&sort=rating';

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setMaterials(data.materials);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isSupplier) {
      fetchMaterials();
    }
  }, [selectedCategory, searchQuery, sortOption, isSupplier]);

  const filteredMaterials = materials.filter((m) => {
    if (inStockOnly && m.stock <= 0) return false;
    if (priceMin && m.price < parseFloat(priceMin)) return false;
    if (priceMax && m.price > parseFloat(priceMax)) return false;
    return true;
  });

  // Supplier Showcase Filter
  const filteredShowcaseMaterials = supplierShowcaseMaterials.filter((item) => {
    const matchesCategory =
      selectedShowcaseCategory === 'ALL' ||
      item.category.toLowerCase().includes(selectedShowcaseCategory.toLowerCase()) ||
      selectedShowcaseCategory.toLowerCase().includes(item.category.toLowerCase());
    const matchesSearch =
      item.name.toLowerCase().includes(showcaseSearchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(showcaseSearchQuery.toLowerCase()) ||
      item.specifications.toLowerCase().includes(showcaseSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handler: Edit Rate
  const handleOpenEditRateModal = (item: SupplierMaterialShowcaseItem) => {
    setEditingRateMaterial(item);
    setEditBaseRateInput(String(item.baseRate));
    setEditTier1MinQtyInput(String(item.tier1MinQty || 100));
    setEditTier1RateInput(String(item.tier1Rate || Math.round(item.baseRate * 0.97)));
    setEditTier2MinQtyInput(String(item.tier2MinQty || 500));
    setEditTier2RateInput(String(item.tier2Rate || Math.round(item.baseRate * 0.94)));
  };

  const handleSaveEditRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRateMaterial) return;
    const base = parseFloat(editBaseRateInput);
    const t1Rate = parseFloat(editTier1RateInput);
    const t1Qty = parseInt(editTier1MinQtyInput, 10);
    const t2Rate = parseFloat(editTier2RateInput);
    const t2Qty = parseInt(editTier2MinQtyInput, 10);

    if (isNaN(base) || base <= 0) {
      addToast({ title: 'Invalid Rate', message: 'Enter a valid base price', type: 'error' });
      return;
    }

    updateSupplierMaterialRate(editingRateMaterial.id, base, {
      tier1MinQty: isNaN(t1Qty) ? undefined : t1Qty,
      tier1Rate: isNaN(t1Rate) ? undefined : t1Rate,
      tier2MinQty: isNaN(t2Qty) ? undefined : t2Qty,
      tier2Rate: isNaN(t2Rate) ? undefined : t2Rate,
    });

    triggerConfetti();
    addToast({
      title: 'Live Rate Updated!',
      message: `Updated rate of ${editingRateMaterial.name} to ${formatINR(base)}/${editingRateMaterial.unit}. All builders and contractors now see this live rate!`,
      type: 'success',
    });

    setEditingRateMaterial(null);
  };

  // Handler: Edit Stock
  const handleOpenEditStockModal = (item: SupplierMaterialShowcaseItem) => {
    setEditingStockMaterial(item);
    setEditStockCountInput(String(item.stockCount));
    setEditStockStatusInput(item.stockStatus);
  };

  const handleSaveEditStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStockMaterial) return;
    const count = parseInt(editStockCountInput, 10);
    if (isNaN(count) || count < 0) {
      addToast({ title: 'Invalid Stock', message: 'Enter a valid stock number', type: 'error' });
      return;
    }

    updateSupplierMaterialStock(editingStockMaterial.id, count, editStockStatusInput);
    addToast({
      title: 'Warehouse Stock Calibrated',
      message: `Updated available stock count to ${count.toLocaleString()} ${editingStockMaterial.unit}.`,
      type: 'success',
    });

    setEditingStockMaterial(null);
  };

  // Handler: Add New Material
  const handleSaveAddShowcase = (e: React.FormEvent) => {
    e.preventDefault();
    const base = parseFloat(addBaseRate);
    const mrp = parseFloat(addMarketMrp);
    const stock = parseInt(addStockCount, 10);

    if (isNaN(base) || base <= 0) {
      addToast({ title: 'Invalid Rate', message: 'Enter a valid selling rate', type: 'error' });
      return;
    }

    addSupplierShowcaseMaterial({
      name: addName,
      brand: addBrand,
      category: addCategory,
      unit: addUnit,
      baseRate: base,
      marketMrp: isNaN(mrp) ? base * 1.08 : mrp,
      stockCount: isNaN(stock) ? 500 : stock,
      stockStatus: addStockStatus,
      hubLocation: addHubLocation,
      deliveryTime: addDeliveryTime,
      specifications: addSpecs,
      image: addImage,
      isPublished: true,
      tier1MinQty: 100,
      tier1Rate: Math.round(base * 0.97),
      tier2MinQty: 500,
      tier2Rate: Math.round(base * 0.94),
    });

    triggerConfetti();
    addToast({
      title: 'Material Added to Live Showcase!',
      message: `Published ${addName} at ${formatINR(base)}/${addUnit}. Ready for builder procurement.`,
      type: 'success',
    });

    setIsAddShowcaseModalOpen(false);
  };

  // =========================================================================
  // RENDER 1: SUPPLIER MATERIAL SHOWCASE & LIVE RATE CARD WINDOW (SUPPLIER ONLY)
  // =========================================================================
  if (isSupplier) {
    return (
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                My Materials &amp; Live Rate Card
              </h1>
              <Badge variant="verified">West Bengal Supplier Rate Deck</Badge>
            </div>
            <p className="text-xs sm:text-sm text-brand-slate dark:text-slate-400 mt-1">
              Showcase your materials and live base rates to builders &amp; contractors across Kolkata and West Bengal • Rates update live in all contractor carts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsAddShowcaseModalOpen(true)}
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Material to Showcase
            </Button>
            <Link href="/sell">
              <Button size="sm" variant="outline" className="border-emerald-400 text-emerald-700 dark:text-emerald-300">
                <DollarSign className="w-4 h-4 mr-1" /> Builder Buyback Desk
              </Button>
            </Link>
          </div>
        </div>

        {/* Highway Toll Terms Strip */}
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2.5">
            <span className="text-base">🛣️</span>
            <div>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-300">Supplier Revenue Protection Policy: </span>
              <span>All en-route highway &amp; bridge toll charges (NH-19 Dankuni, Belghoria Expressway, Vidyasagar Setu) are <strong>100% paid by the Buyer/Contractor</strong> at checkout. Zero toll deduction from your material earnings.</span>
            </div>
          </div>
          <Badge variant="verified" size="sm">Toll Borne by Buyer</Badge>
        </div>

        {/* Overview Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="bg-slate-900 text-white border-slate-800 p-5 space-y-1">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[10px] font-bold uppercase">Showcase Materials</span>
              <Package className="w-4 h-4 text-brand-orange" />
            </div>
            <p className="text-2xl font-black text-brand-orange">
              {supplierShowcaseMaterials.length} Active Materials
            </p>
            <p className="text-[11px] text-slate-400">Live rate deck published</p>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 space-y-1">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-[10px] font-bold uppercase">Staging Location</span>
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-lg font-black text-slate-900 dark:text-white truncate">
              Dankuni Central Hub
            </p>
            <p className="text-[11px] text-emerald-600 font-bold">&lt; 3.5 hrs Express to Sites</p>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 space-y-1">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-[10px] font-bold uppercase">Base Rates Status</span>
              <ShieldCheck className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-lg font-black text-blue-600">
              100% Transparent
            </p>
            <p className="text-[11px] text-slate-400">Zero middleman cut to builders</p>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 space-y-1">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-[10px] font-bold uppercase">Fleet Dispatch</span>
              <Truck className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              Dedicated Logistics
            </p>
            <p className="text-[11px] text-purple-600 font-bold">Flatbed &amp; Tipper Fleet</p>
          </Card>
        </div>

        {/* Filter Pills and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
            {['ALL', 'Cement', 'Steel & TMT', 'Bricks & Blocks', 'Sand & M-Sand', 'Aggregates', 'Tiles & Flooring', 'Paints & Finishes'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedShowcaseCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedShowcaseCategory === cat
                    ? 'bg-brand-orange text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search material, brand, specs..."
              value={showcaseSearchQuery}
              onChange={(e) => setShowcaseSearchQuery(e.target.value)}
              className="text-xs"
            />
          </div>
        </div>

        {/* Showcase Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredShowcaseMaterials.map((item) => {
            const hasTiers = !!item.tier1Rate;
            return (
              <Card
                key={item.id}
                className={`p-5 flex flex-col justify-between space-y-4 border-2 transition-all ${
                  item.isPublished
                    ? 'border-slate-200 dark:border-slate-800 hover:border-brand-orange'
                    : 'border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  {/* Photo & Brand Pill */}
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                      {item.brand}
                    </span>
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md ${
                        item.stockStatus === 'HIGH'
                          ? 'bg-emerald-600 text-white'
                          : item.stockStatus === 'STABLE'
                          ? 'bg-blue-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {item.stockStatus === 'HIGH'
                        ? 'High Capacity'
                        : item.stockStatus === 'STABLE'
                        ? 'Stable Supply'
                        : 'Limited Stock'}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Stock: <strong className="text-slate-800 dark:text-slate-200">{item.stockCount.toLocaleString()} {item.unit}</strong>
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {item.specifications}
                    </p>
                  </div>

                  {/* Live Rate Box & Wholesale Volume Slabs */}
                  <div className="p-3.5 bg-brand-orange/5 dark:bg-brand-orange/10 rounded-2xl border border-brand-orange/20 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl font-black text-brand-orange">
                          {formatINR(item.baseRate)}
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-bold ml-1">
                          / {item.unit} (Live Rate)
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 line-through">
                        MRP: {formatINR(item.marketMrp)}
                      </span>
                    </div>

                    {hasTiers && (
                      <div className="space-y-1 pt-1.5 border-t border-brand-orange/15 text-[11px]">
                        <span className="font-bold text-slate-600 dark:text-slate-300 block text-[10px] uppercase">
                          Wholesale Volume Discount Slabs:
                        </span>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>{item.tier1MinQty}+ {item.unit}s Batch:</span>
                          <span className="font-bold text-emerald-600">{formatINR(item.tier1Rate || 0)} / {item.unit}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>{item.tier2MinQty}+ {item.unit}s Project:</span>
                          <span className="font-bold text-emerald-600">{formatINR(item.tier2Rate || 0)} / {item.unit}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hub Location & Dispatch */}
                  <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1 truncate max-w-[200px]">
                      <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                      {item.hubLocation}
                    </span>
                    <Badge variant="neutral" size="sm">
                      {item.deliveryTime}
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons for Supplier */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    className="flex-1"
                    onClick={() => handleOpenEditRateModal(item)}
                    leftIcon={<Edit className="w-3.5 h-3.5" />}
                  >
                    Edit Live Rate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenEditStockModal(item)}
                    title="Adjust Warehouse Stock"
                    className="px-3"
                  >
                    <Package className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleSupplierMaterialVisibility(item.id)}
                    title={item.isPublished ? 'Pause Visibility' : 'Publish Live'}
                    className="px-3"
                  >
                    {item.isPublished ? (
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* MODAL: EDIT LIVE SELLING RATE & SLABS */}
        <Modal
          isOpen={!!editingRateMaterial}
          onClose={() => setEditingRateMaterial(null)}
          title={`Edit Live Rate: ${editingRateMaterial?.name || ''}`}
          description="Update your live selling rate. Builders in West Bengal will immediately see this updated rate in their procurement."
          maxWidth="lg"
        >
          {editingRateMaterial && (
            <form onSubmit={handleSaveEditRate} className="space-y-4 pt-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Material Brand:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{editingRateMaterial.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unit Metric:</span>
                  <span className="font-bold">{editingRateMaterial.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Selling Rate:</span>
                  <span className="font-bold text-brand-orange">{formatINR(editingRateMaterial.baseRate)} / {editingRateMaterial.unit}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  New Base Selling Rate (₹ / {editingRateMaterial.unit})
                </label>
                <Input
                  type="number"
                  step="any"
                  value={editBaseRateInput}
                  onChange={(e) => setEditBaseRateInput(e.target.value)}
                  required
                  placeholder="e.g. 375"
                />
              </div>

              {/* Volume Slabs Configuration */}
              <div className="space-y-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 block">
                  Wholesale Volume Slabs (Optional):
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">Tier 1 Min Quantity ({editingRateMaterial.unit})</label>
                    <Input
                      type="number"
                      value={editTier1MinQtyInput}
                      onChange={(e) => setEditTier1MinQtyInput(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">Tier 1 Rate (₹ / {editingRateMaterial.unit})</label>
                    <Input
                      type="number"
                      step="any"
                      value={editTier1RateInput}
                      onChange={(e) => setEditTier1RateInput(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">Tier 2 Project Min Qty ({editingRateMaterial.unit})</label>
                    <Input
                      type="number"
                      value={editTier2MinQtyInput}
                      onChange={(e) => setEditTier2MinQtyInput(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">Tier 2 Project Rate (₹ / {editingRateMaterial.unit})</label>
                    <Input
                      type="number"
                      step="any"
                      value={editTier2RateInput}
                      onChange={(e) => setEditTier2RateInput(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full">
                Publish Live Rate Update
              </Button>
            </form>
          )}
        </Modal>

        {/* MODAL: ADJUST WAREHOUSE STOCK */}
        <Modal
          isOpen={!!editingStockMaterial}
          onClose={() => setEditingStockMaterial(null)}
          title={`Adjust Yard Stock: ${editingStockMaterial?.name || ''}`}
          description="Update available physical stock count at your staging yard."
        >
          {editingStockMaterial && (
            <form onSubmit={handleSaveEditStock} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Available Count ({editingStockMaterial.unit})
                </label>
                <Input
                  type="number"
                  value={editStockCountInput}
                  onChange={(e) => setEditStockCountInput(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Stock Availability Status
                </label>
                <select
                  value={editStockStatusInput}
                  onChange={(e) => setEditStockStatusInput(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                >
                  <option value="HIGH">High Capacity (Ready for Immediate Truckload Dispatch)</option>
                  <option value="STABLE">Stable Supply (Regular 24-hr staging)</option>
                  <option value="LIMITED">Limited Stock (Re-staging in progress)</option>
                </select>
              </div>

              <Button type="submit" variant="primary" className="w-full">
                Save Stock Parameters
              </Button>
            </form>
          )}
        </Modal>

        {/* MODAL: ADD MATERIAL TO SHOWCASE */}
        <Modal
          isOpen={isAddShowcaseModalOpen}
          onClose={() => setIsAddShowcaseModalOpen(false)}
          title="Add New Material to Rate Card Showcase"
          description="List a new material and publish its transparent selling rates to builders."
          maxWidth="lg"
        >
          <form onSubmit={handleSaveAddShowcase} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Material Name
                </label>
                <Input
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="e.g. UltraTech Super Weatherproof PPC"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Manufacturer / Brand
                </label>
                <Input
                  value={addBrand}
                  onChange={(e) => setAddBrand(e.target.value)}
                  placeholder="e.g. UltraTech, Tata Tiscon, JSW"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  value={addCategory}
                  onChange={(e) => setAddCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Cement">Cement</option>
                  <option value="Steel & TMT">Steel &amp; TMT</option>
                  <option value="Bricks & Blocks">Bricks &amp; Blocks</option>
                  <option value="Sand & M-Sand">Sand &amp; M-Sand</option>
                  <option value="Aggregates">Aggregates</option>
                  <option value="Tiles & Flooring">Tiles &amp; Flooring</option>
                  <option value="Paints & Finishes">Paints &amp; Finishes</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Unit Metric
                </label>
                <Input
                  value={addUnit}
                  onChange={(e) => setAddUnit(e.target.value)}
                  placeholder="e.g. bag, kg, ton, piece, sq.ft"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Live Base Rate (₹)
                </label>
                <Input
                  type="number"
                  step="any"
                  value={addBaseRate}
                  onChange={(e) => setAddBaseRate(e.target.value)}
                  placeholder="e.g. 380"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Available Staging Stock
                </label>
                <Input
                  type="number"
                  value={addStockCount}
                  onChange={(e) => setAddStockCount(e.target.value)}
                  placeholder="e.g. 2500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Staging Yard Location
                </label>
                <Input
                  value={addHubLocation}
                  onChange={(e) => setAddHubLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Specifications &amp; Quality Certifications
              </label>
              <textarea
                value={addSpecs}
                onChange={(e) => setAddSpecs(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                rows={2}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Add to Rate Card Showcase
            </Button>
          </form>
        </Modal>
      </div>
    );
  }

  // =========================================================================
  // RENDER 2: CONTRACTOR / CUSTOMER SHOPPING MARKETPLACE
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* Top Header Bar & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Materials Marketplace
            <Badge variant="verified">BuildNexus Staging Guaranteed</Badge>
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate dark:text-slate-400 mt-1">
            Transparent supplier rates • Zero middleman markups • Central warehouse delivery
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsMobileFilterOpen(true)}
            variant="outline"
            className="md:hidden"
            leftIcon={<Filter className="w-4 h-4" />}
          >
            Filters
          </Button>
        </div>
      </div>

      {/* Transit Logistics & Highway Toll Policy Banner */}
      <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900 dark:text-blue-200">
        <div className="flex items-center gap-2.5">
          <span className="text-base">🛣️</span>
          <div>
            <span className="font-extrabold text-blue-800 dark:text-blue-300">Transit Toll Notice: </span>
            <span>When materials are supplied from supplier hubs (e.g. Dankuni / Kona Expressway), en-route highway and bridge tolls are itemized and <strong>paid by the Buyer/Contractor at checkout</strong>. Direct supplier catalog prices remain 100% net.</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="neutral" size="sm">Itemized at Checkout</Badge>
          <Badge variant="verified" size="sm">NETC Fastag Tracked</Badge>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-brand-orange text-white shadow-glow'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid & Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Desktop Filters Sidebar */}
        <div className="hidden md:block col-span-1 space-y-6">
          <Card className="p-4 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Refine Filters</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">Search</label>
              <Input
                placeholder="Search material..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">Price Range (₹)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="instock"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-slate-300 text-brand-orange focus:ring-brand-orange"
              />
              <label htmlFor="instock" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                In Stock Only
              </label>
            </div>
          </Card>
        </div>

        {/* Materials Grid */}
        <div className="col-span-1 md:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-3xl" />
              ))}
            </div>
          ) : filteredMaterials.length === 0 ? (
            <EmptyState
              title="No Materials Found"
              description="Try adjusting your filters or search terms."
              actionLabel="Reset Filters"
              onAction={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setPriceMin('');
                setPriceMax('');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMaterials.map((mat) => (
                <Card key={mat.id} hoverable className="flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    <div className="h-40 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img src={mat.image} alt={mat.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{mat.brand}</span>
                        <Rating rating={mat.rating} />
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                        {mat.name}
                      </h3>
                      <p className="text-xs text-slate-500">{mat.supplier.name} • {mat.supplier.city}</p>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-xl font-black text-brand-orange">
                          {formatINR(mat.price)}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold"> / {mat.unit}</span>
                      </div>
                      <span className="text-xs text-emerald-600 font-bold">
                        {mat.stock} in stock
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1"
                      onClick={() => {
                        addToCart({
                          materialId: mat.id,
                          name: mat.name,
                          price: mat.price,
                          unit: mat.unit,
                          supplierId: mat.supplier.id,
                          supplierName: mat.supplier.name,
                          image: mat.image,
                        });
                        addToast({
                          title: 'Added to Cart',
                          message: `${mat.name} added to procurement cart.`,
                          type: 'success',
                        });
                      }}
                    >
                      <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Add to Cart
                    </Button>
                    <Link href="/chat">
                      <Button size="sm" variant="outline" className="px-3" title="Negotiate Price">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
