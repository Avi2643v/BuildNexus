'use client';

import React, { useState } from 'react';
import { formatINR } from '@/lib/utils';
import {
  Sparkles,
  GitBranch,
  Video,
  TrendingUp,
  Brain,
  Send,
  CheckCircle2,
  Activity,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const AISuiteView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'copilot' | 'sthgnn' | 'vision' | 'forecaster'>('copilot');

  // Copilot State
  const [chatLog, setChatLog] = useState([
    {
      role: 'ai',
      text: 'BuildNexus Intelligence ready. Ask for IS 456 Bill of Quantities, mix design calculations, or labor sizing.',
    },
    {
      role: 'user',
      text: 'Estimate materials and labor needed for a 1,200 sq.ft residential RCC roof slab (5-inch thickness).',
    },
    {
      role: 'ai',
      text: `📊 Automated BOQ Estimation (IS 456 Standards):
• Concrete Volume: 14.15 m³ (M25 Grade)
• Cement Required: ~118 Bags (UltraTech 53 Grade)
• TMT Steel Rebar (8mm & 10mm): 1.15 Metric Tons
• River Sand / M-Sand: 22 Metric Tons
• Recommended Crew: 1 Bar-Bending Gang (8 men) + 1 Pouring Gang (12 men on pour day).
• Estimated Direct Procurement Cost: ₹1,84,500 (14.8% below street rates).`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // ST-HGNN State
  const [siteLocation, setSiteLocation] = useState('Site 4B, Koramangala');
  const [requiredTrade, setRequiredTrade] = useState('Ready-Mix Pourers & Vibrators');
  const [requiredVolume, setRequiredVolume] = useState('14 m³ RMC Concrete');
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);

  // Vision State
  const [analyzingVideo, setAnalyzingVideo] = useState(false);
  const [visionReport, setVisionReport] = useState<any>({
    status: 'READY',
    trade: 'Master Masonry (English Bond)',
    sparcSmoothness: '0.94 / 1.0 (High Rhythm)',
    postureErgonomics: 'Low Strain (REBA: 2)',
    plumbVariance: '± 1.2 mm (Architectural Grade)',
    certifiedGrade: 'Grade A+ (Verified Skilled)',
  });

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatLog((prev) => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      setChatLog((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `Intelligence Analysis for "${userMsg}": Regional batch availability within a 6km radius is currently optimal. Procuring directly through BuildNexus locks in an estimated 14% cost efficiency.`,
        },
      ]);
    }, 1000);
  };

  const handleRunSTHGNN = () => {
    setIsMatching(true);
    setMatchResult(null);
    setTimeout(() => {
      setIsMatching(false);
      setMatchResult({
        score: '96.8%',
        laborNode: 'Bihari Bhai Concreting Squad (12 Men • 4.1 km)',
        materialNode: 'Lakshmi Building Supplies (Yeshwanthpur • 4.2 km)',
        syncWindow: 'Today 11:30 AM — 01:00 PM',
        expectedIdleSavings: '₹4,800 saved in eliminated wait-hours',
      });
    }, 1500);
  };

  const handleSimulateVideoScan = () => {
    setAnalyzingVideo(true);
    setTimeout(() => {
      setAnalyzingVideo(false);
      setVisionReport({
        status: 'VERIFIED',
        trade: 'TMT Steel Bar-Bending & Column Cage Tying',
        sparcSmoothness: '0.92 / 1.0 (Fluid Keypoints)',
        postureErgonomics: 'Moderate (REBA: 3)',
        plumbVariance: '± 0.8 mm (High Rigidity)',
        certifiedGrade: 'Grade A (Master Craftsman)',
      });
    }, 2000);
  };

  return (
    <div className="space-y-10">
      {/* Title with Apple Intelligence Aura */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#ff5e3a]/10 via-[#ff2a68]/10 to-[#9b51e0]/10 text-xs font-semibold text-[#1d1d1f] mb-2 border border-black/[0.04]">
          <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
          <span>BuildNexus Intelligence</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
          Intelligence. Integrated into every build.
        </h2>
        <p className="text-lg text-[#86868b] font-normal mt-1">
          Deep neural networks tailored for real-world construction logistics and workforce verification.
        </p>
      </div>

      {/* Apple Capsule Sub-Pill Controls */}
      <div className="inline-flex items-center bg-[#e8e8ed]/70 p-1 rounded-full text-xs font-medium overflow-x-auto max-w-full no-scrollbar">
        {[
          { id: 'copilot', label: 'NexusBot IS 456 Co-pilot' },
          { id: 'sthgnn', label: 'ST-HGNN Tripartite Matcher' },
          { id: 'vision', label: 'Video Proof-of-Skill' },
          { id: 'forecaster', label: '30-Day Commodity Forecaster' },
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'bg-[#1d1d1f] text-white shadow-sm'
                  : 'text-[#1d1d1f] hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SUB-MODULE 1: NEXUSBOT COPILOT */}
      {activeSubTab === 'copilot' && (
        <div className="rounded-[28px] bg-[#f5f5f7] p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#d2d2d7]/50">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">
                NexusBot Co-pilot
              </h3>
              <p className="text-xs text-[#86868b]">
                Trained on Indian Standards (IS 456, IS 1200) for structural quantities and mix design.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#1b8738] bg-[#eaf6ed] px-3 py-1 rounded-full">
              Ready
            </span>
          </div>

          <div className="h-80 overflow-y-auto space-y-3 p-4 rounded-2xl bg-white border border-[#d2d2d7]/60 text-xs sm:text-sm no-scrollbar">
            {chatLog.map((c, i) => (
              <div
                key={i}
                className={`flex flex-col ${c.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-[#86868b] mb-1 px-1">
                  {c.role === 'user' ? 'Site Engineer' : 'BuildNexus Intelligence'}
                </span>
                <div
                  className={`max-w-[85%] rounded-[20px] p-4 whitespace-pre-line leading-relaxed ${
                    c.role === 'user'
                      ? 'bg-[#0071e3] text-white rounded-br-sm'
                      : 'bg-[#f5f5f7] text-[#1d1d1f] rounded-bl-sm'
                  }`}
                >
                  {c.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask for cement bags for 500 sq.ft brickwork, or mix design specs..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              className="flex-1 px-4 py-2.5 rounded-full bg-white border border-[#d2d2d7] text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
            />
            <button
              onClick={handleSendChat}
              className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium px-5 py-2.5 rounded-full transition shadow-sm"
            >
              Ask
            </button>
          </div>
        </div>
      )}

      {/* SUB-MODULE 2: ST-HGNN TRIPARTITE MATCHING */}
      {activeSubTab === 'sthgnn' && (
        <div className="rounded-[28px] bg-[#f5f5f7] p-8 space-y-6">
          <div className="pb-4 border-b border-[#d2d2d7]/50">
            <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">
              Spatio-Temporal Graph Neural Network
            </h3>
            <p className="text-xs text-[#86868b] mt-1">
              Synchronizing Site Requirements ↔ Labor Squads ↔ Material Yards in a unified hypergraph.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-[#86868b] font-medium block mb-1">Site Location Node</label>
              <input
                type="text"
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white border border-[#d2d2d7] font-semibold text-[#1d1d1f]"
              />
            </div>
            <div>
              <label className="text-[#86868b] font-medium block mb-1">Required Labor Trade</label>
              <select
                value={requiredTrade}
                onChange={(e) => setRequiredTrade(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white border border-[#d2d2d7] font-semibold text-[#1d1d1f]"
              >
                <option>Ready-Mix Pourers & Vibrators</option>
                <option>Master Masonry & Bricklaying</option>
                <option>TMT Steel Bar-Benders</option>
                <option>Shuttering Carpenters</option>
              </select>
            </div>
            <div>
              <label className="text-[#86868b] font-medium block mb-1">Material Batch Ingestion</label>
              <input
                type="text"
                value={requiredVolume}
                onChange={(e) => setRequiredVolume(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white border border-[#d2d2d7] font-semibold text-[#1d1d1f]"
              />
            </div>
          </div>

          <button
            onClick={handleRunSTHGNN}
            disabled={isMatching}
            className="w-full py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium transition shadow-sm"
          >
            {isMatching ? 'Propagating Attention Layers...' : 'Run ST-HGNN Tripartite Optimization'}
          </button>

          {matchResult && (
            <div className="p-6 rounded-2xl bg-white border border-[#d2d2d7]/60 space-y-4 animate-fade-in text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#d2d2d7]/40">
                <span className="font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1b8738]" /> Optimal Tripartite Match Formed
                </span>
                <span className="bg-[#eaf6ed] text-[#1b8738] px-3 py-0.5 rounded-full font-semibold">
                  Match Score: {matchResult.score}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#1d1d1f]">
                <div>
                  <span className="text-[11px] text-[#86868b] block">Allocated Labor Squad</span>
                  <span className="font-semibold">{matchResult.laborNode}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#86868b] block">Allocated Supplier Yard</span>
                  <span className="font-semibold">{matchResult.materialNode}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#86868b] block">Synchronized Delivery Window</span>
                  <span className="font-semibold text-[#b64400]">{matchResult.syncWindow}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#86868b] block">Efficiency Impact</span>
                  <span className="font-semibold text-[#1b8738]">{matchResult.expectedIdleSavings}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-MODULE 3: VISION SKILL VERIFIER */}
      {activeSubTab === 'vision' && (
        <div className="rounded-[28px] bg-[#f5f5f7] p-8 space-y-6">
          <div className="pb-4 border-b border-[#d2d2d7]/50">
            <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">
              Computer Vision "Proof-of-Skill" Scanner
            </h3>
            <p className="text-xs text-[#86868b] mt-1">
              Extracts 33 skeletal joint trajectories and SPARC fluidity metrics from 10-second smartphone clips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64 rounded-2xl bg-white border border-[#d2d2d7]/60 flex flex-col items-center justify-center p-6 text-center">
              <Activity className="w-10 h-10 text-[#0071e3] mb-3 animate-pulse" />
              <div className="text-sm font-semibold text-[#1d1d1f]">
                {analyzingVideo ? 'Computing Kinematic Matrix...' : 'Skeletal Kinematic Analyzer'}
              </div>
              <p className="text-xs text-[#86868b] mt-1 max-w-xs">
                YOLOv11-Pose measures wrist angular velocity, postural strain, and tool plumbness.
              </p>
              <button
                onClick={handleSimulateVideoScan}
                disabled={analyzingVideo}
                className="mt-5 px-5 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium transition shadow-sm"
              >
                {analyzingVideo ? 'Analyzing...' : 'Simulate Video Verification'}
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#d2d2d7]/60 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#d2d2d7]/40">
                <span className="font-semibold text-[#1d1d1f]">Biomechanical Audit</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#eaf6ed] text-[#1b8738] font-semibold">
                  {visionReport.certifiedGrade}
                </span>
              </div>

              <div className="space-y-2 text-[#1d1d1f]">
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Trade Classification:</span>
                  <span className="font-semibold">{visionReport.trade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">SPARC Smoothness Metric:</span>
                  <span className="font-semibold text-[#0071e3]">{visionReport.sparcSmoothness}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Ergonomic Strain Index:</span>
                  <span className="font-semibold text-[#1b8738]">{visionReport.postureErgonomics}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Dimensional Plumb Variance:</span>
                  <span className="font-semibold">{visionReport.plumbVariance}</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-[#86868b] border-t border-[#d2d2d7]/40 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1b8738]" />
                <span>Replaces text resumes with verifiable computer vision credentials.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODULE 4: TFT COMMODITY FORECASTER */}
      {activeSubTab === 'forecaster' && (
        <div className="rounded-[28px] bg-[#f5f5f7] p-8 space-y-6">
          <div className="pb-4 border-b border-[#d2d2d7]/50">
            <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">
              Temporal Fusion Transformer Price Forecaster
            </h3>
            <p className="text-xs text-[#86868b] mt-1">
              Multi-horizon quantile forecasting (P₁₀, P₅₀, P₉₀) factoring in weather, freight, and commodity futures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#d2d2d7]/60 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-[#1d1d1f]">UltraTech 53 Grade (50kg)</h4>
                  <span className="text-xs text-[#86868b]">Spot Rate: <strong>₹365/bag</strong></span>
                </div>
                <span className="text-[#b64400] font-semibold bg-[#ffefe6] px-2.5 py-0.5 rounded-full">
                  ▲ Upward Trend
                </span>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-[#d2d2d7]/40 text-[#1d1d1f]">
                <div className="flex justify-between">
                  <span className="text-[#86868b]">7-Day P50 Median:</span>
                  <span className="font-semibold">₹372 (+₹7)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">14-Day P90 Worst Case:</span>
                  <span className="font-semibold text-[#b64400]">₹380 (+₹15)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Primary Driver:</span>
                  <span className="text-xs">Monsoon freight diesel surcharge (+4%)</span>
                </div>
              </div>

              <div className="p-3 bg-[#f5f5f7] rounded-xl text-xs text-[#0071e3] font-medium">
                Recommendation: Procure within 48 hours to save approx ₹3,500 on 500 bags.
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#d2d2d7]/60 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-[#1d1d1f]">Tata Tiscon 550D Rebar (Ton)</h4>
                  <span className="text-xs text-[#86868b]">Spot Rate: <strong>₹62,400/ton</strong></span>
                </div>
                <span className="text-[#1b8738] font-semibold bg-[#eaf6ed] px-2.5 py-0.5 rounded-full">
                  ▼ Softening
                </span>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-[#d2d2d7]/40 text-[#1d1d1f]">
                <div className="flex justify-between">
                  <span className="text-[#86868b]">7-Day P50 Median:</span>
                  <span className="font-semibold">₹62,100 (-₹300)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">14-Day P10 Best Case:</span>
                  <span className="font-semibold text-[#1b8738]">₹61,500 (-₹900)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Primary Driver:</span>
                  <span className="text-xs">Domestic iron ore supply surplus</span>
                </div>
              </div>

              <div className="p-3 bg-[#f5f5f7] rounded-xl text-xs text-[#1b8738] font-medium">
                Recommendation: Delay bulk steel procurement until Tuesday to capture price softening.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
