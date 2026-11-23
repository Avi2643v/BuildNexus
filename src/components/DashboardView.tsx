'use client';

import React from 'react';
import { formatINR } from '@/lib/utils';
import {
  Sparkles,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  Clock,
  CheckCircle2,
  Users,
  ShoppingBag,
  ArrowRight,
  Truck,
  Brain,
} from 'lucide-react';

interface DashboardViewProps {
  onTabChange: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onTabChange }) => {
  return (
    <div className="space-y-12">
      {/* 1. Hero Big Feature Card (Apple Keynote Style) */}
      <div className="rounded-[32px] bg-[#f5f5f7] p-8 sm:p-14 relative overflow-hidden transition-all duration-300 hover:shadow-appleCard">
        <div className="max-w-2xl relative z-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#b64400] mb-3 block">
            BuildNexus Operating System
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.08]">
            Pro power for every site.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#86868b] leading-relaxed font-normal">
            A unified digital ecosystem synchronizing contractors, skilled labor gangs, and material yards
            in real time. With zero unnecessary broker markups and 100% guaranteed fair wages.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onTabChange('marketplace')}
              className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-full shadow-sm transition"
            >
              Explore Materials
            </button>
            <button
              onClick={() => onTabChange('ai-suite')}
              className="text-[#0071e3] hover:underline text-xs sm:text-sm font-medium flex items-center gap-1 transition"
            >
              <span>Discover AI Intelligence</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subtle Decorative Geometric Silhouette */}
        <div className="absolute right-4 -bottom-10 opacity-10 pointer-events-none hidden lg:block">
          <div className="w-96 h-96 rounded-full border-[32px] border-[#1d1d1f]"></div>
        </div>
      </div>

      {/* 2. Apple Spec Metrics (Clean Minimal Numbers) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#f5f5f7] rounded-[24px] p-6 text-center sm:text-left transition hover:bg-[#ebebee]">
          <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
            100%
          </div>
          <div className="text-xs font-medium text-[#86868b] mt-1">
            Fair Wage Guarantee. Zero platform deductions from worker earnings.
          </div>
        </div>

        <div className="bg-[#f5f5f7] rounded-[24px] p-6 text-center sm:text-left transition hover:bg-[#ebebee]">
          <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
            14.8%
          </div>
          <div className="text-xs font-medium text-[#86868b] mt-1">
            Average cost reduction on wholesale cement and steel procurement.
          </div>
        </div>

        <div className="bg-[#f5f5f7] rounded-[24px] p-6 text-center sm:text-left transition hover:bg-[#ebebee]">
          <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
            90 min
          </div>
          <div className="text-xs font-medium text-[#86868b] mt-1">
            Perishable RMC setting horizon tracked live with dynamic MARL rerouting.
          </div>
        </div>

        <div className="bg-[#f5f5f7] rounded-[24px] p-6 text-center sm:text-left transition hover:bg-[#ebebee]">
          <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#0071e3]">
            94%
          </div>
          <div className="text-xs font-medium text-[#86868b] mt-1">
            Computer vision skill accuracy from 10-second worker demonstration videos.
          </div>
        </div>
      </div>

      {/* 3. Bento Grid: Four Apple-Style Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Wholesale Materials */}
        <div className="rounded-[28px] bg-[#f5f5f7] p-8 sm:p-10 flex flex-col justify-between hover:shadow-appleCard transition duration-300">
          <div>
            <div className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
              Wholesale Store
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
              Transparent pricing. Down to the rupee.
            </h3>
            <p className="mt-3 text-sm text-[#86868b] leading-relaxed">
              Compare live rates across verified local cement, rebar, sand, and brick yards.
              Eliminating secret broker commissions and fake freight surcharges.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#d2d2d7]/50 flex items-center justify-between">
            <span className="text-xs text-[#1d1d1f] font-semibold">UltraTech 53 Grade from ₹365</span>
            <button
              onClick={() => onTabChange('marketplace')}
              className="text-[#0071e3] hover:underline text-xs font-medium flex items-center gap-1"
            >
              <span>Shop Materials</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: 100% Fair Wage Labor */}
        <div className="rounded-[28px] bg-[#f5f5f7] p-8 sm:p-10 flex flex-col justify-between hover:shadow-appleCard transition duration-300">
          <div>
            <div className="text-xs font-semibold text-[#1b8738] uppercase tracking-wider mb-2">
              Ethical Workforce
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
              Direct to workers. Zero middleman cut.
            </h3>
            <p className="mt-3 text-sm text-[#86868b] leading-relaxed">
              Every laborer receives 100% of their promised daily wage via biometric escrow.
              Sardars get transparent management splits, and work is verified with video AI.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#d2d2d7]/50 flex items-center justify-between">
            <span className="text-xs text-[#1d1d1f] font-semibold">36 Verified Squads Ready</span>
            <button
              onClick={() => onTabChange('labour')}
              className="text-[#0071e3] hover:underline text-xs font-medium flex items-center gap-1"
            >
              <span>Book Labor Squads</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: In-App Privacy Negotiation */}
        <div className="rounded-[28px] bg-[#f5f5f7] p-8 sm:p-10 flex flex-col justify-between hover:shadow-appleCard transition duration-300">
          <div>
            <div className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
              Private Deals
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
              Privacy built in. Negotiation locked.
            </h3>
            <p className="mt-3 text-sm text-[#86868b] leading-relaxed">
              Automatic contact masking stops platform leakage and protects wholesale volume pricing.
              Agree in chat, lock into a smart escrow contract with 1 click.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#d2d2d7]/50 flex items-center justify-between">
            <span className="text-xs text-[#1d1d1f] font-semibold">Auto-Masking Active</span>
            <button
              onClick={() => onTabChange('chat')}
              className="text-[#0071e3] hover:underline text-xs font-medium flex items-center gap-1"
            >
              <span>Open Chat</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 4: Built-in Intelligence */}
        <div className="rounded-[28px] bg-gradient-to-br from-[#f5f5f7] via-[#fbfbfd] to-[#ebebee] p-8 sm:p-10 flex flex-col justify-between border border-black/[0.03] hover:shadow-appleCard transition duration-300">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0071e3] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>BuildNexus Intelligence</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
              Architected for intelligence.
            </h3>
            <p className="mt-3 text-sm text-[#86868b] leading-relaxed">
              Featuring NexusBot IS 456 Co-pilot, Spatio-Temporal Graph Tripartite Matching,
              and 30-day commodity price forecasting for cement and steel.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#d2d2d7]/50 flex items-center justify-between">
            <span className="text-xs text-[#0071e3] font-semibold">ST-HGNN + VideoMAE Core</span>
            <button
              onClick={() => onTabChange('ai-suite')}
              className="text-[#0071e3] hover:underline text-xs font-medium flex items-center gap-1"
            >
              <span>Explore AI Core</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
