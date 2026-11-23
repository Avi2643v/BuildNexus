'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import {
  Home,
  Store,
  Users,
  MessageSquare,
  BookOpen,
  PlusCircle,
  Truck,
  ShieldCheck,
  Info,
  User,
  LogOut,
  Building2,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import kn from '@/locales/kn.json';

export const DesktopSidebar: React.FC = () => {
  const pathname = usePathname();
  const { language, activeRole, user, setUser } = useAppStore();

  // Optimistic instantaneous active path for zero-latency click response
  const [activePath, setActivePath] = useState(pathname);

  // Sync activePath whenever route changes externally
  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  const dictionaries = { en, hi, kn };
  const t = dictionaries[language].nav;

  const mainNav = [
    { href: '/', label: t.home, icon: Home, roles: ['CONTRACTOR', 'LABORER', 'CUSTOMER', 'SUPPLIER', 'DELIVERY_AGENT', 'ADMIN'] },
    { href: '/contractors', label: activeRole === 'CONTRACTOR' ? 'My Showcase & Leads' : 'Verified Builders', icon: Building2, roles: ['CUSTOMER', 'CONTRACTOR', 'ADMIN'] },
    { href: '/stock', label: activeRole === 'CONTRACTOR' ? 'Site Stock & Surplus' : 'Site Stock Monitor', icon: TrendingUp, roles: ['CONTRACTOR', 'ADMIN'] },
    { href: '/marketplace', label: activeRole === 'SUPPLIER' ? 'My Materials & Rates' : t.market, icon: Store, roles: ['CONTRACTOR', 'SUPPLIER', 'ADMIN'] },
    { href: '/ai', label: t.ai || 'AI Suite', icon: Sparkles, roles: ['CONTRACTOR', 'LABORER', 'CUSTOMER', 'SUPPLIER', 'DELIVERY_AGENT', 'ADMIN'] },
    { href: '/labour', label: activeRole === 'LABORER' ? 'My Jobs & Bookings' : activeRole === 'CUSTOMER' ? 'Hire Skilled Labour' : t.labour, icon: Users, roles: ['CONTRACTOR', 'LABORER', 'CUSTOMER', 'ADMIN'] },
    { href: '/sell', label: activeRole === 'CONTRACTOR' ? 'Sell Extra Materials' : 'Supplier & Buyback Desk', icon: PlusCircle, roles: ['SUPPLIER', 'CONTRACTOR', 'ADMIN'] },
    { href: '/chat', label: t.chat, icon: MessageSquare, roles: ['CONTRACTOR', 'LABORER', 'CUSTOMER', 'SUPPLIER', 'DELIVERY_AGENT', 'ADMIN'] },
    { href: '/notebook', label: t.notebook, icon: BookOpen, roles: ['CONTRACTOR', 'ADMIN'] },
    { href: '/delivery', label: activeRole === 'SUPPLIER' ? 'Outbound Fleet & Delivery' : 'Logistics & Delivery Fleet', icon: Truck, roles: ['CONTRACTOR', 'SUPPLIER', 'DELIVERY_AGENT', 'ADMIN'] },
    { href: '/admin', label: t.admin, icon: ShieldCheck, roles: ['ADMIN'] },
    { href: '/about', label: t.about, icon: Info, roles: ['CONTRACTOR', 'LABORER', 'CUSTOMER', 'SUPPLIER', 'DELIVERY_AGENT', 'ADMIN'] },
  ];

  const filteredNav = mainNav.filter((item) => item.roles.includes(activeRole));

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto select-none">
      {/* Platform Vision Card */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl mb-5 shadow-md border border-slate-800 transition-all hover:border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-5 h-5 text-brand-orange" />
          <span className="font-bold text-sm tracking-tight">The BuildNexus Standard</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          Zero middleman cut, 100% fair wages to workers, & direct supplier-to-builder dispatch tracking.
        </p>
      </div>

      {/* Navigation Items with Gliding Active Pill */}
      <nav className="flex-1 space-y-1.5">
        {filteredNav.map(({ href, label, icon: Icon }) => {
          const isActive = activePath === href;

          return (
            <Link
              key={href}
              href={href}
              prefetch={true}
              onClick={() => setActivePath(href)}
              className="relative block rounded-2xl group outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60"
            >
              {/* Ultra-Smooth Liquid Active Pill */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActivePill"
                  className="absolute inset-0 bg-gradient-to-r from-brand-orange via-orange-500 to-amber-500 rounded-2xl shadow-[0_4px_22px_rgba(249,115,22,0.42)] z-0"
                  transition={{
                    type: 'spring',
                    stiffness: 350,
                    damping: 30,
                    mass: 0.6,
                  }}
                />
              )}

              {/* Interactive Row with Spring Tactile Physics */}
              <div
                className={`relative z-10 flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'text-white'
                    : 'text-brand-slate dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform duration-150 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-brand-orange group-hover:scale-105'
                  }`}
                />

                <span className="truncate">{label}</span>

                {/* Subtle active luminous dot on right */}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] shrink-0" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Profile Card */}
      {user && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800/80 transition-all hover:border-slate-300 dark:hover:border-slate-700">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-brand-navy text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">{activeRole.toLowerCase()}</p>
              </div>
            </div>
            <button
              onClick={() => setUser(null)}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
