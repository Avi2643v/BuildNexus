'use client';

import React, { useState } from 'react';
import { maskPhoneNumber, formatINR } from '@/lib/utils';
import {
  Send,
  Lock,
  Tag,
  Building2,
  ShieldCheck,
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
    <div className="space-y-10">
      {/* Title */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
          Negotiation.
        </h2>
        <p className="text-lg text-[#86868b] font-normal mt-1">
          In-app private deals with built-in privacy protection and immutable escrow contracts.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* iOS-Style Chat Container */}
        <div className="lg:col-span-2 rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8 flex flex-col h-[540px] justify-between">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#d2d2d7]/50">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#86868b]" />
              <span className="text-xs font-semibold text-[#1d1d1f]">
                Lakshmi Building Supplies (Yeshwanthpur)
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#0071e3] font-medium">
              <Lock className="w-3 h-3" />
              <span>Anti-Bypass Guard Active</span>
            </div>
          </div>

          {/* Messages Log */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3.5 no-scrollbar">
            {messages.map((m) => {
              const isMe = m.sender === 'Contractor';
              const maskedText = maskPhoneNumber(m.text);

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-[20px] px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? 'bg-[#0071e3] text-white rounded-br-sm'
                        : 'bg-[#e9e9eb] text-[#1d1d1f] rounded-bl-sm'
                    }`}
                  >
                    <p>{maskedText}</p>

                    {maskedText.includes('🔒 [CONTACT MASKED]') && (
                      <div className="mt-2 text-[10px] font-medium bg-black/10 text-white/90 px-2 py-1 rounded-md">
                        Contact hidden to maintain platform pricing integrity.
                      </div>
                    )}

                    {m.isOffer && m.offerDetails && (
                      <div className="mt-3 p-3 rounded-xl bg-black/10 text-white space-y-1.5 text-xs">
                        <div className="flex items-center justify-between font-semibold">
                          <span>Purchase Offer</span>
                          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                            {m.offerDetails.status}
                          </span>
                        </div>
                        <div className="text-[11px] opacity-90">
                          {m.offerDetails.qty} bags @ {formatINR(m.offerDetails.price)}/bag
                        </div>
                        <div className="font-semibold text-sm pt-1 border-t border-white/10 flex justify-between">
                          <span>Settlement:</span>
                          <span>{formatINR(m.offerDetails.price * m.offerDetails.qty)}</span>
                        </div>

                        {m.offerDetails.status === 'PENDING' && (
                          <button
                            onClick={() => handleAcceptOffer(m.id)}
                            className="w-full mt-2 py-1.5 rounded-full bg-white text-[#0071e3] font-semibold text-xs hover:bg-white/90 transition"
                          >
                            Accept & Lock Escrow
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-[#86868b] mt-1 px-1">
                    {m.sender} • {m.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Input Pill */}
          <div className="pt-4 border-t border-[#d2d2d7]/50 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type message (Try typing a 10-digit phone number)..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2 rounded-full bg-white border border-[#d2d2d7] text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
            />
            <button
              onClick={handleSend}
              className="w-8 h-8 rounded-full bg-[#0071e3] text-white flex items-center justify-center hover:bg-[#0077ed] transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Offer Composer Card */}
        <div className="rounded-[28px] bg-[#f5f5f7] p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-[#0071e3]" />
              <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">
                Make Offer
              </h3>
            </div>
            <p className="text-xs text-[#86868b] mb-6">
              Lock in wholesale pricing directly into an escrow-backed purchase order.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[#86868b] font-medium block mb-1">Offered Rate (₹/bag)</label>
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl bg-white border border-[#d2d2d7] font-semibold text-[#1d1d1f] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#86868b] font-medium block mb-1">Quantity (Bags)</label>
                <input
                  type="number"
                  value={offerQty}
                  onChange={(e) => setOfferQty(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl bg-white border border-[#d2d2d7] font-semibold text-[#1d1d1f] focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#d2d2d7]/60 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#86868b]">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#1d1d1f]">{formatINR(offerPrice * offerQty)}</span>
                </div>
                <div className="flex justify-between text-[#86868b]">
                  <span>GST (18%):</span>
                  <span>{formatINR(offerPrice * offerQty * 0.18)}</span>
                </div>
                <div className="flex justify-between text-[#1d1d1f] font-semibold pt-1 border-t border-[#d2d2d7]/50 text-sm">
                  <span>Total Escrow:</span>
                  <span className="text-[#0071e3]">{formatINR(offerPrice * offerQty * 1.18)}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleMakeOffer}
            className="w-full mt-6 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium transition shadow-sm"
          >
            Send Locked Offer
          </button>
        </div>
      </div>
    </div>
  );
};
