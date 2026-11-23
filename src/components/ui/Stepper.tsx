import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Step {
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number; // 0-indexed
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center relative group">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300',
                    isCompleted && 'bg-brand-success text-white',
                    isCurrent && 'bg-brand-orange text-white ring-4 ring-orange-100 dark:ring-orange-950',
                    !isCompleted && !isCurrent && 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : idx + 1}
                </div>
                <span
                  className={cn(
                    'text-xs font-semibold mt-2 text-center max-w-[80px]',
                    isCurrent ? 'text-brand-orange dark:text-orange-400' : 'text-slate-500'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-1 mx-2 rounded-full transition-all duration-300',
                    idx < currentStep ? 'bg-brand-success' : 'bg-slate-200 dark:bg-slate-800'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
