import { CURRENCY_PRESETS } from './currencies';

const LOCALE_WHITELIST = new Set<string>(CURRENCY_PRESETS.map((p) => p.locale));
const CURRENCY_WHITELIST = new Set<string>(CURRENCY_PRESETS.map((p) => p.code));

export function safeLocale(candidate: string, fallback = 'en-US'): string {
  if (LOCALE_WHITELIST.has(candidate)) return candidate;
  try {
    new Intl.NumberFormat(candidate);
    return candidate;
  } catch {
    return fallback;
  }
}

export function safeCurrency(candidate: string, fallback = 'USD'): string {
  if (CURRENCY_WHITELIST.has(candidate)) return candidate;
  try {
    new Intl.NumberFormat('en-US', { style: 'currency', currency: candidate });
    return candidate;
  } catch {
    return fallback;
  }
}
