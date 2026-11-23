'use client';

import React, { useEffect } from 'react';

/**
 * ButterClickProvider
 * Safe, glitch-free tactile ripple animations without mutating element overflow or clipping dropdowns/badges.
 */
export const ButterClickProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        'button, a, [role="button"], .butter-click, input[type="submit"], input[type="button"]'
      ) as HTMLElement | null;

      if (!target || target.hasAttribute('disabled') || target.getAttribute('aria-disabled') === 'true') {
        return;
      }

      // Check if element has relative positioning; if static, make it relative
      const computedStyle = window.getComputedStyle(target);
      
      // Do not mutate overflow if it could clip popups/dropdowns/badges
      const isClipped = target.classList.contains('overflow-hidden') || computedStyle.overflow === 'hidden';
      if (!isClipped && !target.classList.contains('butter-click')) {
        return; // Safely skip to prevent clipping dropdowns or badges
      }

      const rect = target.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height) * 1.5;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'butter-ripple-element';
      ripple.style.width = `${diameter}px`;
      ripple.style.height = `${diameter}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      const isDarkOrPrimary =
        target.classList.contains('bg-brand-orange') ||
        target.classList.contains('bg-brand-navy') ||
        target.classList.contains('bg-slate-900') ||
        computedStyle.backgroundColor.includes('rgb(234') ||
        computedStyle.backgroundColor.includes('rgb(15, 23, 42)') ||
        computedStyle.backgroundColor.includes('rgb(220, 38, 38)') ||
        computedStyle.backgroundColor.includes('rgb(22, 163, 74)');

      if (isDarkOrPrimary) {
        ripple.style.background =
          'radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.08) 60%, transparent 80%)';
      } else {
        ripple.style.background =
          'radial-gradient(circle, rgba(249, 115, 22, 0.22) 0%, rgba(249, 115, 22, 0.06) 60%, transparent 80%)';
      }

      target.appendChild(ripple);

      const timeout = setTimeout(() => {
        if (ripple.parentNode === target) {
          target.removeChild(ripple);
        }
      }, 400);

      ripple.addEventListener('animationend', () => {
        clearTimeout(timeout);
        if (ripple.parentNode === target) {
          target.removeChild(ripple);
        }
      });
    };

    document.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return <>{children}</>;
};
