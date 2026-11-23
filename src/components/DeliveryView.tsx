'use client';

import React, { useState } from 'react';
import { MOCK_ACTIVE_DELIVERY, ActiveDelivery } from '@/lib/mockData';
import {
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Compass,
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
      setOtpError('Invalid OTP! Please cross-check with the site supervisor.');
    }
  };

  const shelfLifeProgress = Math.min(
    100,
    Math.round((delivery.batchAgeMinutes / delivery.maxShelfLifeMinutes) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              Central Warehouse Dispatch & Perishable Fleet Tracker
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              JIT Synchronized
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Tracking perishability, batch age, and multi-agent rerouting to prevent Ready-Mix Concrete hardening.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-500 font-medium">Tracking Order:</div>
          <div className="text-sm font-black font-mono text-slate-900">{delivery.orderNumber}</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Cols 1-2): Live Map Visualization & Progress */}
        <div className="lg:col-span-2 space-y-5">
          {/* Simulated Map Container */}
          <div className="relative h-72 sm:h-80 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg flex flex-col justify-between p-6">
            {/* Grid Pattern overlay */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#38bdf8 1px, #0f172a 1px)',
                backgroundSize: '40px 40px',
                backgroundPosition: '0 0, 20px 20px',
              }}
            ></div>

            {/* Top Bar on Map */}
            <div className="relative z-10 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Compass className="w-4 h-4 text-blue-400 animate-spin" />
                <span>Live GPS Feed: <strong>Outer Ring Rd $\rightarrow$ Koramangala</strong></span>
              </div>
              <div className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full font-bold">
                Speed: 38 km/h
              </div>
            </div>

            {/* Graphic Map Route Visual */}
            <div className="relative z-10 flex items-center justify-between px-4 sm:px-12">
              {/* Origin */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 border-4 border-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  HUB
                </div>
                <span className="text-[11px] font-bold text-slate-300 mt-2">Central Staging</span>
                <span className="text-[10px] text-slate-500">Departed 10:45 AM</span>
              </div>

              {/* Connecting animated line with Moving Truck */}
              <div className="flex-1 mx-4 h-1.5 bg-slate-700 rounded-full relative overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-amber-500 w-2/3 rounded-full"></div>
                <div className="absolute top-1/2 left-2/3 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow-lg animate-bounce">
                  <Truck className="w-3 h-3 text-slate-950" />
                </div>
              </div>

              {/* Destination */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600 border-4 border-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  SITE
                </div>
                <span className="text-[11px] font-bold text-slate-300 mt-2">Site 4B Hopper</span>
                <span className="text-[10px] text-emerald-400 font-semibold">ETA: 18 Minutes</span>
              </div>
            </div>

            {/* Bottom Status on Map */}
            <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <div>
                Vehicle: <strong className="text-white">{delivery.truckNumber}</strong> | Driver: {delivery.driverName}
              </div>
              <div className="text-amber-400 font-bold">
                Drum RPM: 12 (Continuous Agitation)
              </div>
            </div>
          </div>

          {/* Concrete Perishability & MARL Health Bar */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Ready-Mix Concrete Slump & Setting Monitor
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-700">
                Batch Age: <strong className="text-amber-600">{delivery.batchAgeMinutes}m</strong> / 90m Maximum
              </span>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  shelfLifeProgress > 75
                    ? 'bg-rose-600'
                    : shelfLifeProgress > 50
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${shelfLifeProgress}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Mixing Completed: 10:45 AM</span>
              <span className="text-emerald-700 font-semibold">46 Minutes Remaining Before Setting</span>
              <span>Hardening Limit: 12:15 PM</span>
            </div>
          </div>
        </div>

        {/* Right Column: Driver Handover & Secure OTP Verification */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 font-['Space_Grotesk']">
                Secure OTP Handshake
              </h2>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-normal">
              Zero-leakage proof of delivery. The driver cannot mark the delivery complete without the site supervisor entering the secret 4-digit code.
            </p>

            {/* Checklist */}
            <div className="space-y-2 mb-5">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Central Hub Slump Cone Quality Passed (120mm)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Cube Test Sample Set Cast for 7/28 Day Curing</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Weighbridge Slip Verified: 7.5 m³ Payload</span>
              </div>
            </div>

            {/* OTP Form */}
            {isCompleted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-center space-y-1">
                <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-sm font-black">Delivery Verified & Settled!</div>
                <p className="text-xs text-emerald-700">
                  Escrow payment of ₹36,500 has been released to supplier account.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-600">
                  <span>Demo Hint: Supervisor OTP is </span>
                  <strong className="text-slate-900 font-mono text-sm">{delivery.otpCode}</strong>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enter Site Supervisor OTP
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Enter 4-digit OTP"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="w-full text-center tracking-widest text-lg font-mono font-black py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {otpError && (
                    <div className="text-xs text-rose-600 font-semibold mt-1">{otpError}</div>
                  )}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
                >
                  Verify Handover & Release Escrow
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200 text-center text-[11px] text-slate-500">
            BuildNexus Secure Custody Chain Protocol
          </div>
        </div>
      </div>
    </div>
  );
};
