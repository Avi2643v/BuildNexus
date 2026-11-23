'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Badge } from '@/components/ui/Badge';
import {
  Bell,
  Handshake,
  Truck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Deal Rate Verified by BuildNexus',
      desc: 'Your negotiated rate of ₹365/bag for UltraTech Cement has been locked & verified.',
      time: '5 mins ago',
      icon: Handshake,
      variant: 'fairWage',
      link: '/chat',
    },
    {
      id: 'notif-2',
      title: 'Material Order Staged at Warehouse',
      desc: 'Order #ORD-1001 inspected and dispatched with Vikram Express Logistics.',
      time: '18 mins ago',
      icon: Truck,
      variant: 'orange',
      link: '/delivery',
    },
    {
      id: 'notif-3',
      title: 'Direct Labour Booking Confirmed',
      desc: 'Ramesh Sardar & Team (5 Workers) confirmed for Bellandur Villa Project.',
      time: '1 hr ago',
      icon: Calendar,
      variant: 'success',
      link: '/labour',
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="View Notifications"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full animate-ping" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full" />
      </button>

      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Live Platform Notifications (3 New)"
      >
        <div className="space-y-3 pt-2">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <Link
                key={n.id}
                href={n.link}
                onClick={() => setIsOpen(false)}
                className="block p-3.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl text-brand-orange shadow-xs shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-brand-slate dark:text-slate-400 leading-relaxed">
                      {n.desc}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </BottomSheet>
    </>
  );
};
