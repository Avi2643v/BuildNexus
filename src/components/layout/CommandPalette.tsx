'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Search,
  Building2,
  Store,
  Users,
  MessageSquare,
  BookOpen,
  Truck,
  PlusCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const quickLinks = [
    { title: 'Site Material Stock Depletion Monitor', href: '/stock', icon: TrendingUp, category: 'Stock', badge: 'Burn Tracker' },
    { title: 'Verified Builders Directory (Customer View)', href: '/contractors', icon: Building2, category: 'Customer', badge: 'Zero Pricing' },
    { title: 'Labour Bookings Window & Job Offers', href: '/labour', icon: Users, category: 'Labour', badge: 'Fair Wage' },
    { title: 'Supplier Contractor Rate Locks Portal', href: '/sell', icon: PlusCircle, category: 'Supplier', badge: 'Locked Deals' },
    { title: 'BuildNexus AI Suite', href: '/ai', icon: Sparkles, category: 'AI', badge: 'Intelligence' },
    { title: 'AI Price Forecasting & Buy Timing', href: '/ai?tab=forecast', icon: Sparkles, category: 'AI', badge: 'Prediction' },
    { title: 'AI BOQ Construction Estimator', href: '/ai?tab=estimator', icon: Sparkles, category: 'AI', badge: 'Estimator' },
    { title: 'AI Voice Khata Attendance Parser', href: '/ai?tab=khata', icon: Sparkles, category: 'AI', badge: 'Voice' },
    { title: 'Materials Marketplace', href: '/marketplace', icon: Store, category: 'Materials', badge: 'Catalog' },
    { title: 'UltraTech PPC Cement (50kg)', href: '/marketplace', icon: Store, category: 'Product', badge: '₹380/bag' },
    { title: 'JSW Neosteel TMT 12mm Rebars', href: '/marketplace', icon: Store, category: 'Product', badge: '₹62/kg' },
    { title: 'Brick Jointer & Breakers', href: '/labour', icon: Users, category: 'Labour', badge: '₹750/day' },
    { title: 'Private Negotiation Chat', href: '/chat', icon: MessageSquare, category: 'Chat', badge: 'Masked' },
    { title: 'Digital Khata Notebook', href: '/notebook', icon: BookOpen, category: 'Tools', badge: 'Ledger' },
    { title: 'Live GPS Delivery Tracking', href: '/delivery', icon: Truck, category: 'Logistics', badge: 'Live Map' },
    { title: 'BuildNexus Central Admin', href: '/admin', icon: ShieldCheck, category: 'Admin', badge: 'Control' },
  ];

  const filteredLinks = quickLinks.filter(
    (l) =>
      l.title.toLowerCase().includes(query.toLowerCase()) ||
      l.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(href);
  };

  return (
    <>
      {/* Quick Search Shortcut Trigger Button in Topbar */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 text-xs transition-all shadow-xs shrink-0"
      >
        <Search className="w-3.5 h-3.5 text-slate-400" />
        <span className="hidden lg:inline text-slate-500 dark:text-slate-400">Quick Search...</span>
        <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded shadow-2xs text-slate-500">
          Ctrl K
        </kbd>
      </button>

      {/* Command Palette Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} maxWidth="lg">
        <div className="space-y-4 pt-1">
          <Input
            placeholder="Search anything across BuildNexus (materials, workers, pages)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            autoFocus
          />

          <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
            {filteredLinks.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6">No matching results found.</p>
            ) : (
              filteredLinks.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelect(item.href)}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-slate-200 dark:border-slate-700 hover:border-brand-orange cursor-pointer flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-xl group-hover:bg-brand-orange group-hover:text-white text-slate-600 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-brand-orange transition-colors">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-400">{item.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="orange" size="sm">
                        {item.badge}
                      </Badge>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-orange group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
