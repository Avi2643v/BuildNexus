'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Rating } from '@/components/ui/Rating';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { formatINR } from '@/lib/utils';
import { triggerConfetti } from '@/lib/confetti';
import { DEMO_LABORERS, type LaborerItem } from '@/lib/demo-labour';
import {
  Users,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  Plus,
  Minus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  MapPin,
  Briefcase,
  DollarSign,
  Zap,
  Wrench,
  Hammer,
  Layers,
  Ruler,
} from 'lucide-react';

export default function LabourPage() {
  const { user, activeRole, labourBookingOffers, respondToLabourOffer, addLabourBookingOffer, addToast } = useAppStore();

  const isLaborerPersona = activeRole === 'LABORER';
  const [activeTab, setActiveTab] = useState<'OFFERS' | 'CATALOG'>(
    isLaborerPersona ? 'OFFERS' : 'CATALOG'
  );

  const [laborers, setLaborers] = useState<LaborerItem[]>(DEMO_LABORERS);
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Negotiation Modal State for Laborer
  const [negotiatingOfferId, setNegotiatingOfferId] = useState<string | null>(null);
  const [counterWageInput, setCounterWageInput] = useState('');
  const [counterNoteInput, setCounterNoteInput] = useState('');

  // Contractor Booking Modal State
  const [selectedLaborer, setSelectedLaborer] = useState<LaborerItem | null>(null);
  const [bookingMode, setBookingMode] = useState<'SQFT' | 'DAILY'>('SQFT');
  const [workAreaSqFt, setWorkAreaSqFt] = useState(1200);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [workersCount, setWorkersCount] = useState(4);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  const skillsList = [
    { id: 'all', label: 'All Trades & Skills' },
    { id: 'electrician', label: '⚡ Electrician' },
    { id: 'plumber', label: '🔧 Plumber' },
    { id: 'mason', label: '🧱 Mason / Brick Layer' },
    { id: 'bar bender', label: '🏗️ Bar Bender & Steel Fixer' },
    { id: 'brick jointer', label: 'Brick Jointer' },
    { id: 'sardar', label: 'Sardar Squads' },
  ];

  const fetchLaborers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/labour?skill=${encodeURIComponent(selectedSkill)}`);
      const data = await res.json();
      if (data.success && data.laborers) {
        setLaborers(data.laborers);
      }
    } catch (err) {
      console.error('Failed to fetch laborers, falling back to demo data', err);
      // Filter locally from DEMO_LABORERS if network fails
      if (selectedSkill === 'all') {
        setLaborers(DEMO_LABORERS);
      } else if (selectedSkill === 'sardar') {
        setLaborers(DEMO_LABORERS.filter((l) => l.laborProfile.isSardar));
      } else {
        setLaborers(
          DEMO_LABORERS.filter((l) =>
            l.laborProfile.skills.some((s) => s.name.toLowerCase().includes(selectedSkill.toLowerCase()))
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLaborers();
  }, [selectedSkill]);

  // Duration calculation
  const startD = new Date(startDate);
  const endD = new Date(endDate);
  const diffTime = Math.max(0, endD.getTime() - startD.getTime());
  const durationDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

  const multiplier = isHalfDay ? 0.5 : 1.0;
  const currentWage = selectedLaborer?.laborProfile?.dailyWage || 750;
  const ratePerSqFt = selectedLaborer?.laborProfile?.ratePerSqFt || Math.round(currentWage / 25);

  const totalCostDaily = Math.round(durationDays * workersCount * currentWage * multiplier);
  const totalCostSqFt = Math.round(workAreaSqFt * ratePerSqFt);
  const activeTotalCost = bookingMode === 'SQFT' ? totalCostSqFt : totalCostDaily;

  const handleConfirmBooking = async () => {
    if (!selectedLaborer) return;
    setIsBookingSubmitting(true);

    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorId: user?.id || 'user-contractor-1',
          laborProfileId: selectedLaborer.laborProfile.id,
          laborType: selectedLaborer.laborProfile.skills[0]?.name || 'Specialized Trade',
          workersCount,
          startDate,
          endDate,
          dailyWage: currentWage,
          durationDays,
          totalCost: activeTotalCost,
        }),
      });

      // Synchronize offer to Labour persona's incoming bookings
      addLabourBookingOffer({
        contractorName: user?.name || 'Bengal Prime Builders (Contractor)',
        contractorMobileMasked: '+91 98765 43210',
        contractorRating: 4.9,
        siteLocation: `${selectedLaborer.city} Construction Site`,
        tradeRequired: selectedLaborer.laborProfile.skills[0]?.name || 'Specialized Trade',
        shiftTiming: isHalfDay ? 'Half Day (4 Hrs)' : 'Full Day (8 Hrs)',
        workAreaSqFt: bookingMode === 'SQFT' ? workAreaSqFt : durationDays * 250,
        ratePerSqFt: ratePerSqFt,
        totalWage: activeTotalCost,
        startDate,
        endDate,
        durationDays,
      });

      addToast({
        title: 'Direct Labour Booked!',
        message: `Booking sent for ${bookingMode === 'SQFT' ? `${workAreaSqFt.toLocaleString()} sq.ft` : `${workersCount} workers`}. 100% fair wage entry auto-created in Digital Khata.`,
        type: 'success',
      });
      triggerConfetti();
      setSelectedLaborer(null);
    } catch {
      addToast({ title: 'Error', message: 'Failed to complete booking', type: 'error' });
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  // Labour Accept Offer
  const handleAcceptOffer = (offerId: string) => {
    respondToLabourOffer(offerId, 'ACCEPTED');
    triggerConfetti();
    addToast({
      title: 'Booking Accepted!',
      message: 'BuildNexus Operations will call you to confirm your schedule and site arrival point.',
      type: 'success',
    });
  };

  // Labour Decline Offer
  const handleDeclineOffer = (offerId: string) => {
    respondToLabourOffer(offerId, 'DECLINED');
    addToast({
      title: 'Booking Declined',
      message: 'The contractor has been notified and dates have been released.',
      type: 'info',
    });
  };

  // Labour Submit Counter-Rate as per sq.ft
  const handleNegotiateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!negotiatingOfferId) return;
    const rate = parseFloat(counterWageInput);
    if (isNaN(rate) || rate <= 0) {
      addToast({ title: 'Error', message: 'Enter a valid rate per sq.ft', type: 'error' });
      return;
    }
    respondToLabourOffer(negotiatingOfferId, 'COUNTERED', rate, counterNoteInput);
    addToast({
      title: 'Counter-Rate Proposal Sent',
      message: `Proposed ₹${rate}/sq.ft to contractor. BuildNexus operations will assist in finalizing the deal.`,
      type: 'success',
    });
    setNegotiatingOfferId(null);
    setCounterWageInput('');
    setCounterNoteInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            {isLaborerPersona ? 'My Work Bookings & Job Offers' : 'Hire Skilled Workers & Labour Squads'}
            <Badge variant="fairWage">100% Direct Fair Wage Guarantee</Badge>
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate dark:text-slate-400 mt-1">
            {isLaborerPersona
              ? 'Incoming booking requests from contractors • Transparent sq.ft rates & zero commission deductions'
              : 'Direct sq.ft & daily hiring • Zero middleman cuts • Verified West Bengal trade squads'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('OFFERS')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'OFFERS'
              ? 'bg-brand-orange text-white shadow-glow'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Incoming Bookings Window ({labourBookingOffers.length})
        </button>
        <button
          onClick={() => setActiveTab('CATALOG')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'CATALOG'
              ? 'bg-brand-orange text-white shadow-glow'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Users className="w-4 h-4" /> Skilled Workers Catalog (Contractor View)
        </button>
      </div>

      {/* TAB 1: INCOMING BOOKINGS WINDOW FOR LABOURERS */}
      {activeTab === 'OFFERS' && (
        <div className="space-y-6">
          {/* Guaranteed Company Call Notice */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800 flex items-start gap-3.5 shadow-sm">
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-md shrink-0">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1 text-xs text-emerald-950 dark:text-emerald-200">
              <h4 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                BuildNexus Operations Verification Call Guarantee
                <Badge variant="verified">Official Policy</Badge>
              </h4>
              <p className="leading-relaxed">
                <span className="font-bold underline">The labour will be called directly by the company (BuildNexus Operations)</span> to verify and tell them the exact dates of their booking, site location directions, and shift timings. You do not need to worry about missing dates or contractor confusion!
              </p>
            </div>
          </div>

          {/* Incoming Booking Offers Cards */}
          <div className="space-y-4">
            {labourBookingOffers.map((offer) => {
              const isAccepted = offer.status === 'ACCEPTED';
              const isDeclined = offer.status === 'DECLINED';
              const isCountered = offer.status === 'COUNTERED';

              return (
                <Card
                  key={offer.id}
                  className={`p-5 space-y-4 border-2 transition-all ${
                    isAccepted
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : isDeclined
                      ? 'border-slate-200 dark:border-slate-800 opacity-60'
                      : isCountered
                      ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20'
                      : 'border-brand-orange/40 shadow-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          Who Wants to Book You: {offer.contractorName}
                        </span>
                        <Rating rating={offer.contractorRating} />
                        <span className="text-xs text-slate-500">({offer.contractorMobileMasked})</span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                        Site Location: <span className="font-semibold text-slate-700 dark:text-slate-300">{offer.siteLocation}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          isAccepted
                            ? 'success'
                            : isDeclined
                            ? 'danger'
                            : isCountered
                            ? 'info'
                            : 'orange'
                        }
                      >
                        {isAccepted
                          ? 'Booking Confirmed'
                          : isDeclined
                          ? 'Offer Declined'
                          : isCountered
                          ? 'Counter-Rate Sent'
                          : 'New Job Offer'}
                      </Badge>
                    </div>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Work Type</span>
                      <p className="font-bold text-slate-900 dark:text-white">{offer.tradeRequired}</p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Work Area</span>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {offer.workAreaSqFt.toLocaleString()} sq.ft
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Job Dates</span>
                      <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                        {offer.startDate} to {offer.endDate} ({offer.durationDays} Days)
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Offered Rate &amp; Payout</span>
                      <p className="font-extrabold text-brand-orange text-sm">
                        {formatINR(offer.totalWage)}
                        <span className="text-[10px] text-slate-500 font-normal"> (₹{offer.counterRatePerSqFt || offer.ratePerSqFt}/sq.ft)</span>
                      </p>
                    </div>
                  </div>

                  {/* Company Call Notice for this Booking */}
                  <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        BuildNexus Call Time: <span className="font-bold">{offer.callScheduledTime}</span> (Customer support will call to confirm dates)
                      </span>
                    </div>
                    <Badge variant="neutral" size="sm">Zero Deductions</Badge>
                  </div>

                  {/* Counter Notes Display if any */}
                  {offer.counterNotes && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-xs text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                      <span className="font-bold">Your Counter-Offer Note: </span>
                      {offer.counterNotes} (Proposed: ₹{offer.counterRatePerSqFt || offer.ratePerSqFt}/sq.ft for {offer.workAreaSqFt.toLocaleString()} sq.ft)
                    </div>
                  )}

                  {/* Action Buttons: Accept / Deny / Negotiate */}
                  {offer.status === 'OFFER_RECEIVED' && (
                    <div className="pt-2 flex flex-wrap gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleAcceptOffer(offer.id)}
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        Accept Booking Offer
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setNegotiatingOfferId(offer.id);
                          setCounterWageInput(String(offer.ratePerSqFt + 4));
                        }}
                        leftIcon={<DollarSign className="w-4 h-4" />}
                      >
                        Negotiate Rate (₹/sq.ft)
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeclineOffer(offer.id)}
                        leftIcon={<XCircle className="w-4 h-4" />}
                      >
                        Deny / Decline
                      </Button>
                    </div>
                  )}

                  {isAccepted && (
                    <div className="text-right text-xs font-bold text-emerald-600 flex items-center justify-end gap-1.5 pt-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Booking Confirmed. Please keep your phone available for the BuildNexus schedule call.
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SKILLED WORKERS CATALOG (CONTRACTOR VIEW) */}
      {activeTab === 'CATALOG' && (
        <div className="space-y-6">
          {/* Category Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {skillsList.map((sk) => (
              <button
                key={sk.id}
                onClick={() => setSelectedSkill(sk.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all touch-manipulation ${
                  selectedSkill === sk.id
                    ? 'bg-brand-orange text-white shadow-glow'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {sk.label}
              </button>
            ))}
          </div>

          {/* Laborers Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-3xl" />
              ))}
            </div>
          ) : laborers.length === 0 ? (
            <EmptyState
              title="No Skilled Workers Found"
              description="Try switching categories to view available Electricians, Plumbers, Jointers, and Squads."
              actionLabel="View All Workers"
              onAction={() => setSelectedSkill('all')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {laborers.map((lab) => {
                const profile = lab.laborProfile;
                if (!profile) return null;
                const isSardar = profile.isSardar;
                const sqftRate = profile.ratePerSqFt || Math.round(profile.dailyWage / 25);

                return (
                  <Card key={lab.id} hoverable className="flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar name={lab.name} src={lab.avatar} isVerified size="lg" />
                          <div>
                            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                              {isSardar ? profile.teamName || lab.name : lab.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {profile.experienceYears} Years Exp • {lab.city}
                            </p>
                            <Rating rating={lab.rating} />
                          </div>
                        </div>
                      </div>

                      {/* Skills Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {profile.skills.map((sk) => (
                          <span
                            key={sk.id}
                            className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-xl"
                          >
                            {sk.name}
                          </span>
                        ))}
                        {isSardar && (
                          <Badge variant="orange">Sardar Squad ({profile.teamSize} Workers)</Badge>
                        )}
                      </div>

                      {/* Availability Slots Heat View */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-brand-orange" /> Real-time Slot Availability:
                          </span>
                          <span className="text-emerald-600 font-extrabold">Available for West Bengal</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 h-2 bg-emerald-500 rounded-full" title="Today: Available" />
                          <div className="flex-1 h-2 bg-emerald-500 rounded-full" title="Tomorrow: Available" />
                          <div className="flex-1 h-2 bg-emerald-500 rounded-full" title="Day 3: Available" />
                          <div className="flex-1 h-2 bg-amber-500 rounded-full" title="Day 4: Partial" />
                        </div>
                      </div>

                      {/* Sq.Ft Contract Rate & Daily Reference */}
                      <div className="p-3 bg-brand-orange/5 dark:bg-brand-orange/10 rounded-2xl border border-brand-orange/20 space-y-1.5">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-xl font-black text-brand-orange">
                              ₹{sqftRate}
                            </span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300"> / sq.ft contract</span>
                          </div>
                          <span className="text-xs text-slate-500 font-medium">
                            {formatINR(profile.dailyWage)} / day ref
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> 100% Direct Fair Wage
                          </span>
                          {isSardar ? (
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {profile.teamSize} Workers Squad
                            </span>
                          ) : (
                            <span className="font-medium text-slate-500">
                              Zero Platform Cut
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        className="flex-1"
                        onClick={() => setSelectedLaborer(lab)}
                      >
                        Send Booking Request
                      </Button>
                      <Link href="/chat">
                        <Button size="sm" variant="outline" className="px-3">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL: WAGE NEGOTIATION MODAL FOR LABOUR */}
      <Modal
        isOpen={!!negotiatingOfferId}
        onClose={() => setNegotiatingOfferId(null)}
        title="Negotiate Rate as per Sq.Ft"
        description="Propose a revised rate per sq.ft to the contractor. Total contract payout updates automatically based on work area."
      >
        <form onSubmit={handleNegotiateSubmit} className="space-y-4 pt-2">
          <Input
            label="Your Counter Rate (₹ / sq.ft)"
            type="number"
            step="any"
            value={counterWageInput}
            onChange={(e) => setCounterWageInput(e.target.value)}
            required
            helperText="Specialized contract rate per square foot."
          />

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Note to Contractor (Optional)
            </label>
            <textarea
              value={counterNoteInput}
              onChange={(e) => setCounterNoteInput(e.target.value)}
              placeholder="e.g. Scaffolding wiring work requires additional safety gears; high quality certified finish."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              rows={3}
            />
          </div>

          <div className="p-3 bg-orange-50 dark:bg-orange-950/40 rounded-xl text-xs text-orange-950 dark:text-orange-200">
            BuildNexus will inform the contractor of your per sq.ft proposal and coordinate the confirmation call.
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Submit Counter-Rate Proposal
          </Button>
        </form>
      </Modal>

      {/* BOOKING MODAL FOR CONTRACTORS (SQ.FT FIRST) */}
      <Modal
        isOpen={!!selectedLaborer}
        onClose={() => setSelectedLaborer(null)}
        title={`Book ${selectedLaborer?.laborProfile?.teamName || selectedLaborer?.name}`}
        description="Book as per Sq.Ft Contract (Standard) or daily shift. 100% direct fair wages with zero middleman deductions."
        maxWidth="lg"
      >
        {selectedLaborer && (
          <div className="space-y-5 pt-2">
            {/* Booking Mode Selector */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setBookingMode('SQFT')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  bookingMode === 'SQFT'
                    ? 'bg-brand-orange text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Ruler className="w-4 h-4" /> As per Sq.Ft Contract (Standard)
              </button>
              <button
                type="button"
                onClick={() => setBookingMode('DAILY')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  bookingMode === 'DAILY'
                    ? 'bg-brand-orange text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4" /> Daily Shift Basis
              </button>
            </div>

            {/* Sq.Ft Input Mode */}
            {bookingMode === 'SQFT' ? (
              <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300">
                      Work Area (Sq.Ft)
                    </label>
                    <span className="text-xs font-bold text-brand-orange">
                      Contract Rate: ₹{ratePerSqFt}/sq.ft
                    </span>
                  </div>
                  <Input
                    type="number"
                    value={workAreaSqFt}
                    onChange={(e) => setWorkAreaSqFt(Math.max(10, parseInt(e.target.value) || 0))}
                    placeholder="Enter total project area in sq.ft"
                  />
                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {[500, 1000, 1500, 2500, 5000].map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => setWorkAreaSqFt(area)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                          workAreaSqFt === area
                            ? 'bg-brand-orange text-white border-brand-orange'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {area.toLocaleString()} sq.ft
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Estimated Timeline</span>
                    <p className="font-extrabold text-slate-900 dark:text-white">
                      {Math.max(2, Math.ceil(workAreaSqFt / 300))} Working Days
                    </p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Squad Deployment</span>
                    <p className="font-extrabold text-slate-900 dark:text-white">
                      {selectedLaborer.laborProfile.teamSize || workersCount} Workers Assigned
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Daily Shift Input Mode */
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Workers Required
                    </label>
                    <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit">
                      <button
                        onClick={() => setWorkersCount(Math.max(1, workersCount - 1))}
                        className="p-2 bg-white dark:bg-slate-900 rounded-xl text-slate-700 dark:text-slate-200 shadow-sm"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-extrabold text-base px-3">{workersCount} Workers</span>
                      <button
                        onClick={() => setWorkersCount(workersCount + 1)}
                        className="p-2 bg-white dark:bg-slate-900 rounded-xl text-slate-700 dark:text-slate-200 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Shift Duration
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsHalfDay(false)}
                        className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold border ${
                          !isHalfDay
                            ? 'bg-brand-orange text-white border-brand-orange'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200'
                        }`}
                      >
                        Full Day (8 Hrs)
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsHalfDay(true)}
                        className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold border ${
                          isHalfDay
                            ? 'bg-brand-orange text-white border-brand-orange'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200'
                        }`}
                      >
                        Half Day (4 Hrs)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Date Selection */}
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={(s, e) => {
                setStartDate(s);
                setEndDate(e);
              }}
            />

            {/* Guarantee Call Banner */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                BuildNexus Operations will call the labourer within 30 mins to confirm site address and arrival timings.
              </span>
            </div>

            {/* Price Summary Breakdown */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-800 shadow-lg">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Calculation Basis:</span>
                <span className="font-bold text-white">
                  {bookingMode === 'SQFT'
                    ? `${workAreaSqFt.toLocaleString()} sq.ft × ₹${ratePerSqFt}/sq.ft`
                    : `${workersCount} Workers × ${durationDays} Days × ₹${currentWage * multiplier}`}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Platform Commission:</span>
                <span className="font-extrabold text-emerald-400">₹0 (100% Direct Fair Wage)</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-xs uppercase font-extrabold text-slate-400">Total Contract Booking:</span>
                <span className="text-2xl font-black text-brand-orange">{formatINR(activeTotalCost)}</span>
              </div>
            </div>

            <Button
              onClick={handleConfirmBooking}
              variant="primary"
              isLoading={isBookingSubmitting}
              className="w-full"
            >
              Confirm &amp; Send Booking Request ({formatINR(activeTotalCost)})
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
