'use client';

import React from 'react';
import { formatINR } from '@/lib/utils';
import {
  HardHat,
  Users,
  ShoppingCart,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Brain,
  ShieldCheck,
  ChevronRight,
  Truck,
} from 'lucide-react';

interface DashboardViewProps {
  onTabChange: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onTabChange }) => {
  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
            <span>✨ AI-Synchronized Construction OS</span>
            <span>•</span>
            <span>Zero Brokerage Markups</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">BuildNexus Hub</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Eliminating construction cost leakage through real-time tripartite orchestration:
            connecting <span className="text-white font-semibold">Contractors</span>,{' '}
            <span className="text-amber-300 font-semibold">Verified Labor Squads</span>, and{' '}
            <span className="text-blue-300 font-semibold">Material Yards</span> with zero middlemen.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onTabChange('marketplace')}
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 flex items-center gap-2 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              Compare Material Prices
            </button>
            <button
              onClick={() => onTabChange('labour')}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs sm:text-sm font-bold border border-slate-700 flex items-center gap-2 transition"
            >
              <Users className="w-4 h-4" />
              Book Verified Squads (0% Cut)
            </button>
            <button
              onClick={() => onTabChange('ai-suite')}
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 transition"
            >
              <Brain className="w-4 h-4 text-amber-300" />
              Launch AI SuperCore
            </button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Sites</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <HardHat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">6 Active</div>
            <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>All 6 within budget parameters</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Verified Workers</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">36 Present</div>
            <div className="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Video Verified (Avg: 92% Skill)</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fair Wage Guarantee</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600 font-['Space_Grotesk']">100% Direct</div>
            <div className="text-xs text-slate-600 font-medium flex items-center gap-1 mt-1">
              <span>0% Contractor/Platform deduction</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Procurement Savings</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-indigo-600 font-['Space_Grotesk']">₹42,850</div>
            <div className="text-xs text-indigo-700 font-semibold flex items-center gap-1 mt-1">
              <span>14.8% below street broker rates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Operational Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Urgent Alert 1: Perishable Concrete Logistics */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center animate-pulse">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Perishable Dispatch: RMC Transit Mixer</h3>
                <p className="text-xs text-amber-800 font-medium">Batch Age: 44m / 90m Maximum Shelf-Life</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
              In Transit (ETA: 18 min)
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-700 leading-normal">
            Ready-Mix Concrete batch #BN-ORD-9042 en route to Site 4B. The <strong>MARL Dynamic Dispatch Agent</strong> has synced the 12-man pouring crew to stand by at the pump hopper.
          </p>
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-amber-200/80">
            <span className="text-xs text-slate-600 font-semibold">Delivery OTP: <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-slate-900 font-bold">4921</span></span>
            <button
              onClick={() => onTabChange('delivery')}
              className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1"
            >
              Track Live Map <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Urgent Alert 2: Stock Depletion Horizon */}
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Stock Depletion: UltraTech 53 Grade</h3>
                <p className="text-xs text-rose-800 font-medium">Site Inventory: 24 Bags (Depletion in 2.8 Days)</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-900 uppercase">
              Reorder Warning
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-700 leading-normal">
            Daily mortar consumption will exhaust on-site cement by Thursday afternoon. The <strong>Price Forecaster</strong> predicts local price rise of +₹8/bag due to fuel hike next week.
          </p>
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-rose-200/80">
            <span className="text-xs text-slate-600">Lock in at: <strong>₹365/bag</strong></span>
            <button
              onClick={() => onTabChange('marketplace')}
              className="text-xs font-bold text-rose-900 hover:text-rose-950 flex items-center gap-1"
            >
              1-Click Reorder <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Navigation Cards */}
      <div>
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 mb-3 font-['Space_Grotesk']">
          Core Platform Workflows
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Item 1 */}
          <div
            onClick={() => onTabChange('marketplace')}
            className="group cursor-pointer bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-400 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-blue-600 transition">
                Explore →
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
              Materials Marketplace
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-normal">
              Compare rates side-by-side across vetted local suppliers. Cement, TMT Steel, Sand, and Bricks with transparent pricing.
            </p>
          </div>

          {/* Item 2 */}
          <div
            onClick={() => onTabChange('labour')}
            className="group cursor-pointer bg-white rounded-xl p-5 border border-slate-200 hover:border-amber-400 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-amber-600 transition">
                Explore →
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition">
              100% Fair Wage Labor Squads
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-normal">
              Direct booking for trade gangs (masons, bar benders). Zero contractor cuts. Video-verified skill index for quality assurance.
            </p>
          </div>

          {/* Item 3 */}
          <div
            onClick={() => onTabChange('chat')}
            className="group cursor-pointer bg-white rounded-xl p-5 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-indigo-600 transition">
                Explore →
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
              In-App Private Negotiation
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-normal">
              Auto-masks mobile numbers to eliminate off-platform leakage. Official in-chat offer creation and escrow-ready agreement locks.
            </p>
          </div>

          {/* Item 4 */}
          <div
            onClick={() => onTabChange('khata')}
            className="group cursor-pointer bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-400 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-emerald-600 transition">
                Explore →
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition">
              Digital Khata & Ledger
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-normal">
              Real-time wage ledger, promised vs paid tracking, site petty expenses, and instant PDF/Excel accounting exports.
            </p>
          </div>

          {/* Item 5 */}
          <div
            onClick={() => onTabChange('delivery')}
            className="group cursor-pointer bg-white rounded-xl p-5 border border-slate-200 hover:border-sky-400 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-sky-600 transition">
                Explore →
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition">
              Central Warehouse Dispatch
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-normal">
              Staging hub delivery tracking, driver checklist verification, and secure OTP handshakes for zero-loss drop-offs.
            </p>
          </div>

          {/* Item 6 */}
          <div
            onClick={() => onTabChange('ai-suite')}
            className="group cursor-pointer bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border-2 border-indigo-300 hover:border-indigo-500 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center group-hover:scale-110 transition">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200">
                Novel Core
              </span>
            </div>
            <h3 className="text-base font-bold text-indigo-950 group-hover:text-indigo-700 transition">
              AI SuperCore Suite
            </h3>
            <p className="mt-1 text-xs text-slate-700 leading-normal">
              ST-HGNN Tripartite Matcher, Video Skill Verifier (ST-GCN), NexusBot Copilot, and 30-Day Commodity Forecaster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
