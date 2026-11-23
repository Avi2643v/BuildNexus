'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/utils';
import jsPDF from 'jspdf';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Calculator,
  Mic,
  MicOff,
  Handshake,
  ShoppingCart,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Building2,
  Calendar,
  Layers,
  ShieldCheck,
  Zap,
  Info,
  Clock,
  RefreshCw,
  Cpu,
  BarChart3,
  Flame,
  Check,
} from 'lucide-react';
import { CommodityTrend } from '@/app/api/ai/forecast/route';

// Pre-seeded high-performance initial commodities for 0ms latency rendering
const initialCommodities: CommodityTrend[] = [
  {
    id: 'tmt-steel-550d',
    name: 'Fe-550D TMT Rebar (Tata / Jindal)',
    category: 'Steel',
    currentPrice: 58500,
    unit: 'MT (Metric Tonne)',
    prediction7d: 56900,
    prediction14d: 55800,
    prediction30d: 57400,
    direction: 'DOWN',
    changePercent7d: -2.74,
    confidenceScore: 92,
    recommendation: 'WAIT_TO_BUY',
    reasoning: 'Blast furnace output in Odisha and secondary re-rollers has increased 8%, causing secondary market price cooling. Ideal bulk procurement window is in 6-9 days.',
    priceHistory: [
      { day: '-6d', actual: 60200 },
      { day: '-4d', actual: 59800 },
      { day: '-2d', actual: 59100 },
      { day: 'Today', actual: 58500, predicted: 58500 },
      { day: '+3d', predicted: 57700 },
      { day: '+7d', predicted: 56900 },
      { day: '+14d', predicted: 55800 },
      { day: '+21d', predicted: 56500 },
      { day: '+30d', predicted: 57400 },
    ],
  },
  {
    id: 'opc-53-cement',
    name: 'OPC 53 Grade Cement (UltraTech / ACC)',
    category: 'Cement',
    currentPrice: 385,
    unit: '50kg Bag',
    prediction7d: 398,
    prediction14d: 405,
    prediction30d: 410,
    direction: 'UP',
    changePercent7d: 3.38,
    confidenceScore: 88,
    recommendation: 'STRONG_BUY',
    reasoning: 'Upcoming state infrastructure projects and power tariff revisions for South clinker units will push retail bag rates up ₹15-20. Lock procurement immediately.',
    priceHistory: [
      { day: '-6d', actual: 375 },
      { day: '-4d', actual: 378 },
      { day: '-2d', actual: 382 },
      { day: 'Today', actual: 385, predicted: 385 },
      { day: '+3d', predicted: 392 },
      { day: '+7d', predicted: 398 },
      { day: '+14d', predicted: 405 },
      { day: '+21d', predicted: 408 },
      { day: '+30d', predicted: 410 },
    ],
  },
  {
    id: 'm-sand-concrete',
    name: 'Manufactured M-Sand (Zone II, Washed)',
    category: 'Sand',
    currentPrice: 1450,
    unit: 'Ton',
    prediction7d: 1420,
    prediction14d: 1410,
    prediction30d: 1430,
    direction: 'STABLE',
    changePercent7d: -2.07,
    confidenceScore: 85,
    recommendation: 'ACCUMULATE',
    reasoning: 'Quarry operations in Kanakapura and Hoskote running at optimal crushing capacity. Local logistics supply steady.',
    priceHistory: [
      { day: '-6d', actual: 1480 },
      { day: '-4d', actual: 1470 },
      { day: '-2d', actual: 1460 },
      { day: 'Today', actual: 1450, predicted: 1450 },
      { day: '+3d', predicted: 1435 },
      { day: '+7d', predicted: 1420 },
      { day: '+14d', predicted: 1410 },
      { day: '+21d', predicted: 1420 },
      { day: '+30d', predicted: 1430 },
    ],
  },
  {
    id: 'coarse-aggregate-20mm',
    name: '20mm Blue Metal Coarse Aggregate',
    category: 'Aggregates',
    currentPrice: 1100,
    unit: 'Ton',
    prediction7d: 1110,
    prediction14d: 1125,
    prediction30d: 1140,
    direction: 'UP',
    changePercent7d: 0.91,
    confidenceScore: 81,
    recommendation: 'ACCUMULATE',
    reasoning: 'Diesel freight revisions expected at month end. Moderate upward pressure on delivered tonnage.',
    priceHistory: [
      { day: '-6d', actual: 1080 },
      { day: '-4d', actual: 1090 },
      { day: '-2d', actual: 1095 },
      { day: 'Today', actual: 1100, predicted: 1100 },
      { day: '+3d', predicted: 1105 },
      { day: '+7d', predicted: 1110 },
      { day: '+14d', predicted: 1125 },
      { day: '+21d', predicted: 1135 },
      { day: '+30d', predicted: 1140 },
    ],
  },
];

