'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Rating } from '@/components/ui/Rating';
import { Modal } from '@/components/ui/Modal';
import { triggerConfetti } from '@/lib/confetti';
import {
  Building2,
  MapPin,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldCheck,
  Search,
  Phone,
  Briefcase,
  Sparkles,
  ArrowRight,
  Filter,
  User,
  Edit,
  Save,
  PhoneCall,
  Clock,
  Plus,
  Trash2,
  Eye,
  Check,
  TrendingUp,
} from 'lucide-react';

export default function ContractorsDirectoryPage() {
  const {
    activeRole,
    user,
    builderPublicProfiles,
    updateBuilderProfileSettings,
    customerConsultationInquiries,
    addCustomerConsultationInquiry,
    updateCustomerConsultationStatus,
    addToast,
  } = useAppStore();

  const isContractor = activeRole === 'CONTRACTOR';

  // Active view tab for contractors: strictly their own profile & leads
  const [activeTab, setActiveTab] = useState<'MY_PROFILE' | 'LEADS'>('MY_PROFILE');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('ALL');
  const [selectedSpec, setSelectedSpec] = useState('ALL');

  // Customer Consultation Request Modal State
  const [selectedBuilder, setSelectedBuilder] = useState<any>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contractor Profile Edit State (Defaulting to builder-1 / Rajesh Sharma & Joyjit Constructions)
  const myProfile = builderPublicProfiles.find((b) => b.id === 'builder-1') || builderPublicProfiles[0];
  const [editProjectsCount, setEditProjectsCount] = useState(String(myProfile.projectsCompleted));
  const [editSqFtBuilt, setEditSqFtBuilt] = useState(myProfile.totalSqFtBuilt);
  const [editOnTimeRate, setEditOnTimeRate] = useState(String(myProfile.onTimeDeliveryRate));
  const [editLicense, setEditLicense] = useState(myProfile.license);
  const [editBreakdown, setEditBreakdown] = useState(myProfile.projectBreakdown);
  const [workingAreasList, setWorkingAreasList] = useState<string[]>(myProfile.areasWorked);
  const [newAreaInput, setNewAreaInput] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Extract unique areas across directory
  const allAreas = Array.from(
    new Set(builderPublicProfiles.flatMap((b) => b.areasWorked))
  );

  const filteredBuilders = builderPublicProfiles.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.projectBreakdown.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.areasWorked.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesArea =
      selectedArea === 'ALL' || b.areasWorked.includes(selectedArea);

    const matchesSpec =
      selectedSpec === 'ALL' ||
      b.specializations.some((s) => s.toLowerCase().includes(selectedSpec.toLowerCase()));

    return matchesSearch && matchesArea && matchesSpec;
  });

  // Customer submits consultation request
  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBuilder) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      triggerConfetti();

      // Automatically add as a new lead in the store
      addCustomerConsultationInquiry({
        builderId: selectedBuilder.id,
        customerName: customerName || 'Homeowner Client',
        customerPhone: customerPhone || '9876543210',
        projectLocation: projectLocation || 'New Town, Kolkata',
        projectDescription: projectDescription || 'Turnkey residential villa construction consultation.',
        scope: 'Turnkey Residential Construction',
      });

      addToast({
        title: 'Consultation Request Dispatched!',
        message: `Your project request has been delivered to ${selectedBuilder.name}. They will review your blueprint requirements.`,
        type: 'success',
      });

      setSelectedBuilder(null);
      setCustomerName('');
      setCustomerPhone('');
      setProjectLocation('');
      setProjectDescription('');
    }, 800);
  };

  // Contractor saves their public profile
  const handleSaveContractorProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    setTimeout(() => {
      setIsSavingProfile(false);
      updateBuilderProfileSettings(myProfile.id, {
        projectsCompleted: parseInt(editProjectsCount, 10) || myProfile.projectsCompleted,
        totalSqFtBuilt: editSqFtBuilt,
        onTimeDeliveryRate: parseFloat(editOnTimeRate) || myProfile.onTimeDeliveryRate,
        license: editLicense,
        projectBreakdown: editBreakdown,
        areasWorked: workingAreasList,
      });

      triggerConfetti();
      addToast({
        title: 'Public Builder Profile Updated!',
        message: 'Your changes are now live and visible to all property owners browsing in West Bengal.',
        type: 'success',
      });
    }, 600);
  };

  const handleAddArea = () => {
    if (!newAreaInput.trim()) return;
    if (!workingAreasList.includes(newAreaInput.trim())) {
      setWorkingAreasList([...workingAreasList, newAreaInput.trim()]);
    }
    setNewAreaInput('');
  };

  const handleRemoveArea = (area: string) => {
    setWorkingAreasList(workingAreasList.filter((a) => a !== area));
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          CONTRACTOR VIEW TABS (If user is Builder / Contractor)
      ========================================================================= */}
      {isContractor && (
        <div className="backdrop-blur-xl bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="orange" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                <Building2 className="w-3.5 h-3.5 mr-1" /> Contractor Portal
              </Badge>
              <span className="text-xs font-semibold text-slate-400">
                Logged in as: <strong className="text-white">{user?.company || 'Joyjit Constructions'}</strong>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black">
              Builder Business Desk: Public Showcase &amp; Client Leads
            </h2>
          </div>

          {/* 3 Dedicated Tabs for Builder */}
          <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700 shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('MY_PROFILE')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'MY_PROFILE'
                  ? 'bg-brand-orange text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Edit className="w-3.5 h-3.5" /> My Showcase Setup
            </button>
            <button
              onClick={() => setActiveTab('LEADS')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 relative ${
                activeTab === 'LEADS'
                  ? 'bg-brand-orange text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" /> Customer Leads
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-black">
                {customerConsultationInquiries.length}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 1: CONTRACTOR'S OWN PROFILE EDITOR & LIVE SHOWCASE PREVIEW
      ========================================================================= */}
      {isContractor && activeTab === 'MY_PROFILE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {/* Left: Interactive Profile Editor Form */}
          <div className="lg:col-span-7 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div className="space-y-1 pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-brand-orange" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Manage What Property Owners See
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Update your verified track-record, completed projects count, built square footage, and West Bengal working areas. Changes publish instantly.
              </p>
            </div>

            <form onSubmit={handleSaveContractorProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Completed Projects Count"
                  type="number"
                  value={editProjectsCount}
                  onChange={(e) => setEditProjectsCount(e.target.value)}
                  required
                />
                <Input
                  label="Total Built Volume (Sq.Ft)"
                  value={editSqFtBuilt}
                  onChange={(e) => setEditSqFtBuilt(e.target.value)}
                  placeholder="e.g. 2.4 Lakh sq.ft"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="On-Time Delivery Rate (%)"
                  type="number"
                  step="any"
                  value={editOnTimeRate}
                  onChange={(e) => setEditOnTimeRate(e.target.value)}
                  required
                />
                <Input
                  label="Official WB License Details"
                  value={editLicense}
                  onChange={(e) => setEditLicense(e.target.value)}
                  required
                />
              </div>

              {/* Working Areas Manager */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                  Geographical Areas Worked (West Bengal Corridors)
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add area (e.g. Siliguri, Asansol, Alipore...)"
                    value={newAreaInput}
                    onChange={(e) => setNewAreaInput(e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={handleAddArea} className="shrink-0">
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {workingAreasList.map((area) => (
                    <span
                      key={area}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold bg-orange-50 dark:bg-orange-950/40 text-brand-orange border border-orange-200 dark:border-orange-800 flex items-center gap-1.5"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => handleRemoveArea(area)}
                        className="text-slate-400 hover:text-rose-500 font-black"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Breakdown Portfolio Description */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                  Project Portfolio Summary (Audited Breakdown)
                </label>
                <textarea
                  value={editBreakdown}
                  onChange={(e) => setEditBreakdown(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  placeholder="e.g. 18 Luxury Bungalows, 8 Commercial Tech Hubs, 12 Residential Complexes in New Town..."
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isSavingProfile}
                className="w-full"
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save &amp; Publish Public Showcase
              </Button>
            </form>
          </div>

          {/* Right: Live Preview of the Builder Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-brand-orange" /> Live Customer Card Preview:
              </span>
              <Badge variant="verified">Public View</Badge>
            </div>

            <Card className="backdrop-blur-md border-2 border-brand-orange shadow-2xl p-6 space-y-5 bg-white/90 dark:bg-slate-900/90">
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <Avatar name={myProfile.name} src={myProfile.avatar} isVerified size="xl" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                      {myProfile.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="verified" size="sm">Govt Licensed</Badge>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300">
                        {editOnTimeRate}% On-Time Record
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      License: {editLicense}
                    </p>
                    <div className="flex items-center gap-1 pt-0.5">
                      <Rating rating={myProfile.rating} />
                      <span className="text-xs text-slate-500 font-bold">({myProfile.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Track Record Stats */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-xs border border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Completed</span>
                    <p className="text-base font-black text-slate-900 dark:text-white">
                      {editProjectsCount} Delivered
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Built Area</span>
                    <p className="text-base font-black text-brand-orange">
                      {editSqFtBuilt}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;{editBreakdown}&rdquo;
                </p>

                {/* Areas Worked */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-extrabold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-orange" /> Operating Districts:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {workingAreasList.map((area) => (
                      <span
                        key={area}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-[11px] text-blue-900 dark:text-blue-200 text-center font-bold">
                    🛡️ Strict Zero Pricing Transparency Guarantee Active
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: INCOMING CUSTOMER CONSULTATION INQUIRIES & LEADS
      ========================================================================= */}
      {isContractor && activeTab === 'LEADS' && (
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Incoming Property Owner Consultation Leads
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Property owners and homeowners in West Bengal who requested a private consultation with your company.
              </p>
            </div>

            <Badge variant="verified">
              {customerConsultationInquiries.length} Active Leads
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customerConsultationInquiries.map((lead) => {
              const isContacted = lead.status === 'CONTACTED';

              return (
                <Card
                  key={lead.id}
                  className={`p-5 space-y-4 border-2 transition-all ${
                    isContacted
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : 'border-brand-orange/40 bg-orange-50/10 shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                        New Project Lead
                      </span>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {lead.customerName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                          <Phone className="w-3 h-3 text-emerald-600" /> {lead.customerPhone}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-orange" /> {lead.projectLocation}
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant={isContacted ? 'verified' : 'orange'}
                      size="sm"
                    >
                      {isContacted ? '✓ Contacted' : 'New Client Request'}
                    </Badge>
                  </div>

                  <div className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1.5 text-xs">
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      Scope: <span className="text-brand-orange font-extrabold">{lead.scope}</span>
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 italic">
                      &ldquo;{lead.projectDescription}&rdquo;
                    </p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      Received: {lead.date}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1 text-xs"
                      onClick={() => {
                        updateCustomerConsultationStatus(lead.id, 'CONTACTED');
                        addToast({
                          title: 'Calling Customer Lead',
                          message: `Dialing ${lead.customerName} at ${lead.customerPhone}. Marked as Contacted.`,
                          type: 'info',
                        });
                      }}
                    >
                      <PhoneCall className="w-3.5 h-3.5 mr-1" /> Call Customer Lead
                    </Button>
                    {!isContacted && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => updateCustomerConsultationStatus(lead.id, 'CONTACTED')}
                      >
                        Mark Contacted
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          CUSTOMER VIEW: DIRECTORY SHOWCASE (Strictly for Customers seeking Builders)
      ========================================================================= */}
      {!isContractor && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Header Card with Glassmorphic Container & Perfect Alignment */}
          <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="verified">Customer Showcase</Badge>
                  <Badge variant="orange" className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Independent Track-Record &amp; Verified Delivery Only
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Verified Builders &amp; Contractors
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                  Browse verified West Bengal builders by delivered projects, built square footage &amp; operating areas. (Strict zero pricing transparency)
                </p>
              </div>

              <div className="shrink-0 self-start md:self-auto">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-brand-orange" />
                  <span>{filteredBuilders.length} Builders Listed</span>
                </span>
              </div>
            </div>

            {/* Filter and Search Bar with Exact 3-Column Alignment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Search Contractors"
                placeholder="Search by builder name, project type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />

              <Select
                label="Filter by Area Worked"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                options={[
                  { value: 'ALL', label: 'All West Bengal Regions' },
                  ...allAreas.map((area) => ({ value: area, label: area })),
                ]}
              />

              <Select
                label="Filter by Specialization"
                value={selectedSpec}
                onChange={(e) => setSelectedSpec(e.target.value)}
                options={[
                  { value: 'ALL', label: 'All Specializations' },
                  { value: 'Residential', label: 'Residential Villas & Homes' },
                  { value: 'Commercial', label: 'Commercial Tech Parks' },
                  { value: 'Structural', label: 'Structural Concrete & High-Rise' },
                ]}
              />
            </div>
          </div>

          {/* Builders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBuilders.map((builder) => (
              <Card
                key={builder.id}
                hoverable
                className="p-6 flex flex-col justify-between space-y-5 border-2 border-slate-200 dark:border-slate-800 hover:border-brand-orange transition-all"
              >
                <div className="space-y-4">
                  {/* Header Profile Info (Zero Overlap Layout) */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <Avatar name={builder.name} src={builder.avatar} isVerified size="xl" className="shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                          {builder.name}
                        </h3>

                        {/* Non-overlapping Badge Row */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="verified" size="sm">
                            Govt Licensed
                          </Badge>
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                            {builder.onTimeDeliveryRate}% On-Time Record
                          </span>
                        </div>

                        <p className="text-xs text-slate-500">
                          License: {builder.license} • Established {builder.establishedYear}
                        </p>

                        <div className="flex items-center gap-2 pt-0.5">
                          <Rating rating={builder.rating} />
                          <span className="text-xs text-slate-500 font-bold">
                            ({builder.reviewsCount} Customer Reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* HOW MUCH WORKED (Projects Completed & Total Built Volume) */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-brand-orange">
                        <Briefcase className="w-4 h-4" /> Delivered Construction Volume:
                      </span>
                      <span className="text-slate-500">Audited from Builder Login Setup</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center sm:text-left">
                      <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Total Projects Done</span>
                        <p className="text-xl font-black text-slate-900 dark:text-white">
                          {builder.projectsCompleted} Projects
                        </p>
                      </div>

                      <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Total Area Built</span>
                        <p className="text-xl font-black text-brand-orange">
                          {builder.totalSqFtBuilt}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      &ldquo;{builder.projectBreakdown}&rdquo;
                    </p>
                  </div>

                  {/* IN WHICH AREAS WORKED */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-orange" /> Geographical Areas Worked:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {builder.areasWorked.map((area, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-brand-orange border border-orange-200 dark:border-orange-800"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* SPECIALIZATIONS */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-500" /> Structural Specializations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {builder.specializations.map((spec, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Consultation Request Action (STRICT ZERO PRICING) */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-left w-full sm:w-auto">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Architectural Consultation
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> No Direct Pricing Disclosed
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setSelectedBuilder(builder)}
                    className="w-full sm:w-auto"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Request Consultation
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          CONSULTATION REQUEST MODAL (FOR CUSTOMERS)
      ========================================================================= */}
      <Modal
        isOpen={!!selectedBuilder}
        onClose={() => setSelectedBuilder(null)}
        title={`Request Project Consultation with ${selectedBuilder?.name}`}
        description="Submit your architectural project requirements. Your phone number is strictly protected."
        maxWidth="lg"
      >
        <form onSubmit={handleConsultationSubmit} className="space-y-4 pt-2">
          <Input
            label="Your Full Name"
            placeholder="e.g. Anirban Mukherjee"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            leftIcon={<User className="w-4 h-4" />}
          />

          <Input
            label="Mobile Number"
            placeholder="e.g. 9876543210"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
            maxLength={10}
            leftIcon={<Phone className="w-4 h-4" />}
          />

          <Input
            label="Project Site Location in West Bengal"
            placeholder="e.g. Action Area II, New Town / Salt Lake Sector V"
            value={projectLocation}
            onChange={(e) => setProjectLocation(e.target.value)}
            required
            leftIcon={<MapPin className="w-4 h-4" />}
          />

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Brief Description of Structural Work
            </label>
            <textarea
              placeholder="e.g. Constructing G+3 residential apartment or 3,200 sq.ft villa..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              required
            />
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
            BuildNexus verifies builder licenses and tracks project milestones. No quote fee or brokerage is charged.
          </div>

          <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
            Submit Consultation Request
          </Button>
        </form>
      </Modal>
    </div>
  );
}
