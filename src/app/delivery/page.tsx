'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppStore, UserRole } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { formatINR } from '@/lib/utils';
import { triggerConfetti } from '@/lib/confetti';
import {
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Key,
  FileCheck,
  Building2,
  Store,
  Users,
  ArrowRight,
  Sparkles,
  Navigation,
  Phone,
  MessageSquare,
  Copy,
  Check,
  ChevronRight,
  Gauge,
  RefreshCw,
  Layers,
  Award,
  PackageCheck,
  Radio,
} from 'lucide-react';

interface DeliveryConsignment {
  id: string;
  orderId: string;
  materialName: string;
  materialCategory: string;
  materialImage: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  builderId: string;
  builderName: string;
  builderCompany: string;
  deliverySite: string;
  supplierId: string;
  supplierName: string;
  supplierHub: string;
  status: 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED';
  otpCode: string;
  itemMatches: boolean;
  quantityVerified: boolean;
  etaMinutes: number;
  speedKmH: number;
  distanceKm: number;
  trafficStatus: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  vehicleType: string;
  carrierCompany: string;
  departureTime: string;
  estimatedArrival: string;
  tollAmount: number;
  tollPaidBy: string;
  tollPlazaName: string;
  tollFastagRef: string;
}

const SEEDED_CONSIGNMENTS: DeliveryConsignment[] = [
  {
    id: 'del-wb-8492',
    orderId: 'ORD-WB-8492',
    materialName: 'UltraTech PPC Cement (50kg Bags)',
    materialCategory: 'Structural Cement (Grade 53 PPC)',
    materialImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
    quantity: 500,
    unit: 'bags',
    totalAmount: 182500, // ₹365/bag
    builderId: 'user-contractor-1',
    builderName: 'Joyjit Debnath',
    builderCompany: 'Joyjit Constructions',
    deliverySite: 'Plot 42, Action Area II, New Town, Kolkata (Site #4 Bay)',
    supplierId: 'user-supplier-1',
    supplierName: 'Lakshmi Building Supplies',
    supplierHub: 'Dankuni Central Staging Yard & Railhead (NH-19)',
    status: 'IN_TRANSIT',
    otpCode: '4921',
    itemMatches: true,
    quantityVerified: true,
    etaMinutes: 16,
    speedKmH: 44,
    distanceKm: 6.4,
    trafficStatus: 'Belghoria Expressway Clear • Tollway Cleared',
    driverName: 'Vikramjit Roy',
    driverPhone: '+91 98301 44821',
    vehicleNumber: 'WB-19-J-8412',
    vehicleType: 'Tata Signa 2823 10-Wheeler Flatbed (28T GVW)',
    carrierCompany: 'Vikram Express Heavy Logistics (Rank #1 Fleet)',
    departureTime: '10:45 AM (Dankuni)',
    estimatedArrival: '11:45 AM (New Town)',
    tollAmount: 450,
    tollPaidBy: 'Builder / Contractor (Joyjit Constructions)',
    tollPlazaName: 'Dankuni NH-19 Toll Plaza & Belghoria Tollway',
    tollFastagRef: 'NETC-FASTAG-WB19-48291',
  },
  {
    id: 'del-wb-8493',
    orderId: 'ORD-WB-8493',
    materialName: 'Tata Tiscon 550D TMT Rebar (12mm)',
    materialCategory: 'Primary Steel Reinforcement',
    materialImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
    quantity: 15,
    unit: 'tons',
    totalAmount: 915000, // ₹61,000/ton
    builderId: 'user-contractor-1',
    builderName: 'Joyjit Debnath',
    builderCompany: 'Joyjit Constructions',
    deliverySite: 'Sector V IT Park Block EP, Salt Lake, Kolkata',
    supplierId: 'sup-rank-2',
    supplierName: 'Bengal TMT & Steel Hub',
    supplierHub: 'Kona Expressway Staging Yard Depot',
    status: 'PICKED_UP',
    otpCode: '8820',
    itemMatches: true,
    quantityVerified: true,
    etaMinutes: 45,
    speedKmH: 38,
    distanceKm: 14.2,
    trafficStatus: 'Approaching Vidyasagar Setu Toll Plaza',
    driverName: 'Suraj Das',
    driverPhone: '+91 98451 90214',
    vehicleNumber: 'WB-29-B-6109',
    vehicleType: 'Ashok Leyland 3520 Multi-Axle Trailer',
    carrierCompany: 'Bengal Freightways Heavy Fleet (Rank #2 Fleet)',
    departureTime: '11:15 AM (Kona Yard)',
    estimatedArrival: '12:30 PM (Salt Lake)',
    tollAmount: 680,
    tollPaidBy: 'Builder / Contractor (Joyjit Constructions)',
    tollPlazaName: 'Vidyasagar Setu Tollway & Kona Expressway Toll',
    tollFastagRef: 'NETC-FASTAG-WB29-71028',
  },
  {
    id: 'del-wb-8490',
    orderId: 'ORD-WB-8490',
    materialName: 'Red Wire Cut Solid Clay Bricks',
    materialCategory: 'First-Class Kiln Masonry',
    materialImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
    quantity: 10000,
    unit: 'pcs',
    totalAmount: 88000, // ₹8.8/pc
    builderId: 'user-contractor-1',
    builderName: 'Joyjit Debnath',
    builderCompany: 'Joyjit Constructions',
    deliverySite: 'City Centre II Villa Enclave, Rajarhat, Kolkata',
    supplierId: 'user-supplier-1',
    supplierName: 'Lakshmi Building Supplies',
    supplierHub: 'Dankuni Central Yard',
    status: 'DELIVERED',
    otpCode: '3195',
    itemMatches: true,
    quantityVerified: true,
    etaMinutes: 0,
    speedKmH: 0,
    distanceKm: 0,
    trafficStatus: 'Delivered & Offloaded with BuildNexus Verification',
    driverName: 'Raju Mondal',
    driverPhone: '+91 98311 76542',
    vehicleNumber: 'WB-15-C-3381',
    vehicleType: 'Eicher Pro 3019 Heavy Tipper',
    carrierCompany: 'Hooghly Transit Carriers',
    departureTime: '08:00 AM',
    estimatedArrival: '09:20 AM (Completed)',
    tollAmount: 350,
    tollPaidBy: 'Builder / Contractor (Joyjit Constructions)',
    tollPlazaName: 'Belghoria Expressway Toll Plaza',
    tollFastagRef: 'NETC-FASTAG-WB15-99432',
  },
];

