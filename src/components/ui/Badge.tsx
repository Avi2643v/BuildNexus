import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck, CheckCircle2, AlertCircle, Clock, Award, Sparkles } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'error'
    | 'danger'
    | 'info'
    | 'neutral'
    | 'outline'
    | 'verified'
    | 'fairWage'
    | 'contractor'
    | 'orange';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const base =
    'inline-flex items-center gap-1.5 font-semibold rounded-full select-none transition-colors';

  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    outline: 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-transparent',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    error: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
    verified: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    fairWage: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 font-bold',
    contractor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
    orange: 'bg-orange-50 text-brand-orange dark:bg-orange-950/50 dark:text-orange-300 border border-orange-200 dark:border-orange-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const icons: Record<string, React.ReactNode> = {
    verified: <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
    fairWage: <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
    success: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    warning: <Clock className="w-3.5 h-3.5 text-amber-600" />,
    error: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />,
    danger: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />,
    info: <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />,
    contractor: <Sparkles className="w-3.5 h-3.5 text-purple-600" />,
    default: null,
    neutral: null,
    outline: null,
    orange: null,
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {icons[variant]}
      {children}
    </span>
  );
};
