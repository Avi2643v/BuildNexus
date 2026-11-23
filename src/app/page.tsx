'use client';

import React, { useState } from 'react';
import { UserPersona } from '@/lib/mockData';
import { Navbar } from '@/components/Navbar';
import { DashboardView } from '@/components/DashboardView';
import { MarketplaceView } from '@/components/MarketplaceView';
import { LabourView } from '@/components/LabourView';
import { ChatView } from '@/components/ChatView';
import { KhataView } from '@/components/KhataView';
import { DeliveryView } from '@/components/DeliveryView';
import { AISuiteView } from '@/components/AISuiteView';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<UserPersona['role']>('CONTRACTOR');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const filterTabs = [
    { id: 'dashboard', label: 'All features' },
    { id: 'marketplace', label: 'Materials' },
    { id: 'labour', label: 'Labor' },
    { id: 'chat', label: 'Negotiation' },
    { id: 'khata', label: 'Digital Khata' },
    { id: 'delivery', label: 'Dispatch' },
    { id: 'ai-suite', label: 'AI Intelligence' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1d1d1f] font-sans selection:bg-[#0071e3] selection:text-white">
      {/* 1. Global Apple Header & Sub-Nav Chapter Ribbon */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 2. Apple Hero Typography Section (as seen in Image 1: "Mac") */}
      <section className="max-w-5xl w-full mx-auto px-4 pt-10 sm:pt-16 pb-6">
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight text-[#1d1d1f]">
          BuildNexus
        </h1>
        <p className="text-2xl sm:text-3xl font-medium text-[#86868b] tracking-tight mt-1.5">
          The future of construction. Re-engineered.
        </p>

        {/* 3. "Explore the lineup." & Capsule Pill Segmented Control (as seen in Image 1 & 3) */}
        <div className="mt-12 pt-8 border-t border-[#d2d2d7]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            Explore the platform.
          </h2>

          {/* Capsule Segmented Control */}
          <div className="inline-flex items-center bg-[#e8e8ed]/70 p-1 rounded-full text-xs font-medium overflow-x-auto max-w-full no-scrollbar">
            {filterTabs.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1d1d1f] text-white shadow-sm'
                      : 'text-[#1d1d1f] hover:text-black'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Main Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pb-20 pt-4">
        {activeTab === 'dashboard' && <DashboardView onTabChange={setActiveTab} />}
        {activeTab === 'marketplace' && <MarketplaceView />}
        {activeTab === 'labour' && <LabourView />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'khata' && <KhataView />}
        {activeTab === 'delivery' && <DeliveryView />}
        {activeTab === 'ai-suite' && <AISuiteView />}
      </main>

      {/* 5. Minimal Apple Footer */}
      <footer className="bg-[#f5f5f7] border-t border-[#d2d2d7]/50 py-10 text-[12px] text-[#86868b]">
        <div className="max-w-5xl mx-auto px-4 space-y-4">
          <div className="text-[11px] leading-relaxed border-b border-[#d2d2d7]/40 pb-4">
            * BuildNexus 100% Fair Wage Guarantee applies to all verified labor squads on the platform.
            Ready-Mix Concrete transit times are calculated based on live GPS telemetry and ASTM C94 specifications.
            Prices shown are regional manufacturer spot rates subject to daily commodity updates.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              Copyright © 2026 BuildNexus Inc. All rights reserved. B.Tech Computer Science & Engineering.
            </div>
            <div className="flex items-center space-x-4 text-[#424245]">
              <span className="hover:text-black cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-black cursor-pointer">Terms of Use</span>
              <span>•</span>
              <span className="hover:text-black cursor-pointer">Sales Policy</span>
              <span>•</span>
              <span className="hover:text-black cursor-pointer">Legal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
