'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAppStore, UserRole } from '@/lib/store';
import {
  Building2,
  ShoppingCart,
  Globe,
  Sun,
  Moon,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ChevronDown,
  Users,
  Store,
  Truck,
  ShieldAlert,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { CommandPalette } from './CommandPalette';
import { NotificationDrawer } from './NotificationDrawer';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import kn from '@/locales/kn.json';

export const Header: React.FC = () => {
  const {
    user,
    setUser,
    activeRole,
    setActiveRole,
    language,
    setLanguage,
    cart,
    setCartDrawerOpen,
    isDarkMode,
    toggleDarkMode,
  } = useAppStore();

  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const personaRef = useRef<HTMLDivElement>(null);

  const dictionaries = { en, hi, kn };
  const t = dictionaries[language];

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Close persona dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (personaRef.current && !personaRef.current.contains(event.target as Node)) {
        setIsPersonaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rolesList: {
    role: UserRole;
    label: string;
    subLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }[] = [
    {
      role: 'CONTRACTOR',
      label: 'Builder / Contractor',
      subLabel: 'Materials, site stock & khata ledger',
      icon: Building2,
      accentColor: 'text-amber-500 bg-amber-500/10',
    },
    {
      role: 'LABORER',
      label: 'Labour / Specialized',
      subLabel: 'Bookings window & wage negotiation',
      icon: Users,
      accentColor: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      role: 'CUSTOMER',
      label: 'Homeowner / Customer',
      subLabel: 'Verified builders with zero pricing',
      icon: ShieldCheck,
      accentColor: 'text-blue-500 bg-blue-500/10',
    },
    {
      role: 'SUPPLIER',
      label: 'Material Supplier',
      subLabel: 'Catalog rates & private builder locks',
      icon: Store,
      accentColor: 'text-purple-500 bg-purple-500/10',
    },
    {
      role: 'DELIVERY_AGENT',
      label: 'Delivery Logistics',
      subLabel: 'Warehouse staging & site route dispatch',
      icon: Truck,
      accentColor: 'text-cyan-500 bg-cyan-500/10',
    },
    {
      role: 'ADMIN',
      label: 'Admin Hub',
      subLabel: 'Government ID verification & approvals',
      icon: ShieldAlert,
      accentColor: 'text-rose-500 bg-rose-500/10',
    },
  ];

  const currentRoleObj = rolesList.find((r) => r.role === activeRole) || rolesList[0];
  const CurrentRoleIcon = currentRoleObj.icon;

  const handleRoleSwitch = (r: UserRole) => {
    setActiveRole(r);
    setIsPersonaOpen(false);

    if (r === 'CONTRACTOR') {
      setUser({
        id: 'user-contractor-1',
        name: 'Rajesh Sharma',
        mobile: '9876543210',
        role: 'CONTRACTOR',
        maskedGovtId: 'XXXX XXXX 4912',
        isVerified: true,
        status: 'APPROVED',
        city: 'Kolkata, West Bengal',
        rating: 4.9,
      });
    } else if (r === 'LABORER') {
      setUser({
        id: 'user-laborer-1',
        name: 'Sunil Kumar (Master Electrician)',
        mobile: '9876543211',
        role: 'LABORER',
        trade: 'Electrician',
        maskedGovtId: 'XXXX XXXX 8831',
        isVerified: true,
        status: 'APPROVED',
        city: 'Kolkata, West Bengal',
        rating: 4.85,
        ratePerSqFt: 18,
      });
    } else if (r === 'CUSTOMER') {
      setUser({
        id: 'user-customer-1',
        name: 'Sunita Rao (Homeowner)',
        mobile: '9876543215',
        role: 'CUSTOMER',
        maskedGovtId: 'XXXX XXXX 5521',
        isVerified: true,
        status: 'APPROVED',
        city: 'Kolkata, West Bengal',
        rating: 5.0,
      });
    } else if (r === 'SUPPLIER') {
      setUser({
        id: 'user-supplier-1',
        name: 'Lakshmi Building Supplies',
        mobile: '9876543212',
        role: 'SUPPLIER',
        maskedGovtId: 'XXXXX 1234 P',
        isVerified: true,
        status: 'APPROVED',
        city: 'Kolkata, West Bengal',
        rating: 4.9,
      });
    } else if (r === 'DELIVERY_AGENT') {
      setUser({
        id: 'user-delivery-1',
        name: 'Vikram Express Logistics',
        mobile: '9876543213',
        role: 'DELIVERY_AGENT',
        maskedGovtId: 'XXXX XXXX 9081',
        isVerified: true,
        status: 'APPROVED',
        city: 'Kolkata, West Bengal',
        rating: 4.95,
      });
    } else if (r === 'ADMIN') {
      setUser({
        id: 'user-admin-1',
        name: 'BuildNexus Staff Admin',
        mobile: '9876543214',
        role: 'ADMIN',
        maskedGovtId: 'XXXX XXXX 0001',
        isVerified: true,
        status: 'APPROVED',
        city: 'Kolkata, West Bengal',
        rating: 5.0,
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/75 dark:bg-slate-900/80 border-b border-white/40 dark:border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* LEFT CLUSTER: Logo, Search, AI Suite */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0 min-w-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:scale-105 transition-all">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Build<span className="text-brand-orange">Nexus</span>
              </span>
              <span className="text-[8px] uppercase font-black tracking-widest text-brand-orange block -mt-1">
                Construct
              </span>
            </div>
          </Link>

          {/* Quick Search Shortcut */}
          <CommandPalette />

          {/* Glassmorphic AI Suite Button */}
          <Link
            href="/ai"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 backdrop-blur-md text-xs font-bold transition-all shadow-[0_0_12px_rgba(249,115,22,0.12)] shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Suite</span>
          </Link>

          {/* Quick Delivery Fleet Access for Builder & Supplier */}
          {(activeRole === 'CONTRACTOR' || activeRole === 'SUPPLIER' || activeRole === 'DELIVERY_AGENT') && (
            <Link
              href="/delivery"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-md text-xs font-bold transition-all shrink-0 hover:border-brand-orange/40"
            >
              <Truck className="w-3.5 h-3.5 text-brand-orange" />
              <span>Delivery Fleet</span>
            </Link>
          )}
        </div>

        {/* CENTER CLUSTER: Glassmorphism Persona Selector (Zero Overlap Design) */}
        <div ref={personaRef} className="relative shrink-0">
          <button
            onClick={() => setIsPersonaOpen(!isPersonaOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200/70 dark:border-slate-700/70 hover:border-brand-orange/60 dark:hover:border-brand-orange/60 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs hover:shadow-md transition-all group"
            aria-label="Switch Persona"
          >
            <div className={`p-1 rounded-lg ${currentRoleObj.accentColor} shrink-0`}>
              <CurrentRoleIcon className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1 text-left">
              <span className="hidden md:inline text-slate-400 font-medium">Persona:</span>
              <span className="font-extrabold text-slate-900 dark:text-white truncate max-w-[110px] sm:max-w-none">
                {currentRoleObj.label}
              </span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                isPersonaOpen ? 'rotate-180 text-brand-orange' : 'group-hover:text-slate-700 dark:group-hover:text-slate-200'
              }`}
            />
          </button>

          {/* Frosted Glass Popover Dropdown */}
          {isPersonaOpen && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 w-72 rounded-3xl backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 border border-white/60 dark:border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.18)] p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-brand-orange" /> Select Active Persona
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tailors portal views, rates, and navigation.
                </p>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-1 pt-1 pr-0.5">
                {rolesList.map(({ role, label, subLabel, icon: Icon, accentColor }) => {
                  const isActive = activeRole === role;
                  return (
                    <button
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition-all ${
                        isActive
                          ? 'bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 shadow-xs'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-2 rounded-xl ${accentColor} shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <p className={`text-xs font-bold truncate ${isActive ? 'text-brand-orange' : 'text-slate-900 dark:text-white'}`}>
                            {label}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">{subLabel}</p>
                        </div>
                      </div>

                      {isActive && (
                        <div className="w-5 h-5 rounded-full bg-brand-orange text-white flex items-center justify-center shrink-0 ml-2 shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT CLUSTER: Language, Theme, Notifications, Cart, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Glassmorphic Language Capsule */}
          <div className="flex items-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl p-0.5 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
            <Globe className="w-3 h-3 text-slate-400 ml-1.5 mr-1 hidden sm:inline-block shrink-0" />
            {(['en', 'hi', 'kn'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase transition-all ${
                  language === lang
                    ? 'bg-brand-orange text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Notification Drawer Button */}
          <div className="shrink-0">
            <NotificationDrawer />
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 hover:bg-white/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-2xs shrink-0"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cart Trigger with Glowing Badge */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="relative p-2 sm:p-2.5 rounded-xl bg-orange-50/70 dark:bg-orange-950/40 backdrop-blur-md border border-orange-200/70 dark:border-orange-800/60 text-brand-orange hover:bg-orange-100/80 dark:hover:bg-orange-900/60 transition-all shadow-2xs shrink-0"
            aria-label="View Cart"
          >
            <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(37,99,235,0.6)] animate-bounce">
                {totalCartCount > 99 ? '99+' : totalCartCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar with Glass Ring */}
          {user ? (
            <Link href="/profile" className="flex items-center gap-1.5 pl-0.5 shrink-0 group">
              <div className="p-0.5 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 group-hover:border-brand-orange transition-all">
                <Avatar src={user.avatar} name={user.name} isVerified={user.isVerified} size="sm" />
              </div>
            </Link>
          ) : (
            <Link href="/auth/login" className="shrink-0">
              <Button size="sm" variant="primary">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
