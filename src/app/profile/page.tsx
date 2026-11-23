'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore, UserRole } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  ShieldCheck,
  Globe,
  Sun,
  Moon,
  UserCheck,
  Building2,
  Users,
  Store,
  Truck,
  ShieldAlert,
  LogOut,
  Sparkles,
  Award,
  CheckCircle2,
  Briefcase,
  MapPin,
  ExternalLink,
  Edit,
} from 'lucide-react';

export default function ProfilePage() {
  const {
    user,
    setUser,
    activeRole,
    setActiveRole,
    language,
    setLanguage,
    isDarkMode,
    toggleDarkMode,
    builderPublicProfiles,
    updateBuilderProfileSettings,
    addToast,
  } = useAppStore();

  // Builder Showcase Setup State (for CONTRACTOR)
  const builderProfile = builderPublicProfiles[0];
  const [projectsCount, setProjectsCount] = useState(
    builderProfile ? String(builderProfile.projectsCompleted) : '42'
  );
  const [totalSqFt, setTotalSqFt] = useState(
    builderProfile ? builderProfile.totalSqFtBuilt : '285,000 sq.ft'
  );
  const [areasInput, setAreasInput] = useState(
    builderProfile ? builderProfile.areasWorked.join(', ') : 'New Town, Salt Lake Sector V, Rajarhat, Alipore, Howrah, Durgapur'
  );
  const [breakdownInput, setBreakdownInput] = useState(
    builderProfile
      ? builderProfile.projectBreakdown
      : 'Delivered 24 Luxury Bungalows, 12 Commercial Tech Hubs, & 6 High-Rise Towers across Kolkata & West Bengal.'
  );

  const handleRoleSwitch = (r: UserRole) => {
    setActiveRole(r);
    const demoUsers: Record<UserRole, any> = {
      CONTRACTOR: {
        id: 'user-contractor-1',
        name: 'Rajesh Sharma (Ramesh Constructions)',
        mobile: '9876543210',
        role: 'CONTRACTOR',
        maskedGovtId: 'XXXX XXXX 4912',
        isVerified: true,
        status: 'APPROVED',
        city: 'Kolkata, West Bengal',
        rating: 4.9,
      },
      LABORER: {
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
      },
      CUSTOMER: {
        id: 'user-customer-1',
        name: 'Sunita Rao (Homeowner)',
        mobile: '9876543215',
        role: 'CUSTOMER',
        maskedGovtId: 'XXXX XXXX 5521',
        isVerified: true,
        status: 'APPROVED',
        city: 'Kolkata, West Bengal',
        rating: 5.0,
      },
      SUPPLIER: {
        id: 'user-supplier-1',
        name: 'Lakshmi Building Supplies',
        mobile: '9876543212',
        role: 'SUPPLIER',
        maskedGovtId: 'XXXXX 1234 P',
        isVerified: true,
        status: 'APPROVED',
        city: 'Kolkata, West Bengal',
        rating: 4.9,
      },
      DELIVERY_AGENT: {
        id: 'user-delivery-1',
        name: 'Vikram Express Logistics',
        mobile: '9876543213',
        role: 'DELIVERY_AGENT',
        maskedGovtId: 'XXXX XXXX 9081',
        isVerified: true,
        status: 'APPROVED',
        city: 'Kolkata, West Bengal',
        rating: 4.95,
      },
      ADMIN: {
        id: 'user-admin-1',
        name: 'BuildNexus Staff Admin',
        mobile: '9876543214',
        role: 'ADMIN',
        maskedGovtId: 'XXXX XXXX 0001',
        isVerified: true,
        status: 'APPROVED',
        city: 'Kolkata, West Bengal',
        rating: 5.0,
      },
    };

    setUser(demoUsers[r]);
    addToast({ title: 'Role Switched', message: `Now viewing as ${r}`, type: 'info' });
  };

  const handleSaveBuilderSetup = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAreas = areasInput
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    updateBuilderProfileSettings('builder-1', {
      projectsCompleted: parseInt(projectsCount, 10) || 42,
      totalSqFtBuilt: totalSqFt,
      areasWorked: parsedAreas,
      projectBreakdown: breakdownInput,
    });

    addToast({
      title: 'Builder Portfolio Showcase Updated!',
      message: 'Changes are live in the Customer Directory (/contractors) with strictly zero pricing.',
      type: 'success',
    });
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold">Please sign in to view profile</h2>
        <Link href="/auth/login">
          <Button variant="primary">Login with Government ID Simulation</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      {/* Profile Banner Card */}
      <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <Avatar name={user.name} src={user.avatar} isVerified size="xl" />
          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{user.name}</h2>
              <Badge variant="verified">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> ID Verified
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              Role: <span className="font-bold text-slate-900 dark:text-white">{user.role}</span> • {user.city}
            </p>
            <p className="text-xs font-semibold text-brand-orange">
              Simulated Govt ID: {user.maskedGovtId || 'XXXX XXXX 4912'}
            </p>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Account Approved & Verified</h4>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                Aadhaar simulation verified • Full access enabled
              </p>
            </div>
          </div>
          <Badge variant="fairWage" size="sm">
            <Award className="w-3.5 h-3.5" /> Fair Trust 100%
          </Badge>
        </div>
      </Card>

      {/* BUILDER LOGIN SETUP: CUSTOMER SHOWCASE PORTFOLIO CONFIG */}
      {(activeRole === 'CONTRACTOR' || user.role === 'CONTRACTOR') && (
        <Card className="p-6 space-y-4 border-2 border-brand-orange/40 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-orange" />
                Builder Login Showcase Setup
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure your public track record shown to homeowners on the Customer Directory. (No pricing is ever shown)
              </p>
            </div>
            <Link href="/contractors">
              <Button size="sm" variant="outline" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                Preview Customer View
              </Button>
            </Link>
          </div>

          <form onSubmit={handleSaveBuilderSetup} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Total Projects Completed"
                type="number"
                value={projectsCount}
                onChange={(e) => setProjectsCount(e.target.value)}
                required
              />

              <Input
                label="Total Built-Up Area"
                value={totalSqFt}
                onChange={(e) => setTotalSqFt(e.target.value)}
                placeholder="e.g. 285,000 sq.ft"
                required
              />
            </div>

            <Input
              label="In Which Areas Worked (Comma-separated)"
              value={areasInput}
              onChange={(e) => setAreasInput(e.target.value)}
              placeholder="e.g. Whitefield, Indiranagar, Electronic City, HSR Layout"
              required
              helperText="Customers will filter and find your portfolio by these locations."
            />

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Delivered Projects Breakdown
              </label>
              <textarea
                value={breakdownInput}
                onChange={(e) => setBreakdownInput(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                required
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Update Builder Showcase Settings
            </Button>
          </form>
        </Card>
      )}

      {/* Switch Role Fast Bar */}
      <Card className="p-5 space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-brand-orange" /> Switch Active Demo Persona
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { r: 'CONTRACTOR', label: 'Builder / Contractor' },
            { r: 'LABORER', label: 'Laborer / Specialized' },
            { r: 'CUSTOMER', label: 'Customer / Client' },
            { r: 'SUPPLIER', label: 'Material Supplier' },
            { r: 'DELIVERY_AGENT', label: 'Delivery Agent' },
            { r: 'ADMIN', label: 'BuildNexus Admin' },
          ].map(({ r, label }) => (
            <button
              key={r}
              onClick={() => handleRoleSwitch(r as UserRole)}
              className={`p-2.5 rounded-2xl text-xs font-bold border transition-all text-left ${
                activeRole === r
                  ? 'bg-brand-orange text-white border-brand-orange shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 hover:border-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* App Preferences & Settings */}
      <Card className="p-5 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Platform Settings & Language</h3>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Globe className="w-4 h-4 text-brand-orange" /> Interface Language
          </div>
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['en', 'hi', 'kn'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                  language === lang ? 'bg-brand-orange text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            Dark Mode Theme
          </div>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            {isDarkMode ? 'Dark Active' : 'Light Active'}
          </button>
        </div>
      </Card>

      {/* Sign Out */}
      <div className="pt-2">
        <Button
          onClick={() => {
            setUser(null);
            addToast({ title: 'Signed Out', message: 'You have been logged out.', type: 'info' });
          }}
          variant="outline"
          className="w-full border-rose-300 text-rose-600 hover:bg-rose-50"
          leftIcon={<LogOut className="w-4 h-4" />}
        >
          Sign Out of Account
        </Button>
      </div>
    </div>
  );
}
