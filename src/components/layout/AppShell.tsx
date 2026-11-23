'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Header } from './Header';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomTab } from './MobileBottomTab';
import { ToastContainer } from '@/components/ui/Toast';
import { MiniCartDrawer } from '@/components/cart/MiniCartDrawer';
import { GuidedTour } from '@/components/onboarding/GuidedTour';
import { NexusBot } from '@/components/ai/NexusBot';
import { ButterClickProvider } from '@/components/ui/ButterClickProvider';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkMode } = useAppStore();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  // Dedicated full-screen view for authentication & login pages
  if (isAuthPage) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <ButterClickProvider>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
            <main className="flex-1 flex items-center justify-center p-3 sm:p-6">
              {children}
            </main>
            <ToastContainer />
          </div>
        </ButterClickProvider>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <ButterClickProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
          <Header />
          <div className="flex-1 flex max-w-7xl w-full mx-auto">
            <DesktopSidebar />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-x-hidden">
              {children}
            </main>
          </div>
          <MobileBottomTab />
          <MiniCartDrawer />
          <NexusBot />
          <ToastContainer />
          <GuidedTour />
        </div>
      </ButterClickProvider>
    </div>
  );
};
