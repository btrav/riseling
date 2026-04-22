export type CurrencyPreset = {
  code: string;
  locale: string;
  label: string;
};

export const CURRENCY_PRESETS: CurrencyPreset[] = [
  { code: 'USD', locale: 'en-US', label: 'USD · US Dollar' },
  { code: 'EUR', locale: 'de-DE', label: 'EUR · Euro (DE)' },
  { code: 'EUR', locale: 'fr-FR', label: 'EUR · Euro (FR)' },
  { code: 'EUR', locale: 'nl-NL', label: 'EUR · Euro (NL)' },
  { code: 'GBP', locale: 'en-GB', label: 'GBP · British Pound' },
  { code: 'CAD', locale: 'en-CA', label: 'CAD · Canadian Dollar' },
  { code: 'AUD', locale: 'en-AU', label: 'AUD · Australian Dollar' },
  { code: 'NZD', locale: 'en-NZ', label: 'NZD · New Zealand Dollar' },
  { code: 'JPY', locale: 'ja-JP', label: 'JPY · Japanese Yen' },
  { code: 'KRW', locale: 'ko-KR', label: 'KRW · Korean Won' },
  { code: 'CNY', locale: 'zh-CN', label: 'CNY · Chinese Yuan' },
  { code: 'SGD', locale: 'en-SG', label: 'SGD · Singapore Dollar' },
  { code: 'HKD', locale: 'en-HK', label: 'HKD · Hong Kong Dollar' },
  { code: 'INR', locale: 'en-IN', label: 'INR · Indian Rupee' },
  { code: 'CHF', locale: 'de-CH', label: 'CHF · Swiss Franc' },
  { code: 'SEK', locale: 'sv-SE', label: 'SEK · Swedish Krona' },
  { code: 'NOK', locale: 'nb-NO', label: 'NOK · Norwegian Krone' },
  { code: 'DKK', locale: 'da-DK', label: 'DKK · Danish Krone' },
  { code: 'BRL', locale: 'pt-BR', label: 'BRL · Brazilian Real' },
  { code: 'MXN', locale: 'es-MX', label: 'MXN · Mexican Peso' },
  { code: 'ZAR', locale: 'en-ZA', label: 'ZAR · South African Rand' },
];

export function presetKey(p: CurrencyPreset): string {
  return `${p.code}:${p.locale}`;
}

export function findPreset(code: string, locale: string): CurrencyPreset | undefined {
  return CURRENCY_PRESETS.find((p) => p.code === code && p.locale === locale);
}
