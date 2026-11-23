'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatINR } from '@/lib/utils';
import {
  Send,
  Search,
  ShieldCheck,
  Flag,
  Handshake,
  Paperclip,
  Image as ImageIcon,
  CheckCheck,
  Check,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface OfferItem {
  id: string;
  senderId: string;
  price: number;
  quantity: number;
  counterPrice?: number;
  status: 'SENT' | 'COUNTERED' | 'APPROVED_PARTY' | 'VERIFIED_BUILDNEXUS' | 'REJECTED';
  material: {
    id: string;
    name: string;
    unit: string;
    price: number;
    image: string;
  };
}

interface MessageItem {
  id: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  isSystem: boolean;
  createdAt: string;
}

interface ConversationItem {
  id: string;
  participant1Id: string;
  participant2Id: string;
  lastMessageAt: string;
  flagged: boolean;
  messages: MessageItem[];
  offers: OfferItem[];
  otherUser: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    rating?: number;
    maskedGovtId?: string;
  };
}

export default function ChatPage() {
  const { user, addToCart, addToast } = useAppStore();

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Make Offer Modal State
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerPrice, setOfferPrice] = useState('365');
  const [offerQty, setOfferQty] = useState('100');
  const [counterInput, setCounterInput] = useState('');
  const [counteringOfferId, setCounteringOfferId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeUserId = user?.id || 'user-contractor-1';

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const res = await fetch(`/api/chat/conversations?userId=${activeUserId}`);
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations);
        if (!activeConvId && data.conversations.length > 0) {
          setActiveConvId(data.conversations[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    // Auto-polling for real-time messages fallback
    const interval = setInterval(fetchConversations, 4000);
    return () => clearInterval(interval);
  }, [activeUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConvId]);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  // Send text message with privacy auto-masking
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConvId) return;

    const textToSend = messageText;
    setMessageText('');

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvId,
          senderId: activeUserId,
          text: textToSend,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchConversations();
      }
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to send message', type: 'error' });
    }
  };

  // Submit Make Offer
  const handleCreateOffer = async () => {
    if (!activeConvId) return;
    try {
      const res = await fetch('/api/chat/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvId,
          senderId: activeUserId,
          materialId: 'mat-1', // Default UltraTech Cement demo
          price: offerPrice,
          quantity: offerQty,
          action: 'CREATE',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsOfferModalOpen(false);
        addToast({ title: 'Offer Sent', message: 'Negotiation offer created.', type: 'success' });
        fetchConversations();
      }
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to send offer', type: 'error' });
    }
  };

  // Party action on offer (Accept / Counter / Reject)
  const handleOfferAction = async (offerId: string, action: string, counterPrice?: string) => {
    try {
      const res = await fetch('/api/chat/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId,
          senderId: activeUserId,
          action,
          counterPrice,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast({
          title: 'Offer Updated',
          message: action === 'ACCEPT_PARTY' ? 'Accepted! Sent to BuildNexus Admin for central verification.' : 'Status updated.',
          type: 'success',
        });
        setCounteringOfferId(null);
        fetchConversations();
      }
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to update offer', type: 'error' });
    }
  };

  // Admin verify offer
  const handleAdminVerifyOffer = async (offerId: string) => {
    try {
      const res = await fetch('/api/chat/offers/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId, adminId: activeUserId }),
      });
      const data = await res.json();
      if (data.success) {
        addToast({ title: 'BuildNexus Verified!', message: 'Deal rate locked & verified for checkout.', type: 'success' });
        fetchConversations();
      }
    } catch (err) {
      addToast({ title: 'Error', message: 'Verification failed', type: 'error' });
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-4 overflow-hidden">
      {/* LEFT: Conversation List */}
      <div className={`w-full md:w-80 flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
        <div className="space-y-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">Negotiations</h2>
            <Badge variant="orange">{conversations.length} Active</Badge>
          </div>
          <Input
            placeholder="Search supplier or builder..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-2 pt-3 pr-1">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))
          ) : filteredConversations.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-6">No conversations found.</p>
          ) : (
            filteredConversations.map((c) => {
              const isActive = c.id === activeConvId;
              const lastMsg = c.messages[c.messages.length - 1];
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all border flex items-center gap-3 ${
                    isActive
                      ? 'bg-brand-orange text-white border-brand-orange shadow-glow'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Avatar name={c.otherUser?.name || 'User'} src={c.otherUser?.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {c.otherUser?.name}
                      </h4>
                      <span className={`text-[10px] ${isActive ? 'text-orange-200' : 'text-slate-400'}`}>
                        {c.otherUser?.role}
                      </span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-orange-100' : 'text-slate-500'}`}>
                      {lastMsg?.text || 'No messages yet'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT: Active Chat View */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
        {activeConv ? (
          <>
            {/* Active Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveConvId(null)} className="md:hidden text-xs font-bold text-brand-orange">
                  ← Back
                </button>
                <Avatar name={activeConv.otherUser?.name || 'User'} src={activeConv.otherUser?.avatar} isVerified size="md" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    {activeConv.otherUser?.name}
                    <Badge variant="verified" size="sm">Verified</Badge>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {activeConv.otherUser?.role} • Masked ID: {activeConv.otherUser?.maskedGovtId || 'Verified'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsOfferModalOpen(true)}
                  variant="primary"
                  size="sm"
                  leftIcon={<Handshake className="w-4 h-4" />}
                >
                  Make Offer
                </Button>
                <button
                  onClick={() => addToast({ title: 'Chat Flagged', message: 'Sent to Admin moderation queue.', type: 'warning' })}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Flag Conversation"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Privacy Disclaimer Banner */}
            <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 text-center text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2 border-b border-slate-200 dark:border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Private In-App Negotiation • Phone numbers & emails typed are automatically masked for safety.
            </div>

            {/* Message & Offer Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {/* Render Offers */}
              {activeConv.offers.map((offer) => {
                const isMyOffer = offer.senderId === activeUserId;
                const dealPrice = offer.counterPrice || offer.price;

                const statusStyles: Record<string, { badge: string; label: string }> = {
                  SENT: { badge: 'warning', label: 'Offer Sent' },
                  COUNTERED: { badge: 'orange', label: 'Countered Rate Offered' },
                  APPROVED_PARTY: { badge: 'verified', label: 'Approved by Party (Awaiting BuildNexus Admin)' },
                  VERIFIED_BUILDNEXUS: { badge: 'fairWage', label: 'Verified & Rate Locked by BuildNexus Admin' },
                  REJECTED: { badge: 'error', label: 'Rejected' },
                };

                return (
                  <Card key={offer.id} className="border-2 border-brand-orange/40 bg-orange-50/30 dark:bg-orange-950/20 max-w-md mx-auto my-3 shadow-md">
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-orange uppercase flex items-center gap-1">
                          <Handshake className="w-4 h-4" /> Price Negotiation Card
                        </span>
                        <Badge variant={statusStyles[offer.status]?.badge as any}>
                          {statusStyles[offer.status]?.label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                        <img src={offer.material.image} alt={offer.material.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{offer.material.name}</h4>
                          <p className="text-[11px] text-slate-500">
                            Quantity: <span className="font-bold text-slate-900 dark:text-white">{offer.quantity} {offer.material.unit}</span>
                          </p>
                          <p className="text-xs font-extrabold text-brand-orange">
                            Offered: {formatINR(dealPrice)} / {offer.material.unit}
                            <span className="line-through text-slate-400 font-normal text-[10px] ml-1">
                              {formatINR(offer.material.price)}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons for Recipients */}
                      <div className="space-y-2 pt-1">
                        {!isMyOffer && offer.status === 'SENT' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="success" className="flex-1 text-xs" onClick={() => handleOfferAction(offer.id, 'ACCEPT_PARTY')}>
                              Accept Offer
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs" onClick={() => setCounteringOfferId(offer.id)}>
                              Counter
                            </Button>
                            <Button size="sm" variant="danger" className="text-xs" onClick={() => handleOfferAction(offer.id, 'REJECT')}>
                              Reject
                            </Button>
                          </div>
                        )}

                        {counteringOfferId === offer.id && (
                          <div className="flex items-center gap-2 pt-2">
                            <Input
                              placeholder="Enter counter price ₹"
                              value={counterInput}
                              onChange={(e) => setCounterInput(e.target.value)}
                              className="text-xs min-h-[38px]"
                            />
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleOfferAction(offer.id, 'COUNTER', counterInput)}
                            >
                              Submit Counter
                            </Button>
                          </div>
                        )}

                        {/* Admin Verification Action */}
                        {user?.role === 'ADMIN' && offer.status === 'APPROVED_PARTY' && (
                          <Button
                            size="sm"
                            variant="primary"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                            onClick={() => handleAdminVerifyOffer(offer.id)}
                          >
                            [Admin] Verify & Lock BuildNexus Rate
                          </Button>
                        )}

                        {/* Checkout Action if Verified */}
                        {offer.status === 'VERIFIED_BUILDNEXUS' && (
                          <Button
                            size="sm"
                            variant="primary"
                            className="w-full text-xs"
                            leftIcon={<ShoppingBag className="w-4 h-4" />}
                            onClick={() => {
                              addToCart({
                                materialId: offer.material.id,
                                name: offer.material.name,
                                price: offer.material.price,
                                negotiatedPrice: dealPrice,
                                unit: offer.material.unit,
                                quantity: offer.quantity,
                                supplierId: activeConv.otherUser.id,
                                supplierName: activeConv.otherUser.name,
                                image: offer.material.image,
                              });
                              addToast({ title: 'Added Negotiated Deal', message: 'Added to cart at verified rate.', type: 'success' });
                            }}
                          >
                            Add to Cart at Negotiated Rate ({formatINR(dealPrice)})
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Text Messages */}
              {activeConv.messages.map((m) => {
                const isMe = m.senderId === activeUserId;
                if (m.isSystem) {
                  return (
                    <div key={m.id} className="text-center my-3">
                      <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                        {m.text}
                      </span>
                    </div>
                  );
                }
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-brand-orange text-white rounded-br-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-xs'
                      }`}
                    >
                      <p>{m.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {isMe && <CheckCheck className="w-3 h-3 text-brand-orange" />}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* AI Smart Negotiation Suggestions */}
            <div className="px-4 py-2 bg-orange-50/70 dark:bg-orange-950/30 border-t border-orange-200/60 dark:border-orange-900/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1 text-[11px] font-black text-brand-orange uppercase shrink-0">
                <Sparkles className="w-3.5 h-3.5" /> AI Copilot:
              </div>
              {[
                { text: '💡 Counter ₹372/bag + 48h staging', price: '372', qty: '100', msg: 'Can you do ₹372/bag if we stage at BuildNexus Bay B2 for 48 hours?' },
                { text: '💡 Bulk: ₹365/bag for 200 bags', price: '365', qty: '200', msg: 'If I increase volume to 200 bags, can you lock ₹365/bag?' },
                { text: '💡 Accept quote + delivery voucher', price: '380', qty: '100', msg: 'Agreed on your quote with BuildNexus express delivery staging.' },
              ].map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setMessageText(sug.msg);
                    setOfferPrice(sug.price);
                    setOfferQty(sug.qty);
                  }}
                  className="text-xs font-semibold whitespace-nowrap bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-900/60 hover:bg-orange-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-xl shadow-xs transition-colors shrink-0"
                >
                  {sug.text}
                </button>
              ))}
            </div>

            {/* Quick Replies Bar */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto">
              {[
                'Can you dispatch tomorrow?',
                'Is ₹365/bag acceptable?',
                'Share BuildNexus staging date',
                'Require 1000 pcs bricks',
              ].map((qr) => (
                <button
                  key={qr}
                  type="button"
                  onClick={() => setMessageText(qr)}
                  className="text-xs font-bold whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-orange text-slate-700 dark:text-slate-200 px-3 py-1 rounded-full"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <button type="button" className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                placeholder="Type message... (contact numbers will be masked)"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
              <Button type="submit" variant="primary" size="md" className="rounded-2xl">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <Handshake className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white">Select a Negotiation Conversation</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Connect with verified material suppliers or builders to negotiate transparent direct prices.
            </p>
          </div>
        )}
      </div>

      {/* MAKE OFFER MODAL */}
      <Modal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        title="Make Direct Price Offer"
        description="Negotiate material unit rates directly. Finalized deals require party approval and BuildNexus central verification."
      >
        <div className="space-y-4 pt-2">
          <Input
            label="Material Item"
            value="UltraTech PPC Cement (50kg)"
            disabled
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Offered Price / Unit (₹)"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              type="number"
            />
            <Input
              label="Quantity Required"
              value={offerQty}
              onChange={(e) => setOfferQty(e.target.value)}
              type="number"
            />
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl text-xs space-y-1">
            <div className="flex justify-between font-bold text-slate-900 dark:text-white">
              <span>Standard Price:</span>
              <span>₹380 / bag</span>
            </div>
            <div className="flex justify-between font-extrabold text-brand-orange">
              <span>Your Offer Total:</span>
              <span>{formatINR(parseFloat(offerPrice || '0') * parseInt(offerQty || '0', 10))}</span>
            </div>
          </div>
          <Button onClick={handleCreateOffer} variant="primary" className="w-full">
            Submit Offer Card to Chat
          </Button>
        </div>
      </Modal>
    </div>
  );
}
