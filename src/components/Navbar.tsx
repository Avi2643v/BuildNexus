'use client';

import React from 'react';
import { DEMO_PERSONAS, UserPersona } from '@/lib/mockData';
import {
  HardHat,
  LayoutDashboard,
  ShoppingCart,
  Users,
  MessageSquare,
  BookOpen,
  Truck,
  Brain,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserPersona['role'];
  onRoleChange: (role: UserPersona['role']) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
}) => {
  const currentPersona = DEMO_PERSONAS.find((p) => p.role === currentRole) || DEMO_PERSONAS[0];

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'marketplace', label: 'Wholesale Materials', icon: ShoppingCart },
    { id: 'labour', label: 'Labor Squads', icon: Users },
    { id: 'chat', label: 'Private Negotiation', icon: MessageSquare },
    { id: 'khata', label: 'Digital Khata', icon: BookOpen },
    { id: 'delivery', label: 'Live Dispatch', icon: Truck },
    { id: 'ai-suite', label: 'AI SuperCore', icon: Brain, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-lg backdrop-blur-md">
      {/* Top Banner: Verification & Persona Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-2 border-b border-slate-800 gap-2">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <HardHat className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-['Space_Grotesk']">
                  BuildNexus<span className="text-blue-500">Hub</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  v2.0 • AI Orchestrated
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                The Digital Era of Construction — <span className="text-amber-400 font-semibold">Build Smarter. Pay Fairly.</span>
              </p>
            </div>
          </div>

          {/* Persona Switcher Pill */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Active Persona:</span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserPersona['role'])}
              className="bg-transparent text-xs font-bold text-amber-400 focus:outline-none cursor-pointer"
            >
              {DEMO_PERSONAS.map((p) => (
                <option key={p.id} value={p.role} className="bg-slate-900 text-white">
                  {p.avatar} {p.name} ({p.role})
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
              <ShieldCheck className="w-3 h-3" />
              <span>KYC: {currentPersona.maskedId}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? item.highlight
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                      : 'bg-blue-600 text-white shadow-sm'
                    : item.highlight
                    ? 'text-amber-400 hover:bg-slate-800/80 border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
