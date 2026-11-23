'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Building2,
  Users,
  Store,
  Truck,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Globe2,
  Sparkles,
  Layers,
  ArrowRight,
  Mail,
  Linkedin,
  CheckCircle2,
  Phone,
  MapPin,
  Briefcase,
  FileCheck,
  Lock,
  ShieldAlert,
  BarChart3,
  Database,
  Scale,
  Clock,
  Send,
  ExternalLink,
} from 'lucide-react';

export default function AboutPage() {
  const { activeRole, addToast } = useAppStore();
  const isAdmin = activeRole === 'ADMIN';

  // Partnership Inquiry Form state
  const [partnerOrg, setPartnerOrg] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [partnerCategory, setPartnerCategory] = useState('Supplier');
  const [partnerMsg, setPartnerMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    addToast({
      title: 'Partnership Inquiry Logged',
      message: 'Your official partnership inquiry has been routed to the executive desk. An BuildNexus representative will contact you within 12 business hours.',
      type: 'success',
    });
  };

  // Full Leadership & Founding Team (5 Members)
  const teamMembers = [
    {
      name: 'Avidhan Ghosh',
      role: 'Co-Founder & Full-Stack Architect',
      department: 'Core Platform & Transaction Engine',
      photo: '/team/avidhan_ghosh.jpg',
      linkedin: 'https://www.linkedin.com/in/avidhan-ghosh-664b093b8?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    },
    {
      name: 'Aditya Jha',
      role: 'Co-Founder & Product Strategist',
      department: 'Corporate Strategy & Product Growth',
      photo: '/team/aditya_jha.jpg',
      linkedin: 'https://www.linkedin.com/in/aditya-jha-6b1292378?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    },
    {
      name: 'Ahana Roy',
      role: 'Co-Founder & Lead Frontend & UX Engineer',
      department: 'User Experience & Design Systems',
      photo: '/team/ahana_roy.jpg',
      linkedin: 'https://www.linkedin.com/in/ahana-roy-949044311?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    },
    {
      name: 'Nihal Gazi',
      role: 'Co-Founder & Cloud & Systems Infrastructure',
      department: 'Platform Operations & Systems Infrastructure',
      photo: '/team/nihal_gazi.jpg',
      linkedin: 'https://www.linkedin.com/',
    },
    {
      name: 'Soumyadeep Tapadar',
      role: 'Co-Founder & Backend Systems & Database Architect',
      department: 'High-Throughput Databases & Khata Ledgers',
      photo: '/team/soumyadeep_tapadar.jpg',
      linkedin: 'https://www.linkedin.com/in/soumyadeep-tapadar-9bb7b3389?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    },
  ];

  // Official Strategic Partnership Pillars
  const partnershipTracks = [
    {
      title: 'Authorized Material Manufacturers & Distributors',
      subtitle: 'Cement, Primary TMT Steel, Aggregates, AAC Blocks & Finishes',
      description:
        'Direct builder off-take agreements, scheduled mill dispatches, automated reverse surplus buybacks, and guaranteed 24-hour payment reconciliation escrow.',
      badge: 'Supply Ecosystem',
      icon: Store,
      benefits: [
        'Zero commission middleman cuts; direct quote locks with verified builders',
        'Automated wholesale slab discounts & regional yard staging in West Bengal',
        'Surplus material buyback clearing desk to maintain high capital turnover',
      ],
    },
    {
      title: 'Class-A Builders & General Contractors',
      subtitle: 'Commercial, Residential Towers & Infrastructure Developers',
      description:
        'Centralized material procurement with factory-direct test certificates, verified square-footage specialized labor deployment, and digitized site khata ledgers.',
      badge: 'Contractor Alliance',
      icon: Building2,
      benefits: [
        'Wholesale supplier live rate cards with multi-tier bulk pricing',
        'Verified skilled workforce deployment on standardized sq.ft rates',
        'Site surplus liquidation hub to sell excess steel and cement back to suppliers',
      ],
    },
    {
      title: 'Heavy Logistics Carriers & Fleet Operators',
      subtitle: 'Multi-Axle Flatbeds, Tipper Fleets, & Rapid Delivery Vans',
      description:
        'Integrated GPS telematics matching outbound material shipments with return-haul builder surplus pickups, maximizing fleet revenue and eliminating dry runs.',
      badge: 'Logistics Fleet',
      icon: Truck,
      benefits: [
        'Guaranteed return-haul load matching between Dankuni, Kona & New Town corridors',
        'Digital bill of lading (e-Way Bill) generation and automated weigh-slip validation',
        'Instant driver trip settlements with integrated fuel toll advances',
      ],
    },
    {
      title: 'Institutional, Trade Guilds & Financial Partners',
      subtitle: 'Banking Escrows, Technical Universities & Skill Councils',
      description:
        'Collaboration with national financial institutions for structured khata trade credit lines, and construction trade councils for direct biometric artisan verification.',
      badge: 'Institutional Alliances',
      icon: ShieldCheck,
      benefits: [
        'RERA-compliant escrow trust mechanisms for milestone disbursements',
        '100% fair wage guarantee index with direct artisan wallet disbursals',
        'IS-code standardized digital quality inspections and lab testing linkages',
      ],
    },
  ];

  // Admin-Only Strategic Data: Target Market Matrix
  const targetMarkets = [
    {
      title: 'Tier-1 Real Estate Developers',
      scale: '₹50Cr - ₹500Cr+ Portfolio',
      desc: 'High-rise residential and commercial project developers seeking centralized transparent material pricing, institutional QA/QC, and dedicated logistics pipelines.',
    },
    {
      title: 'General Contractors & Civil Builders',
      scale: '₹5Cr - ₹50Cr Turnover',
      desc: 'Class-A to Class-C builders needing reliable daily cement/TMT supplies, site surplus liquidation, and real-time ledger accounting.',
    },
    {
      title: 'Specialized Subcontracting Trade Guilds',
      scale: '50 - 500+ Craftsmen Teams',
      desc: 'Plastering, tile-laying, RCC bar-bending, and electrical guilds working on square-footage performance contracts with escrow wage protection.',
    },
    {
      title: 'Independent Plot Owners & Home Constructors',
      scale: 'Individual Custom Homes',
      desc: 'Homeowners building residential bungalows and duplexes who require verified contractor portfolios, uninflated local material rates, and direct artisan hiring.',
    },
    {
      title: 'Infrastructure & Roadwork Contractors',
      scale: 'Highways, Bridges & Industrial Sheds',
      desc: 'Industrial builders requiring bulk aggregate and M-sand tipper scheduling across Hooghly, Howrah, and North 24 Parganas industrial corridors.',
    },
    {
      title: 'Regional Building Material Distributors',
      scale: 'Stocking Hubs & Yards',
      desc: 'Depot owners leveraging BuildNexus to showcase verified rate cards directly to corporate buyers and purchase high-quality builder site surplus.',
    },
  ];

  // Admin-Only Strategic Data: Product & Tech Roadmap
  const roadmapItems = [
    {
      quarter: 'Phase I (Operational)',
      title: 'Core Dual-Sided Marketplace & Surplus Buyback Engine',
      desc: 'Full role-based portals for Builders, Suppliers, Workers, and Logistics. Transparent rate cards, sq.ft labor bookings, and reverse surplus liquidation.',
      status: 'ACTIVE & DEPLOYED',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: CheckCircle2,
    },
    {
      quarter: 'Phase II (Q2 2027)',
      title: 'AI Commodity Curve & Steel-Cement Procurement Hedging',
      desc: 'Deep learning models trained on regional commodity price indexes to forecast steel & cement dips, recommending optimal bulk procurement timeframes.',
      status: 'IN ACTIVE DEVELOPMENT',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: Cpu,
    },
    {
      quarter: 'Phase III (Q4 2027)',
      title: 'IoT Job-Site Weighbridge & Telemetry Integration',
      desc: 'Automated weight sensors at site checkposts, drone-based volumetric stockpile scanning, and RFID badge check-ins synchronizing straight to khata ledgers.',
      status: 'ARCHITECTURAL DRAFT',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: Layers,
    },
    {
      quarter: 'Phase IV (2028)',
      title: 'PAN-India Heavy Logistics Corridor Expansion',
      desc: 'Scaling automated return-haul matching and verified multi-state freight networks across 20+ Tier-1 industrial belts with native voice procurement in 8 languages.',
      status: 'STRATEGIC HORIZON',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      icon: Globe2,
    },
  ];

  // Admin-Only Strategic Data: Platform Unit Economics & KPIs
  const operationalKpis = [
    { label: 'Dispatch Lead Time SLA', value: '< 3.5 Hours', detail: 'Central Staging Yard to Job Site' },
    { label: 'Khata Default Rate', value: '0.00%', detail: 'Secured via escrow milestone holds' },
    { label: 'Surplus Liquidation Velocity', value: '< 48 Hours', detail: 'From site listing to supplier pickup' },
    { label: 'Fair Wage Index', value: '100% Direct', detail: 'Zero agent cut on artisan sq.ft earnings' },
  ];

  return (
    <div className="space-y-16 py-4 pb-12">
      {/* ADMIN EXCLUSIVE BADGE NOTIFICATION */}
      {isAdmin && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-xs shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-amber-900 dark:text-amber-200">
                  BuildNexus Administrator Executive Dossier
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
                  Full Access
                </span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                Displaying complete organizational blueprint: Executive Leadership, Operational KPIs, Target Market Architecture, Strategic Roadmap, and Corporate Partnerships.
              </p>
            </div>
          </div>
          <Badge variant="orange" className="shrink-0 text-xs py-1">
            Role: ATLAS_ADMIN
          </Badge>
        </div>
      )}

      {/* CORPORATE HERO HEADER */}
      <section className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white dark:bg-slate-800 border border-slate-700 text-xs font-bold shadow-xs">
          <Building2 className="w-4 h-4 text-brand-orange" />
          <span>BuildNexus Infrastructure Technologies Pvt. Ltd.</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Corporate Standing
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Pioneering the Future of <span className="text-brand-orange">Construction Logistics</span> & Fair Trade
        </h1>

        <p className="text-base sm:text-lg text-brand-slate dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          BuildNexus is India's purpose-built construction operating system. We bridge General Contractors, Authorized Material Manufacturers, Heavy Transport Fleets, and Specialized Artisans into a unified, zero-brokerage digital supply chain.
        </p>

        {/* Corporate Trust Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <FileCheck className="w-4 h-4 text-brand-orange" /> GSTIN & CIN Registered
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <Scale className="w-4 h-4 text-emerald-500" /> 100% Fair Wage Mandate
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-blue-500" /> IS-Standard Material Testing
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <Clock className="w-4 h-4 text-purple-500" /> Express Staging Dispatch
          </span>
        </div>
      </section>

      {/* =========================================================================
          SECTION: FULL EXECUTIVE LEADERSHIP & FOUNDING TEAM (VISIBLE TO ALL)
          ========================================================================= */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <Badge variant="orange" className="mx-auto">
            <Users className="w-3.5 h-3.5 text-brand-orange" /> Executive Leadership
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Meet the Creators of BuildNexus
          </h2>
          <p className="text-xs sm:text-sm text-brand-slate dark:text-slate-400 max-w-2xl mx-auto">
            Our multi-disciplinary team brings together specialized expertise in full-stack architecture, high-throughput cloud systems, civil supply chain mechanics, and heavy telematics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {teamMembers.map((member) => (
            <Card
              key={member.name}
              hoverable
              className="p-5 flex flex-col justify-between text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-orange/50 transition-all shadow-sm"
            >
              <div className="space-y-4">
                {/* Member Photo with Verified Shield */}
                <div className="relative w-24 h-24 mx-auto">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover border-4 border-slate-100 dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      // Fallback initials avatar if image doesn't load
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="absolute bottom-0 right-0 bg-brand-orange text-white p-1 rounded-full border-2 border-white dark:border-slate-900 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold text-brand-orange leading-tight">
                    {member.role}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-0.5">
                    {member.department}
                  </p>
                </div>
              </div>

              {/* Verified LinkedIn Link */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold transition-all border border-slate-200/60 dark:border-slate-700/60"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Verified Profile</span>
                  <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* =========================================================================
          ADMIN-ONLY SECTION: OPERATIONAL BLUEPRINT & INTERNAL STRATEGY
          (Only rendered when activeRole === 'ADMIN')
          ========================================================================= */}
      {isAdmin && (
        <>
          {/* 1. OPERATIONAL KPIS & PLATFORM UNIT ECONOMICS */}
          <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-xl space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="orange" className="bg-orange-500/20 text-orange-400">
                    Admin Intelligence
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">INTERNAL_AUDIT_2026</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Operational Metrics & Unit Economics
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Real-time algorithmic dispatch performance and collateral risk indicators across West Bengal hubs.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Platform Health: Optimal
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {operationalKpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-1.5"
                >
                  <p className="text-xs text-slate-400 font-medium">{kpi.label}</p>
                  <p className="text-2xl sm:text-3xl font-black text-brand-orange tracking-tight">
                    {kpi.value}
                  </p>
                  <p className="text-[11px] text-slate-400">{kpi.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 2. TARGET MARKET SEGMENTATION (ADMIN VIEW) */}
          <section className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <Badge variant="verified">Market Opportunity</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Market Segmentation & Industry Scale
              </h2>
              <p className="text-xs sm:text-sm text-brand-slate dark:text-slate-400">
                Strategic analysis of the ₹72,000 Cr unorganized construction supply chain in Eastern India.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {targetMarkets.map((tm) => (
                <Card key={tm.title} className="p-5 space-y-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-brand-orange uppercase tracking-wider">
                      {tm.scale}
                    </span>
                    <Building2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {tm.title}
                  </h3>
                  <p className="text-xs text-brand-slate dark:text-slate-400 leading-relaxed">
                    {tm.desc}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* 3. FUTURE PRODUCT & TECHNOLOGY ROADMAP (ADMIN VIEW) */}
          <section className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <Badge variant="fairWage">Strategic Moats</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Technological Roadmap & Scaling Horizons
              </h2>
              <p className="text-xs sm:text-sm text-brand-slate dark:text-slate-400">
                Building defensible technological infrastructure for construction transactions and telematics.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {roadmapItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <Card
                    key={item.title}
                    className="p-5 space-y-3.5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                          {item.quarter}
                        </span>
                        <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-brand-orange">
                          <ItemIcon className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-brand-slate dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className={`inline-block text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${item.badgeColor}`}>
                        {item.status}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* =========================================================================
          SECTION: OFFICIAL STRATEGIC PARTNERSHIP DETAILS (VISIBLE TO ALL)
          ========================================================================= */}
      <section className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <Badge variant="verified">Enterprise Collaboration</Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Strategic Corporate Partnerships
          </h2>
          <p className="text-xs sm:text-sm text-brand-slate dark:text-slate-400 max-w-2xl mx-auto">
            BuildNexus enters into formal accords with authorized building material manufacturers, institutional real estate developers, carrier logistics fleets, and banking escrows.
          </p>
        </div>

        {/* 4 Official Strategic Tracks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {partnershipTracks.map((track) => {
            const TrackIcon = track.icon;
            return (
              <Card
                key={track.title}
                hoverable
                className="p-6 space-y-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-orange/40 transition-all shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-brand-orange shrink-0 border border-orange-200/50 dark:border-orange-900/50">
                    <TrackIcon className="w-6 h-6" />
                  </div>
                  <Badge variant="orange" className="text-[10px] py-0.5">
                    {track.badge}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    {track.title}
                  </h3>
                  <p className="text-xs font-bold text-brand-orange">
                    {track.subtitle}
                  </p>
                  <p className="text-xs text-brand-slate dark:text-slate-400 leading-relaxed pt-1">
                    {track.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Institutional Guarantees & Accord:
                  </span>
                  <ul className="space-y-1.5">
                    {track.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>

        {/* OFFICIAL PARTNERSHIP INQUIRY & APPLICATION FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official Contact & Corporate Headquarters */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 bg-slate-900 text-white rounded-3xl border-slate-800 space-y-6 shadow-xl">
              <div>
                <span className="text-[10px] font-black uppercase text-brand-orange tracking-widest block">
                  Official Corporate Secretariat
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  BuildNexus Technologies Head Office
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Direct liaison for institutional agreements, supplier accreditation, and enterprise builder onboarding.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Registered Corporate Office:</span>
                    <span>Tower II, Millennium City IT Park, Sector V, Salt Lake, Kolkata, West Bengal — 700091</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <Mail className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Official Partnership Inquiries:</span>
                    <a href="mailto:partnerships@buildnexus.in" className="hover:text-brand-orange transition-colors">
                      partnerships@buildnexus.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <Phone className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Corporate Board Line:</span>
                    <span>+91 (033) 4022-8800 / +91 98765 43210</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Response SLA:</span>
                    <span>Official responses dispatched within &lt; 12 business hours.</span>
                  </div>
                </div>
              </div>

              {/* Corporate Compliance Details */}
              <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
                <p>CIN: U72900WB2026PTC248910</p>
                <p>GSTIN: 19AAACA8891P1ZV</p>
                <p>MSME UDYAM: WB-14-0092811</p>
                <p>RERA Protocol: WB-RERA-OS-2026-081</p>
              </div>
            </Card>
          </div>

          {/* Right Column: Formal Partnership Application Desk */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="orange">Executive Liaison Desk</Badge>
                  <span className="text-xs text-slate-400 font-bold">• Formal Inquiry</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Initiate Strategic Partnership
                </h3>
                <p className="text-xs text-brand-slate dark:text-slate-400 mt-1">
                  Submit organizational details to receive formal partnership terms, API documentation, or supplier rate card publishing credentials.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-extrabold text-emerald-900 dark:text-emerald-100">
                    Application Docket Successfully Logged
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-bold">{partnerName}</span> from <span className="font-bold">{partnerOrg || 'your enterprise'}</span>. Our corporate alliances team has registered your inquiry under reference ID <span className="font-mono font-bold">ATH-PTNR-{Date.now().toString().slice(-6)}</span>. You will receive an official briefing packet at <span className="font-bold">{partnerEmail}</span> shortly.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setIsSubmitted(false);
                      setPartnerOrg('');
                      setPartnerName('');
                      setPartnerEmail('');
                      setPartnerPhone('');
                      setPartnerMsg('');
                    }}
                  >
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePartnerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Organization / Enterprise Legal Name
                      </label>
                      <Input
                        placeholder="e.g. Bengal Mega Infra Corp"
                        value={partnerOrg}
                        onChange={(e) => setPartnerOrg(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Authorized Representative Name
                      </label>
                      <Input
                        placeholder="e.g. S. K. Mukherjee"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Official Corporate Email
                      </label>
                      <Input
                        type="email"
                        placeholder="e.g. procurement@megainfra.in"
                        value={partnerEmail}
                        onChange={(e) => setPartnerEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Direct Contact Phone
                      </label>
                      <Input
                        type="tel"
                        placeholder="e.g. +91 98301 23456"
                        value={partnerPhone}
                        onChange={(e) => setPartnerPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Partnership Category Track
                      </label>
                      <select
                        value={partnerCategory}
                        onChange={(e) => setPartnerCategory(e.target.value)}
                        className="w-full p-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      >
                        <option value="Supplier">Material Supplier / Distributor</option>
                        <option value="Builder">General Contractor / Builder</option>
                        <option value="Logistics">Heavy Fleet / Logistics Carrier</option>
                        <option value="Institutional">Trade Guild / Financial Escrow</option>
                        <option value="Technology">Technology & Hardware Vendor</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Scope of Partnership Inquiry & Project Details
                    </label>
                    <textarea
                      placeholder="Outline your enterprise procurement volume, delivery corridors (e.g., Dankuni, Howrah, New Town), fleet capacity, or specific alliance requirements..."
                      value={partnerMsg}
                      onChange={(e) => setPartnerMsg(e.target.value)}
                      rows={3}
                      className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      required
                    />
                  </div>

                  <Button type="submit" variant="primary" className="w-full gap-2">
                    <Send className="w-4 h-4" /> Submit Official Partnership Inquiry
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
