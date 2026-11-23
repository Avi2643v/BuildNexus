'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, UserRole } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Stepper } from '@/components/ui/Stepper';
import {
  Building2,
  Users,
  Store,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Phone,
  User,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  FileCheck,
  Check,
  HardHat,
  ArrowUpRight,
  Scale,
  Clock,
  Layers,
  Cpu,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setActiveRole, addToast } = useAppStore();

  const [currentStep, setCurrentStep] = useState(0); // 0: Role, 1: Details & ID, 2: OTP, 3: Verifying, 4: Success
  const [selectedRole, setSelectedRole] = useState<UserRole>('CONTRACTOR');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [govtIdType, setGovtIdType] = useState('AADHAAR');
  const [govtIdNumber, setGovtIdNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [maskedResult, setMaskedResult] = useState('');

  // Labour Specific Fields
  const [labourTrade, setLabourTrade] = useState('Electrician');
  const [labourExperience, setLabourExperience] = useState('5');
  const [expectedWage, setExpectedWage] = useState('18');
  const [isSardarSupervisor, setIsSardarSupervisor] = useState(false);

  // Resend OTP timer
  useEffect(() => {
    let interval: any;
    if (currentStep === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, timer]);

  // Handle Quick Demo Login
  const handleQuickDemoLogin = (role: UserRole) => {
    setActiveRole(role);
    const demoUsers: Record<UserRole, any> = {
      CONTRACTOR: {
        id: 'user-contractor-1',
        name: 'Rajesh Sharma',
        mobile: '9876543210',
        role: 'CONTRACTOR',
        maskedGovtId: 'XXXX XXXX 4912',
        isVerified: true,
        status: 'APPROVED',
        city: 'Kolkata, West Bengal',
      },
      LABORER: {
        id: 'user-laborer-1',
        name: 'Subhas Sardar (Master Electrician)',
        mobile: '9876543211',
        role: 'LABORER',
        trade: 'Electrician',
        maskedGovtId: 'XXXX XXXX 8831',
        isVerified: true,
        status: 'APPROVED',
        city: 'Kolkata, West Bengal',
        ratePerSqFt: 18,
      },
      CUSTOMER: {
        id: 'user-customer-1',
        name: 'Sunita Rao (Property Owner)',
        mobile: '9876543215',
        role: 'CUSTOMER',
        maskedGovtId: 'XXXX XXXX 5521',
        isVerified: true,
        status: 'APPROVED',
        city: 'Kolkata, West Bengal',
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
      },
    };

    setUser(demoUsers[role]);
    addToast({
      title: `Logged in as Demo ${role}`,
      message: 'Government ID simulated verification active.',
      type: 'success',
    });

    if (role === 'CONTRACTOR') router.push('/marketplace');
    else if (role === 'LABORER') router.push('/labour');
    else if (role === 'CUSTOMER') router.push('/contractors');
    else if (role === 'SUPPLIER') router.push('/sell');
    else if (role === 'DELIVERY_AGENT') router.push('/delivery');
    else if (role === 'ADMIN') router.push('/admin');
  };

  // Step 1 -> 2: Role selection
  const handleProceedToDetails = () => {
    setCurrentStep(1);
  };

  // Step 2 -> 3: Details submit -> Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      addToast({ title: 'Validation Error', message: 'Enter a valid 10-digit mobile number', type: 'error' });
      return;
    }
    if (!govtIdNumber) {
      addToast({ title: 'Validation Error', message: 'Enter simulated Government ID number', type: 'error' });
      return;
    }
    setCurrentStep(2);
    setTimer(30);
    addToast({ title: 'Mock OTP Sent', message: 'Use demo OTP code: 123456', type: 'info' });
  };

  // Step 3 -> 4: Verify OTP & DB Simulation
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456') {
      addToast({ title: 'Invalid OTP', message: 'Please enter 123456 for demo verification.', type: 'error' });
      return;
    }

    setCurrentStep(3); // Show verification animation
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Demo User',
          mobile,
          role: selectedRole,
          govtIdType,
          govtIdNumber,
          otp,
        }),
      });
      const data = await res.json();

      setTimeout(() => {
        setIsLoading(false);
        if (data.success) {
          const updatedUser = {
            ...data.user,
            trade: selectedRole === 'LABORER' ? labourTrade : undefined,
            ratePerSqFt: selectedRole === 'LABORER' ? parseFloat(expectedWage) : undefined,
            isSardar: isSardarSupervisor,
          };
          setMaskedResult(data.user.maskedGovtId);
          setUser(updatedUser);
          setActiveRole(selectedRole);
          setCurrentStep(4); // Success screen
        } else {
          addToast({ title: 'Verification Failed', message: data.error, type: 'error' });
          setCurrentStep(2);
        }
      }, 1600);
    } catch {
      setIsLoading(false);
      addToast({ title: 'Error', message: 'Failed to verify ID.', type: 'error' });
      setCurrentStep(2);
    }
  };

  const rolesList: {
    role: UserRole;
    label: string;
    subLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    glowBg: string;
    desc: string;
  }[] = [
    {
      role: 'CONTRACTOR',
      label: 'Builder / Contractor',
      subLabel: 'Procurement & Khata',
      icon: Building2,
      accentColor: 'text-amber-500',
      glowBg: 'from-amber-500/20 to-orange-500/20',
      desc: 'Lock wholesale rates, sell extra site stock to suppliers, and hire verified workers.',
    },
    {
      role: 'SUPPLIER',
      label: 'Material Supplier',
      subLabel: 'Rate Cards & Buyback Desk',
      icon: Store,
      accentColor: 'text-purple-500',
      glowBg: 'from-purple-500/20 to-indigo-500/20',
      desc: 'Showcase live material rates, manage warehouse stock, and buy back builder surplus.',
    },
    {
      role: 'LABORER',
      label: 'Skilled Labour & Sardar',
      subLabel: 'Sq.Ft Wage Escrow',
      icon: Users,
      accentColor: 'text-emerald-500',
      glowBg: 'from-emerald-500/20 to-teal-500/20',
      desc: 'Accept job bookings, negotiate fair sq.ft work rates, and receive escrow payouts.',
    },
    {
      role: 'CUSTOMER',
      label: 'Homeowner / Property Client',
      subLabel: 'Verified Directory',
      icon: ShieldCheck,
      accentColor: 'text-blue-500',
      glowBg: 'from-blue-500/20 to-sky-500/20',
      desc: 'Inspect builder portfolios, verify past structural track records, and hire labour directly.',
    },
    {
      role: 'DELIVERY_AGENT',
      label: 'Logistics Fleet Driver',
      subLabel: 'Heavy Vehicle Telematics',
      icon: Truck,
      accentColor: 'text-cyan-500',
      glowBg: 'from-cyan-500/20 to-blue-500/20',
      desc: 'Pick up bulk building loads from staging depots and execute scheduled job-site drops.',
    },
    {
      role: 'ADMIN',
      label: 'BuildNexus Administrator',
      subLabel: 'Executive Command Console',
      icon: ShieldAlert,
      accentColor: 'text-rose-500',
      glowBg: 'from-rose-500/20 to-red-500/20',
      desc: 'Oversee full supply chain telemetry, user verifications, audit logs, and strategic dossiers.',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-4 px-2 sm:px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-[0_25px_70px_rgba(15,23,42,0.14)] bg-white dark:bg-slate-900">
        
        {/* =========================================================================
            LEFT COLUMN: GRAPHICAL BRAND SHOWCASE & ENTERPRISE METRICS
            ========================================================================= */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          {/* Ambient Radiant Mesh Background Lights */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          {/* Top Header & Platform Mission */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)] border border-white/20">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                  Build<span className="text-brand-orange">Nexus</span>
                </h1>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block -mt-1">
                  Enterprise Construction OS
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-amber-300">
                <Sparkles className="w-3.5 h-3.5" /> Direct Builder-to-Supplier Architecture
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                India's Verified Digital Construction Hub
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Zero middleman markups, factory-direct material locks, real-time logistics dispatch tracking, and guaranteed fair wage escrow for trade artisans.
              </p>
            </div>

            {/* Graphical Floating Telemetry Badges */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-brand-orange/40 transition-all flex items-center gap-3 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-brand-orange flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">UltraTech PPC &amp; Tata TMT</span>
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Live Base Locked
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">Direct Supplier Quote • Zero Brokerage</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-500/40 transition-all flex items-center gap-3 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">Heavy Fleet Telematics</span>
                    <span className="text-[10px] font-mono text-slate-300">&lt; 3.5 hrs SLA</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">Dankuni Central Depot ➔ Job Site Drop</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 transition-all flex items-center gap-3 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">Fair Wage Escrow Guarantee</span>
                    <span className="text-[10px] font-black text-emerald-400">100% Direct</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">Square-Footage Performance Contracts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Statutory Footnote */}
          <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-brand-orange" /> CIN &amp; GSTIN Verified
            </span>
            <span>WB-RERA Compliant</span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: PROFESSIONAL AUTH CONSOLE & PERSONA WORKFLOW
            ========================================================================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          
          {/* Top Quick Demo Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" /> Instant Demo Access
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                Simulated Sandbox
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {rolesList.map(({ role, label, icon: Icon, accentColor }) => (
                <button
                  key={role}
                  onClick={() => handleQuickDemoLogin(role)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-slate-200/80 dark:border-slate-800 hover:border-brand-orange/40 text-left transition-all group"
                >
                  <div className={`p-1.5 rounded-lg bg-white dark:bg-slate-700 shadow-2xs group-hover:scale-105 transition-transform shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 ${accentColor}`} />
                  </div>
                  <div className="truncate min-w-0">
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-orange">
                      {label.split('/')[0]}
                    </p>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate">1-Click Sign In</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-slate-100 dark:bg-slate-800 w-full" />

          {/* Stepper Progress */}
          <div className="space-y-6">
            <Stepper
              steps={[
                { label: 'Role' },
                { label: 'Details' },
                { label: 'OTP' },
                { label: 'Verify' },
                { label: 'Done' },
              ]}
              currentStep={currentStep}
            />

            {/* STEP 0: Interactive Role Matrix */}
            {currentStep === 0 && (
              <div className="space-y-4 pt-1">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    Select Your Operating Persona
                  </h3>
                  <p className="text-xs text-brand-slate dark:text-slate-400">
                    Your persona configures direct portal navigation, custom rate cards, and trading desks.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
                  {rolesList.map(({ role, label, subLabel, icon: Icon, desc }) => {
                    const isSelected = selectedRole === role;
                    return (
                      <div
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'border-brand-orange bg-orange-50/60 dark:bg-orange-950/30 shadow-xs'
                            : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div
                              className={`p-2 rounded-xl transition-colors ${
                                isSelected
                                  ? 'bg-brand-orange text-white shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-2xs">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            )}
                          </div>

                          <div>
                            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                              {label}
                            </h4>
                            <p className="text-[10px] text-brand-orange font-bold">{subLabel}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-1 line-clamp-2">
                              {desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button
                  onClick={handleProceedToDetails}
                  variant="primary"
                  className="w-full gap-2 mt-2"
                >
                  <span>Continue Setup with {selectedRole}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* STEP 1: Details & Government ID */}
            {currentStep === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4 pt-1">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    {selectedRole === 'LABORER'
                      ? 'Trade Specialization & Wage Rate'
                      : 'Identification & Business Profile'}
                  </h3>
                  <p className="text-xs text-brand-slate dark:text-slate-400">
                    {selectedRole === 'LABORER'
                      ? 'Specify your trade trade expertise, square-foot rate card, and team capacity.'
                      : 'Simulate government KYC authentication to generate verified trust badges.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="Full Name / Legal Enterprise"
                    placeholder={selectedRole === 'LABORER' ? 'e.g. Sunil Kumar' : 'e.g. Rajesh Sharma'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    leftIcon={<User className="w-4 h-4" />}
                    required
                  />

                  <Input
                    label="Mobile Number (Direct Contact)"
                    placeholder="e.g. 9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    leftIcon={<Phone className="w-4 h-4" />}
                    maxLength={10}
                    required
                  />
                </div>

                {/* SPECIALIZED TRADE PICKER FOR LABOUR */}
                {selectedRole === 'LABORER' && (
                  <div className="p-4 bg-orange-50/70 dark:bg-orange-950/40 rounded-2xl border border-orange-200 dark:border-orange-800 space-y-3.5">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-brand-orange" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Trade Specialization &amp; Rate Structure
                      </span>
                    </div>

                    <Select
                      label="Select Primary Specialization Work"
                      value={labourTrade}
                      onChange={(e) => setLabourTrade(e.target.value)}
                      options={[
                        { value: 'Electrician', label: '⚡ Electrician (Conduit, DB, Wiring, Industrial)' },
                        { value: 'Plumber', label: '🔧 Plumber & Pipe Fitter (CPVC, Sanitary, Drainage)' },
                        { value: 'Mason', label: '🧱 Mason / Brick Layer (Plastering, AAC, Concrete)' },
                        { value: 'Bar Bender', label: '🏗️ Bar Bender & Steel Fixer (Rebar Tying, Column)' },
                        { value: 'Welder', label: '🔥 Welder & Structural Fabricator' },
                        { value: 'Painter', label: '🎨 Painter & Surface Polisher (Putty, Emulsion)' },
                        { value: 'Carpenter', label: '🪚 Carpenter & Shuttering Expert (Formwork)' },
                        { value: 'Tile & Marble Layer', label: '📐 Tile, Granite & Marble Layer' },
                        { value: 'Heavy Equipment Operator', label: '🚜 Crane, JCB & Concrete Pump Operator' },
                        { value: 'Site Helper / Coolie', label: '📦 General Construction Helper / Coolie' },
                      ]}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Expected Rate (₹ / sq.ft)"
                        type="number"
                        step="any"
                        value={expectedWage}
                        onChange={(e) => setExpectedWage(e.target.value)}
                        placeholder="e.g. 18"
                        required
                      />
                      <Input
                        label="Years of Experience"
                        type="number"
                        value={labourExperience}
                        onChange={(e) => setLabourExperience(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="sardarCheck"
                        checked={isSardarSupervisor}
                        onChange={(e) => setIsSardarSupervisor(e.target.checked)}
                        className="w-4 h-4 text-brand-orange rounded"
                      />
                      <label htmlFor="sardarCheck" className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                        I lead a Sardar Team (Multiple workers under my supervision)
                      </label>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Select
                    label="Government ID Type"
                    value={govtIdType}
                    onChange={(e) => setGovtIdType(e.target.value)}
                    options={[
                      { value: 'AADHAAR', label: 'Aadhaar Card (12 Digits)' },
                      { value: 'PAN', label: 'PAN Card (10 Digits)' },
                      { value: 'VOTER_ID', label: 'Voter ID Card' },
                    ]}
                  />

                  <Input
                    label={`${govtIdType} Number (Simulation)`}
                    placeholder="Enter any simulated 12-digit ID"
                    value={govtIdNumber}
                    onChange={(e) => setGovtIdNumber(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4" />}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(0)}
                    className="w-1/3"
                  >
                    Back
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1">
                    Send Verification OTP
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 2: Mock OTP Screen */}
            {currentStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1 text-center">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Enter Verification OTP
                  </h3>
                  <p className="text-xs text-brand-slate dark:text-slate-400">
                    A 6-digit mock OTP has been dispatched to <span className="font-bold text-slate-900 dark:text-white">+91 {mobile}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOtp('123456')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-brand-orange text-xs font-extrabold border border-orange-300 dark:border-orange-800 mt-2 hover:bg-orange-200 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Auto-Fill Demo OTP: 123456
                  </button>
                </div>

                <div className="max-w-xs mx-auto">
                  <Input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-center font-extrabold text-2xl tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="text-xs text-slate-500">
                  {timer > 0 ? (
                    <span>Resend OTP in <span className="font-bold">{timer}s</span></span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setTimer(30);
                        addToast({ title: 'OTP Resent', message: 'Demo OTP is 123456', type: 'info' });
                      }}
                      className="text-brand-orange font-bold hover:underline"
                    >
                      Resend OTP Code
                    </button>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="w-1/3"
                  >
                    Back
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1">
                    Verify &amp; Enter Portal
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 3: Animated Radar Verification Scan */}
            {currentStep === 3 && (
              <div className="py-10 text-center space-y-5">
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-orange/30 border-t-brand-orange animate-spin" />
                  <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center">
                    <ShieldCheck className="w-9 h-9 text-brand-orange animate-pulse" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Verifying Identity &amp; Initializing Portal...
                  </h3>
                  <p className="text-xs text-brand-slate dark:text-slate-400 max-w-sm mx-auto">
                    Executing zero-knowledge hash verification, staging khata ledger, and publishing trust certificates.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 4: Successful Sign-In Confirmation */}
            {currentStep === 4 && (
              <div className="py-6 text-center space-y-5">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <Badge variant="verified" className="text-xs px-3 py-1 mx-auto">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Government ID Verified &amp; Masked
                  </Badge>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Welcome to BuildNexus!
                  </h3>
                  <p className="text-xs text-brand-slate dark:text-slate-400">
                    Logged in as <span className="font-extrabold text-slate-900 dark:text-white">{name || 'User'}</span> ({selectedRole}).
                  </p>
                </div>

                <Card className="bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-left p-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Security Clearance:</span>
                    <span className="font-bold text-emerald-600">Approved &amp; Live</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Active Persona:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedRole}</span>
                  </div>
                  {selectedRole === 'LABORER' && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Trade Specialization:</span>
                      <span className="font-bold text-brand-orange">{labourTrade} (₹{expectedWage}/sq.ft)</span>
                    </div>
                  )}
                </Card>

                <Button
                  onClick={() => {
                    if (selectedRole === 'CONTRACTOR') router.push('/marketplace');
                    else if (selectedRole === 'LABORER') router.push('/labour');
                    else if (selectedRole === 'CUSTOMER') router.push('/contractors');
                    else if (selectedRole === 'SUPPLIER') router.push('/sell');
                    else if (selectedRole === 'DELIVERY_AGENT') router.push('/delivery');
                    else if (selectedRole === 'ADMIN') router.push('/admin');
                  }}
                  variant="primary"
                  className="w-full gap-2"
                >
                  <span>Launch {selectedRole === 'CUSTOMER' ? 'Customer Directory' : `${selectedRole} Portal`}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Bottom Security Note */}
          <div className="pt-2 text-center text-[11px] text-slate-400">
            Protected by 256-Bit TLS Encryption • Zero Personal Data Leakage • IS 1489 Protocol
          </div>
        </div>

      </div>
    </div>
  );
}
