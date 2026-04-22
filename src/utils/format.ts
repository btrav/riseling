import type { Config } from '../types';

export function formatValue(value: number, config: Config): string {
  if (config.useCurrencyFormat) {
    try {
      return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.currency,
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      return String(value);
    }
  }
  const num = new Intl.NumberFormat(config.locale).format(value);
  return config.unitLabel ? `${num} ${config.unitLabel}` : num;
}

export function progressPercent(config: Config): number {
  if (config.target <= 0) return 0;
  return Math.min(100, Math.max(0, (config.current / config.target) * 100));
}
