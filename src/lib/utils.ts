import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numbers into Indian Rupee format (e.g. ₹1,25,000)
 */
export function formatINR(amount: number): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}

/**
 * Privacy helper: auto-masks any phone number or email address typed in messages
 * e.g., 9876543210 -> •••••••••• (or private placeholder)
 */
export function maskSensitiveText(text: string): string {
  if (!text) return text;
  
  // Mask 10-digit or 11-digit phone numbers
  let masked = text.replace(/(\+?\d{1,3}[\s-]?)?\(?\d{3,5}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/g, '•••••••••• [Contact details hidden for privacy]');
  
  // Mask email addresses
  masked = masked.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '••••@••••.com [Email hidden]');
  
  return masked;
}

/**
 * Mask 12-digit Aadhaar / Govt ID into XXXX XXXX 1234
 */
export function maskGovtId(idNumber: string): string {
  const clean = idNumber.replace(/\D/g, '');
  if (clean.length === 12) {
    return `XXXX XXXX ${clean.slice(8)}`;
  }
  if (clean.length > 4) {
    return `${'X'.repeat(clean.length - 4)}${clean.slice(-4)}`;
  }
  return 'XXXX XXXX 1234';
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