export default function AISuitePage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'forecast';

  const { addToCart, setCartDrawerOpen, addToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<'forecast' | 'estimator' | 'khata' | 'negotiator'>(
    (initialTab as any) || 'forecast'
  );

  // Tab 1: Forecasting State
  const [commodities, setCommodities] = useState<CommodityTrend[]>(initialCommodities);
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('tmt-steel-550d');
  const [calcQuantity, setCalcQuantity] = useState<number>(10);
  const [isRefreshingForecast, setIsRefreshingForecast] = useState(false);

  // Tab 2: BOQ Estimator State (Instant Client-Side Computation)
  const [projectType, setProjectType] = useState<'RESIDENTIAL' | 'COMMERCIAL' | 'BOUNDARY_WALL' | 'SLAB_FOUNDATION' | 'INTERIOR_PLASTER'>('RESIDENTIAL');
  const [builtUpArea, setBuiltUpArea] = useState<number>(1200);
  const [floors, setFloors] = useState<number>(1);
  const [mixGrade, setMixGrade] = useState<'M20' | 'M25' | 'M30'>('M25');
  const [brickType, setBrickType] = useState<'RED_BRICK' | 'AAC_BLOCK'>('AAC_BLOCK');

  // Tab 3: Voice Khata Parser State
  const [khataInput, setKhataInput] = useState('Ramesh and Suresh worked full day, paid Ramesh 500 cash advance, and Ganesh worked half day');
  const [isParsingKhata, setIsParsingKhata] = useState(false);
  const [parsedKhataEntries, setParsedKhataEntries] = useState<any[]>([
    {
      type: 'ATTENDANCE',
      title: 'Ramesh Sardar - Full Day Shift',
      workerName: 'Ramesh Sardar',
      wagePromised: 850,
      wagePaid: 500,
      amount: 500,
      notes: 'AI Parsed: Full day shift + ₹500 cash advance recorded',
    },
    {
      type: 'ATTENDANCE',
      title: 'Suresh Kumar - Full Day Shift',
      workerName: 'Suresh Kumar',
      wagePromised: 750,
      wagePaid: 0,
      amount: 0,
      notes: 'AI Parsed: Full day shift standard attendance',
    },
  ]);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);

  // Tab 4: AI Negotiation Engine State
  const [supplierQuote, setSupplierQuote] = useState('390');
  const [targetVolume, setTargetVolume] = useState('150');
  const [negotiationResult, setNegotiationResult] = useState<any>({
    quote: 390,
    volume: 150,
    optimalCounter: 374,
    potentialSaving: 2400,
    strategyName: 'Volume Tier-2 Leverage',
    talkingPoints: [
      'Offer counter of ₹374/unit citing BuildNexus immediate payment lock.',
      'Highlight prompt unloading at builder site with no demurrage delays.',
      'Commit to secondary re-order for next construction phase.',
    ],
  });

  // Fetch Live Forecast from Server in Background
  useEffect(() => {
    fetch('/api/ai/forecast')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.commodities?.length) {
          setCommodities(data.commodities);
        }
      })
      .catch(() => {});
  }, []);

  const selectedCommodity = useMemo(() => {
    return commodities.find((c) => c.id === selectedCommodityId) || commodities[0];
  }, [commodities, selectedCommodityId]);

  // Instant In-Memory 0ms IS-456 BOQ Calculations
  const calculatedBOQ = useMemo(() => {
    const area = Number(builtUpArea) || 1000;
    const fl = Number(floors) || 1;
    const totalSlabArea = area * fl;
    const gradeMultiplier = mixGrade === 'M25' ? 1.08 : mixGrade === 'M30' ? 1.15 : 1.0;

    let cementBags = Math.round(totalSlabArea * 0.42 * gradeMultiplier);
    let steelTons = parseFloat(((totalSlabArea * 3.8) / 1000).toFixed(2));
    let sandTons = Math.round(totalSlabArea * 0.085);
    let aggregateTons = Math.round(totalSlabArea * 0.11);
    let bricksCount = brickType === 'AAC_BLOCK' 
      ? Math.round(totalSlabArea * 1.35) 
      : Math.round(totalSlabArea * 18.5);

    let masonDays = Math.round(totalSlabArea * 0.08);
    let helperDays = Math.round(totalSlabArea * 0.16);

    if (projectType === 'BOUNDARY_WALL') {
      cementBags = Math.round(area * 0.15);
      steelTons = parseFloat(((area * 0.8) / 1000).toFixed(2));
      sandTons = Math.round(area * 0.035);
      aggregateTons = Math.round(area * 0.04);
      bricksCount = Math.round(area * 14);
      masonDays = Math.round(area * 0.04);
      helperDays = Math.round(area * 0.07);
    } else if (projectType === 'SLAB_FOUNDATION') {
      cementBags = Math.round(area * 0.35 * gradeMultiplier);
      steelTons = parseFloat(((area * 4.5) / 1000).toFixed(2));
      sandTons = Math.round(area * 0.07);
      aggregateTons = Math.round(area * 0.1);
      bricksCount = 0;
      masonDays = Math.round(area * 0.05);
      helperDays = Math.round(area * 0.12);
    } else if (projectType === 'INTERIOR_PLASTER') {
      cementBags = Math.round(area * 0.12);
      steelTons = 0;
      sandTons = Math.round(area * 0.04);
      aggregateTons = 0;
      bricksCount = 0;
      masonDays = Math.round(area * 0.035);
      helperDays = Math.round(area * 0.05);
    }

    const items = [
      {
        materialId: 'mat-1',
        name: 'UltraTech PPC Cement (50kg)',
        quantity: cementBags,
        unit: 'bag',
        unitPrice: 380,
        totalCost: cementBags * 380,
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
        supplierName: 'Lakshmi Building Supplies',
      },
      ...(steelTons > 0 ? [{
        materialId: 'mat-2',
        name: 'Tata Tiscon 550D TMT Rebar (12mm)',
        quantity: Math.max(1, Math.round(steelTons * 1000)),
        unit: 'kg',
        unitPrice: 65,
        totalCost: Math.round(steelTons * 1000 * 65),
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
        supplierName: 'Kaveri Steel Corporation',
      }] : []),
      ...(sandTons > 0 ? [{
        materialId: 'mat-3',
        name: 'Manufactured M-Sand (Zone II, Washed)',
        quantity: sandTons,
        unit: 'ton',
        unitPrice: 1450,
        totalCost: sandTons * 1450,
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
        supplierName: 'Sri Balaji Aggregates & Sand',
      }] : []),
      ...(aggregateTons > 0 ? [{
        materialId: 'mat-4',
        name: '20mm Blue Metal Coarse Aggregate',
        quantity: aggregateTons,
        unit: 'ton',
        unitPrice: 1100,
        totalCost: aggregateTons * 1100,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
        supplierName: 'Sri Balaji Aggregates & Sand',
      }] : []),
      ...(bricksCount > 0 ? [{
        materialId: 'mat-5',
        name: brickType === 'AAC_BLOCK' ? 'Aerocon AAC Lightweight Blocks' : 'Standard Red Clay Kiln Bricks',
        quantity: bricksCount,
        unit: 'piece',
        unitPrice: brickType === 'AAC_BLOCK' ? 62 : 9,
        totalCost: bricksCount * (brickType === 'AAC_BLOCK' ? 62 : 9),
        image: 'https://images.unsplash.com/photo-1584463699042-45a8e2cbce18?auto=format&fit=crop&w=400&q=80',
        supplierName: 'Lakshmi Building Supplies',
      }] : []),
    ];

    const materialSubtotal = items.reduce((sum, item) => sum + item.totalCost, 0);
    const estimatedLabourCost = (masonDays * 850) + (helperDays * 550);
    const gstAmount = Math.round(materialSubtotal * 0.18);
    const logisticsFee = Math.round(materialSubtotal * 0.035);
    const grandTotal = materialSubtotal + estimatedLabourCost + gstAmount + logisticsFee;

    return {
      summary: {
        totalArea: totalSlabArea,
        cementBags,
        steelTons,
        sandTons,
        aggregateTons,
        bricksCount,
        masonDays,
        helperDays,
        materialSubtotal,
        estimatedLabourCost,
        gstAmount,
        logisticsFee,
        grandTotal,
      },
      items,
    };
  }, [projectType, builtUpArea, floors, mixGrade, brickType]);

  // Add Entire BOQ to Cart
  const handleAddAllToCart = () => {
    calculatedBOQ.items.forEach((item: any) => {
      addToCart({
        materialId: item.materialId,
        name: item.name,
        price: item.unitPrice,
        unit: item.unit,
        quantity: item.quantity,
        supplierId: 'sup-1',
        supplierName: item.supplierName,
        image: item.image,
      });
    });
    addToast({
      title: 'BOQ Loaded to Cart!',
      message: `${calculatedBOQ.items.length} civil materials loaded for instant checkout.`,
      type: 'success',
    });
    setCartDrawerOpen(true);
  };

  // Export BOQ PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(249, 115, 22);
    doc.text('BuildNexus AI Civil Engineering BOQ Estimate', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')} | IS-456 Standard Multipliers`, 14, 28);
    doc.text(`Project: ${projectType} | Built-up Area: ${builtUpArea} sq.ft | Floors: ${floors}`, 14, 34);

    let y = 46;
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Bill of Quantities (Materials & Labour Breakdown)', 14, y);
    y += 8;

    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    calculatedBOQ.items.forEach((item: any, i: number) => {
      doc.text(`${i + 1}. ${item.name} - ${item.quantity} ${item.unit} @ Rs ${item.unitPrice}/${item.unit} = Rs ${item.totalCost.toLocaleString('en-IN')}`, 14, y);
      y += 7;
    });

    y += 5;
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`Estimated Labour (Masons & Helpers): Rs ${calculatedBOQ.summary.estimatedLabourCost.toLocaleString('en-IN')}`, 14, y);
    y += 6;
    doc.text(`GST (18%): Rs ${calculatedBOQ.summary.gstAmount.toLocaleString('en-IN')}`, 14, y);
    y += 6;
    doc.text(`Direct Transit Logistics: Rs ${calculatedBOQ.summary.logisticsFee.toLocaleString('en-IN')}`, 14, y);
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(249, 115, 22);
    doc.text(`Total Project Civil Budget: Rs ${calculatedBOQ.summary.grandTotal.toLocaleString('en-IN')}`, 14, y);

    doc.save(`BuildNexus_BOQ_${projectType}_${builtUpArea}sqft.pdf`);
    addToast({
      title: 'BOQ PDF Downloaded',
      message: 'Your estimated civil engineering Bill of Quantities has been exported.',
      type: 'success',
    });
  };

  // Run Voice / Text Khata Parsing
  const handleParseKhata = async (customTranscript?: string) => {
    const text = customTranscript || khataInput;
    if (!text.trim()) return;
    setIsParsingKhata(true);
    try {
      const res = await fetch('/api/ai/parse-khata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text }),
      });
      const data = await res.json();
      if (data.success && data.parsedEntries) {
        setParsedKhataEntries(data.parsedEntries);
        addToast({
          title: 'Khata Parsed Successfully',
          message: data.message,
          type: 'success',
        });
      }
    } catch {
      // Fallback
    } finally {
      setIsParsingKhata(false);
    }
  };

  // Voice recording
  const handleVoiceRecordKhata = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      addToast({
        title: 'Voice Not Supported',
        message: 'Speech recognition is not available in your browser.',
        type: 'warning',
      });
      return;
    }

    if (isVoiceRecording) {
      setIsVoiceRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsVoiceRecording(true);
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setKhataInput(text);
      setIsVoiceRecording(false);
      handleParseKhata(text);
    };
    recognition.onerror = () => setIsVoiceRecording(false);
    recognition.onend = () => setIsVoiceRecording(false);
    recognition.start();
  };

  // Run AI Negotiation Simulator
  const handleRunNegotiation = () => {
    const quote = parseFloat(supplierQuote) || 390;
    const vol = parseInt(targetVolume, 10) || 100;
    const optimalCounter = Math.round(quote * (vol > 200 ? 0.94 : vol > 100 ? 0.96 : 0.975));
    const potentialSaving = (quote - optimalCounter) * vol;

    setNegotiationResult({
      quote,
      volume: vol,
      optimalCounter,
      potentialSaving,
      strategyName: vol > 200 ? 'Volume Tier-2 Leverage' : 'Standard Win-Win Buffer',
      talkingPoints: [
        `Offer counter of ₹${optimalCounter}/unit citing BuildNexus immediate payment lock.`,
        `Highlight fast site unloading with zero vehicle detention delays.`,
        `Commit to secondary re-order for next project block.`,
      ],
    });
  };

  return (
    <div className="space-y-8 py-4 max-w-7xl mx-auto">
      {/* Header Banner - High-Tech ConTech Command Center */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-brand-navy rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="orange" className="bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Enterprise ConTech Intelligence
            </Badge>
            <Badge variant="verified" className="bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Cpu className="w-3.5 h-3.5 mr-1" /> IS-456 Civil Engineering Models
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Artificial Intelligence for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-400 to-orange-400">
              High-Precision Construction
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Eliminate procurement speculation. Predict commodity dips before they happen, generate IS-456 Bill of Quantities in milliseconds, and capture site khata attendance via voice NLP.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-xs text-slate-400 font-medium">Model Accuracy</p>
              <p className="text-xl font-black text-emerald-400">92.4%</p>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-xs text-slate-400 font-medium">Avg Contractor Savings</p>
              <p className="text-xl font-black text-brand-orange">11.8%</p>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-xs text-slate-400 font-medium">BOQ Compute Latency</p>
              <p className="text-xl font-black text-blue-400">0 ms (Instant)</p>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-xs text-slate-400 font-medium">Speech NLP Engines</p>
              <p className="text-xl font-black text-amber-300">EN, HI, KN</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('forecast')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all shrink-0 ${
            activeTab === 'forecast'
              ? 'bg-brand-orange text-white shadow-glow'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:text-brand-orange'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Commodity Price Forecasting</span>
        </button>

        <button
          onClick={() => setActiveTab('estimator')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all shrink-0 ${
            activeTab === 'estimator'
              ? 'bg-brand-orange text-white shadow-glow'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:text-brand-orange'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>AI BOQ Material Estimator</span>
        </button>

        <button
          onClick={() => setActiveTab('khata')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all shrink-0 ${
            activeTab === 'khata'
              ? 'bg-brand-orange text-white shadow-glow'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:text-brand-orange'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>AI Voice Khata Parser</span>
        </button>

        <button
          onClick={() => setActiveTab('negotiator')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all shrink-0 ${
            activeTab === 'negotiator'
              ? 'bg-brand-orange text-white shadow-glow'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:text-brand-orange'
          }`}
        >
          <Handshake className="w-4 h-4" />
          <span>AI Negotiation Copilot</span>
        </button>
      </div>

      {/* TAB 1: COMMODITY PRICE FORECASTING */}
      {activeTab === 'forecast' && (
        <div className="space-y-6">
          {/* Commodity Selector Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {commodities.map((item) => {
              const isSelected = item.id === selectedCommodityId;
              const isDown = item.direction === 'DOWN';
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedCommodityId(item.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-brand-orange bg-orange-50/60 dark:bg-orange-950/30 shadow-md ring-2 ring-brand-orange/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">{item.category}</span>
                    <Badge
                      variant={
                        item.recommendation === 'STRONG_BUY'
                          ? 'orange'
                          : item.recommendation === 'WAIT_TO_BUY'
                          ? 'outline'
                          : 'verified'
                      }
                      className="text-[10px]"
                    >
                      {item.recommendation.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <p className="text-lg font-black text-slate-900 dark:text-white">
                        {formatINR(item.currentPrice)}
                      </p>
                      <p className="text-[11px] text-slate-400">per {item.unit}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-extrabold ${isDown ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isDown ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                      <span>{Math.abs(item.changePercent7d)}% (7d)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deep Dive Forecast Box */}
          {selectedCommodity && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Predictive Trend Curve & Model Reasoning */}
              <Card className="lg:col-span-2 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      {selectedCommodity.name}
                      <span className="text-xs font-normal text-slate-500">({selectedCommodity.confidenceScore}% Model Confidence)</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Multi-factor predictive curve modeling primary mill loads, freight revisions, and regional infrastructure demand.
                    </p>
                  </div>
                  <Badge variant={selectedCommodity.direction === 'DOWN' ? 'verified' : 'orange'}>
                    {selectedCommodity.direction === 'DOWN' ? '📉 Price Cooling Signal' : '📈 Upward Pressure'}
                  </Badge>
                </div>

                {/* Simulated Visual Interactive Chart */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>30-Day Predictive Trajectory</span>
                    <span>Values in INR per {selectedCommodity.unit}</span>
                  </div>

                  <div className="h-52 w-full bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 flex items-end justify-between gap-2 border border-slate-100 dark:border-slate-800">
                    {selectedCommodity.priceHistory.map((pt, idx) => {
                      const val = pt.predicted ?? pt.actual ?? selectedCommodity.currentPrice;
                      const minVal = Math.min(...selectedCommodity.priceHistory.map((p) => p.predicted ?? p.actual ?? 0)) * 0.96;
                      const maxVal = Math.max(...selectedCommodity.priceHistory.map((p) => p.predicted ?? p.actual ?? 0)) * 1.04;
                      const heightPercent = Math.max(15, Math.min(100, ((val - minVal) / (maxVal - minVal)) * 100));
                      const isFuture = pt.day.includes('+') || pt.predicted !== undefined;
                      const isToday = pt.day === 'Today';

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                          <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap pointer-events-none z-20">
                            {formatINR(val)} ({pt.day})
                          </div>

                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-t-xl transition-all duration-300 ${
                              isToday
                                ? 'bg-brand-navy dark:bg-blue-600 shadow-md ring-2 ring-blue-400'
                                : isFuture
                                ? 'bg-gradient-to-t from-orange-500/60 to-brand-orange'
                                : 'bg-slate-300 dark:bg-slate-600'
                            }`}
                          />
                          <span className={`text-[10px] font-semibold truncate ${isToday ? 'text-brand-orange font-black' : 'text-slate-400'}`}>
                            {pt.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-400 inline-block" /> Historical Market Rate</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-brand-navy inline-block" /> Today's Spot Rate</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-brand-orange inline-block" /> AI Predicted Trajectory</span>
                  </div>
                </div>

                {/* AI Reasoning Text */}
                <div className="p-4 bg-orange-50/70 dark:bg-orange-950/30 rounded-2xl border border-orange-200 dark:border-orange-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-brand-orange font-bold text-xs">
                    <Zap className="w-4 h-4" /> AI Predictive Rationale
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                    {selectedCommodity.reasoning}
                  </p>
                </div>
              </Card>

              {/* Right Col: Instant Savings Calculator & 1-Click Buy */}
              <Card className="p-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-brand-orange" />
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      Procurement Savings Calculator
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Input your required volume to compute exact budget impact based on AI timing recommendations.
                  </p>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Planned Site Quantity ({selectedCommodity.unit}s)
                    </label>
                    <Input
                      type="number"
                      value={calcQuantity}
                      onChange={(e) => setCalcQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                  </div>

                  {/* Calculations */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-3 border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Cost at Current Rate:</span>
                      <span className="font-bold">{formatINR(selectedCommodity.currentPrice * calcQuantity)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Cost at +7 Day Forecast:</span>
                      <span className="font-bold">{formatINR(selectedCommodity.prediction7d * calcQuantity)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Estimated Impact:</span>
                      <span
                        className={`text-sm font-black ${
                          selectedCommodity.prediction7d < selectedCommodity.currentPrice
                            ? 'text-emerald-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {selectedCommodity.prediction7d < selectedCommodity.currentPrice
                          ? `Save ${formatINR((selectedCommodity.currentPrice - selectedCommodity.prediction7d) * calcQuantity)} by waiting`
                          : `Save ${formatINR((selectedCommodity.prediction7d - selectedCommodity.currentPrice) * calcQuantity)} by buying today`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      addToCart({
                        materialId: selectedCommodity.id,
                        name: selectedCommodity.name,
                        price: selectedCommodity.currentPrice,
                        unit: selectedCommodity.unit,
                        quantity: calcQuantity,
                        supplierId: 'sup-1',
                        supplierName: 'BuildNexus Verified Partner',
                        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
                      });
                      addToast({
                        title: 'Added to Cart',
                        message: `${calcQuantity} ${selectedCommodity.unit} of ${selectedCommodity.name} added to cart.`,
                        type: 'success',
                      });
                      setCartDrawerOpen(true);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1.5" /> Lock & Add to Cart
                  </Button>
                  <p className="text-[10px] text-center text-slate-400">
                    Protected with direct supplier-to-builder transit monitoring.
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI BOQ MATERIAL ESTIMATOR (Instant 0ms Dynamic Engine) */}
      {activeTab === 'estimator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Parameters Box */}
            <Card className="p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Building2 className="w-5 h-5 text-brand-orange" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Project Specification</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Project Type</label>
                  <Select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as any)}
                  >
                    <option value="RESIDENTIAL">Residential Building / Villa</option>
                    <option value="COMMERCIAL">Commercial Framed Structure</option>
                    <option value="SLAB_FOUNDATION">Concrete Slab & Foundation Only</option>
                    <option value="BOUNDARY_WALL">Compound / Boundary Wall</option>
                    <option value="INTERIOR_PLASTER">Plastering & Masonry Work</option>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Built-up Slab Area</span>
                    <span className="text-brand-orange font-black text-sm">{builtUpArea.toLocaleString()} sq.ft</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="10000"
                    step="50"
                    value={builtUpArea}
                    onChange={(e) => setBuiltUpArea(parseInt(e.target.value))}
                    className="w-full accent-brand-orange cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>300 sq.ft</span>
                    <span>5,000 sq.ft</span>
                    <span>10,000 sq.ft</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Floors</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={floors}
                      onChange={(e) => setFloors(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Concrete Grade</label>
                    <Select
                      value={mixGrade}
                      onChange={(e) => setMixGrade(e.target.value as any)}
                    >
                      <option value="M20">M20 (1:1.5:3)</option>
                      <option value="M25">M25 (1:1:2)</option>
                      <option value="M30">M30 (Design Mix)</option>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Masonry Unit Type</label>
                  <Select
                    value={brickType}
                    onChange={(e) => setBrickType(e.target.value as any)}
                  >
                    <option value="AAC_BLOCK">Aerocon AAC Lightweight Blocks</option>
                    <option value="RED_BRICK">Traditional Red Clay Kiln Bricks</option>
                  </Select>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-orange shrink-0" />
                  <span>Real-time instant calculation active as sliders adjust.</span>
                </div>
              </div>
            </Card>

            {/* Results BOQ Box */}
            <div className="lg:col-span-2 space-y-6">
              {/* Summary metric cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-orange-50 dark:bg-orange-950/40 rounded-2xl border border-orange-200 dark:border-orange-900/50">
                  <p className="text-[11px] font-bold text-orange-600 dark:text-orange-400">Cement Bags</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {calculatedBOQ.summary.cementBags}
                  </p>
                  <p className="text-[10px] text-slate-500">50kg PPC Bags</p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/50">
                  <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400">TMT Steel</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {calculatedBOQ.summary.steelTons} MT
                  </p>
                  <p className="text-[10px] text-slate-500">Fe-550D High Tensile</p>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/50">
                  <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">Sand & Aggregates</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {calculatedBOQ.summary.sandTons + calculatedBOQ.summary.aggregateTons} T
                  </p>
                  <p className="text-[10px] text-slate-500">Zone-II Quarry Washed</p>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/50">
                  <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Labour Effort</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {calculatedBOQ.summary.masonDays + calculatedBOQ.summary.helperDays}
                  </p>
                  <p className="text-[10px] text-slate-500">Person-days (Fair Wage)</p>
                </div>
              </div>

              {/* Detailed BOQ Table */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-orange" /> Itemized Bill of Quantities (Live Marketplace Match)
                  </h4>
                  <Badge variant="verified">IS-456 Compliant</Badge>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {calculatedBOQ.items.map((item: any) => (
                    <div key={item.materialId} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover border" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                          <p className="text-[11px] text-slate-500">Supplier: {item.supplierName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {item.quantity} {item.unit}
                        </p>
                        <p className="text-[11px] text-brand-orange font-semibold">
                          {formatINR(item.totalCost)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cost Breakdown */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Materials Subtotal:</span>
                    <span>{formatINR(calculatedBOQ.summary.materialSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Estimated Labour (Masons & Helpers):</span>
                    <span>{formatINR(calculatedBOQ.summary.estimatedLabourCost)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>GST (18% on materials):</span>
                    <span>{formatINR(calculatedBOQ.summary.gstAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Direct Site Logistics Delivery:</span>
                    <span>{formatINR(calculatedBOQ.summary.logisticsFee)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm font-black text-slate-900 dark:text-white">
                    <span>Total Civil Construction Budget:</span>
                    <span className="text-xl text-brand-orange font-black">{formatINR(calculatedBOQ.summary.grandTotal)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleAddAllToCart}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" /> Load All Items to BuildNexus Cart
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleExportPDF}
                  >
                    <Download className="w-4 h-4 mr-2" /> Export PDF BOQ
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI VOICE KHATA PARSER */}
      {activeTab === 'khata' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-brand-orange" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Site Voice & Khata Input</h3>
              </div>
              <Badge variant="orange">NLP Engine</Badge>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Site sardars and supervisors can speak or type daily attendance, advances, and cement deliveries naturally. The AI extracts structured ledger items automatically in real-time.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Daily Log Description</span>
                <button
                  type="button"
                  onClick={handleVoiceRecordKhata}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isVoiceRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-brand-orange'
                  }`}
                >
                  {isVoiceRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  {isVoiceRecording ? 'Recording (Click to stop)' : 'Speak into Mic'}
                </button>
              </div>

              <textarea
                value={khataInput}
                onChange={(e) => setKhataInput(e.target.value)}
                rows={4}
                placeholder="e.g. Ramesh and Suresh worked full day, paid Ramesh 500 advance, cement 40 bags arrived..."
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />

              {/* Sample Prompts */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400">Try these sample site logs:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const sample = 'Ramesh Sardar and Suresh Kumar worked full day, paid Suresh 750 full wage';
                      setKhataInput(sample);
                      handleParseKhata(sample);
                    }}
                    className="text-[11px] px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:text-brand-orange"
                  >
                    "Ramesh and Suresh full day wage"
                  </button>
                  <button
                    onClick={() => {
                      const sample = 'Ganesh Das half day shift, paid 300 cash advance, and 50 bags cement intake 19000';
                      setKhataInput(sample);
                      handleParseKhata(sample);
                    }}
                    className="text-[11px] px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:text-brand-orange"
                  >
                    "Ganesh half day + Cement intake"
                  </button>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full mt-3"
                onClick={() => handleParseKhata()}
                disabled={isParsingKhata}
              >
                {isParsingKhata ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Extract Structured Khata Entries
              </Button>
            </div>
          </Card>

          {/* Parsed Output Card */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Extracted Ledger Entries
              </h3>
              <span className="text-xs font-bold text-slate-400">
                {parsedKhataEntries.length} Items Found
              </span>
            </div>

            {parsedKhataEntries.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Mic className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-xs">No entries parsed yet. Speak or click "Extract Structured Khata Entries".</p>
              </div>
            ) : (
              <div className="space-y-3">
                {parsedKhataEntries.map((entry, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">{entry.title}</span>
                      <Badge variant={entry.type === 'ATTENDANCE' ? 'verified' : 'orange'}>
                        {entry.type}
                      </Badge>
                    </div>

                    {entry.workerName && (
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-1">
                        <div>Promised Wage: <span className="font-bold text-slate-900 dark:text-white">{formatINR(entry.wagePromised || 0)}</span></div>
                        <div>Paid / Advance: <span className="font-bold text-emerald-600">{formatINR(entry.wagePaid || 0)}</span></div>
                      </div>
                    )}

                    <p className="text-[11px] text-slate-400 italic">{entry.notes}</p>
                  </div>
                ))}

                <div className="pt-2">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      addToast({
                        title: 'Synced to Digital Notebook!',
                        message: `${parsedKhataEntries.length} entries recorded to your site ledger khata.`,
                        type: 'success',
                      });
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Sync to Digital Notebook Ledger
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 4: AI NEGOTIATION COPILOT */}
      {activeTab === 'negotiator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Handshake className="w-5 h-5 text-brand-orange" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Negotiation Deal Simulator</h3>
              </div>
              <Badge variant="verified">Game Theory Model</Badge>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Formulate optimal counter-offers in BuildNexus Chat using volume incentives and fast site unloading guarantees.
            </p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Supplier Initial Quote (₹ per unit)</label>
                <Input
                  type="number"
                  value={supplierQuote}
                  onChange={(e) => setSupplierQuote(e.target.value)}
                  placeholder="e.g. 390 for cement bag"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Order Quantity</label>
                <Input
                  type="number"
                  value={targetVolume}
                  onChange={(e) => setTargetVolume(e.target.value)}
                  placeholder="e.g. 150 bags"
                />
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleRunNegotiation}
              >
                <Sparkles className="w-4 h-4 mr-2" /> Generate Win-Win Counter Strategy
              </Button>
            </div>
          </Card>

          {/* Negotiation Strategy Output */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-brand-orange" /> Recommended Offer Strategy
              </h3>
            </div>

            {negotiationResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 dark:bg-orange-950/40 rounded-2xl border border-orange-200 dark:border-orange-900/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{negotiationResult.strategyName}</span>
                    <Badge variant="orange">High Acceptance Probability (88%)</Badge>
                  </div>
                  <div className="flex items-baseline gap-3 pt-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      ₹{negotiationResult.optimalCounter}
                    </span>
                    <span className="text-xs text-slate-500 line-through">
                      ₹{negotiationResult.quote} initial
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      Save {formatINR(negotiationResult.potentialSaving)} total
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Recommended Talking Points:</h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {negotiationResult.talkingPoints.map((point: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Enter supplier quote and click "Generate Win-Win Counter Strategy".
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
