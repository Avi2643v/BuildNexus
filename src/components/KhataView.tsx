'use client';

import React, { useState } from 'react';
import { MOCK_KHATA, KhataEntry } from '@/lib/mockData';
import { formatINR } from '@/lib/utils';
import {
  BookOpen,
  Mic,
  Plus,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Clock,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const KhataView: React.FC = () => {
  const [entries, setEntries] = useState<KhataEntry[]>(MOCK_KHATA);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newEntity, setNewEntity] = useState('');

  const totalPaid = entries.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalPromised = entries.reduce((acc, curr) => acc + curr.promisedAmount, 0);

  const handleVoiceInput = () => {
    setIsListening(true);
    setVoiceNotice('Listening to speech... "Paid 4000 rupees to Bihari Bhai for column shuttering"');
    setTimeout(() => {
      setIsListening(false);
      const simulatedEntry: KhataEntry = {
        id: `k-${Date.now()}`,
        date: 'Just now (Voice Input)',
        category: 'LABOR',
        title: 'Column Shuttering Advance',
        entity: 'Bihari Bhai Concreting Squad',
        promisedAmount: 4000,
        paidAmount: 4000,
        status: 'SETTLED',
        note: 'Transcribed via BuildNexus Speech Engine. 0% deductions.',
      };
      setEntries((prev) => [simulatedEntry, ...prev]);
      setVoiceNotice('Transcribed & recorded to Digital Khata!');
      setTimeout(() => setVoiceNotice(null), 3000);
    }, 2500);
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || newAmount <= 0) return;
    const entry: KhataEntry = {
      id: `k-${Date.now()}`,
      date: 'Just now',
      category: 'PETTY_CASH',
      title: newTitle,
      entity: newEntity || 'Site 4B Petty Expense',
      promisedAmount: newAmount,
      paidAmount: newAmount,
      status: 'SETTLED',
      note: 'Manual notebook entry.',
    };
    setEntries((prev) => [entry, ...prev]);
    setNewTitle('');
    setNewAmount(0);
    setNewEntity('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              Contractor Digital Khata & Ledger
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Audit-Ready
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time tracking of promised vs. paid wages with zero leakage. Hands-free voice logging for on-site supervisors.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleVoiceInput}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-slate-900 text-amber-400 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{isListening ? 'Recording Audio...' : 'Voice-to-Khata'}</span>
          </button>

          <button
            onClick={() => alert('Exporting Official BuildNexus Ledger PDF & Excel summary...')}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {voiceNotice && (
        <div className="bg-blue-50 border border-blue-300 text-blue-900 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>{voiceNotice}</span>
        </div>
      )}

      {/* Financial Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Promised</span>
          <div className="text-2xl font-black text-slate-900 font-['Space_Grotesk'] mt-1">
            {formatINR(totalPromised)}
          </div>
          <span className="text-[11px] text-slate-500">Agreed contract milestones</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Paid Out</span>
          <div className="text-2xl font-black text-emerald-600 font-['Space_Grotesk'] mt-1">
            {formatINR(totalPaid)}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">100% Settled • 0% Disputed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Wage Integrity Index</span>
          <div className="text-2xl font-black text-blue-600 font-['Space_Grotesk'] mt-1">
            100% Fair
          </div>
          <span className="text-[11px] text-blue-700 font-semibold">Zero unauthorized contractor cuts</span>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 font-['Space_Grotesk']">
            Site Disbursement Log
          </h2>
          <span className="text-xs text-slate-500 font-medium">Auto-synced with GST & UPI Rails</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Particulars</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4 text-right">Promised</th>
                <th className="py-3 px-4 text-right">Settled</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{item.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.category === 'LABOR'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : item.category === 'MATERIAL'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {item.title}
                    <div className="text-[10px] text-slate-500 font-normal">{item.note}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{item.entity}</td>
                  <td className="py-3 px-4 text-right font-medium text-slate-500">
                    {formatINR(item.promisedAmount)}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-slate-900">
                    {formatINR(item.paidAmount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" /> Settled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
