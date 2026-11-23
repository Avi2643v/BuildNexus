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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Universal Top Navigation & Role Bar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && <DashboardView onTabChange={setActiveTab} />}
        {activeTab === 'marketplace' && <MarketplaceView />}
        {activeTab === 'labour' && <LabourView />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'khata' && <KhataView />}
        {activeTab === 'delivery' && <DeliveryView />}
        {activeTab === 'ai-suite' && <AISuiteView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-slate-800">BuildNexus Hub</strong> — AI-Synchronized Construction Operating System
          </div>
          <div className="text-slate-400">
            Innovative Project • 100% Fair Wage Guarantee • B.Tech CSE 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
