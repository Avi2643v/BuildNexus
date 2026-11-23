'use client';

import React, { useState } from 'react';
import { MOCK_KHATA, KhataEntry } from '@/lib/mockData';
import { formatINR } from '@/lib/utils';
import {
  Mic,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  TrendingDown,
  Sparkles,
  Zap,
} from 'lucide-react';

interface KhataWorkspaceProps {
  committedPlanSavings?: number;
}

export const KhataWorkspace: React.FC<KhataWorkspaceProps> = ({ committedPlanSavings = 7364 }) => {
  const [entries, setEntries] = useState<KhataEntry[]>(MOCK_KHATA);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const totalPaid = entries.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalPromised = entries.reduce((acc, curr) => acc + curr.promisedAmount, 0);

  const handleVoiceInput = () => {
    setIsListening(true);
    setVoiceNotice('Listening: "Disbursed 4000 rupees to Bihari Bhai for column shuttering"');
    setTimeout(() => {
      setIsListening(false);
      const simulated: KhataEntry = {
        id: `k-${Date.now()}`,
        date: 'Today, 11:20 AM',
        category: 'LABOR',
        title: 'Column Shuttering Advance',
        entity: 'Bihari Bhai Concreting Squad',
        promisedAmount: 4000,
        paidAmount: 4000,
        status: 'SETTLED',
        note: 'Voice dictated via Speech Engine. 0% deductions.',
      };
      setEntries((prev) => [simulated, ...prev]);
      setVoiceNotice('Transcribed & settled into Digital Khata muster roll.');
      setTimeout(() => setVoiceNotice(null), 3000);
    }, 2200);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            Digital Khata & Muster Roll
          </h2>
          <p className="text-sm text-[#86868b] mt-1">
            Zero-leakage wage disbursements, daily squad muster logs, and SyncEngine idle savings ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleVoiceInput}
            className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 transition ${
              isListening
                ? 'bg-[#b64400] text-white animate-pulse'
                : 'bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f]'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isListening ? 'Listening to speech...' : 'Voice Dictate'}</span>
          </button>

          <button
            onClick={() => alert('Exporting official GST & Fair-Wage ledger (PDF)...')}
            className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-4 py-2 rounded-full text-xs font-medium transition shadow-sm"
          >
            Export Audit Ledger
          </button>
        </div>
      </div>

      {voiceNotice && (
        <div className="bg-[#f5f5f7] border border-[#d2d2d7] text-[#1d1d1f] px-5 py-3 rounded-2xl text-xs font-medium flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#1b8738]" />
          <span>{voiceNotice}</span>
        </div>
      )}

      {/* 3 Summary Cards (Including the SyncEngine Idle Cost Saved Metric!) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-[24px] bg-[#f5f5f7] p-6 border border-[#d2d2d7]/40">
          <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
            Total Disbursed
          </span>
          <div className="text-3xl font-semibold text-[#1b8738] mt-1">
            {formatINR(totalPaid)}
          </div>
          <span className="text-xs text-[#86868b] mt-1 block">100% Settled directly to workers</span>
        </div>

        <div className="rounded-[24px] bg-[#f5f5f7] p-6 border border-[#d2d2d7]/40">
          <span className="text-[11px] font-semibold text-[#0071e3] uppercase tracking-wider block">
            Wage Integrity Index
          </span>
          <div className="text-3xl font-semibold text-[#0071e3] mt-1">
            100% Fair
          </div>
          <span className="text-xs text-[#86868b] mt-1 block">0% Platform or broker cut</span>
        </div>

        {/* SyncEngine Core Metric: Idle Cost Saved */}
        <div className="rounded-[24px] bg-[#eaf6ed] p-6 border border-[#1b8738]/30">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1b8738] uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-[#1b8738]" />
            <span>Idle Cost Saved by SyncEngine</span>
          </div>
          <div className="text-3xl font-semibold text-[#1b8738] mt-1">
            {formatINR(committedPlanSavings)}
          </div>
          <span className="text-xs text-[#1b8738]/80 mt-1 block">
            Coupled supplier-labor synchronization eliminated idle wait wages
          </span>
        </div>
      </div>

      {/* Muster Roll & Ledger Activity */}
      <div className="rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#d2d2d7]/50 mb-2">
          <h3 className="text-sm font-semibold text-[#1d1d1f] uppercase tracking-wider">
            Site Disbursement & Attendance Log
          </h3>
          <span className="text-xs text-[#86868b]">Biometric Escrow Connected</span>
        </div>

        <div className="divide-y divide-[#d2d2d7]/40">
          {entries.map((item) => (
            <div
              key={item.id}
              className="py-4 flex items-center justify-between gap-4 hover:bg-black/[0.01] transition px-2 rounded-xl"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1d1d1f] shadow-sm border border-[#d2d2d7]/40">
                  <CreditCard className="w-4 h-4 text-[#86868b]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1d1d1f]">{item.title}</div>
                  <div className="text-xs text-[#86868b]">
                    {item.entity} • {item.date}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold text-[#1d1d1f]">
                  -{formatINR(item.paidAmount)}
                </div>
                <div className="text-[11px] font-medium text-[#1b8738] flex items-center justify-end gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Settled (0% Deduction)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