const LOGISTICS_FLEET_RANKINGS = [
  {
    rank: 1,
    name: 'Vikram Express Heavy Logistics',
    badge: 'Diamond Transport Tier • BuildNexus Verified Carrier',
    onTimeRate: 99.8,
    rating: 4.96,
    fleetSize: '42 Heavy Commercial Flatbeds & Trailers',
    gpsTracking: 'Real-Time AIS-140 GPS Active',
    hubBase: 'Dankuni Transport Nagar & Kona Expressway',
    avgDeliveryTime: '< 3.2 hrs across Kolkata Metropolitan Area',
    contactMasked: '98301XXXX1',
  },
  {
    rank: 2,
    name: 'Bengal Freightways Heavy Fleet',
    badge: 'Platinum Transport Tier • Steel & Bulk Specialist',
    onTimeRate: 99.2,
    rating: 4.91,
    fleetSize: '28 Multi-Axle Trailers & Transit Mixers',
    gpsTracking: 'Real-Time Telematics & Axle Scale Certified',
    hubBase: 'Durgapur Industrial Corridor & Kona Terminal',
    avgDeliveryTime: '< 4.0 hrs Heavy Freight Turnaround',
    contactMasked: '98451XXXX4',
  },
  {
    rank: 3,
    name: 'Hooghly Transit Carriers',
    badge: 'Gold Transport Tier • Sand & Aggregate Tipper Fleet',
    onTimeRate: 98.6,
    rating: 4.87,
    fleetSize: '35 Hydraulic 10-Wheeler Tippers',
    gpsTracking: 'Digital Electronic Weighbridge Sync',
    hubBase: 'Howrah Riverfront Terminal & Rajarhat Bypass',
    avgDeliveryTime: '< 4.5 hrs Dump Delivery',
    contactMasked: '98311XXXX9',
  },
];

