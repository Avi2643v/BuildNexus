'use client';

import React, { useState } from 'react';
import { formatINR } from '@/lib/utils';
import {
  Brain,
  Sparkles,
  Cpu,
  Video,
  TrendingUp,
  Activity,
  CheckCircle2,
  Send,
  GitBranch,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const AISuiteView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'copilot' | 'sthgnn' | 'vision' | 'forecaster'>('copilot');

  // Copilot State
  const [chatLog, setChatLog] = useState([
    {
      role: 'ai',
      text: 'Hello Engineer! I am NexusBot AI. Ask me for Bill of Quantities (BOQ) estimation, concrete mix designs (IS 456), or labor sizing.',
    },
    {
      role: 'user',
      text: 'Estimate materials and labor needed for a 1,200 sq.ft residential RCC roof slab (5-inch thickness).',
    },
    {
      role: 'ai',
      text: `📊 **Automated BOQ Estimation (IS 456 Standards)**:
• **Concrete Volume**: 14.15 m³ (M20 / M25 Grade)
• **Cement Required**: ~118 Bags (UltraTech 53 Grade)
• **TMT Steel Rebar (8mm & 10mm)**: 1.15 Metric Tons
• **River Sand / M-Sand**: 22 Metric Tons
• **Recommended Crew**: 1 Bar-Bending Gang (8 men for 2 days) + 1 Pouring Gang (12 men on pour day).
• **Estimated Raw Material Cost**: ₹1,84,500 (Direct Yard Rate via BuildNexus).`,
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
    postureErgonomics: 'Low Strain (REBA Score: 2)',
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
          text: `NexusBot Intelligence response: Analyzing your query "${userMsg}". Current local market parameters show favorable spot rates for procurement within a 6km radius.`,
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
        jointLoss: '0.032 (Converged)',
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
        postureErgonomics: 'Moderate (REBA Score: 3)',
        plumbVariance: '± 0.8 mm (High Rigidity)',
        certifiedGrade: 'Grade A (Master Craftsman)',
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-indigo-900/80 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-3 border border-indigo-500/30">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Proprietary Artificial Intelligence Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-['Space_Grotesk'] text-white">
            BuildNexus AI SuperCore Engine
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Going beyond naive e-commerce matching: deploying <strong>Spatio-Temporal Graph Neural Networks</strong>,{' '}
            <strong>Deep Kinematic Action Recognition</strong>, and <strong>Multi-Horizon Quantile Price Forecasting</strong>.
          </p>

          {/* Sub-Tabs */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { id: 'copilot', label: 'NexusBot Copilot', icon: Brain },
              { id: 'sthgnn', label: 'ST-HGNN Tripartite Matcher', icon: GitBranch },
              { id: 'vision', label: 'Vision Skill Verifier (ST-GCN)', icon: Video },
              { id: 'forecaster', label: 'TFT Commodity Forecaster', icon: TrendingUp },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SUB-MODULE 1: NEXUSBOT COPILOT */}
      {activeSubTab === 'copilot' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-black text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                <span>NexusBot: AI Civil Engineering Assistant</span>
              </h2>
              <p className="text-xs text-slate-500">
                Trained on Indian Standards (IS 456, IS 1200) for instant structural quantities, mix proportions, and schedules.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Online • LLM Co-Pilot
            </span>
          </div>

          {/* Chat Window */}
          <div className="h-80 overflow-y-auto space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
            {chatLog.map((c, i) => (
              <div
                key={i}
                className={`flex flex-col ${c.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[10px] font-bold text-slate-400 mb-1 px-1">
                  {c.role === 'user' ? 'Site Contractor' : 'NexusBot AI'}
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-sm whitespace-pre-line leading-relaxed ${
                    c.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {c.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask for cement bags for 500 sq.ft brickwork, or beam reinforcement specs..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendChat}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition"
            >
              <Send className="w-4 h-4" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-MODULE 2: ST-HGNN TRIPARTITE MATCHING */}
      {activeSubTab === 'sthgnn' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-black text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-blue-600" />
                <span>Spatio-Temporal Heterogeneous Graph Neural Network (ST-HGNN)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Solving the 3-Way Synchronization Puzzle: Site Requirement $\leftrightarrow$ Labor Gang $\leftrightarrow$ Material Supplier.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              Graph Attention Engine
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Site Node (V_s)
              </label>
              <input
                type="text"
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Labor Requirement (V_l)
              </label>
              <select
                value={requiredTrade}
                onChange={(e) => setRequiredTrade(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white"
              >
                <option>Ready-Mix Pourers & Vibrators</option>
                <option>Master Masonry & Bricklaying</option>
                <option>TMT Steel Bar-Benders</option>
                <option>Shuttering Carpenters</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Material Ingestion (V_m)
              </label>
              <input
                type="text"
                value={requiredVolume}
                onChange={(e) => setRequiredVolume(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          <button
            onClick={handleRunSTHGNN}
            disabled={isMatching}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>{isMatching ? 'Propagating Attention Layers...' : 'Execute ST-HGNN Hyperedge Optimization'}</span>
          </button>

          {matchResult && (
            <div className="p-5 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-4 animate-fade-in text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Optimal Tripartite Match Computed
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold">
                  Compatibility: {matchResult.score}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Synced Labor Gang</span>
                  <span className="text-white font-bold">{matchResult.laborNode}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Synced Supplier Yard</span>
                  <span className="text-white font-bold">{matchResult.materialNode}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Synchronized Dispatch Window</span>
                  <span className="text-amber-400 font-bold">{matchResult.syncWindow}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Projected Impact</span>
                  <span className="text-emerald-400 font-bold">{matchResult.expectedIdleSavings}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-MODULE 3: VISION SKILL VERIFIER */}
      {activeSubTab === 'vision' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-black text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-600" />
                <span>Computer Vision "Proof-of-Skill" Scanner (ST-GCN)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Extracting skeletal joint kinematics & SPARC smoothness metrics from 10-second smartphone clips.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
              Pose Kinematics Core
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visualizer Frame */}
            <div className="h-64 rounded-xl bg-slate-950 border border-slate-800 relative flex flex-col items-center justify-center p-4 text-center overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-purple-900/50 text-purple-400 flex items-center justify-center mb-3 border border-purple-500/30">
                <Activity className="w-8 h-8 animate-pulse" />
              </div>
              <div className="text-xs text-slate-300 font-bold">
                {analyzingVideo ? 'Tracking 33 Skeletal Keypoints...' : 'Skeletal Kinematic Pose Stream'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                YOLOv11-Pose extracts joint angular velocity, plumb-line alignment, and tool holding curvature.
              </p>

              <button
                onClick={handleSimulateVideoScan}
                disabled={analyzingVideo}
                className="mt-4 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition"
              >
                {analyzingVideo ? 'Processing Kinematic Matrix...' : 'Simulate Video Upload & Audit'}
              </button>
            </div>

            {/* Audit Results Card */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                  Worker Verification Report
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">
                  {visionReport.certifiedGrade}
                </span>
              </div>

              <div className="space-y-2 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Classified Trade:</span>
                  <span className="font-bold text-slate-900">{visionReport.trade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SPARC Smoothness Metric:</span>
                  <span className="font-bold text-blue-600">{visionReport.sparcSmoothness}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ergonomic Safety Strain:</span>
                  <span className="font-bold text-emerald-600">{visionReport.postureErgonomics}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Plumb / Dimensional Variance:</span>
                  <span className="font-bold text-slate-900">{visionReport.plumbVariance}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-100/70 border border-emerald-300 rounded-lg text-emerald-900 text-[11px] font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Verified: Replaces subjective references with tamper-proof mathematical certification.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODULE 4: TFT PRICE FORECASTER */}
      {activeSubTab === 'forecaster' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-black text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <span>Temporal Fusion Transformer (TFT) Price Forecaster</span>
              </h2>
              <p className="text-xs text-slate-500">
                Multi-Horizon Probabilistic Quantile Forecasting ($P_{10}, P_{50}, P_{90}$) based on weather, freight, and commodity futures.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              Quantile Transformer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Cement Card */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">UltraTech 53 Grade (50kg)</h3>
                  <span className="text-[11px] text-slate-500">Current Spot Rate: <strong>₹365/bag</strong></span>
                </div>
                <span className="text-rose-600 font-bold bg-rose-100 px-2 py-0.5 rounded">
                  ▲ Upward Trend Expected
                </span>
              </div>

              {/* Forecast Simulation Bars */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600">7-Day P50 Median:</span>
                  <span className="font-bold text-slate-800">₹372 (+₹7)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600">14-Day P90 Worst Case:</span>
                  <span className="font-bold text-rose-600">₹380 (+₹15)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600">Driver Reason:</span>
                  <span className="font-medium text-slate-700">Monsoon freight diesel surcharge (+4%)</span>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-blue-900 font-bold text-[11px]">
                💡 AI Recommendation: Procure your 500-bag batch within 48 hours to save ~₹3,500.
              </div>
            </div>

            {/* Steel Card */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Tata Tiscon 550D Rebar (Ton)</h3>
                  <span className="text-[11px] text-slate-500">Current Spot Rate: <strong>₹62,400/ton</strong></span>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                  ▼ Stable / Softening
                </span>
              </div>

              {/* Forecast Simulation Bars */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600">7-Day P50 Median:</span>
                  <span className="font-bold text-slate-800">₹62,100 (-₹300)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600">14-Day P10 Best Case:</span>
                  <span className="font-bold text-emerald-700">₹61,500 (-₹900)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600">Driver Reason:</span>
                  <span className="font-medium text-slate-700">Domestic iron ore supply surplus</span>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 font-bold text-[11px]">
                💡 AI Recommendation: Delay bulk steel procurement until next Tuesday to capture price drop.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
