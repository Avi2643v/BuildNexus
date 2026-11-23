'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Bot,
  X,
  Send,
  Mic,
  MicOff,
  Sparkles,
  TrendingUp,
  Calculator,
  Users,
  ShoppingCart,
  ArrowRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  Globe,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  actions?: Array<{
    label: string;
    actionType: string;
    payload?: any;
  }>;
  time: string;
}

export const NexusBot: React.FC = () => {
  const router = useRouter();
  const { addToCart, addToast, language: appLanguage, setCartDrawerOpen } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatLanguage, setChatLanguage] = useState<'en' | 'hi' | 'kn'>('en');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'bot-welcome',
      sender: 'bot',
      text: `👋 Namaste! I am **NexusBot**, your AI construction copilot. 

I can estimate Bill of Quantities (BOQ), forecast cement & steel price drops, help negotiate supplier bids, or find certified masons. How can I help your project today?`,
      time: 'Just now',
      actions: [
        {
          label: '🏗️ Estimate 1,200 sq.ft BOQ',
          actionType: 'OPEN_ESTIMATOR',
          payload: { area: 1200 },
        },
        {
          label: '📈 Check Steel & Cement Forecast',
          actionType: 'VIEW_FORECAST',
        },
        {
          label: '👷 Find Available Labour',
          actionType: 'VIEW_LABOUR',
        },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Voice Recognition Handler
  const handleToggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      addToast({
        title: 'Voice Not Supported',
        message: 'Speech recognition is not available in your current browser. You can type queries instead.',
        type: 'warning',
      });
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = chatLanguage === 'hi' ? 'hi-IN' : chatLanguage === 'kn' ? 'kn-IN' : 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const spokenText = event.results[0][0].transcript;
        setInputMessage(spokenText);
        setIsListening(false);
        // Automatically submit the spoken text
        sendMessage(spokenText);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language: chatLanguage }),
      });
      const data = await res.json();

      if (data.success) {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: data.reply,
          actions: data.actions,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'Apologies, I encountered an issue analyzing your query. Please try again or check our dedicated AI Suite page.',
          time: 'Now',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: { label: string; actionType: string; payload?: any }) => {
    if (action.actionType === 'ADD_TO_CART' && action.payload) {
      addToCart({
        ...action.payload,
      });
      addToast({
        title: 'Added to Cart',
        message: `${action.payload.name} (${action.payload.quantity} ${action.payload.unit}) added to your BuildNexus cart.`,
        type: 'success',
      });
      setCartDrawerOpen(true);
    } else if (action.actionType === 'OPEN_ESTIMATOR') {
      router.push('/ai?tab=estimator');
      setIsOpen(false);
    } else if (action.actionType === 'VIEW_FORECAST') {
      router.push('/ai?tab=forecast');
      setIsOpen(false);
    } else if (action.actionType === 'VIEW_LABOUR') {
      router.push('/labour');
      setIsOpen(false);
    } else if (action.actionType === 'NAVIGATE' && action.payload?.url) {
      router.push(action.payload.url);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-40 group">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-orange-500 via-brand-orange to-amber-500 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/30"
            aria-label="Open NexusBot AI Copilot"
          >
            <div className="relative">
              <Bot className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white animate-ping" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-black tracking-wide leading-none flex items-center gap-1">
                NexusBot AI <Sparkles className="w-3 h-3 text-amber-200" />
              </p>
              <p className="text-[10px] text-white/80 font-medium">Copilot & Forecast</p>
            </div>
          </button>
        </div>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ${
            isExpanded
              ? 'inset-4 sm:inset-10'
              : 'bottom-6 right-4 sm:right-6 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white rounded-t-3xl flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-orange to-amber-400 flex items-center justify-center text-white shadow-glow">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm tracking-tight">NexusBot AI Copilot</h3>
                  <Badge variant="orange" className="text-[10px] py-0 px-1.5">v2.5</Badge>
                </div>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" /> Live Construction Knowledge
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Language Switch */}
              <select
                value={chatLanguage}
                onChange={(e) => setChatLanguage(e.target.value as any)}
                className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded-lg border border-slate-700 outline-none font-medium cursor-pointer"
                title="Select Language"
              >
                <option value="en">EN</option>
                <option value="hi">HI (हिंदी)</option>
                <option value="kn">KN (ಕನ್ನಡ)</option>
              </select>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title={isExpanded ? 'Minimize' : 'Maximize'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick AI Links Bar */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span className="text-[11px] font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-orange" /> Suggestions:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => sendMessage('What is the cement price prediction for next week?')}
                className="px-2 py-1 rounded-md bg-white dark:bg-slate-700 text-[11px] font-medium border border-slate-200 dark:border-slate-600 hover:text-brand-orange transition-colors shrink-0"
              >
                Cement Forecast
              </button>
              <button
                onClick={() => sendMessage('Estimate materials for 1000 sq ft house')}
                className="px-2 py-1 rounded-md bg-white dark:bg-slate-700 text-[11px] font-medium border border-slate-200 dark:border-slate-600 hover:text-brand-orange transition-colors shrink-0"
              >
                1000 sq.ft BOQ
              </button>
              <button
                onClick={() => sendMessage('Available masons in Bengaluru')}
                className="px-2 py-1 rounded-md bg-white dark:bg-slate-700 text-[11px] font-medium border border-slate-200 dark:border-slate-600 hover:text-brand-orange transition-colors shrink-0"
              >
                Find Masons
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-navy text-white rounded-br-none ml-8'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="whitespace-pre-line font-normal">{msg.text}</div>

                  {/* Bot Interactive Actions */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="pt-2 flex flex-col gap-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                      {msg.actions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(act)}
                          className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-900 hover:bg-orange-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-xs transition-colors group text-left"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-brand-orange group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[10px] text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-b-3xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-2.5 rounded-2xl border transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-brand-orange'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Voice input (Hindi/English/Kannada)'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {isListening && (
                <div className="flex items-center gap-1 px-1 shrink-0">
                  <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce [animation-delay:0s]" />
                  <span className="w-1 h-5 bg-rose-500 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce [animation-delay:0.3s]" />
                  <span className="w-1 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:0.45s]" />
                </div>
              )}

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  isListening
                    ? 'Listening... speak clearly into microphone'
                    : 'Ask NexusBot about prices, BOQ, masons...'
                }
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />

              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="rounded-2xl h-10 px-3.5"
                disabled={!inputMessage.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
