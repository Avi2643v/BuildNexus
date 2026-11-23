'use client';

import React from 'react';
import Link from 'next/link';
import {
  HardHat,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Truck,
  TrendingDown,
  Layers,
  ChevronRight,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1d1d1f] font-sans selection:bg-[#0071e3] selection:text-white">
      {/* 1. Global Apple-Style Minimal Header */}
      <header className="sticky top-0 z-50 bg-[#161617]/90 text-[#f5f5f7] backdrop-blur-md border-b border-white/10 text-[12px] font-normal tracking-tight">
        <div className="max-w-5xl mx-auto px-4 h-11 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardHat className="w-4 h-4 text-white" />
            <span className="font-semibold text-white tracking-tight text-[13px]">
              BuildNexus
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[#86868b] text-[11px]">
              B.Tech Innovative Project • ConTech OS
            </span>
            <Link
              href="/app"
              className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-[11px] font-medium px-3.5 py-1 rounded-full transition"
            >
              Launch App →
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Apple Black Friday Style Announcement Banner */}
      <div className="bg-[#f5f5f7] border-b border-[#d2d2d7]/50 py-2.5 text-center text-[12px] text-[#1d1d1f]">
        <span>
          BuildNexus SyncEngine: Weather-Aware Stochastic Pareto Scheduler is now live.{' '}
        </span>
        <Link href="/app" className="text-[#0071e3] hover:underline font-normal inline-flex items-center">
          Open Live Workspace <ChevronRight className="w-3 h-3 ml-0.5" />
        </Link>
      </div>

      {/* 3. Hero Section (Cupertino Typography Scale) */}
      <section className="max-w-5xl w-full mx-auto px-4 pt-16 sm:pt-24 pb-12 text-center sm:text-left">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0071e3]/10 text-xs font-semibold text-[#0071e3] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Orchestrated Construction Operating System</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.06]">
            BuildNexus.
          </h1>
          <p className="text-2xl sm:text-4xl font-medium text-[#86868b] tracking-tight mt-2 leading-tight">
            The future of construction. Re-engineered.
          </p>

          <p className="mt-6 text-base sm:text-lg text-[#86868b] font-normal leading-relaxed max-w-2xl">
            A weather-aware tripartite platform connecting contractors, skilled labor squads, and material suppliers
            into a synchronized world-model loop. Eliminating idle labor loss, opaque broker markups, and structural delays.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/app"
              className="w-full sm:w-auto bg-[#0071e3] hover:bg-[#0077ed] text-white text-sm font-semibold px-7 py-3 rounded-full shadow-sm transition inline-flex items-center justify-center gap-2"
            >
              <span>Open Live Site Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <span className="text-xs text-[#86868b]">
              Pre-loaded with Salt Lake G+4 Project & Real-Time Weather
            </span>
          </div>
        </div>
      </section>

      {/* 4. Core Spec Pillars (Apple Numbers Grid) */}
      <section className="max-w-5xl w-full mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#f5f5f7] rounded-[24px] p-6 text-center sm:text-left">
            <div className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f]">
              100%
            </div>
            <div className="text-xs font-medium text-[#86868b] mt-1.5 leading-snug">
              Fair Wage Guarantee. Zero broker cuts on worker earnings.
            </div>
          </div>

          <div className="bg-[#f5f5f7] rounded-[24px] p-6 text-center sm:text-left">
            <div className="text-3xl sm:text-4xl font-semibold text-[#0071e3]">
              SyncEngine
            </div>
            <div className="text-xs font-medium text-[#86868b] mt-1.5 leading-snug">
              Stochastic Pareto Scheduler with coupled idle-mismatch tracking.
            </div>
          </div>

          <div className="bg-[#f5f5f7] rounded-[24px] p-6 text-center sm:text-left">
            <div className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f]">
              90 min
            </div>
            <div className="text-xs font-medium text-[#86868b] mt-1.5 leading-snug">
              Ready-Mix Concrete perishability horizon monitored live.
            </div>
          </div>

          <div className="bg-[#f5f5f7] rounded-[24px] p-6 text-center sm:text-left">
            <div className="text-3xl sm:text-4xl font-semibold text-[#1b8738]">
              14.8%
            </div>
            <div className="text-xs font-medium text-[#86868b] mt-1.5 leading-snug">
              Average procurement savings over regional street broker rates.
            </div>
          </div>
        </div>
      </section>

      {/* 5. Apple Bento Feature Highlights */}
      <section className="max-w-5xl w-full mx-auto px-4 py-12 space-y-8">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
          Architectural innovations.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: SyncEngine Pareto Scheduler */}
          <div className="rounded-[28px] bg-[#f5f5f7] p-8 sm:p-10 flex flex-col justify-between hover:shadow-appleCard transition">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0071e3] mb-2">
                <Zap className="w-4 h-4 text-[#0071e3]" />
                <span>SyncEngine Core</span>
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
                Weather-Aware Stochastic Pareto Scheduler.
              </h3>
              <p className="mt-3 text-sm text-[#86868b] leading-relaxed">
                Traditional schedules fail when it rains or cement arrives late. SyncEngine simulates 500 parallel Monte Carlo futures,
                integrates ISO 7243 WBGT thermal stress, and computes a non-dominated Pareto Frontier (Cost vs. Duration vs. CVaR Tail Delay Risk).
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#d2d2d7]/50 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1d1d1f]">NSGA-II Multi-Objective Engine</span>
              <Link href="/app" className="text-xs font-medium text-[#0071e3] hover:underline flex items-center gap-1">
                <span>Test Shock Sliders</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: 100% Fair Wage Guarantee */}
          <div className="rounded-[28px] bg-[#f5f5f7] p-8 sm:p-10 flex flex-col justify-between hover:shadow-appleCard transition">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1b8738] mb-2">
                <ShieldCheck className="w-4 h-4 text-[#1b8738]" />
                <span>Ethical Labor</span>
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
                100% Guaranteed Fair Wages. Direct to Workers.
              </h3>
              <p className="mt-3 text-sm text-[#86868b] leading-relaxed">
                Eliminating the 20–30% wage theft common in informal Indian labor chawks.
                Daily muster roll payouts go directly to laborers with zero platform cut, verified via biometric escrow.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#d2d2d7]/50 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1b8738]">0% Platform Deduction</span>
              <Link href="/app" className="text-xs font-medium text-[#0071e3] hover:underline flex items-center gap-1">
                <span>View Muster Ledger</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Perishable Ready-Mix Concrete Logistics */}
          <div className="rounded-[28px] bg-[#f5f5f7] p-8 sm:p-10 flex flex-col justify-between hover:shadow-appleCard transition">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#b64400] mb-2">
                <Truck className="w-4 h-4 text-[#b64400]" />
                <span>JIT Logistics</span>
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
                90-Minute Perishable Decay Monitor.
              </h3>
              <p className="mt-3 text-sm text-[#86868b] leading-relaxed">
                Ready-Mix Concrete starts setting in 90 minutes. BuildNexus dynamically syncs the 12-man pouring crew
                to stand by as the mixer truck approaches, avoiding ruined batches and wasted labor wages.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#d2d2d7]/50 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1d1d1f]">OTP-Secured Handover</span>
              <Link href="/app" className="text-xs font-medium text-[#0071e3] hover:underline flex items-center gap-1">
                <span>Track Live Truck</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 4: In-App Privacy Negotiation */}
          <div className="rounded-[28px] bg-[#f5f5f7] p-8 sm:p-10 flex flex-col justify-between hover:shadow-appleCard transition">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1d1d1f] mb-2">
                <Layers className="w-4 h-4 text-[#0071e3]" />
                <span>Deal Integrity</span>
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
                Private In-App Negotiation & Anti-Bypass.
              </h3>
              <p className="mt-3 text-sm text-[#86868b] leading-relaxed">
                Automatic phone-number masking protects wholesale volume pricing and prevents off-platform bypass,
                locking agreements into immutable escrow milestone contracts.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#d2d2d7]/50 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1d1d1f]">Auto-Masking Active</span>
              <Link href="/app" className="text-xs font-medium text-[#0071e3] hover:underline flex items-center gap-1">
                <span>Open Chat Demo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Apple Minimal Footer */}
      <footer className="bg-[#f5f5f7] border-t border-[#d2d2d7]/50 py-12 text-[12px] text-[#86868b] mt-auto">
        <div className="max-w-5xl mx-auto px-4 space-y-4">
          <div className="text-[11px] leading-relaxed border-b border-[#d2d2d7]/40 pb-4">
            BuildNexus is an academic innovative project for B.Tech Computer Science & Engineering (2026).
            All weather simulations utilize the Open-Meteo API under Creative Commons licensing.
            SyncEngine algorithms implement ISO 7243 WBGT thermal physics and NSGA-II non-dominated sorting.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              Copyright © 2026 BuildNexus Inc. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-[#424245]">
              <Link href="/app" className="hover:text-black font-semibold text-[#0071e3]">
                Launch Workspace
              </Link>
              <span>•</span>
              <span className="hover:text-black cursor-pointer">Project Documentation</span>
              <span>•</span>
              <span className="hover:text-black cursor-pointer">Algorithm Specification</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
