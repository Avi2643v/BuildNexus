import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import {
  Home,
  Store,
  Users,
  MessageSquare,
  BookOpen,
  User,
  ShoppingCart,
  PlusCircle,
  Truck,
  Building2,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import kn from '@/locales/kn.json';

export const MobileBottomTab: React.FC = () => {
  const pathname = usePathname();
  const { language, activeRole, cart, setCartDrawerOpen } = useAppStore();

  const dictionaries = { en, hi, kn };
  const t = dictionaries[language].nav;

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Role-specific bottom tab navigation items (Icon-first + label for low-literacy clarity)
  const getNavItems = () => {
    switch (activeRole) {
      case 'LABORER':
        return [
          { href: '/', label: t.home, icon: Home },
          { href: '/labour', label: 'Bookings', icon: Users },
          { href: '/chat', label: t.chat, icon: MessageSquare },
          { href: '/profile', label: t.profile, icon: User },
        ];
      case 'CUSTOMER':
        return [
          { href: '/', label: t.home, icon: Home },
          { href: '/contractors', label: 'Builders', icon: Building2 },
          { href: '/labour', label: 'Labour', icon: Users },
          { href: '/chat', label: t.chat, icon: MessageSquare },
          { href: '/profile', label: t.profile, icon: User },
        ];
      case 'SUPPLIER':
        return [
          { href: '/', label: t.home, icon: Home },
          { href: '/sell', label: 'Buyback Hub', icon: PlusCircle },
          { href: '/delivery', label: 'Delivery', icon: Truck },
          { href: '/marketplace', label: 'My Rates', icon: Store },
          { href: '/profile', label: t.profile, icon: User },
        ];
      case 'DELIVERY_AGENT':
        return [
          { href: '/', label: t.home, icon: Home },
          { href: '/delivery', label: 'Deliveries', icon: Truck },
          { href: '/chat', label: t.chat, icon: MessageSquare },
          { href: '/profile', label: t.profile, icon: User },
        ];
      case 'ADMIN':
        return [
          { href: '/', label: t.home, icon: Home },
          { href: '/admin', label: 'Admin Hub', icon: ShieldAlert },
          { href: '/chat', label: t.chat, icon: MessageSquare },
          { href: '/profile', label: t.profile, icon: User },
        ];
      case 'CONTRACTOR':
      default:
        return [
          { href: '/', label: t.home, icon: Home },
          { href: '/stock', label: 'Stock & Sell', icon: TrendingUp },
          { href: '/delivery', label: 'Delivery', icon: Truck },
          { href: '/marketplace', label: t.market, icon: Store },
          { href: '/labour', label: t.labour, icon: Users },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 transition-colors">
      {/* Floating Cart Button for Contractor on Mobile */}
      {activeRole === 'CONTRACTOR' && (
        <button
          onClick={() => setCartDrawerOpen(true)}
          className="fixed bottom-16 right-4 z-50 p-3.5 bg-brand-orange text-white rounded-full shadow-glow flex items-center justify-center animate-bounce touch-manipulation"
          aria-label="Floating Cart"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalCartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-navy text-white text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {totalCartCount}
            </span>
          )}
        </button>
      )}

      <nav className="flex items-center justify-around">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl min-w-[60px] min-h-[48px] transition-all duration-150 ease-out active:scale-90 select-none touch-manipulation ${
                isActive
                  ? 'text-brand-orange font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[11px] leading-tight text-center truncate max-w-[68px]">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
