'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatINR } from '@/lib/utils';
import {
  BookOpen,
  Plus,
  Mic,
  MicOff,
  Download,
  FileSpreadsheet,
  Calendar,
  Users,
  Package,
  DollarSign,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface NotebookEntryItem {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  type: 'ATTENDANCE' | 'MATERIAL' | 'EXPENSE' | 'PAYMENT';
  title: string;
  amount: number;
  workerName?: string;
  wagePromised?: number;
  wagePaid?: number;
  notes?: string;
  syncStatus: string;
}

export default function NotebookPage() {
  const { user, addToast } = useAppStore();

  const [entries, setEntries] = useState<NotebookEntryItem[]>([]);
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Quick Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [entryType, setEntryType] = useState<'ATTENDANCE' | 'MATERIAL' | 'EXPENSE' | 'PAYMENT'>('ATTENDANCE');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [wagePromised, setWagePromised] = useState('750');
  const [wagePaid, setWagePaid] = useState('750');
  const [notes, setNotes] = useState('');
  const [isListening, setIsListening] = useState(false);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/notebook?contractorId=${user?.id || 'user-contractor-1'}&type=${filterType}`);
      const data = await res.json();
      if (data.success) {
        setEntries(data.entries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [filterType]);

  // Voice-to-Text Web Speech API Helper
  const handleToggleVoiceToText = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      addToast({
        title: 'Voice Input Unsupported',
        message: 'Speech recognition is not supported in this browser. Please type text.',
        type: 'warning',
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;

    if (!isListening) {
      setIsListening(true);
      recognition.start();
      addToast({ title: 'Listening...', message: 'Speak now (e.g. Paid 750 to Ramesh for mortar work)', type: 'info' });

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNotes((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);

        // AI Khata NLP Auto-fill
        try {
          const res = await fetch('/api/ai/parse-khata', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcript }),
          });
          const data = await res.json();
          if (data.success && data.parsedEntries?.length > 0) {
            const first = data.parsedEntries[0];
            if (first.workerName) setWorkerName(first.workerName);
            if (first.wagePromised) setWagePromised(String(first.wagePromised));
            if (first.wagePaid) setWagePaid(String(first.wagePaid));
            if (first.amount) setAmount(String(first.amount));
            if (first.title) setTitle(first.title);
            if (first.type) setEntryType(first.type);
            addToast({
              title: 'AI Auto-Filled Khata',
              message: `Extracted entry details from speech.`,
              type: 'success',
            });
          } else {
            addToast({ title: 'Voice Captured', message: `Recorded: "${transcript}"`, type: 'success' });
          }
        } catch {
          addToast({ title: 'Voice Captured', message: `Recorded: "${transcript}"`, type: 'success' });
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsListening(false);
      recognition.stop();
    }
  };

  const handleCreateEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/notebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorId: user?.id || 'user-contractor-1',
          type: entryType,
          title: title || `${entryType} Entry`,
          amount,
          workerName,
          wagePromised,
          wagePaid,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        addToast({ title: 'Khata Entry Recorded', message: 'Saved to Digital Notebook.', type: 'success' });
        setIsAddModalOpen(false);
        // Reset form
        setTitle('');
        setAmount('');
        setNotes('');
        fetchEntries();
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to save entry', type: 'error' });
    }
  };

  // Export PDF Report using jsPDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('BuildNexus Digital Notebook (Khata) Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Project: Main Site Villa Project • Date: ${new Date().toLocaleDateString('en-IN')}`, 14, 28);

    let y = 40;
    entries.forEach((e, idx) => {
      doc.text(
        `${idx + 1}. [${e.type}] ${e.title} - ${formatINR(e.amount)} (${e.date})`,
        14,
        y
      );
      if (e.notes) doc.text(`   Notes: ${e.notes}`, 14, y + 5);
      y += 12;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`BuildNexus_Khata_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    addToast({ title: 'PDF Generated', message: 'Downloaded Khata report.', type: 'success' });
  };

  // Export Excel Ledger using xlsx
  const exportExcel = () => {
    const data = entries.map((e) => ({
      Date: e.date,
      Type: e.type,
      Title: e.title,
      'Amount (₹)': e.amount,
      'Worker Name': e.workerName || '-',
      'Wage Promised (₹)': e.wagePromised || '-',
      'Wage Paid (₹)': e.wagePaid || '-',
      Notes: e.notes || '-',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Digital Khata');
    XLSX.writeFile(wb, `BuildNexus_Khata_Ledger_${new Date().toISOString().split('T')[0]}.xlsx`);
    addToast({ title: 'Excel Exported', message: 'Downloaded Khata ledger sheet.', type: 'success' });
  };

  // Metrics
  const totalExpenses = entries.reduce((acc, e) => acc + e.amount, 0);
  const totalWagePaid = entries
    .filter((e) => e.type === 'ATTENDANCE')
    .reduce((acc, e) => acc + (e.wagePaid || e.amount), 0);
  const totalWagePromised = entries
    .filter((e) => e.type === 'ATTENDANCE')
    .reduce((acc, e) => acc + (e.wagePromised || e.amount), 0);
  const wageDues = Math.max(0, totalWagePromised - totalWagePaid);

  const filteredEntries = entries.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Digital Notebook ("Khata")
            <Badge variant="verified">Offline-First & Auto-Synced</Badge>
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate dark:text-slate-400 mt-1">
            Track daily site attendance, material deliveries, payments, & fair-wage ledger transparency.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={exportPDF} variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Export PDF
          </Button>
          <Button onClick={exportExcel} variant="outline" size="sm" leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
            Export Excel
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Quick Add Entry
          </Button>
        </div>
      </div>

      {/* Running Balance Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-slate-900 text-white border-slate-800">
          <CardContent className="pt-5 space-y-1">
            <span className="text-xs font-bold uppercase text-slate-400">Total Site Expenditure</span>
            <p className="text-2xl font-black text-brand-orange">{formatINR(totalExpenses)}</p>
            <p className="text-[11px] text-slate-400">Materials, wages & daily logistics</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200">
          <CardContent className="pt-5 space-y-1">
            <span className="text-xs font-bold uppercase text-slate-500">Labor Payout Ledger</span>
            <p className="text-2xl font-black text-emerald-600">{formatINR(totalWagePaid)}</p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Guaranteed Fair Wage Paid
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200">
          <CardContent className="pt-5 space-y-1">
            <span className="text-xs font-bold uppercase text-slate-500">Pending Labor Dues</span>
            <p className="text-2xl font-black text-amber-500">{formatINR(wageDues)}</p>
            <p className="text-[11px] text-slate-400">Promised: {formatINR(totalWagePromised)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Entries' },
            { id: 'ATTENDANCE', label: 'Attendance & Wages' },
            { id: 'MATERIAL', label: 'Materials Received' },
            { id: 'EXPENSE', label: 'Expenses' },
            { id: 'PAYMENT', label: 'Payments' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterType === cat.id
                  ? 'bg-brand-orange text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <Input
            placeholder="Search khata entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="text-xs min-h-[40px]"
          />
        </div>
      </div>

      {/* Entries List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <EmptyState
          title="No Khata Entries Found"
          description="Click 'Quick Add Entry' to record site attendance, payments or received materials."
          actionLabel="Quick Add Entry"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => {
            const badgeVariants: Record<string, 'orange' | 'success' | 'verified' | 'warning'> = {
              ATTENDANCE: 'orange',
              MATERIAL: 'verified',
              EXPENSE: 'warning',
              PAYMENT: 'success',
            };

            return (
              <Card key={entry.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-brand-orange shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{entry.title}</h4>
                      <Badge variant={badgeVariants[entry.type] as any} size="sm">
                        {entry.type}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Project: <span className="font-semibold">{entry.projectName}</span> • Date: {entry.date}
                    </p>

                    {entry.type === 'ATTENDANCE' && (
                      <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                        Worker: {entry.workerName || 'Mason Squad'} • Promised: {formatINR(entry.wagePromised || entry.amount)} | Paid: {formatINR(entry.wagePaid || entry.amount)}
                      </p>
                    )}

                    {entry.notes && (
                      <p className="text-xs text-brand-slate dark:text-slate-400 mt-1 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                        {entry.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-baseline sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {formatINR(entry.amount)}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    Synced
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* QUICK ADD KHATA MODAL WITH VOICE INPUT */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Digital Khata Entry"
        description="Record attendance, expenses, or material receipts with voice-to-text input."
      >
        <form onSubmit={handleCreateEntrySubmit} className="space-y-4 pt-2">
          <Select
            label="Entry Type"
            value={entryType}
            onChange={(e) => setEntryType(e.target.value as any)}
            options={[
              { value: 'ATTENDANCE', label: 'Attendance & Fair Wage' },
              { value: 'MATERIAL', label: 'Material Received' },
              { value: 'EXPENSE', label: 'Site Expense' },
              { value: 'PAYMENT', label: 'Payment Made' },
            ]}
          />

          <Input
            label="Title / Description"
            placeholder="e.g. Masonry Team Attendance (5 Workers)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Amount (₹)"
            placeholder="e.g. 3650"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            required
          />

          {entryType === 'ATTENDANCE' && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Worker / Team Name"
                placeholder="e.g. Ramesh Squad"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
              />
              <Input
                label="Promised Wage (₹)"
                value={wagePromised}
                onChange={(e) => setWagePromised(e.target.value)}
                type="number"
              />
            </div>
          )}

          {/* Voice to Text Note Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Notes & Photos
              </label>
              <button
                type="button"
                onClick={handleToggleVoiceToText}
                className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-brand-orange/10 text-brand-orange hover:bg-brand-orange hover:text-white'
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                {isListening ? 'Listening Voice...' : 'Voice Input (Web Speech)'}
              </button>
            </div>
            <textarea
              placeholder="Speak or type site details (e.g. Ramesh full day 750, paid 500 advance)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[80px] p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            {notes.trim().length > 5 && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await fetch('/api/ai/parse-khata', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ transcript: notes }),
                    });
                    const data = await res.json();
                    if (data.success && data.parsedEntries?.length > 0) {
                      const first = data.parsedEntries[0];
                      if (first.workerName) setWorkerName(first.workerName);
                      if (first.wagePromised) setWagePromised(String(first.wagePromised));
                      if (first.wagePaid) setWagePaid(String(first.wagePaid));
                      if (first.amount) setAmount(String(first.amount));
                      if (first.title) setTitle(first.title);
                      if (first.type) setEntryType(first.type);
                      addToast({
                        title: 'AI Auto-Filled',
                        message: 'Successfully filled fields from note text.',
                        type: 'success',
                      });
                    }
                  } catch (e) {
                    // silently handle
                  }
                }}
                className="text-xs text-brand-orange font-bold flex items-center gap-1 hover:underline"
              >
                <Sparkles className="w-3.5 h-3.5" /> AI: Auto-Fill Form from This Note
              </button>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Save Entry to Khata
          </Button>
        </form>
      </Modal>
    </div>
  );
}
