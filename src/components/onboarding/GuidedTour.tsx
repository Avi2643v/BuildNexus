'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Stepper } from '@/components/ui/Stepper';
import { Building2, Handshake, Truck, Sparkles, ArrowRight, Check } from 'lucide-react';

export const GuidedTour: React.FC = () => {
  const { hasSeenOnboarding, setHasSeenOnboarding, activeRole } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Show onboarding for new sessions once
    const seen = localStorage.getItem('buildnexus_onboarded');
    if (!seen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setHasSeenOnboarding(true);
    localStorage.setItem('buildnexus_onboarded', 'true');
  };

  const tourSteps = [
    {
      title: 'Welcome to BuildNexus!',
      desc: 'The Digital Era of Construction. Discover transparent material rates, hire skilled workers with zero middleman exploitation, and stage orders via our central warehouse.',
      icon: <Building2 className="w-10 h-10 text-brand-orange" />,
    },
    {
      title: 'Private In-App Negotiation',
      desc: 'Negotiate bulk material discounts directly with verified suppliers in private chat. Phone numbers are automatically hidden for privacy, and deals are locked by Admin.',
      icon: <Handshake className="w-10 h-10 text-emerald-500" />,
    },
    {
      title: 'Central Warehouse & GPS Delivery',
      desc: 'All materials route through BuildNexus Central Warehouse (Yeshwanthpur) for quality inspection before being delivered to your site with 4-digit OTP verification.',
      icon: <Truck className="w-10 h-10 text-blue-500" />,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="md">
      <div className="text-center space-y-4 py-2">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          {tourSteps[step].icon}
        </div>

        <Stepper
          steps={[{ label: '1' }, { label: '2' }, { label: '3' }]}
          currentStep={step}
        />

        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {tourSteps[step].title}
          </h3>
          <p className="text-xs text-brand-slate dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
            {tourSteps[step].desc}
          </p>
        </div>

        <div className="flex gap-2 pt-4">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="w-1/3">
              Previous
            </Button>
          )}

          {step < 2 ? (
            <Button
              variant="primary"
              onClick={() => setStep(step + 1)}
              className="flex-1"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleClose}
              className="flex-1"
              rightIcon={<Check className="w-4 h-4" />}
            >
              Start Exploring BuildNexus
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
