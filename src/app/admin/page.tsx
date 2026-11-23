'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatINR } from '@/lib/utils';
import {
  ShieldAlert,
  Users,
  Store,
  Truck,
  Building2,
  CheckCircle2,
  XCircle,
  Handshake,
  TrendingUp,
  Boxes,
  AlertTriangle,
  FileCheck,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

export default function AdminPage() {
  const { user, addToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<'approvals' | 'deals' | 'warehouse' | 'rates' | 'cases'>('approvals');
  const [stats, setStats] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [pendingOffers, setPendingOffers] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setRevenue(data.revenueStreams);
        setPendingOffers(data.pendingOffers);
        setCases(data.cases);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyDeal = async (offerId: string) => {
    try {
      const res = await fetch('/api/chat/offers/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId, adminId: user?.id || 'user-admin-1' }),
      });
      const data = await res.json();
      if (data.success) {
        addToast({
          title: 'Deal Verified & Locked',
          message: 'Contractor can now checkout at the approved negotiated rate.',
          type: 'success',
        });
        fetchAdminData();
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to verify deal', type: 'error' });
    }
  };

  const tabs = [
    { id: 'approvals', label: 'Approvals Queue', count: 2 },
    { id: 'deals', label: 'Deal Verifications', count: pendingOffers.length },
    { id: 'warehouse', label: 'Warehouse Staging', count: 18 },
    { id: 'rates', label: 'Rates Monitor', count: null },
    { id: 'cases', label: 'Disputes & Cases', count: cases.length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            BuildNexus Central Admin Command
            <Badge variant="verified">Super Admin Access</Badge>
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate dark:text-slate-400 mt-1">
            Centralized platform oversight: warehouse inventory, rate approvals, deal audits, & dispute resolution.
          </p>
        </div>

        <Badge variant="orange" className="text-sm px-3 py-1">
          <Sparkles className="w-4 h-4 text-brand-orange" /> Real-time Platform Sync
        </Badge>
      </div>

      {/* KPI Overview Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 text-white border-slate-800">
          <CardContent className="pt-5 space-y-1">
            <span className="text-xs font-bold uppercase text-slate-400">Total Users</span>
            <p className="text-2xl font-black text-white">{stats?.usersCount || 34}</p>
            <p className="text-[10px] text-slate-400">Builders, Laborers & Suppliers</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200">
          <CardContent className="pt-5 space-y-1">
            <span className="text-xs font-bold uppercase text-slate-500">Total Material Orders</span>
            <p className="text-2xl font-black text-brand-orange">{stats?.ordersCount || 12}</p>
            <p className="text-[10px] text-slate-400">Routed through warehouse</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200">
          <CardContent className="pt-5 space-y-1">
            <span className="text-xs font-bold uppercase text-slate-500">Labour Bookings</span>
            <p className="text-2xl font-black text-emerald-600">{stats?.bookingsCount || 18}</p>
            <p className="text-[10px] text-emerald-600 font-bold">100% Fair Wage Guaranteed</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200">
          <CardContent className="pt-5 space-y-1">
            <span className="text-xs font-bold uppercase text-slate-500">Open Cases</span>
            <p className="text-2xl font-black text-rose-600">{cases.length}</p>
            <p className="text-[10px] text-slate-400">Pending investigation</p>
          </CardContent>
        </Card>
      </div>

      {/* REVENUE STREAMS HOOKS CARD */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 to-slate-950 text-white border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Revenue Streams & Monetization Engine
            </h3>
            <p className="text-xs text-slate-400">Platform earnings breakdown across all monetization channels.</p>
          </div>
          <p className="text-2xl font-black text-brand-orange">
            {formatINR(revenue?.totalRevenue || 85090)} <span className="text-xs font-normal text-slate-400">MTD</span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400">Builder Subscriptions:</span>
            <p className="font-extrabold text-sm text-white">{formatINR(revenue?.subscriptions || 45990)}</p>
          </div>
          <div>
            <span className="text-slate-400">Warehouse Logistics Fees:</span>
            <p className="font-extrabold text-sm text-white">{formatINR(revenue?.logistics || 18400)}</p>
          </div>
          <div>
            <span className="text-slate-400">Boosted Supplier Listings:</span>
            <p className="font-extrabold text-sm text-white">{formatINR(revenue?.premiumListings || 12500)}</p>
          </div>
          <div>
            <span className="text-slate-400">Labour Booking Commission:</span>
            <p className="font-extrabold text-sm text-white">{formatINR(revenue?.laborCommission || 8200)}</p>
          </div>
        </div>
      </Card>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-brand-navy text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === tab.id ? 'bg-brand-orange text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Approvals */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">New User Registrations & Government ID Approvals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name="Anand Builders" size="md" isVerified />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Anand Infra Projects</h4>
                  <p className="text-xs text-slate-500">Role: Contractor • Aadhaar: XXXX XXXX 5512</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="success" onClick={() => addToast({ title: 'Approved', message: 'User account approved.', type: 'success' })}>
                  Approve
                </Button>
                <Button size="sm" variant="danger" onClick={() => addToast({ title: 'Rejected', message: 'User registration rejected.', type: 'warning' })}>
                  Reject
                </Button>
              </div>
            </Card>

            <Card className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name="Deccan Aggregates" size="md" isVerified />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Deccan Aggregates & Sand</h4>
                  <p className="text-xs text-slate-500">Role: Supplier • GSTIN: XXXXX 8821 G</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="success" onClick={() => addToast({ title: 'Approved', message: 'Supplier approved.', type: 'success' })}>
                  Approve
                </Button>
                <Button size="sm" variant="danger" onClick={() => addToast({ title: 'Rejected', message: 'Supplier rejected.', type: 'warning' })}>
                  Reject
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Deals Verification Queue */}
      {activeTab === 'deals' && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Negotiated Deals Awaiting BuildNexus Central Verification</h3>
          {pendingOffers.length === 0 ? (
            <Card className="p-8 text-center text-xs text-slate-500">
              <Handshake className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              All negotiation deals have been verified.
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingOffers.map((off) => (
                <Card key={off.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-2 border-brand-orange/40">
                  <div className="flex items-start gap-3">
                    <img src={off.material.image} alt={off.material.name} className="w-14 h-14 rounded-2xl object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{off.material.name}</h4>
                      <p className="text-xs text-slate-500">
                        Quantity: <span className="font-bold">{off.quantity} {off.material.unit}</span>
                      </p>
                      <p className="text-xs font-bold text-brand-orange mt-0.5">
                        Agreed Rate: {formatINR(off.counterPrice || off.price)} / {off.material.unit}
                        <span className="line-through text-slate-400 font-normal ml-2">Original: {formatINR(off.material.price)}</span>
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleVerifyDeal(off.id)}
                    leftIcon={<Check className="w-4 h-4" />}
                  >
                    Verify & Lock Negotiated Rate
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Central Warehouse Monitor */}
      {activeTab === 'warehouse' && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">BuildNexus Central Warehouse Inventory & Dispatch Staging</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-brand-orange" /> Bay 1: Cement & Mortar Staging
              </h4>
              <p className="text-xs text-slate-500">Stock: 1,450 Bags (UltraTech, ACC, Birla)</p>
              <Badge variant="success">Staging Quality Verified</Badge>
            </Card>

            <Card className="p-4 space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-brand-orange" /> Bay 2: Steel & Rebars Staging
              </h4>
              <p className="text-xs text-slate-500">Stock: 18.5 Tons (JSW Fe-550D, Tata Tiscon)</p>
              <Badge variant="success">Tensile Tested</Badge>
            </Card>

            <Card className="p-4 space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-brand-orange" /> Bay 3: Surplus Inspection Hub
              </h4>
              <p className="text-xs text-slate-500">Contractor listings inspected before site dispatch</p>
              <Badge variant="verified">100% Inspected</Badge>
            </Card>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Rates Monitor */}
      {activeTab === 'rates' && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Live Real-time Construction Rates Monitor</h3>
          <Card className="overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <th className="p-3">Material Grade</th>
                  <th className="p-3">Average Market Rate</th>
                  <th className="p-3">BuildNexus Direct Rate</th>
                  <th className="p-3">Builder Savings</th>
                  <th className="p-3">24h Price Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-3 font-bold">UltraTech PPC Cement (50kg)</td>
                  <td className="p-3 line-through text-slate-400">₹420</td>
                  <td className="p-3 font-black text-brand-orange">₹380</td>
                  <td className="p-3 text-emerald-600 font-bold">₹40 / bag saved (10%)</td>
                  <td className="p-3 text-emerald-600 font-bold">↓ 2.1% Stable</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">JSW Neosteel TMT 12mm (kg)</td>
                  <td className="p-3 line-through text-slate-400">₹72</td>
                  <td className="p-3 font-black text-brand-orange">₹62</td>
                  <td className="p-3 text-emerald-600 font-bold">₹10 / kg saved (14%)</td>
                  <td className="p-3 text-amber-600 font-bold">↑ 0.5% Slight Rise</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Red Clay Wirecut Bricks (1000 pcs)</td>
                  <td className="p-3 line-through text-slate-400">₹11,500</td>
                  <td className="p-3 font-black text-brand-orange">₹9,500</td>
                  <td className="p-3 text-emerald-600 font-bold">₹2,000 saved (17%)</td>
                  <td className="p-3 text-emerald-600 font-bold">↓ 1.4% Drop</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* TAB CONTENT: Disputes & Cases */}
      {activeTab === 'cases' && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Dispute Cases & Damaged Item Resolutions</h3>
          {cases.length === 0 ? (
            <Card className="p-8 text-center text-xs text-slate-500">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              No open dispute cases. All deliveries completed with zero issues.
            </Card>
          ) : (
            <div className="space-y-3">
              {cases.map((cs) => (
                <Card key={cs.id} className="p-4 border-l-4 border-l-rose-500 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500" /> Case #{cs.id.slice(0, 8)} - {cs.type}
                    </span>
                    <Badge variant="error">{cs.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{cs.description}</p>
                  <div className="pt-2 flex justify-between items-center text-xs border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Raised By: {cs.raisedBy?.name || 'Contractor'}</span>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => addToast({ title: 'Case Resolved', message: 'Replacement order dispatched via BuildNexus.', type: 'success' })}
                    >
                      Resolve & Issue Replacement
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
