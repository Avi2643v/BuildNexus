'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  generateParetoFrontier,
  CandidatePlan,
  fetchLiveWeather16d,
  getFallbackWeatherData,
  HourlyWeather,
  DEFAULT_SITE_DAG,
} from '@/lib/syncEngine';
import { formatINR } from '@/lib/utils';
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingDown,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface AIPlannerProps {
  onCommitPlan: (plan: CandidatePlan) => void;
  committedPlanId?: string;
}

export const AIPlanner: React.FC<AIPlannerProps> = ({ onCommitPlan, committedPlanId }) => {
  const [weatherData, setWeatherData] = useState<HourlyWeather[]>(getFallbackWeatherData());
  const [loading, setLoading] = useState(false);

  // Live Shock Sliders
  const [rainShock, setRainShock] = useState<number>(0); // 0..50 mm/hr
  const [supplierDelay, setSupplierDelay] = useState<number>(0); // 0..4 days
  const [absenteeism, setAbsenteeism] = useState<number>(0); // 0..0.30 (0%..30%)

  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-balanced');
  const [hoveredPlan, setHoveredPlan] = useState<CandidatePlan | null>(null);

  useEffect(() => {
    fetchLiveWeather16d().then((data) => {
      setWeatherData(data);
      setLoading(false);
    });
  }, []);

  // Compute Pareto Frontier dynamically whenever weather or shock sliders change
  const paretoPlans = useMemo(() => {
    return generateParetoFrontier(DEFAULT_SITE_DAG, weatherData, {
      rainMm: rainShock,
      supplierDelayDays: supplierDelay,
      absenteeismPct: absenteeism,
    });
  }, [weatherData, rainShock, supplierDelay, absenteeism]);

  const activePlan = paretoPlans.find((p) => p.id === selectedPlanId) || paretoPlans[1] || paretoPlans[0];

  // Min and max bounds for SVG scatter plot coordinate mapping
  const costExtent = useMemo(() => {
    const costs = paretoPlans.map((p) => p.expectedCostInr);
    return [Math.min(...costs) * 0.98, Math.max(...costs) * 1.02];
  }, [paretoPlans]);

  const daysExtent = useMemo(() => {
    const days = paretoPlans.map((p) => p.expectedMakespanDays);
    return [Math.min(...days) - 1.5, Math.max(...days) + 1.5];
  }, [paretoPlans]);

  const getSvgX = (cost: number) => {
    const [min, max] = costExtent;
    return 60 + ((cost - min) / (max - min || 1)) * 450;
  };

  const getSvgY = (days: number) => {
    const [min, max] = daysExtent;
    // Invert Y so longer makespan is near y=45 (top), shorter makespan is near y=185 (bottom)
    return 185 - ((days - min) / (max - min || 1)) * 140;
  };

  const handleCommit = () => {
    if (activePlan) {
      onCommitPlan(activePlan);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0071e3]/10 text-xs font-semibold text-[#0071e3] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Weather-Aware Stochastic Pareto Scheduler</span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            AI Planner & World-Model Simulation
          </h2>
          <p className="text-sm text-[#86868b] mt-1 max-w-3xl leading-relaxed">
            Coupling labour squads, material supply logistics, and Open-Meteo weather physics into a single Monte Carlo loop.
            Explore the <strong>Pareto Frontier</strong> below to choose your optimal trade-off plan.
          </p>
        </div>

        {/* Selected Preset Pills */}
        <div className="flex items-center gap-2">
          {['plan-lowest-cost', 'plan-balanced', 'plan-weather-safe'].map((id) => {
            const plan = paretoPlans.find((p) => p.id === id);
            if (!plan) return null;
            const isSelected = selectedPlanId === plan.id;
            return (
              <button
                key={id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                  isSelected
                    ? 'bg-[#1d1d1f] text-white shadow-sm'
                    : 'bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f]'
                }`}
              >
                {plan.tag?.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Control Rail + Interactive Pareto Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Control Rail (Cols 1-4): Live Shock Sliders & Site Context */}
        <div className="lg:col-span-4 rounded-[28px] bg-[#f5f5f7] p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#d2d2d7]/50">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1d1d1f]">
              <Sliders className="w-4 h-4 text-[#0071e3]" />
              <span>Disruption Shock Testing</span>
            </div>
            <span className="text-[10px] text-[#86868b] font-medium">Real-Time Simulation</span>
          </div>

          {/* Slider 1: Rain Shock */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-[#1d1d1f]">
              <span>Monsoon Rain Shock:</span>
              <strong className="text-[#0071e3]">+{rainShock} mm/hr</strong>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={5}
              value={rainShock}
              onChange={(e) => setRainShock(Number(e.target.value))}
              className="w-full h-1.5 bg-[#d2d2d7] rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
            />
            <div className="flex justify-between text-[10px] text-[#86868b]">
              <span>0mm (Forecast)</span>
              <span>+20mm (Heavy)</span>
              <span>+40mm (Cloudburst)</span>
            </div>
          </div>

          {/* Slider 2: Supplier Delay Shock */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-[#1d1d1f]">
              <span>Supplier Delivery Delay:</span>
              <strong className="text-[#b64400]">+{supplierDelay} Days</strong>
            </div>
            <input
              type="range"
              min={0}
              max={3}
              step={0.5}
              value={supplierDelay}
              onChange={(e) => setSupplierDelay(Number(e.target.value))}
              className="w-full h-1.5 bg-[#d2d2d7] rounded-lg appearance-none cursor-pointer accent-[#b64400]"
            />
            <div className="flex justify-between text-[10px] text-[#86868b]">
              <span>On-Time</span>
              <span>+1.5 Days Traffic</span>
              <span>+3 Days Quarry Strike</span>
            </div>
          </div>

          {/* Slider 3: Labor Absenteeism */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-[#1d1d1f]">
              <span>Labor Absenteeism Spike:</span>
              <strong className="text-[#1b8738]">{Math.round(absenteeism * 100)}% Missing</strong>
            </div>
            <input
              type="range"
              min={0}
              max={0.25}
              step={0.05}
              value={absenteeism}
              onChange={(e) => setAbsenteeism(Number(e.target.value))}
              className="w-full h-1.5 bg-[#d2d2d7] rounded-lg appearance-none cursor-pointer accent-[#1b8738]"
            />
            <div className="flex justify-between text-[10px] text-[#86868b]">
              <span>Full Attendance</span>
              <span>15% Local Festival</span>
              <span>25% Harvest Season</span>
            </div>
          </div>

          {/* Task DAG Summary Card */}
          <div className="pt-4 border-t border-[#d2d2d7]/50 space-y-2">
            <div className="text-xs font-semibold text-[#1d1d1f] flex items-center justify-between">
              <span>G+4 Task Precedence DAG</span>
              <span className="text-[10px] text-[#86868b]">7 Sequential Tasks</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-[#86868b]">
              <div className="flex justify-between items-center">
                <span>1. Excavation → 2. PCC Sub-base</span>
                <span className="text-[#0071e3] font-medium">Outdoor (Rain-Sensitive)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>3. Rebar Tying → 4. Shuttering</span>
                <span className="text-[#1d1d1f] font-medium">Structural (Outdoor)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>5. RCC Pouring → 6. Brick Masonry</span>
                <span className="text-[#b64400] font-medium">JIT Perishable Lock</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#d2d2d7]/60 text-xs text-[#86868b] leading-normal">
            💡 <strong>Coupled Idle-Mismatch Rule:</strong> Notice that when supplier delay increases,
            SyncEngine automatically quantifies the contractor's idle wages incurred while squads wait.
          </div>
        </div>

        {/* Center: Interactive Pareto Frontier Scatter Plot (Cols 5-12) */}
        <div className="lg:col-span-8 rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[#1d1d1f]">
                Pareto Frontier Trade-Off Plot (NSGA-II)
              </h3>
              <p className="text-xs text-[#86868b]">
                Click any dot to load its synchronized schedule. Hover smoothly to inspect cost-duration trade-offs.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-[#1b8738] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1b8738]"></span> Lowest Cost
              </span>
              <span className="flex items-center gap-1.5 text-[#0071e3] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0071e3]"></span> Balanced
              </span>
              <span className="flex items-center gap-1.5 text-[#b64400] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b64400]"></span> Weather-Safe
              </span>
            </div>
          </div>

          {/* Custom Interactive SVG Scatter Plot Engine */}
          <div className="relative bg-white rounded-2xl border border-[#d2d2d7]/60 p-4 shadow-sm overflow-hidden">
            <svg
              viewBox="0 0 560 240"
              className="w-full h-64 select-none"
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {/* Grid Lines */}
              <line x1="60" y1="45" x2="510" y2="45" stroke="#f0f0f3" strokeWidth="1" />
              <line x1="60" y1="95" x2="510" y2="95" stroke="#f0f0f3" strokeWidth="1" />
              <line x1="60" y1="145" x2="510" y2="145" stroke="#f0f0f3" strokeWidth="1" />
              <line x1="60" y1="195" x2="510" y2="195" stroke="#d2d2d7" strokeWidth="1.5" />
              <line x1="60" y1="35" x2="60" y2="195" stroke="#d2d2d7" strokeWidth="1.5" />

              {/* Axis Labels */}
              <text x="60" y="215" fontSize="9" fill="#86868b" textAnchor="start">
                Low Cost ({formatINR(costExtent[0])})
              </text>
              <text x="510" y="215" fontSize="9" fill="#86868b" textAnchor="end">
                High Cost ({formatINR(costExtent[1])})
              </text>
              <text x="285" y="232" fontSize="10" fill="#1d1d1f" textAnchor="middle" fontWeight="600">
                Total Projected Cost (f₁ in ₹ INR) →
              </text>

              <text x="28" y="48" fontSize="9" fill="#86868b" textAnchor="middle">
                Slow ({Math.round(daysExtent[1])}d)
              </text>
              <text x="28" y="195" fontSize="9" fill="#86868b" textAnchor="middle">
                Fast ({Math.round(daysExtent[0])}d)
              </text>

              {/* Connecting Pareto Non-Dominated Curve */}
              <path
                d={paretoPlans.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getSvgX(p.expectedCostInr)} ${getSvgY(p.expectedMakespanDays)}`).join(' ')}
                fill="none"
                stroke="#0071e3"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                className="opacity-40"
              />

              {/* Scatter Points */}
              {paretoPlans.map((plan) => {
                const cx = getSvgX(plan.expectedCostInr);
                const cy = getSvgY(plan.expectedMakespanDays);
                const isSelected = plan.id === activePlan?.id;
                const isHovered = plan.id === hoveredPlan?.id;
                const isPreset = !!plan.tag;

                const fillColor = plan.tag === 'Lowest Cost'
                  ? '#1b8738'
                  : plan.tag === 'Weather-Safe / Fastest'
                  ? '#b64400'
                  : '#0071e3';

                return (
                  <g
                    key={plan.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedPlanId(plan.id)}
                    onMouseEnter={() => setHoveredPlan(plan)}
                  >
                    {/* Invisible Stable Hit Target - 32px diameter prevents mouse flicker */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="16"
                      fill="transparent"
                      className="cursor-pointer"
                    />

                    {/* Ring for selected plan */}
                    {isSelected && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="12"
                        fill="none"
                        stroke={fillColor}
                        strokeWidth="2.5"
                        strokeOpacity="0.8"
                        className="animate-pulse pointer-events-none"
                      />
                    )}

                    {/* Visual Point */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 7.5 : isHovered ? 6.5 : (isPreset ? 5.5 : 4)}
                      fill={fillColor}
                      stroke="#ffffff"
                      strokeWidth={isPreset || isSelected ? 2 : 1.5}
                      className="transition-all duration-150 pointer-events-none"
                    />

                    {/* Preset Badges above special points */}
                    {isPreset && (
                      <text
                        x={cx}
                        y={cy - 12}
                        fontSize="9"
                        fill="#1d1d1f"
                        fontWeight="700"
                        textAnchor="middle"
                        className="pointer-events-none select-none"
                      >
                        {plan.tag?.split(' ')[0]}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPlan && (
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#d2d2d7] shadow-lg text-xs space-y-1.5 pointer-events-none transition-all duration-200 z-10 min-w-[210px]">
                <div className="font-semibold text-[#1d1d1f] text-sm flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        hoveredPlan.tag === 'Lowest Cost'
                          ? '#1b8738'
                          : hoveredPlan.tag === 'Weather-Safe / Fastest'
                          ? '#b64400'
                          : '#0071e3',
                    }}
                  />
                  <span>{hoveredPlan.name}</span>
                </div>
                <div className="text-[#86868b] flex justify-between gap-4">
                  <span>Expected Cost:</span>
                  <strong className="text-[#1d1d1f]">{formatINR(hoveredPlan.expectedCostInr)}</strong>
                </div>
                <div className="text-[#86868b] flex justify-between gap-4">
                  <span>Makespan:</span>
                  <strong className="text-[#0071e3]">{Number(hoveredPlan.expectedMakespanDays).toFixed(1)} Days</strong>
                </div>
                <div className="text-[#86868b] flex justify-between gap-4">
                  <span>Tail Delay Risk:</span>
                  <strong className="text-[#b64400]">+{Number(hoveredPlan.tailDelayRiskCvarDays).toFixed(1)} Days</strong>
                </div>
              </div>
            )}
          </div>

          {/* Selected Plan Metrics Strip - Structured to avoid collisions and float explosions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-white border border-[#d2d2d7]/60 text-xs">
            <div className="min-w-0">
              <span className="text-[#86868b] block text-[11px] truncate">Expected Cost (f₁)</span>
              <span className="text-base font-semibold text-[#1d1d1f] block truncate">{formatINR(activePlan.expectedCostInr)}</span>
              <span className="text-[10px] text-[#86868b] block truncate mt-0.5">Total project spend</span>
            </div>
            <div className="min-w-0">
              <span className="text-[#86868b] block text-[11px] truncate">Project Makespan (f₂)</span>
              <span className="text-base font-semibold text-[#0071e3] block truncate">{Number(activePlan.expectedMakespanDays).toFixed(1)} Days</span>
              <span className="text-[10px] text-[#86868b] block truncate mt-0.5">Open-Meteo integrated</span>
            </div>
            <div className="min-w-0">
              <span className="text-[#86868b] block text-[11px] truncate">Tail Delay Risk (f₃)</span>
              <span className="text-base font-semibold text-[#b64400] block truncate">+{Number(activePlan.tailDelayRiskCvarDays).toFixed(1)} Days</span>
              <span className="text-[10px] text-[#86868b] block truncate mt-0.5">CVaR₉₀ worst-10% tail</span>
            </div>
            <div className="min-w-0">
              <span className="text-[#86868b] block text-[11px] truncate">Idle Loss Minimized</span>
              <span className="text-base font-semibold text-[#1b8738] block truncate">{formatINR(activePlan.idleLaborCostInr)}</span>
              <span className="text-[10px] text-[#86868b] block truncate mt-0.5">Coupled mismatch savings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Split View: Interactive Gantt Timeline + Resource Assignment */}
      <div className="rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d2d2d7]/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">
                Schedule & Resource Synchronisation: {activePlan.name}
              </h3>
              {committedPlanId === activePlan.id && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#eaf6ed] text-[#1b8738] text-[11px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active On Site
                </span>
              )}
            </div>
            <p className="text-xs text-[#86868b] mt-1">
              Gantt timeline integrated hour-by-hour across Open-Meteo weather physics and supplier lead-times.
            </p>
          </div>

          <button
            onClick={handleCommit}
            className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold px-6 py-2.5 rounded-full shadow-sm transition flex items-center gap-2 whitespace-nowrap"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Commit Plan to Site (Push Bookings)</span>
          </button>
        </div>

        {/* Gantt Timeline View */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#86868b] font-medium px-2">
            <span>Project Tasks (G+4 RCC Framework)</span>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Day 0</span>
              <span>•</span>
              <span>Midpoint (~{Math.round(activePlan.expectedMakespanDays / 2)}d)</span>
              <span>•</span>
              <span>Day {Math.ceil(activePlan.expectedMakespanDays)}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {activePlan.schedule.map((item, idx) => {
              const maxDays = Math.ceil(activePlan.expectedMakespanDays) || 35;
              const leftPct = (item.startDay / maxDays) * 100;
              const widthPct = ((item.endDay - item.startDay) / maxDays) * 100;
              const barColor = item.weatherRiskLevel === 'HIGH'
                ? 'bg-[#b64400]'
                : item.weatherRiskLevel === 'MEDIUM'
                ? 'bg-[#0071e3]'
                : 'bg-[#1b8738]';

              // Ensure the pill is never squished: min width 76px and fits cleanly on track
              const clampedLeft = Math.min(80, Math.max(0, leftPct));
              const effectiveWidth = Math.max(16, Math.min(100 - clampedLeft, widthPct));

              return (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#d2d2d7]/60 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="min-w-[200px] sm:min-w-[240px]">
                    <div className="font-semibold text-[#1d1d1f] text-sm">{item.taskName}</div>
                    <div className="text-[11px] text-[#86868b] mt-0.5">
                      Squad: <strong className="text-[#1d1d1f]">{item.squadName}</strong> • Yard: {item.supplierName}
                    </div>
                  </div>

                  {/* Gantt Bar Track */}
                  <div className="flex-1 min-w-[220px] sm:min-w-[320px] h-8 bg-[#f5f5f7] rounded-full relative overflow-hidden flex items-center p-1">
                    {/* Subtle Milestone Grid */}
                    <div className="absolute inset-0 flex justify-between px-4 pointer-events-none opacity-20">
                      <div className="w-px h-full bg-[#86868b]" />
                      <div className="w-px h-full bg-[#86868b]" />
                      <div className="w-px h-full bg-[#86868b]" />
                    </div>

                    {/* Active Gantt Pill */}
                    <div
                      className={`h-full rounded-full transition-all duration-300 flex items-center justify-center px-3 text-[11px] font-semibold text-white shadow-xs whitespace-nowrap min-w-[76px] ${barColor}`}
                      style={{
                        marginLeft: `${clampedLeft}%`,
                        width: `${effectiveWidth}%`,
                      }}
                    >
                      Day {Math.round(item.startDay)}–{Math.round(item.endDay)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 min-w-[130px]">
                    <span className="text-[11px] text-[#86868b] font-medium">
                      {(item.endDay - item.startDay).toFixed(0)}d duration
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        item.weatherRiskLevel === 'HIGH'
                          ? 'bg-[#ffefe6] text-[#b64400]'
                          : item.weatherRiskLevel === 'MEDIUM'
                          ? 'bg-[#0071e3]/10 text-[#0071e3]'
                          : 'bg-[#eaf6ed] text-[#1b8738]'
                      }`}
                    >
                      {item.weatherRiskLevel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
