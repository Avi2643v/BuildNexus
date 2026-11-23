'use client';

import React, { useState } from 'react';
import { MOCK_MATERIALS, MaterialItem } from '@/lib/mockData';
import { formatINR } from '@/lib/utils';
import {
  ShoppingCart,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Truck,
  Building2,
  TrendingDown,
  Layers,
} from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [comparingItem, setComparingItem] = useState<MaterialItem | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const categories = ['All', 'Cement', 'Steel', 'Bricks', 'Sand'];

  const filteredMaterials = MOCK_MATERIALS.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleOrder = (item: MaterialItem) => {
    setCartCount((prev) => prev + 1);
    setOrderSuccess(`Added ${item.name} to cart! Total items: ${cartCount + 1}`);
    setTimeout(() => setOrderSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              Wholesale Materials Marketplace
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Direct Yard Rates
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Zero broker margins. Verified quality inspection at BuildNexus Central Warehouse staging hub.
          </p>
        </div>

        {/* Cart Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg text-blue-900 font-bold text-xs sm:text-sm">
            <ShoppingCart className="w-4 h-4 text-blue-600" />
            <span>Cart: {cartCount} Items</span>
          </div>
        </div>
      </div>

      {orderSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{orderSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cement, TMT rebar, red bricks, sand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMaterials.map((item) => {
          const discountPct = Math.round(((item.marketAvg - item.basePrice) / item.marketAvg) * 100);
          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:border-slate-300 transition"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 mb-1.5">
                      {item.category}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {item.name}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.supplier}</span>
                      <span>•</span>
                      <span className="text-amber-600 font-bold">★ {item.rating}</span>
                    </div>
                  </div>

                  {/* Pricing Badge */}
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-900 font-['Space_Grotesk']">
                      {formatINR(item.basePrice)}
                    </div>
                    <div className="text-[11px] text-slate-400 line-through">
                      Avg: {formatINR(item.marketAvg)}
                    </div>
                    <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-0.5">
                      Save {discountPct}%
                    </span>
                  </div>
                </div>

                {/* Logistics & Stock Info */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-[11px] text-slate-600">
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <div className="text-slate-400 text-[10px]">Unit</div>
                    <div className="font-bold text-slate-800">{item.unit}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <div className="text-slate-400 text-[10px]">Min Batch</div>
                    <div className="font-bold text-slate-800">{item.minOrder} Units</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <div className="text-slate-400 text-[10px]">Dispatch SLA</div>
                    <div className="font-bold text-blue-600">{item.deliveryTimeHours} Hours</div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setComparingItem(comparingItem?.id === item.id ? null : item)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <TrendingDown className="w-3.5 h-3.5 text-blue-600" />
                  <span>{comparingItem?.id === item.id ? 'Close Compare' : '⚡ Compare Prices'}</span>
                </button>

                <button
                  onClick={() => handleOrder(item)}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Procure Direct</span>
                </button>
              </div>

              {/* Transparent Side-by-Side Comparison Modal Drawer */}
              {comparingItem?.id === item.id && (
                <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white border border-slate-800 animate-fade-in text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">
                      Transparent Yard Rate Index
                    </span>
                    <span className="text-[10px] text-slate-400">Updated 10m ago</span>
                  </div>
                  <div className="space-y-2">
                    {item.priceComparisons.map((c, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-2 rounded ${
                          i === 0
                            ? 'bg-blue-950/80 border border-blue-500/40 text-blue-200'
                            : 'bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-bold">{c.supplier}</div>
                          <div className="text-[10px] text-slate-400">Haulage: {c.distanceKm} km</div>
                        </div>
                        <div className="text-right">
                          <div className="font-extrabold text-sm text-white">
                            {formatINR(c.price)}
                          </div>
                          {i === 0 && (
                            <span className="text-[10px] font-bold text-emerald-400">
                              Lowest Rate
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
