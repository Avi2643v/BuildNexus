import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function maskPhoneNumber(text: string): string {
  // Regex detects 10-digit Indian phone numbers and masked variations
  const phoneRegex = /(\+?91[\-\s]?)?[6-9]\d{9}/g;
  return text.replace(phoneRegex, '🔒 [CONTACT MASKED]');
}
