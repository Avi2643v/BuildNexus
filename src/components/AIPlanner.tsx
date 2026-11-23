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
    return [Math.min(...days) - 1, Math.max(...days) + 1.5];
  }, [paretoPlans]);

  const getSvgX = (cost: number) => {
    const [min, max] = costExtent;
    return 40 + ((cost - min) / (max - min || 1)) * 480;
  };

  const getSvgY = (days: number) => {
    const [min, max] = daysExtent;
    // Invert Y so shorter days is higher up
    return 200 - ((days - min) / (max - min || 1)) * 160;
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
              <div className="flex justify-between">
                <span>1. Excavation $\rightarrow$ 2. PCC Sub-base</span>
                <span className="text-[#0071e3] font-medium">Outdoor (Rain-Sensitive)</span>
              </div>
              <div className="flex justify-between">
                <span>3. Rebar Tying $\rightarrow$ 4. Shuttering</span>
                <span className="text-[#1d1d1f] font-medium">Structural (Outdoor)</span>
              </div>
              <div className="flex justify-between">
                <span>5. RCC Pouring $\rightarrow$ 6. Brick Masonry</span>
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
                Click any dot to load its synchronized schedule. Dot color indicates Tail Delay Risk (CVaR 90).
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
            <svg viewBox="0 0 560 240" className="w-full h-64 select-none">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="520" y2="20" stroke="#f0f0f3" strokeWidth="1" />
              <line x1="40" y1="80" x2="520" y2="80" stroke="#f0f0f3" strokeWidth="1" />
              <line x1="40" y1="140" x2="520" y2="140" stroke="#f0f0f3" strokeWidth="1" />
              <line x1="40" y1="200" x2="520" y2="200" stroke="#d2d2d7" strokeWidth="1.5" />
              <line x1="40" y1="20" x2="40" y2="200" stroke="#d2d2d7" strokeWidth="1.5" />

              {/* Axis Labels */}
              <text x="40" y="222" fontSize="9" fill="#86868b" textAnchor="start">
                Low Cost ({formatINR(costExtent[0])})
              </text>
              <text x="520" y="222" fontSize="9" fill="#86868b" textAnchor="end">
                High Cost ({formatINR(costExtent[1])})
              </text>
              <text x="280" y="235" fontSize="10" fill="#1d1d1f" textAnchor="middle" fontWeight="600">
                Total Projected Cost ($f_1$ in ₹ INR) →
              </text>

              <text x="15" y="30" fontSize="9" fill="#86868b" textAnchor="middle">
                Fast ({daysExtent[0]}d)
              </text>
              <text x="15" y="195" fontSize="9" fill="#86868b" textAnchor="middle">
                Slow ({daysExtent[1]}d)
              </text>

              {/* Connecting Pareto Non-Dominated Curve */}
              <path
                d={paretoPlans.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getSvgX(p.expectedCostInr)} ${getSvgY(p.expectedMakespanDays)}`).join(' ')}
                fill="none"
                stroke="#0071e3"
                strokeWidth="2"
                strokeDasharray="4 3"
                className="opacity-40"
              />

              {/* Scatter Points */}
              {paretoPlans.map((plan) => {
                const cx = getSvgX(plan.expectedCostInr);
                const cy = getSvgY(plan.expectedMakespanDays);
                const isSelected = plan.id === activePlan?.id;
                const isPreset = !!plan.tag;

                const fillColor = plan.tag === 'Lowest Cost'
                  ? '#1b8738'
                  : plan.tag === 'Weather-Safe / Fastest'
                  ? '#b64400'
                  : '#0071e3';

                return (
                  <g
                    key={plan.id}
                    className="cursor-pointer transition-transform duration-200"
                    onClick={() => setSelectedPlanId(plan.id)}
                    onMouseEnter={() => setHoveredPlan(plan)}
                    onMouseLeave={() => setHoveredPlan(null)}
                  >
                    {/* Ring for selected plan */}
                    {isSelected && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="12"
                        fill="none"
                        stroke={fillColor}
                        strokeWidth="2.5"
                        className="animate-pulse"
                      />
                    )}

                    <circle
                      cx={cx}
                      cy={cy}
                      r={isPreset ? 7 : 4.5}
                      fill={fillColor}
                      stroke="#ffffff"
                      strokeWidth={isPreset ? 2 : 1}
                      className="hover:scale-125 transition-transform"
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
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-[#d2d2d7] shadow-md text-xs space-y-1 pointer-events-none">
                <div className="font-semibold text-[#1d1d1f]">{hoveredPlan.name}</div>
                <div className="text-[#86868b]">
                  Expected Cost: <strong className="text-[#1d1d1f]">{formatINR(hoveredPlan.expectedCostInr)}</strong>
                </div>
                <div className="text-[#86868b]">
                  Makespan: <strong className="text-[#0071e3]">{hoveredPlan.expectedMakespanDays} Days</strong>
                </div>
                <div className="text-[#86868b]">
                  Tail Delay Risk (CVaR_90): <strong className="text-[#b64400]">+{hoveredPlan.tailDelayRiskCvarDays} Days</strong>
                </div>
              </div>
            )}
          </div>

          {/* Selected Plan Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-[#d2d2d7]/60 text-xs">
            <div>
              <span className="text-[#86868b] block text-[11px]">Expected Cost (f1)</span>
              <span className="text-base font-semibold text-[#1d1d1f]">{formatINR(activePlan.expectedCostInr)}</span>
            </div>
            <div>
              <span className="text-[#86868b] block text-[11px]">Project Makespan (f2)</span>
              <span className="text-base font-semibold text-[#0071e3]">{activePlan.expectedMakespanDays} Days</span>
            </div>
            <div>
              <span className="text-[#86868b] block text-[11px]">Tail Delay Risk (f3)</span>
              <span className="text-base font-semibold text-[#b64400]">+{activePlan.tailDelayRiskCvarDays}d CVaR_90</span>
            </div>
            <div>
              <span className="text-[#86868b] block text-[11px]">Idle Loss Minimized</span>
              <span className="text-base font-semibold text-[#1b8738]">{formatINR(activePlan.idleLaborCostInr)}</span>
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
              Gantt timeline integrated hour-by-hour across Open-Meteo weather and supplier lead-times.
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
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#86868b] font-medium px-2">
            <span>Project Tasks (G+4 RCC Framework)</span>
            <span>Duration Timeline (Days 0 to {Math.ceil(activePlan.expectedMakespanDays)})</span>
          </div>

          <div className="space-y-2">
            {activePlan.schedule.map((item, idx) => {
              const maxDays = Math.ceil(activePlan.expectedMakespanDays) || 35;
              const leftPct = (item.startDay / maxDays) * 100;
              const widthPct = Math.max(8, ((item.endDay - item.startDay) / maxDays) * 100);

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white border border-[#d2d2d7]/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-[240px]">
                    <div className="font-semibold text-[#1d1d1f]">{item.taskName}</div>
                    <div className="text-[11px] text-[#86868b]">
                      Squad: <strong className="text-[#1d1d1f]">{item.squadName}</strong> • Supplier: {item.supplierName}
                    </div>
                  </div>

                  {/* Gantt Bar Strip */}
                  <div className="flex-1 max-w-md h-7 bg-[#f5f5f7] rounded-full relative overflow-hidden flex items-center">
                    <div
                      className={`h-full rounded-full transition-all duration-300 flex items-center justify-end pr-2 text-[10px] font-semibold text-white ${
                        item.weatherRiskLevel === 'HIGH'
                          ? 'bg-[#b64400]'
                          : item.weatherRiskLevel === 'MEDIUM'
                          ? 'bg-[#0071e3]'
                          : 'bg-[#1b8738]'
                      }`}
                      style={{
                        marginLeft: `${Math.min(85, leftPct)}%`,
                        width: `${Math.min(95 - leftPct, widthPct)}%`,
                      }}
                    >
                      Day {item.startDay.toFixed(0)}-{item.endDay.toFixed(0)}
                    </div>
                  </div>

                  <div className="text-right min-w-[120px]">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.weatherRiskLevel === 'HIGH'
                          ? 'bg-[#ffefe6] text-[#b64400]'
                          : item.weatherRiskLevel === 'MEDIUM'
                          ? 'bg-[#0071e3]/10 text-[#0071e3]'
                          : 'bg-[#eaf6ed] text-[#1b8738]'
                      }`}
                    >
                      {item.weatherRiskLevel} Risk
                    </span>
                    {item.idleDays > 0 && (
                      <span className="block text-[10px] text-[#b64400] font-medium mt-0.5">
                        +{item.idleDays}d Idle Wait
                      </span>
                    )}
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
