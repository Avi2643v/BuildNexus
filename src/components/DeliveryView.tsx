'use client';

import React, { useState } from 'react';
import { MOCK_ACTIVE_DELIVERY, ActiveDelivery } from '@/lib/mockData';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  KeyRound,
} from 'lucide-react';

export const DeliveryView: React.FC = () => {
  const [delivery, setDelivery] = useState<ActiveDelivery>(MOCK_ACTIVE_DELIVERY);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleVerifyOtp = () => {
    if (enteredOtp.trim() === delivery.otpCode) {
      setIsCompleted(true);
      setDelivery((prev) => ({ ...prev, status: 'COMPLETED' }));
      setOtpError(null);
    } else {
      setOtpError('Invalid OTP code. Please verify with site supervisor.');
    }
  };

  const remainingMinutes = delivery.maxShelfLifeMinutes - delivery.batchAgeMinutes;
  const progressPercent = Math.min(100, Math.round((delivery.batchAgeMinutes / delivery.maxShelfLifeMinutes) * 100));

  return (
    <div className="space-y-10">
      {/* Title */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
          Live Dispatch.
        </h2>
        <p className="text-lg text-[#86868b] font-normal mt-1">
          Precision logistics for perishable materials. Tracked to the second.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Apple Maps Style Dispatch Visual (Cols 1-2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[32px] bg-[#f5f5f7] p-8 sm:p-10 border border-[#d2d2d7]/50 relative overflow-hidden flex flex-col justify-between h-80 shadow-apple">
            {/* Top Bar */}
            <div className="flex items-center justify-between text-xs text-[#1d1d1f]">
              <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full shadow-sm border border-[#d2d2d7]/50">
                <Compass className="w-3.5 h-3.5 text-[#0071e3] animate-spin" />
                <span>En Route to <strong>Site 4B Hopper</strong></span>
              </div>
              <span className="font-semibold text-xs text-[#0071e3] bg-[#0071e3]/10 px-3 py-1 rounded-full">
                ETA: {delivery.etaMinutes} mins
              </span>
            </div>

            {/* Apple Style Route Graphic */}
            <div className="flex items-center justify-between px-4 sm:px-12 relative z-10">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center font-semibold text-xs mx-auto shadow-md">
                  HUB
                </div>
                <div className="text-xs font-semibold text-[#1d1d1f] mt-2">Central Staging</div>
                <div className="text-[10px] text-[#86868b]">Departed 10:45 AM</div>
              </div>

              {/* Connecting progress track */}
              <div className="flex-1 mx-6 h-2 bg-[#e8e8ed] rounded-full relative overflow-hidden">
                <div className="h-full bg-[#0071e3] w-2/3 rounded-full"></div>
                <div className="absolute top-1/2 left-2/3 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white shadow-md border border-[#d2d2d7] flex items-center justify-center">
                  <Truck className="w-3.5 h-3.5 text-[#0071e3]" />
                </div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#0071e3] text-white flex items-center justify-center font-semibold text-xs mx-auto shadow-md">
                  SITE
                </div>
                <div className="text-xs font-semibold text-[#1d1d1f] mt-2">Site 4B Pour</div>
                <div className="text-[10px] text-[#0071e3] font-semibold">18 Mins Out</div>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="flex items-center justify-between text-xs text-[#86868b] pt-4 border-t border-[#d2d2d7]/50">
              <span>Vehicle: <strong className="text-[#1d1d1f]">{delivery.truckNumber}</strong> ({delivery.driverName})</span>
              <span>Payload: <strong>7.5 m³ M25 RMC</strong></span>
            </div>
          </div>

          {/* 90-minute Perishable Timer Component */}
          <div className="rounded-[28px] bg-[#f5f5f7] p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-semibold text-[#b64400] uppercase tracking-wider block">
                Perishable Decay Horizon
              </span>
              <h3 className="text-xl font-semibold text-[#1d1d1f] tracking-tight">
                {remainingMinutes} minutes before initial concrete setting.
              </h3>
              <p className="text-xs text-[#86868b]">
                MARL Logistics Agent has alerted the 12-man pouring crew to stand by at the pump hopper.
              </p>
            </div>

            {/* Apple Watch Style Progress Dial Indicator */}
            <div className="flex items-center gap-4 bg-white px-5 py-4 rounded-2xl border border-[#d2d2d7]/60 shadow-sm">
              <Clock className="w-8 h-8 text-[#0071e3]" />
              <div>
                <div className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
                  {delivery.batchAgeMinutes}m <span className="text-xs text-[#86868b] font-normal">/ 90m limit</span>
                </div>
                <div className="text-[10px] text-[#1b8738] font-semibold">Slump: 120mm (Optimal)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: OTP Handover (Apple Style Security) */}
        <div className="rounded-[28px] bg-[#f5f5f7] p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="w-4 h-4 text-[#0071e3]" />
              <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">
                Secure Handover
              </h3>
            </div>
            <p className="text-xs text-[#86868b] mb-6">
              Zero-leakage proof of delivery. Funds are released from escrow once OTP is verified.
            </p>

            <div className="space-y-3 mb-6 text-xs text-[#1d1d1f]">
              <div className="p-3 bg-white rounded-xl border border-[#d2d2d7]/60 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1b8738]" />
                <span>Central Hub Quality Passed</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#d2d2d7]/60 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1b8738]" />
                <span>Cylinder Samples Cast for 28-day curing</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#d2d2d7]/60 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1b8738]" />
                <span>Weighbridge Verified: 7.5 m³ Payload</span>
              </div>
            </div>

            {isCompleted ? (
              <div className="p-5 rounded-2xl bg-[#eaf6ed] border border-[#1b8738]/20 text-center space-y-1">
                <ShieldCheck className="w-8 h-8 text-[#1b8738] mx-auto" />
                <div className="text-sm font-semibold text-[#1b8738]">Delivery Confirmed</div>
                <p className="text-xs text-[#1b8738]/80">
                  Escrow payment released to supplier account.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-xl text-xs text-[#86868b] border border-[#d2d2d7]/60 text-center">
                  Supervisor Demo OTP: <strong className="text-[#1d1d1f] font-mono text-sm">{delivery.otpCode}</strong>
                </div>

                <div>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Enter 4-digit code"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="w-full text-center tracking-widest text-lg font-mono font-semibold py-2.5 rounded-xl bg-white border border-[#d2d2d7] text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                  {otpError && (
                    <div className="text-xs text-[#b64400] font-medium mt-1 text-center">{otpError}</div>
                  )}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  className="w-full py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium transition shadow-sm"
                >
                  Confirm Handover
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-[11px] text-[#86868b]">
            BuildNexus Custody Protocol
          </div>
        </div>
      </div>
    </div>
  );
};
