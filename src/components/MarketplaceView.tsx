'use client';

import React, { useState } from 'react';
import { MOCK_MATERIALS, MaterialItem } from '@/lib/mockData';
import { formatINR } from '@/lib/utils';
import {
  Search,
  CheckCircle2,
  ChevronRight,
  TrendingDown,
  Building2,
  X,
} from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All products');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [comparingItem, setComparingItem] = useState<MaterialItem | null>(null);
  const [orderToast, setOrderToast] = useState<string | null>(null);

  const categories = ['All products', 'Cement', 'Steel', 'Bricks', 'Sand'];

  const filteredMaterials = MOCK_MATERIALS.filter((item) => {
    const matchesCat =
      selectedCategory === 'All products' || item.category === selectedCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleOrder = (item: MaterialItem) => {
    setOrderToast(`Added ${item.name} to dispatch order. Zero broker markup applied.`);
    setTimeout(() => setOrderToast(null), 3500);
  };

  return (
    <div className="space-y-10">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
          Materials.
        </h2>
        <p className="text-lg text-[#86868b] font-normal mt-1">
          Wholesale rates directly from verified regional manufacturers and stockyards.
        </p>
      </div>

      {/* Apple-Style Segmented Pill Controls & Search (as in Image 1) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Capsule Pill Bar */}
        <div className="inline-flex items-center bg-[#e8e8ed]/70 p-1 rounded-full text-xs font-medium overflow-x-auto max-w-full no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1d1d1f] text-white shadow-sm'
                    : 'text-[#1d1d1f] hover:text-black'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Minimal Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-full bg-[#f5f5f7] border-none text-xs text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
          />
        </div>
      </div>

      {orderToast && (
        <div className="bg-[#f5f5f7] border border-[#d2d2d7] text-[#1d1d1f] px-5 py-3 rounded-2xl text-xs font-medium flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1b8738]" />
            <span>{orderToast}</span>
          </div>
          <button onClick={() => setOrderToast(null)} className="text-[#86868b] hover:text-black">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Apple Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredMaterials.map((item) => {
          const discountPct = Math.round(((item.marketAvg - item.basePrice) / item.marketAvg) * 100);
          return (
            <div
              key={item.id}
              className="rounded-[28px] bg-[#f5f5f7] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-appleCard hover:bg-[#f0f0f3]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-xs font-semibold text-[#1b8738] bg-[#eaf6ed] px-2.5 py-0.5 rounded-full">
                    Save {discountPct}% vs Market
                  </span>
                </div>

                <h3 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
                  {item.name}
                </h3>
                <p className="text-xs text-[#86868b] mt-1.5 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#86868b]" />
                  <span>{item.supplier}</span>
                  <span>•</span>
                  <span>Dispatch in {item.deliveryTimeHours} hrs</span>
                </p>

                {/* Specs Box */}
                <div className="mt-6 grid grid-cols-3 gap-3 py-4 border-y border-[#d2d2d7]/50 text-xs">
                  <div>
                    <span className="text-[11px] text-[#86868b] block">Unit Size</span>
                    <span className="font-semibold text-[#1d1d1f]">{item.unit}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#86868b] block">Min Order</span>
                    <span className="font-semibold text-[#1d1d1f]">{item.minOrder} Units</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#86868b] block">Stock Health</span>
                    <span className="font-semibold text-[#1b8738]">In Stock</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                    {formatINR(item.basePrice)}
                  </span>
                  <span className="text-xs text-[#86868b]">
                    per {item.unit.toLowerCase()} (was {formatINR(item.marketAvg)})
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-4 flex items-center justify-between gap-4">
                <button
                  onClick={() => setComparingItem(comparingItem?.id === item.id ? null : item)}
                  className="text-xs font-medium text-[#0071e3] hover:underline flex items-center gap-1"
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{comparingItem?.id === item.id ? 'Close comparison' : 'Compare yard prices >'}</span>
                </button>

                <button
                  onClick={() => handleOrder(item)}
                  className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium px-5 py-2 rounded-full transition shadow-sm"
                >
                  Buy Direct
                </button>
              </div>

              {/* Minimal Comparison Drawer */}
              {comparingItem?.id === item.id && (
                <div className="mt-6 p-5 rounded-2xl bg-white border border-[#d2d2d7] shadow-sm animate-fade-in text-xs space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1d1d1f]">
                    <span>Regional Yard Price Index</span>
                    <span className="text-[10px] text-[#86868b]">Verified Spot Rates</span>
                  </div>
                  <div className="space-y-2">
                    {item.priceComparisons.map((c, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-3 rounded-xl ${
                          i === 0 ? 'bg-[#f5f5f7] font-semibold text-[#1d1d1f]' : 'text-[#86868b]'
                        }`}
                      >
                        <div>
                          <div>{c.supplier}</div>
                          <div className="text-[10px] text-[#86868b]">{c.distanceKm} km from site</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-[#1d1d1f]">{formatINR(c.price)}</div>
                          {i === 0 && (
                            <span className="text-[10px] text-[#1b8738] font-medium">Best Rate</span>
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
