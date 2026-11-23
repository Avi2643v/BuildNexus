'use client';

import React, { useState } from 'react';
import { maskPhoneNumber, formatINR } from '@/lib/utils';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Tag,
  Building2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'Contractor' | 'Supplier';
  text: string;
  time: string;
  isOffer?: boolean;
  offerDetails?: { price: number; qty: number; material: string; status: 'PENDING' | 'ACCEPTED' };
}

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'Contractor',
      text: 'Hello Lakshmi Supplies. Need 500 bags of UltraTech 53 Grade for Site 4B. Can you do ₹355?',
      time: '10:14 AM',
    },
    {
      id: 'm2',
      sender: 'Supplier',
      text: 'Sir, our catalog price is ₹365. For 500 bags, I can do ₹358 if you take delivery today.',
      time: '10:16 AM',
    },
    {
      id: 'm3',
      sender: 'Contractor',
      text: 'Call me on 9876543210 to discuss quick.',
      time: '10:18 AM',
    },
    {
      id: 'm4',
      sender: 'Supplier',
      text: 'Notice: Phone numbers are masked for safety. Let us lock the deal directly here.',
      time: '10:19 AM',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [offerPrice, setOfferPrice] = useState(358);
  const [offerQty, setOfferQty] = useState(500);
  const [offerPlaced, setOfferPlaced] = useState(false);

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'Contractor',
      text: inputMessage,
      time: 'Just now',
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
  };

  const handleMakeOffer = () => {
    const offerMsg: ChatMessage = {
      id: `offer-${Date.now()}`,
      sender: 'Contractor',
      text: `Formal Offer: ₹${offerPrice}/bag for ${offerQty} bags of UltraTech 53 Grade.`,
      time: 'Just now',
      isOffer: true,
      offerDetails: {
        price: offerPrice,
        qty: offerQty,
        material: 'UltraTech 53 Grade Cement',
        status: 'PENDING',
      },
    };
    setMessages((prev) => [...prev, offerMsg]);
    setOfferPlaced(true);
  };

  const handleAcceptOffer = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.offerDetails
          ? { ...m, offerDetails: { ...m.offerDetails, status: 'ACCEPTED' } }
          : m
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              In-App Private Negotiation
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 flex items-center gap-1 border border-indigo-200">
              <Lock className="w-3 h-3" /> Anti-Bypass Guard
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Contact masking algorithm prevents off-platform leakage and protects wholesale discount structures.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-100 p-2 rounded-lg border border-slate-200">
          <Building2 className="w-4 h-4 text-slate-700" />
          <span>Chatting with: <strong>Lakshmi Building Supplies (Yeshwanthpur)</strong></span>
        </div>
      </div>

      {/* Main Chat & Offer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Window (Cols 1-2) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((m) => {
              const isMe = m.sender === 'Contractor';
              const maskedText = maskPhoneNumber(m.text);

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-400 font-semibold mb-1 px-1">
                    {m.sender} • {m.time}
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-sm ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed">{maskedText}</p>

                    {/* Masking alert badge if phone was masked */}
                    {maskedText.includes('🔒 [CONTACT MASKED]') && (
                      <div className="mt-2 text-[10px] font-bold bg-amber-400/20 text-amber-900 border border-amber-300 p-1.5 rounded flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>BuildNexus Privacy Filter: Contact number hidden for deal security.</span>
                      </div>
                    )}

                    {/* In-Chat Offer Card */}
                    {m.isOffer && m.offerDetails && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-900 text-white border border-slate-700 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-400 flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5" /> Formal Purchase Offer
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              m.offerDetails.status === 'ACCEPTED'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-amber-500 text-slate-950'
                            }`}
                          >
                            {m.offerDetails.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300">
                          {m.offerDetails.qty} bags of {m.offerDetails.material} @{' '}
                          <strong className="text-white">{formatINR(m.offerDetails.price)}/bag</strong>
                        </div>
                        <div className="text-xs font-bold text-emerald-400 pt-1 border-t border-slate-800 flex justify-between">
                          <span>Total Settlement:</span>
                          <span>{formatINR(m.offerDetails.price * m.offerDetails.qty)}</span>
                        </div>

                        {m.offerDetails.status === 'PENDING' && (
                          <button
                            onClick={() => handleAcceptOffer(m.id)}
                            className="w-full mt-2 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                          >
                            Accept Deal & Generate Escrow Invoice
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type message (Try typing a phone number to test privacy masking)..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </div>

        {/* Instant Formal Offer Creator Panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 font-['Space_Grotesk']">
                Make Locked Deal Offer
              </h2>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-normal">
              Agree on price in chat and lock it into an immutable contract with 1-click escrow release.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Material
                </label>
                <input
                  type="text"
                  readOnly
                  value="UltraTech 53 Grade Cement"
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Offered Price per Bag (Catalog: ₹365)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quantity (Bags)
                </label>
                <input
                  type="number"
                  value={offerQty}
                  onChange={(e) => setOfferQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-800">{formatINR(offerPrice * offerQty)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>18% GST:</span>
                  <span>{formatINR(offerPrice * offerQty * 0.18)}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-extrabold pt-1 border-t border-slate-200">
                  <span>Offer Grand Total:</span>
                  <span className="text-blue-600">{formatINR(offerPrice * offerQty * 1.18)}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleMakeOffer}
            className="w-full mt-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
          >
            Send Formal Offer to Chat
          </button>
        </div>
      </div>
    </div>
  );
};
