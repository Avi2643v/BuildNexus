import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'relative overflow-hidden inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-orange active:scale-[0.96] disabled:opacity-60 disabled:pointer-events-none min-h-[44px] touch-manipulation select-none cursor-pointer';

    const variants = {
      primary:
        'bg-brand-orange text-white hover:bg-brand-orange-hover hover:shadow-lg hover:shadow-blue-500/25 active:bg-blue-700 shadow-glow focus-visible:ring-brand-orange',
      secondary:
        'bg-brand-navy text-white hover:bg-brand-navy-light hover:shadow-lg hover:shadow-slate-900/25 active:bg-slate-950 focus-visible:ring-brand-navy',
      outline:
        'border-2 border-slate-300 dark:border-slate-700 text-brand-slate dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 active:bg-slate-200 dark:active:bg-slate-700 focus-visible:ring-slate-400',
      ghost:
        'text-brand-slate dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 focus-visible:ring-slate-400',
      danger:
        'bg-brand-error text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/25 active:bg-red-800 focus-visible:ring-brand-error',
      success:
        'bg-brand-success text-white hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/25 active:bg-green-800 focus-visible:ring-brand-success',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-xl',
      md: 'px-5 py-2.5 text-base rounded-2xl',
      lg: 'px-7 py-3.5 text-lg rounded-2xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
