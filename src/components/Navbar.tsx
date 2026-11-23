'use client';

import React from 'react';
import { DEMO_PERSONAS, UserPersona } from '@/lib/mockData';
import {
  HardHat,
  Search,
  ShoppingBag,
  Layers,
  Users,
  MessageSquare,
  BookOpen,
  Truck,
  Sparkles,
  ShieldCheck,
  ChevronRight,
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

  // Chapter Navigation Ribbon items (as seen in Apple Mac/iPad page)
  const chapterItems = [
    {
      id: 'dashboard',
      label: 'Overview',
      badge: '',
      icon: Layers,
    },
    {
      id: 'marketplace',
      label: 'Materials',
      badge: 'New',
      icon: ShoppingBag,
    },
    {
      id: 'labour',
      label: 'Labor Squads',
      badge: '',
      icon: Users,
    },
    {
      id: 'chat',
      label: 'Negotiation',
      badge: '',
      icon: MessageSquare,
    },
    {
      id: 'khata',
      label: 'Digital Khata',
      badge: 'New',
      icon: BookOpen,
    },
    {
      id: 'delivery',
      label: 'Live Dispatch',
      badge: '',
      icon: Truck,
    },
    {
      id: 'ai-suite',
      label: 'Intelligence',
      badge: 'New',
      icon: Sparkles,
      highlight: true,
    },
  ];

  return (
    <div className="w-full bg-white select-none">
      {/* 1. Global Apple-style Top Bar */}
      <header className="sticky top-0 z-50 bg-[#161617]/90 text-[#f5f5f7] backdrop-blur-md border-b border-white/10 text-[12px] font-normal tracking-tight">
        <div className="max-w-5xl mx-auto px-4 h-11 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <div className="w-4 h-4 text-white">
              <HardHat className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white tracking-tight text-[13px]">
              BuildNexus
            </span>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center space-x-7 text-[#f5f5f7]/80 text-[12px]">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`hover:text-white transition ${activeTab === 'dashboard' ? 'text-white font-medium' : ''}`}
            >
              Overview
            </button>
            <button
              onClick={() => onTabChange('marketplace')}
              className={`hover:text-white transition ${activeTab === 'marketplace' ? 'text-white font-medium' : ''}`}
            >
              Store
            </button>
            <button
              onClick={() => onTabChange('labour')}
              className={`hover:text-white transition ${activeTab === 'labour' ? 'text-white font-medium' : ''}`}
            >
              Labor
            </button>
            <button
              onClick={() => onTabChange('chat')}
              className={`hover:text-white transition ${activeTab === 'chat' ? 'text-white font-medium' : ''}`}
            >
              Chat
            </button>
            <button
              onClick={() => onTabChange('khata')}
              className={`hover:text-white transition ${activeTab === 'khata' ? 'text-white font-medium' : ''}`}
            >
              Khata
            </button>
            <button
              onClick={() => onTabChange('delivery')}
              className={`hover:text-white transition ${activeTab === 'delivery' ? 'text-white font-medium' : ''}`}
            >
              Dispatch
            </button>
            <button
              onClick={() => onTabChange('ai-suite')}
              className={`hover:text-white transition flex items-center gap-1 ${activeTab === 'ai-suite' ? 'text-white font-medium' : ''}`}
            >
              <span>Intelligence</span>
              <span className="text-[10px] text-[#b64400] font-semibold">New</span>
            </button>
          </nav>

          {/* Right Controls: Persona & Verified Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-[11px] text-[#f5f5f7]/90 border border-white/10">
              <span className="text-[#86868b]">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserPersona['role'])}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-[11px]"
              >
                {DEMO_PERSONAS.map((p) => (
                  <option key={p.id} value={p.role} className="bg-[#1d1d1f] text-white">
                    {p.name.split(' ')[0]} ({p.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#2997ff]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{currentPersona.maskedId}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Apple Black-Friday Style Announcement Ribbon */}
      <div className="bg-[#f5f5f7] border-b border-[#d2d2d7]/50 py-2.5 text-center text-[12px] text-[#1d1d1f]">
        <span>
          BuildNexus 2.0 is here. Get zero-broker procurement and 100% fair wage guarantees on every site.{' '}
        </span>
        <button
          onClick={() => onTabChange('ai-suite')}
          className="text-[#0071e3] hover:underline font-normal inline-flex items-center"
        >
          Explore Intelligence <ChevronRight className="w-3 h-3 ml-0.5" />
        </button>
      </div>

      {/* 3. Apple Sub-Nav / Chapter Ribbon (Identical to Apple Mac & iPad Pages) */}
      <div className="border-b border-[#d2d2d7]/40 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-start sm:justify-center gap-8 sm:gap-10 min-w-max">
            {chapterItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className="group flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
                >
                  {/* Clean Vector / Hardware style icon container */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? 'bg-[#0071e3] text-white shadow-md shadow-[#0071e3]/20 scale-105'
                        : 'bg-[#f5f5f7] text-[#1d1d1f] group-hover:bg-[#e8e8ed] group-hover:scale-105'
                    }`}
                  >
                    <Icon className="w-6 h-6" strokeWidth={1.75} />
                  </div>

                  {/* Title & "New" Subscript */}
                  <div className="text-center">
                    <span
                      className={`block text-[11px] sm:text-[12px] font-medium tracking-tight transition ${
                        isActive
                          ? 'text-[#0071e3] font-semibold'
                          : 'text-[#1d1d1f] group-hover:text-[#0071e3]'
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="block text-[10px] text-[#b64400] font-semibold mt-0.5 leading-none">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
