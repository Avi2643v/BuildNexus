'use client';

import React, { useState } from 'react';
import { MOCK_LABOR_SQUADS, LaborSquad } from '@/lib/mockData';
import { formatINR } from '@/lib/utils';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  ChevronRight,
  X,
} from 'lucide-react';

export const LabourView: React.FC = () => {
  const [bookingDays, setBookingDays] = useState<number>(3);
  const [bookingToast, setBookingToast] = useState<string | null>(null);

  const handleBook = (squad: LaborSquad) => {
    const totalWage = squad.dailyRatePerWorker * squad.squadSize * bookingDays;
    setBookingToast(
      `Confirmed booking for ${squad.leadName} (${squad.squadSize} workers) for ${bookingDays} days. Total: ${formatINR(totalWage)} with 0% platform deductions.`
    );
    setTimeout(() => setBookingToast(null), 4000);
  };

  return (
    <div className="space-y-10">
      {/* Title */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
          Labor Squads.
        </h2>
        <p className="text-lg text-[#86868b] font-normal mt-1">
          Video-audited craftsmanship. 100% fair daily wages deposited directly to workers.
        </p>
      </div>

      {/* Apple Environmental/Ethical Style Commitment Card */}
      <div className="rounded-[28px] bg-[#f5f5f7] p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1b8738] mb-2">
            <ShieldCheck className="w-4 h-4 text-[#1b8738]" />
            <span>Ethical Commitment</span>
          </div>
          <h3 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
            100% Fair Wage Guarantee. 0% Broker Deductions.
          </h3>
          <p className="mt-2 text-sm text-[#86868b] leading-relaxed">
            In informal construction, workers routinely lose 20–30% of their daily earnings to exploitative middlemen.
            BuildNexus takes zero commission from labor wages. The full rate goes to workers via biometric escrow.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#d2d2d7]/60 text-xs min-w-[240px] shadow-sm">
          <div className="text-[#86868b] text-[11px] uppercase font-semibold">Fair Wage Ledger</div>
          <div className="mt-2 space-y-1 text-[#1d1d1f]">
            <div className="flex justify-between">
              <span>Direct to Worker:</span>
              <span className="font-semibold">₹750 /day</span>
            </div>
            <div className="flex justify-between">
              <span>Sardar Supervision:</span>
              <span className="font-semibold">+ ₹50 /day</span>
            </div>
            <div className="flex justify-between text-[#1b8738] font-semibold pt-1 border-t border-[#d2d2d7]/40">
              <span>BuildNexus Fee:</span>
              <span>₹0 (0% Cut)</span>
            </div>
          </div>
        </div>
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

      {/* Labor Squads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_LABOR_SQUADS.map((squad) => {
          const totalDaily = squad.dailyRatePerWorker * squad.squadSize;
          return (
            <div
              key={squad.id}
              className="rounded-[28px] bg-[#f5f5f7] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-appleCard hover:bg-[#f0f0f3]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                    {squad.availableCount} of {squad.squadSize} Available Today
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

                {/* AI Video Audit Chip */}
                <div className="mt-4 p-3 rounded-xl bg-white border border-[#d2d2d7]/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#1d1d1f]">
                    <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
                    <span className="font-medium text-[11px]">{squad.recentAudit}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#0071e3] bg-[#0071e3]/10 px-2 py-0.5 rounded-full">
                    {Math.round(squad.verifiedSkillScore * 100)}% Match
                  </span>
                </div>

                {/* Skills Chips */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {squad.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium text-[#1d1d1f] bg-white px-2.5 py-1 rounded-full border border-[#d2d2d7]/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Pricing & Location */}
                <div className="mt-6 flex items-baseline justify-between pt-4 border-t border-[#d2d2d7]/50">
                  <div>
                    <span className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
                      {formatINR(squad.dailyRatePerWorker)}
                    </span>
                    <span className="text-xs text-[#86868b]"> /worker/day</span>
                  </div>
                  <div className="text-xs text-[#86868b] flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{squad.distanceKm} km away</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#86868b]">
                  <span>Days:</span>
                  <select
                    value={bookingDays}
                    onChange={(e) => setBookingDays(Number(e.target.value))}
                    className="bg-white border border-[#d2d2d7] rounded-full px-3 py-1 text-xs font-semibold text-[#1d1d1f] focus:outline-none"
                  >
                    {[1, 2, 3, 5, 7, 14, 30].map((d) => (
                      <option key={d} value={d}>
                        {d} Days
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => handleBook(squad)}
                  className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium px-5 py-2 rounded-full transition shadow-sm"
                >
                  Book Squad
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
