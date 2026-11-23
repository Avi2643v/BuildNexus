'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DEMO_PERSONAS, UserPersona } from '@/lib/mockData';
import { CandidatePlan } from '@/lib/syncEngine';
import { SiteCockpit } from '@/components/SiteCockpit';
import { AIPlanner } from '@/components/AIPlanner';
import { ProcurementWorkspace } from '@/components/ProcurementWorkspace';
import { WorkforceWorkspace } from '@/components/WorkforceWorkspace';
import { KhataWorkspace } from '@/components/KhataWorkspace';
import {
  HardHat,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';

export default function WorkspaceApp() {
  const [currentRole, setCurrentRole] = useState<UserPersona['role']>('CONTRACTOR');
  const [activeTab, setActiveTab] = useState<'cockpit' | 'planner' | 'procurement' | 'workforce' | 'khata'>('cockpit');
  const [activeSite, setActiveSite] = useState<string>('Salt Lake G+4 Project (Kolkata)');

  // Global reactive committed plan state
  const [committedPlan, setCommittedPlan] = useState<CandidatePlan | null>(null);
  const [commitNotice, setCommitNotice] = useState<string | null>(null);

  const currentPersona = DEMO_PERSONAS.find((p) => p.role === currentRole) || DEMO_PERSONAS[0];

  const handleCommitPlan = (plan: CandidatePlan) => {
    setCommittedPlan(plan);
    setCommitNotice(`Committed ${plan.name} to site. Synced Procurement orders, Workforce rosters, and Khata ledger!`);
    setTimeout(() => setCommitNotice(null), 4500);
  };

  const navItems = [
    { id: 'cockpit', label: 'Site Cockpit' },
    { id: 'planner', label: 'AI Planner ★', highlight: true },
    { id: 'procurement', label: 'Procurement' },
    { id: 'workforce', label: 'Workforce' },
    { id: 'khata', label: 'Digital Khata' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1d1d1f] font-sans selection:bg-[#0071e3] selection:text-white">
      {/* SINGLE UNIFIED LOGGED-IN HEADER (Clean 1-Bar Navigation) */}
      <header className="sticky top-0 z-50 bg-[#161617]/90 text-[#f5f5f7] backdrop-blur-md border-b border-white/10 text-[12px] select-none">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
          {/* Left: Brand + Back to Overview Link */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition text-[#f5f5f7]"
            >
              <div className="w-5 h-5 text-white">
                <HardHat className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-white tracking-tight text-[13px]">
                BuildNexus
              </span>
            </Link>

            <span className="text-white/20">|</span>

            {/* Navigation Tabs */}
            <nav className="flex items-center space-x-1 sm:space-x-2">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      isActive
                        ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold'
                        : item.highlight
                        ? 'text-[#2997ff] hover:text-white'
                        : 'text-[#f5f5f7]/75 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Active Site Picker + Clean KYC Profile & Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Site Picker */}
            <div className="hidden md:flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[11px] text-[#f5f5f7] border border-white/10">
              <span className="text-[#86868b]">Site:</span>
              <select
                value={activeSite}
                onChange={(e) => setActiveSite(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-[11px]"
              >
                <option value="Salt Lake G+4 Project (Kolkata)" className="bg-[#1d1d1f] text-white">
                  Salt Lake G+4 (Kolkata)
                </option>
                <option value="Site 4B Koramangala (Bengaluru)" className="bg-[#1d1d1f] text-white">
                  Site 4B Koramangala
                </option>
                <option value="New Town Tower B" className="bg-[#1d1d1f] text-white">
                  New Town Tower B
                </option>
              </select>
            </div>

            {/* Role Switcher Pill */}
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-[11px] text-[#f5f5f7] border border-white/10">
              <span className="text-[#86868b]">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserPersona['role'])}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-[11px]"
              >
                {DEMO_PERSONAS.map((p) => (
                  <option key={p.id} value={p.role} className="bg-[#1d1d1f] text-white">
                    {p.name.split(' ')[0]} ({p.role})
                  </option>
                ))}
              </select>
              <span title="KYC Verified">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1b8738]" />
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Commit Banner Toast Notification */}
      {commitNotice && (
        <div className="bg-[#eaf6ed] border-b border-[#1b8738]/20 px-4 py-2.5 text-xs text-[#1b8738] font-medium flex items-center justify-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#1b8738]" />
          <span>{commitNotice}</span>
        </div>
      )}

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'cockpit' && (
          <SiteCockpit
            onNavigateTab={(tab) => setActiveTab(tab as any)}
            committedPlanName={committedPlan?.name}
          />
        )}
        {activeTab === 'planner' && (
          <AIPlanner
            onCommitPlan={handleCommitPlan}
            committedPlanId={committedPlan?.id}
          />
        )}
        {activeTab === 'procurement' && (
          <ProcurementWorkspace
            committedOrdersCount={committedPlan?.schedule.length || 0}
          />
        )}
        {activeTab === 'workforce' && (
          <WorkforceWorkspace
            committedPlanName={committedPlan?.name}
            committedSchedule={committedPlan?.schedule}
          />
        )}
        {activeTab === 'khata' && (
          <KhataWorkspace
            committedPlanSavings={committedPlan?.idleLaborCostInr ? Math.round(committedPlan.idleLaborCostInr * 0.4) : 7364}
          />
        )}
      </main>

      {/* Minimal App Footer */}
      <footer className="bg-[#f5f5f7] border-t border-[#d2d2d7]/50 py-6 text-xs text-[#86868b]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            BuildNexus Hub • Active Site: <strong>{activeSite}</strong>
          </div>
          <div>
            SyncEngine Weather-Aware Stochastic Pareto Scheduler • B.Tech CSE
          </div>
        </div>
      </footer>
    </div>
  );
}