export default function DeliveryPage() {
  const { user, activeRole, setActiveRole, addToast } = useAppStore();

  // Perspective Mode: BUILDER, SUPPLIER, AGENT
  const [perspective, setPerspective] = useState<'BUILDER' | 'SUPPLIER' | 'AGENT'>(
    activeRole === 'SUPPLIER' ? 'SUPPLIER' : activeRole === 'DELIVERY_AGENT' ? 'AGENT' : 'BUILDER'
  );

  // Sync perspective when activeRole changes externally
  useEffect(() => {
    if (activeRole === 'SUPPLIER') setPerspective('SUPPLIER');
    else if (activeRole === 'DELIVERY_AGENT') setPerspective('AGENT');
    else if (activeRole === 'CONTRACTOR') setPerspective('BUILDER');
  }, [activeRole]);

  // Consignments list state
  const [consignments, setConsignments] = useState<DeliveryConsignment[]>(SEEDED_CONSIGNMENTS);
  const [selectedConsignmentId, setSelectedConsignmentId] = useState<string>(SEEDED_CONSIGNMENTS[0].id);
  const [isCopiedOtp, setIsCopiedOtp] = useState(false);

  // Active consignment object
  const activeConsignment = consignments.find((c) => c.id === selectedConsignmentId) || consignments[0];

  // Delivery Checklist State (Agent view)
  const [itemMatchesCheck, setItemMatchesCheck] = useState(true);
  const [qtyCheck, setQtyCheck] = useState(true);
  const [enteredOtp, setEnteredOtp] = useState('');

  // Raise Dispute Case Modal State
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [caseType, setCaseType] = useState('DAMAGED');
  const [caseDesc, setCaseDesc] = useState('');

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'TRACKING' | 'CARRIERS' | 'MANIFEST'>('TRACKING');

  // Handle Driver OTP Verification and Delivery Completion
  const handleCompleteDelivery = () => {
    if (!itemMatchesCheck || !qtyCheck) {
      addToast({
        title: 'Checklist Incomplete',
        message: 'Both manifest count and material condition checks must be completed.',
        type: 'error',
      });
      return;
    }

    if (enteredOtp !== activeConsignment.otpCode) {
      addToast({
        title: 'Invalid OTP Code',
        message: `Incorrect code. Enter the 4-digit code provided by the builder (${activeConsignment.otpCode}).`,
        type: 'error',
      });
      return;
    }

    // Mark as delivered
    setConsignments((prev) =>
      prev.map((c) =>
        c.id === activeConsignment.id
          ? {
              ...c,
              status: 'DELIVERED',
              etaMinutes: 0,
              speedKmH: 0,
              distanceKm: 0,
              trafficStatus: 'Delivered & Verified at Site Bay',
            }
          : c
      )
    );

    triggerConfetti();
    addToast({
      title: 'Consignment Delivered Successfully!',
      message: `OTP ${enteredOtp} confirmed for ${activeConsignment.materialName}. Electronic proof of delivery recorded.`,
      type: 'success',
    });
    setEnteredOtp('');
  };

  // Status Stepper helper
  const getStepProgress = (status: DeliveryConsignment['status']) => {
    switch (status) {
      case 'ASSIGNED':
        return 1;
      case 'PICKED_UP':
        return 2;
      case 'IN_TRANSIT':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 1;
    }
  };

  const copyOtpToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(activeConsignment.otpCode);
      setIsCopiedOtp(true);
      setTimeout(() => setIsCopiedOtp(false), 2000);
      addToast({
        title: 'OTP Copied to Clipboard',
        message: `Share code ${activeConsignment.otpCode} with the driver upon physical inspection.`,
        type: 'info',
      });
    }
  };

  return (
    <div className="relative min-h-screen space-y-8 pb-16">
      {/* AMBIENT FROSTED GLASS BACKGROUND GLOWS */}
      <div className="pointer-events-none absolute -top-12 -left-12 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="pointer-events-none absolute top-48 -right-12 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-12 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -z-10" />

      {/* =========================================================================
          1. HEADER & DUAL VANTAGE POINT SWITCHER (BUILDER / SUPPLIER / DRIVER)
      ========================================================================= */}
      <div className="backdrop-blur-2xl bg-white/70 dark:bg-slate-900/75 rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="orange" className="bg-orange-500/10 text-brand-orange border-orange-500/20 font-black">
                <Truck className="w-3.5 h-3.5 mr-1 animate-pulse" /> West Bengal Logistics Corridor
              </Badge>
              <Badge variant="verified" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-black">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> GPS Telematics &amp; OTP Guarded
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Central Fleet Delivery &amp; Live Tracking
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Connecting <strong>Dankuni Central Yard (NH-19)</strong>, <strong>Kona Expressway Depot</strong>, and <strong>New Town Action Area / Salt Lake</strong> construction sites with tamper-proof delivery verification.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => setIsCaseModalOpen(true)}
              variant="outline"
              size="sm"
              className="border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold"
              leftIcon={<AlertTriangle className="w-4 h-4" />}
            >
              Report Transit Issue
            </Button>
          </div>
        </div>

        {/* PERSPECTIVE SELECTOR: Builder, Supplier, Driver */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Active Vantage Point:
            </span>
            <div className="inline-flex p-1 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-md">
              <button
                onClick={() => setPerspective('BUILDER')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  perspective === 'BUILDER'
                    ? 'bg-brand-orange text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Builder Inbound
              </button>

              <button
                onClick={() => setPerspective('SUPPLIER')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  perspective === 'SUPPLIER'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" /> Supplier Outbound
              </button>

              <button
                onClick={() => setPerspective('AGENT')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  perspective === 'AGENT'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Truck className="w-3.5 h-3.5" /> Driver / Logistics Agent
              </button>
            </div>
          </div>

          {/* Sub-Tabs: Live Tracking, Carriers, Manifest */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('TRACKING')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'TRACKING'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Live Telemetry
            </button>
            <button
              onClick={() => setActiveTab('CARRIERS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'CARRIERS'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" /> Carrier Rankings
            </button>
            <button
              onClick={() => setActiveTab('MANIFEST')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'MANIFEST'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Consignment Slips
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. CONSIGNMENT SELECTOR PILLS (Switch between active shipments)
      ========================================================================= */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500 shrink-0">
          Shipments:
        </span>
        {consignments.map((c) => {
          const isSelected = c.id === activeConsignment.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedConsignmentId(c.id)}
              className={`shrink-0 px-4 py-2.5 rounded-2xl backdrop-blur-md text-left transition-all border flex items-center gap-3 ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 dark:from-orange-500/20 dark:to-slate-800 border-brand-orange text-slate-900 dark:text-white shadow-md scale-[1.01]'
                  : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <img
                src={c.materialImage}
                alt={c.materialName}
                className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {c.materialName}
                  </span>
                  <Badge
                    variant={c.status === 'DELIVERED' ? 'verified' : c.status === 'IN_TRANSIT' ? 'orange' : 'default'}
                    size="sm"
                    className="text-[10px]"
                  >
                    {c.status}
                  </Badge>
                </div>
                <p className="text-[10px] text-slate-500">
                  {c.quantity} {c.unit} • {c.orderId}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          3. MAIN INTERACTIVE GLASS BODY (TELEMETRY / CARRIERS / MANIFEST)
      ========================================================================= */}
      {activeTab === 'CARRIERS' ? (
        /* ---------------------------------------------------------------------
           VIEW A: TOP RANKED LOGISTICS FLEETS IN WEST BENGAL
        --------------------------------------------------------------------- */
        <div className="space-y-6 animate-fadeIn">
          <div className="backdrop-blur-2xl bg-white/70 dark:bg-slate-900/75 rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                West Bengal Verified Fleet &amp; Carrier Rankings
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Independent heavy freight carriers evaluated by on-time fulfillment, GPS telematics reliability, axle scale accuracy, and safe unloading standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LOGISTICS_FLEET_RANKINGS.map((carrier) => (
              <div
                key={carrier.rank}
                className="backdrop-blur-xl bg-white/75 dark:bg-slate-900/80 rounded-3xl p-6 border border-white/60 dark:border-slate-800 shadow-xl space-y-5 relative overflow-hidden group hover:border-brand-orange/60 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-orange to-amber-500 text-white font-black flex items-center justify-center text-lg shadow-md">
                    #{carrier.rank}
                  </div>
                  <Badge variant="verified" className="text-[10px]">
                    {carrier.badge}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {carrier.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Base: {carrier.hubBase}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">On-Time Performance:</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">
                      {carrier.onTimeRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Fleet Strength:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {carrier.fleetSize}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Average Turnaround:</span>
                    <span className="font-bold text-brand-orange">
                      {carrier.avgDeliveryTime}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {carrier.gpsTracking}
                </div>

                <Link href="/chat">
                  <Button variant="outline" size="sm" className="w-full text-xs font-bold" leftIcon={<MessageSquare className="w-3.5 h-3.5" />}>
                    Inquire Carrier Booking
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'MANIFEST' ? (
        /* ---------------------------------------------------------------------
           VIEW B: CONSIGNMENT MANIFEST & BILL OF LADING
        --------------------------------------------------------------------- */
        <div className="backdrop-blur-2xl bg-white/70 dark:bg-slate-900/75 rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Official Consignment Manifest &amp; E-Way Bill
              </h2>
              <p className="text-xs text-slate-500">
                Consignment Reference: <strong>{activeConsignment.orderId}</strong> • Staged via BuildNexus Digital Vault
              </p>
            </div>
            <Badge variant="orange">Verified Digital Consignment</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-white/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600">
                Consignor / Dispatch Yard (Supplier)
              </span>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {activeConsignment.supplierName}
              </h4>
              <p className="text-slate-600 dark:text-slate-400">{activeConsignment.supplierHub}</p>
              <p className="text-slate-500">Dispatch Departure: {activeConsignment.departureTime}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-orange">
                Consignee / Site Unloading Bay (Builder)
              </span>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {activeConsignment.builderCompany} ({activeConsignment.builderName})
              </h4>
              <p className="text-slate-600 dark:text-slate-400">{activeConsignment.deliverySite}</p>
              <p className="text-slate-500">Scheduled Arrival: {activeConsignment.estimatedArrival}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Manifest Line Items
            </h3>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={activeConsignment.materialImage}
                  alt={activeConsignment.materialName}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white">
                    {activeConsignment.materialName}
                  </h4>
                  <p className="text-[11px] text-slate-500">{activeConsignment.materialCategory}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-black text-sm text-slate-900 dark:text-white">
                  {activeConsignment.quantity.toLocaleString()} {activeConsignment.unit}
                </span>
                <p className="text-[11px] font-bold text-brand-orange">
                  Value: {formatINR(activeConsignment.totalAmount)}
                </p>
              </div>
            </div>

            {/* Toll Allocation & Highway Clearance Accord */}
            <div className="p-4 rounded-xl bg-orange-50/70 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/80 space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-brand-orange flex items-center gap-1.5">
                  <Truck className="w-4 h-4" /> Highway Toll Transit Allocation
                </span>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-orange-200 dark:bg-orange-900 text-orange-900 dark:text-orange-200">
                  Paid by Builder / Contractor
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Tollway Charge:</span>
                  <span className="font-extrabold text-sm text-brand-orange">{formatINR(activeConsignment.tollAmount)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">En-Route Plaza:</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate block">{activeConsignment.tollPlazaName}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Fastag Transit Docket:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate block">{activeConsignment.tollFastagRef}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5">
                🛡️ <strong>BuildNexus Freight Clause:</strong> When the supplier dispatches materials to the job site, all expressway and bridge tolls are 100% borne and settled by the <strong>{activeConsignment.builderCompany} (Builder/Contractor)</strong>. Supplier catalog payouts are protected with zero toll deduction.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ---------------------------------------------------------------------
           VIEW C: REAL-TIME TELEMETRY, GPS ROUTE & OTP SIGN-OFF
        --------------------------------------------------------------------- */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* LEFT 2 COLS: Route Stepper, Glass Telemetry HUD & Live Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. STAGE PROGRESSION STEPPER */}
            <div className="backdrop-blur-2xl bg-white/70 dark:bg-slate-900/75 rounded-3xl p-6 sm:p-7 border border-white/60 dark:border-white/10 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-orange">
                    Shipment Transit Lifecycle
                  </span>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    {activeConsignment.materialName}
                  </h2>
                </div>
                <Badge
                  variant={activeConsignment.status === 'DELIVERED' ? 'verified' : 'orange'}
                  size="md"
                  className="font-black"
                >
                  Status: {activeConsignment.status}
                </Badge>
              </div>

              {/* Progress Milestones */}
              <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                {[
                  { step: 1, label: 'Order Dispatched', sub: 'Dankuni Yard' },
                  { step: 2, label: 'Weighbridge Audit', sub: 'Quality Inspected' },
                  { step: 3, label: 'In-Transit GPS', sub: 'Belghoria Expressway' },
                  { step: 4, label: 'Site Unloaded', sub: 'OTP Confirmed' },
                ].map((s) => {
                  const currentProg = getStepProgress(activeConsignment.status);
                  const isDone = currentProg >= s.step;
                  const isCurrent = currentProg === s.step;

                  return (
                    <div key={s.step} className="space-y-2">
                      <div className="flex items-center">
                        <div
                          className={`w-full h-1.5 rounded-full transition-all ${
                            isDone ? 'bg-brand-orange' : 'bg-slate-200 dark:bg-slate-800'
                          }`}
                        />
                      </div>
                      <div>
                        <div
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black mb-1 transition-all ${
                            isDone
                              ? 'bg-brand-orange text-white shadow-[0_0_12px_rgba(249,115,22,0.5)]'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          } ${isCurrent ? 'ring-4 ring-orange-500/20 animate-pulse' : ''}`}
                        >
                          {isDone ? <Check className="w-4 h-4" /> : s.step}
                        </div>
                        <h4 className="font-extrabold text-[11px] text-slate-900 dark:text-white line-clamp-1">
                          {s.label}
                        </h4>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{s.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. LIVE INTERACTIVE GPS MAP HUD & RADAR CONTAINER */}
            <div className="backdrop-blur-2xl bg-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800/90 shadow-2xl space-y-5 relative overflow-hidden">
              {/* Top Telemetry Gauges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 relative">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                      Live Telematics HUD
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-brand-orange animate-bounce" /> Route Corridor: Dankuni ➔ New Town
                  </h3>
                  <p className="text-xs text-slate-400">
                    Destination: {activeConsignment.deliverySite}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold">Speed</span>
                    <span className="text-sm font-black text-amber-400 flex items-center justify-center gap-1">
                      <Gauge className="w-3.5 h-3.5" /> {activeConsignment.speedKmH} km/h
                    </span>
                  </div>

                  <div className="px-3.5 py-2 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-center">
                    <span className="text-[10px] text-orange-400 block font-semibold">Live ETA</span>
                    <span className="text-sm font-black text-brand-orange">
                      {activeConsignment.etaMinutes > 0 ? `~${activeConsignment.etaMinutes} Mins` : 'Arrived'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Simulated Visual Route Vector Canvas */}
              <div className="relative h-72 sm:h-80 w-full rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-center overflow-hidden">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

                {/* Animated Curved Road SVG */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="roadGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="50%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  {/* Outer Road bed */}
                  <path
                    d="M 40,240 Q 220,120 440,160 T 800,90"
                    stroke="#1e293b"
                    strokeWidth="24"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* High Glow Arterial Line */}
                  <path
                    d="M 40,240 Q 220,120 440,160 T 800,90"
                    stroke="url(#roadGlow)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray="10 8"
                    className="animate-[dash_20s_linear_infinite]"
                  />
                  {/* Origin Point: Dankuni Yard */}
                  <circle cx="50" cy="235" r="9" fill="#8b5cf6" />
                  {/* Destination Point: New Town Site */}
                  <circle cx="750" cy="98" r="11" fill="#10b981" className="animate-pulse" />
                </svg>

                {/* Origin Label */}
                <div className="absolute bottom-6 left-6 z-10 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-purple-500/40 text-[11px] font-bold text-purple-300">
                  📍 Dankuni Staging Yard (NH-19)
                </div>

                {/* Destination Label */}
                <div className="absolute top-6 right-6 z-10 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/40 text-[11px] font-bold text-emerald-300">
                  🎯 New Town Action Area II (Site #4)
                </div>

                {/* Live Moving Vehicle Marker */}
                <div className="relative z-20 flex flex-col items-center">
                  <div className="p-3.5 bg-gradient-to-tr from-brand-orange to-amber-500 text-white rounded-full shadow-[0_0_25px_rgba(249,115,22,0.7)] animate-bounce">
                    <Truck className="w-8 h-8" />
                  </div>
                  <div className="mt-2 bg-slate-950/95 px-3 py-1 rounded-full border border-orange-500/60 shadow-lg text-center">
                    <span className="text-xs font-black text-brand-orange block">
                      {activeConsignment.vehicleNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {activeConsignment.vehicleType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Traffic & Corridor Status Card */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                  <span className="text-slate-300">
                    Corridor Status: <strong className="text-white">{activeConsignment.trafficStatus}</strong>
                  </span>
                </div>
                <span className="text-slate-400 text-[11px]">
                  Distance Remaining: <strong className="text-amber-400">{activeConsignment.distanceKm} km</strong>
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COL: Driver Info, Security OTP Vault, & Execution Forms */}
          <div className="space-y-6">
            {/* 1. ASSIGNED DRIVER & VEHICLE DETAILS */}
            <div className="backdrop-blur-2xl bg-white/70 dark:bg-slate-900/75 rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Logistics Carrier &amp; Driver
                </span>
                <Badge variant="verified" size="sm" className="text-[10px]">
                  Verified Operator
                </Badge>
              </div>

              <div className="flex items-center gap-3.5">
                <Avatar
                  name={activeConsignment.driverName}
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
                  isVerified
                  size="lg"
                />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {activeConsignment.driverName}
                  </h3>
                  <p className="text-xs text-brand-orange font-bold">
                    {activeConsignment.carrierCompany}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Vehicle: {activeConsignment.vehicleNumber}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <a href={`tel:${activeConsignment.driverPhone}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs font-bold" leftIcon={<Phone className="w-3.5 h-3.5 text-emerald-500" />}>
                    Call Driver
                  </Button>
                </a>
                <Link href="/chat" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs font-bold" leftIcon={<MessageSquare className="w-3.5 h-3.5 text-blue-500" />}>
                    In-App Chat
                  </Button>
                </Link>
              </div>
            </div>

            {/* 2. SECURITY OTP CODE CARD (Crucial for Builder and Driver) */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5 dark:from-slate-900/90 dark:to-orange-950/30 rounded-3xl p-6 border-2 border-brand-orange/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-500 animate-pulse" />
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Contractor Delivery OTP Code
                  </h3>
                </div>
                <Badge variant="orange" size="sm">Site Unloading Guard</Badge>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Provide this 4-digit verification code to the driver ONLY after inspecting material count and quality bags.
              </p>

              {/* Glowing OTP Box */}
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-950/90 border border-amber-500/50 flex items-center justify-between shadow-inner">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Security Verification Passcode
                  </span>
                  <span className="text-3xl font-black text-brand-orange tracking-widest font-mono">
                    {activeConsignment.otpCode}
                  </span>
                </div>

                <Button
                  onClick={copyOtpToClipboard}
                  variant="outline"
                  size="sm"
                  className="border-amber-300 dark:border-amber-700/60 text-xs"
                >
                  {isCopiedOtp ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1" /> Copy OTP
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* 3. PERSPECTIVE SPECIFIC ACTION DESK */}
            {perspective === 'AGENT' ? (
              /* Driver Proof of Delivery Form */
              <div className="backdrop-blur-2xl bg-white/70 dark:bg-slate-900/75 rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <FileCheck className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Driver Sign-Off &amp; OTP Verification
                  </h3>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={itemMatchesCheck}
                      onChange={(e) => setItemMatchesCheck(e.target.checked)}
                      className="rounded text-brand-orange w-4 h-4"
                    />
                    Item count matches order manifest ({activeConsignment.quantity} {activeConsignment.unit})
                  </label>
                  <label className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={qtyCheck}
                      onChange={(e) => setQtyCheck(e.target.checked)}
                      className="rounded text-brand-orange w-4 h-4"
                    />
                    Physical bag condition &amp; grade verified by site supervisor
                  </label>
                </div>

                <Input
                  label="Enter Contractor 4-Digit OTP"
                  placeholder="e.g. 4921"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  maxLength={4}
                  className="text-center font-bold tracking-widest text-lg"
                />

                <Button
                  variant="primary"
                  className="w-full text-xs font-bold"
                  onClick={handleCompleteDelivery}
                  disabled={activeConsignment.status === 'DELIVERED'}
                >
                  <PackageCheck className="w-4 h-4 mr-1.5" />
                  {activeConsignment.status === 'DELIVERED'
                    ? '✓ Consignment Delivered'
                    : 'Confirm Site Delivery Sign-Off'}
                </Button>
              </div>
            ) : perspective === 'SUPPLIER' ? (
              /* Supplier Dispatch Controls */
              <div className="backdrop-blur-2xl bg-white/70 dark:bg-slate-900/75 rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <Store className="w-4 h-4 text-purple-600" />
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Supplier Staging &amp; Fleet Dispatch
                  </h3>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/60 text-xs space-y-2">
                  <p className="text-slate-600 dark:text-slate-300">
                    Dispatched from: <strong>{activeConsignment.supplierHub}</strong>
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    Carrier Allocation: <strong>{activeConsignment.carrierCompany}</strong>
                  </p>
                  <div className="pt-1.5 border-t border-purple-200/50 dark:border-purple-800/50 text-[11px] text-purple-700 dark:text-purple-300">
                    🛡️ <strong>Toll Protection:</strong> Highway toll ({formatINR(activeConsignment.tollAmount)}) is 100% paid by the Buyer/Contractor. Zero deduction from your supplier account.
                  </div>
                </div>

                <Link href="/sell">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Return to Supplier Portal
                  </Button>
                </Link>
              </div>
            ) : (
              /* Builder Acceptance Desk */
              <div className="backdrop-blur-2xl bg-white/70 dark:bg-slate-900/75 rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <Building2 className="w-4 h-4 text-brand-orange" />
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Builder Site Reception Desk
                  </h3>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-2">
                  <p className="text-slate-600 dark:text-slate-400">
                    Site Delivery Bay: <strong>{activeConsignment.deliverySite}</strong>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Material Value: <strong>{formatINR(activeConsignment.totalAmount)}</strong>
                  </p>
                  <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 text-[11px] text-brand-orange font-bold flex items-center justify-between">
                    <span>Highway Toll (Paid by Contractor):</span>
                    <span>{formatINR(activeConsignment.tollAmount)}</span>
                  </div>
                </div>

                <Link href="/stock">
                  <Button variant="outline" size="sm" className="w-full text-xs" leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                    Check Site Material Stock Horizon
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          4. RAISE DISPUTE CASE MODAL
      ========================================================================= */}
      <Modal
        isOpen={isCaseModalOpen}
        onClose={() => setIsCaseModalOpen(false)}
        title="Report Material Transit Issue"
        description="Submit reports for torn cement bags, bent steel rebar, or quantity discrepancy during transit. Directly reviewed by BuildNexus West Bengal resolution desk."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsCaseModalOpen(false);
            setCaseDesc('');
            addToast({
              title: 'Transit Issue Submitted',
              message: 'Case report filed. BuildNexus Logistics Manager will contact you within 15 mins.',
              type: 'warning',
            });
          }}
          className="space-y-4 pt-2"
        >
          <Select
            label="Dispute Category"
            value={caseType}
            onChange={(e) => setCaseType(e.target.value)}
            options={[
              { value: 'DAMAGED', label: 'Damaged Material Bags / Moisture Exposure' },
              { value: 'SHORT_QUANTITY', label: 'Missing / Short Bag Count on Flatbed' },
              { value: 'WRONG_ITEM', label: 'Incorrect Material Grade / Brand Shipped' },
              { value: 'TRANSIT_DELAY', label: 'Severe Transit Vehicle Delay' },
            ]}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Detailed Issue Description
            </label>
            <textarea
              placeholder="Provide exact damaged bag count, physical condition, or truck location details..."
              value={caseDesc}
              onChange={(e) => setCaseDesc(e.target.value)}
              className="w-full min-h-[100px] p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange"
              required
            />
          </div>

          <Button type="submit" variant="danger" className="w-full text-xs font-bold">
            Submit Issue to BuildNexus Resolution Desk
          </Button>
        </form>
      </Modal>
    </div>
  );
}
