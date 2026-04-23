import type { Config } from '../types';

function formatCurrency(value: number, config: Config): string {
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

function formatNumber(value: number, config: Config): string {
  try {
    return new Intl.NumberFormat(config.locale).format(value);
  } catch {
    return String(value);
  }
}

function impactCount(value: number, config: Config): number {
  if (!config.impactUnitEnabled || config.impactUnitValue <= 0) return 0;
  return Math.floor(value / config.impactUnitValue);
}

export function formatValue(value: number, config: Config): string {
  if (config.impactUnitEnabled && config.impactUnitValue > 0) {
    return formatNumber(impactCount(value, config), config);
  }
  if (config.useCurrencyFormat) {
    return formatCurrency(value, config);
  }
  const num = formatNumber(value, config);
  return config.unitLabel ? `${num} ${config.unitLabel}` : num;
}

export function formatGoalValue(value: number, config: Config): string {
  if (config.impactUnitEnabled && config.impactUnitValue > 0) {
    const count = impactCount(value, config);
    const label = config.impactUnitLabel.trim() || 'units';
    return `${formatNumber(count, config)} ${label}`;
  }
  return formatValue(value, config);
}

export function raisedLabelText(config: Config): string {
  if (config.impactUnitEnabled && config.impactUnitValue > 0) {
    const label = config.impactUnitLabel.trim() || 'units';
    return label.toUpperCase();
  }
  return 'RAISED';
}

export function progressPercent(config: Config): number {
  if (config.target <= 0) return 0;
  return Math.min(100, Math.max(0, (config.current / config.target) * 100));
}
