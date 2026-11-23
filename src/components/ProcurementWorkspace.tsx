'use client';

import React, { useState } from 'react';
import { MOCK_MATERIALS, MaterialItem, MOCK_ACTIVE_DELIVERY, ActiveDelivery } from '@/lib/mockData';
import { formatINR, maskPhoneNumber } from '@/lib/utils';
import {
  ShoppingBag,
  MessageSquare,
  Truck,
  Search,
  CheckCircle2,
  Lock,
  Tag,
  Building2,
  Compass,
  Clock,
  KeyRound,
  ShieldCheck,
  Send,
  X,
} from 'lucide-react';

interface ProcurementWorkspaceProps {
  initialSubTab?: 'marketplace' | 'quotes' | 'dispatch';
  committedOrdersCount?: number;
}

export const ProcurementWorkspace: React.FC<ProcurementWorkspaceProps> = ({
  initialSubTab = 'marketplace',
  committedOrdersCount = 0,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'marketplace' | 'quotes' | 'dispatch'>(initialSubTab);

  // Marketplace State
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderToast, setOrderToast] = useState<string | null>(null);

  // Chat State
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'Contractor',
      text: 'Need 500 bags of UltraTech 53 Grade for Salt Lake G+4. Can you match Chronos-2 fair target of ₹358?',
      time: '10:14 AM',
    },
    {
      id: 'm2',
      sender: 'Supplier',
      text: 'Yes sir, we can lock ₹358 for 500 bags with delivery tomorrow 10 AM before the rain spell.',
      time: '10:16 AM',
    },
    {
      id: 'm3',
      sender: 'Contractor',
      text: 'Great, call me at 9876543210 to confirm.',
      time: '10:18 AM',
    },
    {
      id: 'm4',
      sender: 'Supplier',
      text: 'Contact is automatically masked for deal protection. Let us formalize here.',
      time: '10:19 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [offerPrice, setOfferPrice] = useState(358);
  const [offerQty, setOfferQty] = useState(500);

  // Dispatch State
  const [delivery, setDelivery] = useState<ActiveDelivery>(MOCK_ACTIVE_DELIVERY);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const categories = ['All', 'Cement', 'Steel', 'Bricks', 'Sand'];

  const filteredMaterials = MOCK_MATERIALS.filter((item) => {
    const matchesCat = selectedCat === 'All' || item.category === selectedCat;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, sender: 'Contractor', text: chatInput, time: 'Just now' },
    ]);
    setChatInput('');
  };

  const handleVerifyOtp = () => {
    if (otpCode.trim() === delivery.otpCode) {
      setOtpVerified(true);
      setOtpError(null);
    } else {
      setOtpError('Invalid OTP code. Cross-check with site supervisor.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            Procurement & Logistics Workspace
          </h2>
          <p className="text-sm text-[#86868b] mt-1">
            Direct yard marketplace, in-app quote negotiations with Chronos-2 price bounds, and live RMC tracking.
          </p>
        </div>

        {/* 3 Sub-Tabs */}
        <div className="inline-flex items-center bg-[#e8e8ed]/70 p-1 rounded-full text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('marketplace')}
            className={`px-4 py-1.5 rounded-full transition ${
              activeSubTab === 'marketplace'
                ? 'bg-[#1d1d1f] text-white shadow-sm'
                : 'text-[#1d1d1f] hover:text-black'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveSubTab('quotes')}
            className={`px-4 py-1.5 rounded-full transition ${
              activeSubTab === 'quotes'
                ? 'bg-[#1d1d1f] text-white shadow-sm'
                : 'text-[#1d1d1f] hover:text-black'
            }`}
          >
            Quotes & Negotiation
          </button>
          <button
            onClick={() => setActiveSubTab('dispatch')}
            className={`px-4 py-1.5 rounded-full transition flex items-center gap-1.5 ${
              activeSubTab === 'dispatch'
                ? 'bg-[#1d1d1f] text-white shadow-sm'
                : 'text-[#1d1d1f] hover:text-black'
            }`}
          >
            <span>Live Dispatch</span>
            <span className="w-2 h-2 rounded-full bg-[#0071e3] animate-pulse"></span>
          </button>
        </div>
      </div>

      {orderToast && (
        <div className="bg-[#f5f5f7] border border-[#d2d2d7] text-[#1d1d1f] px-5 py-3 rounded-2xl text-xs font-medium flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1b8738]" />
            <span>{orderToast}</span>
          </div>
          <button onClick={() => setOrderToast(null)} className="text-[#86868b] hover:text-black">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SUB-TAB 1: MARKETPLACE */}
      {activeSubTab === 'marketplace' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="inline-flex items-center bg-[#e8e8ed]/70 p-1 rounded-full text-xs font-medium">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCat(c)}
                  className={`px-3.5 py-1.5 rounded-full transition ${
                    selectedCat === c
                      ? 'bg-[#1d1d1f] text-white shadow-sm'
                      : 'text-[#1d1d1f] hover:text-black'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-full bg-[#f5f5f7] border-none text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMaterials.map((item) => (
              <div
                key={item.id}
                className="rounded-[28px] bg-[#f5f5f7] p-8 flex flex-col justify-between hover:bg-[#f0f0f3] transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-xs font-semibold text-[#1b8738] bg-[#eaf6ed] px-2.5 py-0.5 rounded-full">
                      Zero Broker Fee
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-[#1d1d1f] tracking-tight">{item.name}</h3>
                  <div className="text-xs text-[#86868b] mt-1 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{item.supplier}</span>
                    <span>•</span>
                    <span>Dispatch in {item.deliveryTimeHours} hrs</span>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-[#1d1d1f]">{formatINR(item.basePrice)}</span>
                    <span className="text-xs text-[#86868b]">per {item.unit.toLowerCase()}</span>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#d2d2d7]/50 flex items-center justify-between">
                  <span className="text-xs text-[#86868b]">Min Order: <strong>{item.minOrder} Units</strong></span>
                  <button
                    onClick={() => {
                      setOrderToast(`Direct purchase order initiated for ${item.name}. Syncing with Digital Khata.`);
                      setTimeout(() => setOrderToast(null), 3500);
                    }}
                    className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium px-5 py-2 rounded-full transition shadow-sm"
                  >
                    Direct Procure
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: QUOTES & IN-APP CHAT (WITH PHONE MASKING) */}
      {activeSubTab === 'quotes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8 flex flex-col h-[520px] justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[#d2d2d7]/50 text-xs">
              <div className="flex items-center gap-2 font-semibold text-[#1d1d1f]">
                <Building2 className="w-4 h-4 text-[#86868b]" />
                <span>Lakshmi Building Supplies (Salt Lake Depot)</span>
              </div>
              <span className="text-[#0071e3] font-medium flex items-center gap-1 text-[11px]">
                <Lock className="w-3 h-3" /> Anti-Bypass Filter Active
              </span>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3 no-scrollbar">
              {messages.map((m) => {
                const isMe = m.sender === 'Contractor';
                const masked = maskPhoneNumber(m.text);
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-[20px] px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-[#0071e3] text-white rounded-br-sm'
                          : 'bg-[#e9e9eb] text-[#1d1d1f] rounded-bl-sm'
                      }`}
                    >
                      <p>{masked}</p>
                      {masked.includes('🔒 [CONTACT MASKED]') && (
                        <div className="mt-1.5 text-[10px] font-medium bg-black/10 text-white/90 px-2 py-0.5 rounded">
                          Phone masked: Negotiations must stay on-platform for escrow safety.
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-[#86868b] mt-1 px-1">{m.sender} • {m.time}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#d2d2d7]/50 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type message (Try typing your phone number to test masking)..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                className="flex-1 px-4 py-2 rounded-full bg-white border border-[#d2d2d7] text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
              />
              <button
                onClick={handleSendChat}
                className="w-8 h-8 rounded-full bg-[#0071e3] text-white flex items-center justify-center hover:bg-[#0077ed]"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="rounded-[28px] bg-[#f5f5f7] p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-[#0071e3]" />
                <h3 className="text-xl font-semibold text-[#1d1d1f]">Formal Purchase Lock</h3>
              </div>
              <p className="text-xs text-[#86868b] mb-4">
                Chronos-2 Fair Price Range: <strong>₹355 – ₹370/bag</strong>
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[#86868b] block mb-1">Target Price (₹/unit)</label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d2d2d7] font-semibold text-[#1d1d1f]"
                  />
                </div>
                <div>
                  <label className="text-[#86868b] block mb-1">Batch Quantity</label>
                  <input
                    type="number"
                    value={offerQty}
                    onChange={(e) => setOfferQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d2d2d7] font-semibold text-[#1d1d1f]"
                  />
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#d2d2d7]/60 space-y-1">
                  <div className="flex justify-between text-[#86868b]">
                    <span>Settlement Total:</span>
                    <span className="font-semibold text-[#1d1d1f]">{formatINR(offerPrice * offerQty)}</span>
                  </div>
                  <div className="flex justify-between text-[#86868b]">
                    <span>GST (18%):</span>
                    <span>{formatINR(offerPrice * offerQty * 0.18)}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `m-offer-${Date.now()}`,
                    sender: 'Contractor',
                    text: `Formal Offer Sent: ${offerQty} bags of UltraTech 53 Grade @ ₹${offerPrice}/bag.`,
                    time: 'Just now',
                  },
                ]);
              }}
              className="w-full mt-6 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium transition"
            >
              Send Locked RFQ to Supplier
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: LIVE DISPATCH (WITH 90-MIN RMC PERISHABLE DECAY TRACKER) */}
      {activeSubTab === 'dispatch' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-[32px] bg-[#f5f5f7] p-8 sm:p-10 border border-[#d2d2d7]/50 relative overflow-hidden flex flex-col justify-between h-80">
              <div className="flex items-center justify-between text-xs text-[#1d1d1f]">
                <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full shadow-sm border border-[#d2d2d7]/50">
                  <Compass className="w-3.5 h-3.5 text-[#0071e3] animate-spin" />
                  <span>En Route to <strong>Salt Lake G+4 Hopper</strong></span>
                </div>
                <span className="font-semibold text-xs text-[#0071e3] bg-[#0071e3]/10 px-3 py-1 rounded-full">
                  ETA: 18 mins
                </span>
              </div>

              <div className="flex items-center justify-between px-4 sm:px-12 relative z-10">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center font-semibold text-xs mx-auto shadow-md">
                    HUB
                  </div>
                  <div className="text-xs font-semibold text-[#1d1d1f] mt-2">Central Staging</div>
                  <div className="text-[10px] text-[#86868b]">Departed 10:45 AM</div>
                </div>

                <div className="flex-1 mx-6 h-2 bg-[#e8e8ed] rounded-full relative overflow-hidden">
                  <div className="h-full bg-[#0071e3] w-2/3 rounded-full"></div>
                  <div className="absolute top-1/2 left-2/3 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white shadow-md border border-[#d2d2d7] flex items-center justify-center">
                    <Truck className="w-3.5 h-3.5 text-[#0071e3]" />
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#0071e3] text-white flex items-center justify-center font-semibold text-xs mx-auto shadow-md">
                    SITE
                  </div>
                  <div className="text-xs font-semibold text-[#1d1d1f] mt-2">Salt Lake Pour</div>
                  <div className="text-[10px] text-[#0071e3] font-semibold">18 Mins Out</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#86868b] pt-4 border-t border-[#d2d2d7]/50">
                <span>Vehicle: <strong className="text-[#1d1d1f]">WB-04-E-8819</strong> (Vikram Singh)</span>
                <span>Payload: <strong>7.5 m³ M25 RMC</strong></span>
              </div>
            </div>

            {/* 90-min RMC setting monitor */}
            <div className="rounded-[28px] bg-[#f5f5f7] p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-semibold text-[#b64400] uppercase tracking-wider block">
                  Perishable Concrete Horizon (ASTM C94)
                </span>
                <h3 className="text-xl font-semibold text-[#1d1d1f] mt-1">
                  46 minutes remaining before initial concrete set.
                </h3>
                <p className="text-xs text-[#86868b]">
                  12-man pouring crew standing by at hopper to avoid idle wage leakage.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-white px-5 py-4 rounded-2xl border border-[#d2d2d7]/60 shadow-sm">
                <Clock className="w-8 h-8 text-[#0071e3]" />
                <div>
                  <div className="text-2xl font-semibold text-[#1d1d1f]">
                    44m <span className="text-xs text-[#86868b] font-normal">/ 90m max</span>
                  </div>
                  <div className="text-[10px] text-[#1b8738] font-semibold">Slump: 120mm Optimal</div>
                </div>
              </div>
            </div>
          </div>

          {/* Secure Handover */}
          <div className="rounded-[28px] bg-[#f5f5f7] p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <KeyRound className="w-4 h-4 text-[#0071e3]" />
                <h3 className="text-xl font-semibold text-[#1d1d1f]">Secure OTP Handover</h3>
              </div>
              <p className="text-xs text-[#86868b] mb-6">
                Funds released from escrow only upon physical verification by site engineer.
              </p>

              {otpVerified ? (
                <div className="p-5 rounded-2xl bg-[#eaf6ed] border border-[#1b8738]/20 text-center space-y-1">
                  <ShieldCheck className="w-8 h-8 text-[#1b8738] mx-auto" />
                  <div className="text-sm font-semibold text-[#1b8738]">Handover Verified</div>
                  <p className="text-xs text-[#1b8738]/80">Payment of ₹28,875 released to supplier.</p>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-[#d2d2d7]/60 text-center text-[#86868b]">
                    Supervisor Demo OTP: <strong className="text-[#1d1d1f] font-mono text-sm">{delivery.otpCode}</strong>
                  </div>

                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Enter 4-digit OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-center tracking-widest text-lg font-mono font-semibold py-2.5 rounded-xl bg-white border border-[#d2d2d7] text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                  {otpError && <div className="text-xs text-[#b64400] text-center font-medium">{otpError}</div>}

                  <button
                    onClick={handleVerifyOtp}
                    className="w-full py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium transition shadow-sm"
                  >
                    Confirm Delivery & Release Escrow
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8 text-center text-[11px] text-[#86868b]">
              BuildNexus Custody Chain
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
