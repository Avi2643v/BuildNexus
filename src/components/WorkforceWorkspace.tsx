'use client';

import React, { useState } from 'react';
import { MOCK_LABOR_SQUADS, LaborSquad } from '@/lib/mockData';
import { formatINR } from '@/lib/utils';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  X,
  Clock,
} from 'lucide-react';

interface WorkforceWorkspaceProps {
  committedPlanName?: string;
  committedSchedule?: any[];
}

export const WorkforceWorkspace: React.FC<WorkforceWorkspaceProps> = ({
  committedPlanName,
  committedSchedule,
}) => {
  const [selectedTrade, setSelectedTrade] = useState('All');
  const [bookingToast, setBookingToast] = useState<string | null>(null);

  const trades = ['All', 'Masonry', 'Bar-Benders', 'Carpenters', 'Concreting'];

  const filteredSquads = MOCK_LABOR_SQUADS.filter((squad) => {
    if (selectedTrade === 'All') return true;
    return squad.trade.toLowerCase().includes(selectedTrade.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
          Workforce & Trade Squads
        </h2>
        <p className="text-sm text-[#86868b] mt-1">
          Direct trade squads with video-audited skill verification and 100% guaranteed fair wages.
        </p>
      </div>

      {/* 100% Fair Wage Commitment Card */}
      <div className="rounded-[28px] bg-[#f5f5f7] p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1b8738] mb-2">
            <ShieldCheck className="w-4 h-4 text-[#1b8738]" />
            <span>Social Innovation Moat</span>
          </div>
          <h3 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
            100% Fair Wage Guarantee. Zero Broker Deductions.
          </h3>
          <p className="mt-2 text-sm text-[#86868b] leading-relaxed">
            In informal chawks, contractors and brokers deduct 20–30% of daily wages.
            BuildNexus takes <strong>0% cut on worker wages</strong>. Direct bank/UPI transfer with transparent Sardar supervision fees.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#d2d2d7]/60 text-xs min-w-[240px] shadow-sm">
          <div className="text-[#86868b] text-[11px] uppercase font-semibold">Muster Ledger Split</div>
          <div className="mt-2 space-y-1.5 text-[#1d1d1f]">
            <div className="flex justify-between">
              <span>Direct to Laborer:</span>
              <strong className="text-[#1d1d1f]">₹750 /day</strong>
            </div>
            <div className="flex justify-between">
              <span>Sardar Supervision:</span>
              <strong className="text-[#1d1d1f]">+ ₹50 /day</strong>
            </div>
            <div className="flex justify-between text-[#1b8738] font-semibold pt-1 border-t border-[#d2d2d7]/50">
              <span>Platform Take-Rate:</span>
              <span>₹0 (0% Commission)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Roster Synced from AI Planner */}
      {committedPlanName && (
        <div className="rounded-[24px] bg-[#eaf6ed] p-6 border border-[#1b8738]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#1b8738]" />
            <div>
              <div className="text-sm font-semibold text-[#1b8738]">
                Active Site Roster Synced: {committedPlanName}
              </div>
              <div className="text-xs text-[#1b8738]/80">
                Squad deployments and shift windows are synchronized directly from your AI Planner schedule.
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#1b8738] bg-white px-3 py-1 rounded-full border border-[#1b8738]/30">
            Auto-Dispatched
          </span>
        </div>
      )}

      {/* Trade Filter Pills */}
      <div className="inline-flex items-center bg-[#e8e8ed]/70 p-1 rounded-full text-xs font-medium">
        {trades.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTrade(t)}
            className={`px-4 py-1.5 rounded-full transition ${
              selectedTrade === t
                ? 'bg-[#1d1d1f] text-white shadow-sm'
                : 'text-[#1d1d1f] hover:text-black'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {bookingToast && (
        <div className="bg-[#f5f5f7] border border-[#d2d2d7] text-[#1d1d1f] px-5 py-3 rounded-2xl text-xs font-medium flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1b8738]" />
            <span>{bookingToast}</span>
          </div>
          <button onClick={() => setBookingToast(null)} className="text-[#86868b] hover:text-black">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Squads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredSquads.map((squad) => (
          <div
            key={squad.id}
            className="rounded-[28px] bg-[#f5f5f7] p-8 flex flex-col justify-between hover:bg-[#f0f0f3] transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                  {squad.availableCount} of {squad.squadSize} Available
                </span>
                <span className="text-xs font-semibold text-[#1d1d1f]">
                  ★ {squad.rating} ({squad.experienceYears} yrs)
                </span>
              </div>

              <h3 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
                {squad.trade}
              </h3>
              <p className="text-xs text-[#86868b] mt-1">
                Lead Sardar: <strong className="text-[#1d1d1f]">{squad.leadName}</strong>
              </p>

              {/* Video Verification Badge */}
              <div className="mt-4 p-3 rounded-xl bg-white border border-[#d2d2d7]/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#1d1d1f]">
                  <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span className="font-medium text-[11px]">{squad.recentAudit}</span>
                </div>
                <span className="text-[10px] font-semibold text-[#0071e3] bg-[#0071e3]/10 px-2.5 py-0.5 rounded-full">
                  {Math.round(squad.verifiedSkillScore * 100)}% Match
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {squad.skills.map((s, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium text-[#1d1d1f] bg-white px-2.5 py-1 rounded-full border border-[#d2d2d7]/50"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-[#d2d2d7]/50 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-semibold text-[#1d1d1f]">
                    {formatINR(squad.dailyRatePerWorker)}
                  </span>
                  <span className="text-xs text-[#86868b]"> /worker/day</span>
                </div>
                <div className="text-xs text-[#86868b] flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{squad.distanceKm} km haulage</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <span className="text-xs text-[#86868b]">
                Total: <strong>{formatINR(squad.dailyRatePerWorker * squad.squadSize)}/day</strong>
              </span>

              <button
                onClick={() => {
                  setBookingToast(`Booked ${squad.leadName} for site deployment. Synced with Digital Khata.`);
                  setTimeout(() => setBookingToast(null), 3500);
                }}
                className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium px-5 py-2 rounded-full transition shadow-sm"
              >
                Book Squad
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
