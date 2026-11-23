'use client';

import React, { useState } from 'react';
import { MOCK_LABOR_SQUADS, LaborSquad } from '@/lib/mockData';
import { formatINR } from '@/lib/utils';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  Info,
} from 'lucide-react';

export const LabourView: React.FC = () => {
  const [selectedSquad, setSelectedSquad] = useState<LaborSquad | null>(null);
  const [bookingDays, setBookingDays] = useState<number>(3);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const handleBook = (squad: LaborSquad) => {
    const totalWage = squad.dailyRatePerWorker * squad.squadSize * bookingDays;
    setBookingSuccess(
      `Successfully confirmed booking for ${squad.leadName} (${squad.squadSize} workers) for ${bookingDays} days! Total: ${formatINR(totalWage)}`
    );
    setTimeout(() => setBookingSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Fair Wage Guarantee Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-2xl p-6 text-white border border-emerald-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3 border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Social Innovation Moat: 100% Guaranteed Fair Wages</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-['Space_Grotesk'] text-white">
            Ethical Workforce Deployment & Video-Audited Squads
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Unlike informal chawks where corrupt labor brokers deduct 20–30% of workers' earnings,
            <strong> BuildNexus takes 0% commission from labor wages</strong>. The full wage is paid directly
            to workers via biometric escrow, with a transparent split ledger for the team Sardar.
          </p>
        </div>
      </div>

      {bookingSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{bookingSuccess}</span>
        </div>
      )}

      {/* Labor Squads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MOCK_LABOR_SQUADS.map((squad) => {
          const totalDaily = squad.dailyRatePerWorker * squad.squadSize;
          return (
            <div
              key={squad.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:border-slate-300 transition"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {squad.availableCount} of {squad.squadSize} Ready Today
                      </span>
                      <span className="text-xs text-amber-600 font-bold">★ {squad.rating}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      {squad.trade}
                    </h3>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">
                      Lead: <span className="font-bold text-slate-800">{squad.leadName}</span> ({squad.experienceYears} yrs exp)
                    </div>
                  </div>

                  {/* Daily Rate */}
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-900 font-['Space_Grotesk']">
                      {formatINR(squad.dailyRatePerWorker)}
                      <span className="text-xs font-normal text-slate-500">/day/worker</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold">
                      Full Squad: {formatINR(totalDaily)}/day
                    </div>
                  </div>
                </div>

                {/* AI Video-Audit Skill Badge */}
                <div className="mt-3.5 p-2.5 rounded-lg bg-blue-50/80 border border-blue-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-blue-900">AI Skill Certification: </span>
                      <span className="text-blue-700 font-medium">{squad.recentAudit}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[11px] font-bold">
                    Score: {Math.round(squad.verifiedSkillScore * 100)}%
                  </span>
                </div>

                {/* Trade Skills Chips */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {squad.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Location & Distance */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{squad.location}</span>
                  <span>•</span>
                  <span className="font-semibold text-blue-600">{squad.distanceKm} km haulage</span>
                </div>
              </div>

              {/* Action & Transparent Wage Split Accordion */}
              <div className="mt-5 pt-3 border-t border-slate-100 space-y-3">
                {/* 100% Fair Wage Split Breakdown Table */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 text-[11px] space-y-1">
                  <div className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Fair Wage Ledger Breakdown:</span>
                    <span className="text-emerald-700 font-extrabold">0% Platform Cut</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Direct Worker Payout:</span>
                    <span className="font-bold text-slate-800">{formatINR(squad.dailyRatePerWorker - squad.sardarCut)} /day</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Sardar Team Supervision:</span>
                    <span className="font-bold text-slate-800">+{formatINR(squad.sardarCut)} /day</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span>Days:</span>
                    <select
                      value={bookingDays}
                      onChange={(e) => setBookingDays(Number(e.target.value))}
                      className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-900 focus:outline-none"
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
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Confirm Squad Booking</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
