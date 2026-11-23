'use client';

import React, { useState, useEffect } from 'react';
import { fetchLiveWeather16d, HourlyWeather } from '@/lib/syncEngine';
import { formatINR } from '@/lib/utils';
import {
  CloudRain,
  Sun,
  Thermometer,
  ShieldAlert,
  Users,
  Truck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface SiteCockpitProps {
  onNavigateTab: (tabId: string) => void;
  committedPlanName?: string;
}

export const SiteCockpit: React.FC<SiteCockpitProps> = ({ onNavigateTab, committedPlanName }) => {
  const [weatherData, setWeatherData] = useState<HourlyWeather[]>([]);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    fetchLiveWeather16d(22.58, 88.42).then((data) => {
      setWeatherData(data);
      setLoadingWeather(false);
    });
  }, []);

  const currentWeather = weatherData[12] || {
    tempC: 31.2,
    humidityPct: 78,
    rainMm: 0,
    windKmh: 14,
    wbgtC: 29.4,
  };

  const isRainWarning = currentWeather.rainMm > 2.0;
  const isHeatWarning = currentWeather.wbgtC > 28.0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Live Site Environmental Alert Strip (Open-Meteo + ISO 7243 WBGT) */}
      <div className="rounded-[24px] bg-[#f5f5f7] p-5 sm:p-6 border border-[#d2d2d7]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#0071e3] border border-[#d2d2d7]/40">
            {isRainWarning ? (
              <CloudRain className="w-6 h-6 text-[#0071e3] animate-bounce" />
            ) : isHeatWarning ? (
              <Sun className="w-6 h-6 text-[#b64400]" />
            ) : (
              <Thermometer className="w-6 h-6 text-[#1b8738]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1d1d1f]">
                Live Site Environment • Salt Lake G+4 (22.58° N, 88.42° E)
              </span>
              <span className="text-[10px] font-bold text-[#1b8738] bg-[#eaf6ed] px-2 py-0.5 rounded-full">
                Open-Meteo Live Feed
              </span>
            </div>
            <div className="text-sm font-semibold text-[#1d1d1f] mt-0.5 flex flex-wrap items-center gap-3">
              <span>Temp: <strong>{currentWeather.tempC}°C</strong></span>
              <span>Humidity: <strong>{currentWeather.humidityPct}%</strong></span>
              <span>WBGT Index: <strong className={isHeatWarning ? 'text-[#b64400]' : 'text-[#1b8738]'}>{currentWeather.wbgtC}°C</strong></span>
              <span>Precipitation: <strong>{currentWeather.rainMm} mm/hr</strong></span>
            </div>
          </div>
        </div>

        {/* Dynamic WBGT Advisory Banner */}
        <div className="text-right">
          {isHeatWarning ? (
            <div className="text-xs font-semibold text-[#b64400] bg-[#ffefe6] px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>ISO 7243: Moderate Heat Stress (20% rest cycle recommended)</span>
            </div>
          ) : (
            <div className="text-xs font-semibold text-[#1b8738] bg-[#eaf6ed] px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Optimal Thermal Working Window</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Four Compact KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-[22px] bg-[#f5f5f7] p-5 border border-[#d2d2d7]/40">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] block">
            Active Workers Today
          </span>
          <div className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] mt-1">
            36 On Site
          </div>
          <span className="text-xs text-[#1b8738] font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Bio-Verified
          </span>
        </div>

        <div className="rounded-[22px] bg-[#f5f5f7] p-5 border border-[#d2d2d7]/40">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] block">
            Materials in Transit
          </span>
          <div className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] mt-1">
            2 Deliveries
          </div>
          <span className="text-xs text-[#0071e3] font-medium mt-1 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> 1 RMC Transit Mixer (ETA 18m)
          </span>
        </div>

        <div className="rounded-[22px] bg-[#f5f5f7] p-5 border border-[#d2d2d7]/40">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] block">
            Budget Burn Rate
          </span>
          <div className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] mt-1">
            ₹42.8L <span className="text-xs text-[#86868b] font-normal">/ ₹65L</span>
          </div>
          <span className="text-xs text-[#1b8738] font-medium mt-1">
            14.8% procurement savings
          </span>
        </div>

        <div className="rounded-[22px] bg-[#f5f5f7] p-5 border border-[#d2d2d7]/40">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] block">
            Projected Tail Delay Risk
          </span>
          <div className="text-2xl sm:text-3xl font-semibold text-[#0071e3] mt-1">
            4.2% (Low)
          </div>
          <span className="text-xs text-[#86868b] font-medium mt-1">
            Synced Plan: {committedPlanName || 'Balanced Plan B'}
          </span>
        </div>
      </div>

      {/* 3. Today's Action Feed & Weather-Aware Decision Engine */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight text-[#1d1d1f]">
            Today's Operational Action Feed
          </h3>
          <span className="text-xs text-[#86868b]">SyncEngine Autonomous Triggers</span>
        </div>

        <div className="space-y-3">
          {/* Action Card 1: Weather Disruption Alert */}
          <div className="rounded-[20px] bg-white p-5 border border-[#d2d2d7]/60 shadow-apple flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#ffefe6] text-[#b64400] flex items-center justify-center flex-shrink-0 mt-0.5">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#1d1d1f]">
                  Weather Shock: 14mm/hr Rain Forecast on Day 4 (Column Pouring at Risk)
                </div>
                <p className="text-xs text-[#86868b] mt-1 max-w-2xl leading-normal">
                  Open-Meteo predicts severe rain during the planned Column RCC Casting window.
                  SyncEngine recommends swapping with internal perimeter brickwork to avoid ₹18,400 in idle labor loss.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('planner')}
              className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium px-4 py-2 rounded-full whitespace-nowrap shadow-sm transition flex items-center gap-1.5"
            >
              <span>Review in AI Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Card 2: Perishable Delivery Standby */}
          <div className="rounded-[20px] bg-white p-5 border border-[#d2d2d7]/60 shadow-apple flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#eaf6ed] text-[#1b8738] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#1d1d1f]">
                  Perishable RMC Batch #BN-9042 In Transit (44m / 90m Setting Limit)
                </div>
                <p className="text-xs text-[#86868b] mt-1 max-w-2xl leading-normal">
                  Truck is 18 minutes away from site gate. 12-man concreting squad has been prompted to clear pump hopper and ready vibrators.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('procurement')}
              className="bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-medium px-4 py-2 rounded-full whitespace-nowrap transition"
            >
              Track Truck Dispatch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
