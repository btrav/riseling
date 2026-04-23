import type { Config } from '../types';
import { FONT_THEMES } from './fonts';

type BuildEmbedOptions = {
  config: Config;
  width: number;
  height: number;
  background: 'white' | 'transparent';
  showEditLink: boolean;
  interactive: boolean;
};

const VIEWER_BASE = 'https://benjamintravis.com/riseling/v/';

function buildViewerUrl({ config, background, showEditLink, interactive }: BuildEmbedOptions): string {
  const params = new URLSearchParams();
  params.set('s', config.shape);
  params.set('g', String(config.target));
  params.set('r', String(config.current));
  if (config.title) params.set('t', config.title);
  if (config.caption) params.set('cp', config.caption);
  params.set('c', config.currency);
  params.set('lo', config.locale);
  if (config.unitLabel) params.set('u', config.unitLabel);
  params.set('cf', config.fillColor);
  params.set('ct', config.trackColor);
  if (FONT_THEMES[config.font]) params.set('f', config.font);
  params.set('uc', String(config.useCurrencyFormat));
  params.set('iu', String(config.impactUnitEnabled));
  params.set('iv', String(config.impactUnitValue));
  if (config.impactUnitLabel) params.set('il', config.impactUnitLabel);
  params.set('vt', String(config.show.title));
  params.set('vc', String(config.show.caption));
  params.set('vg', String(config.show.goal));
  params.set('vr', String(config.show.raised));
  params.set('vp', String(config.show.percentage));
  if (background === 'transparent') params.set('bg', 'transparent');
  if (showEditLink) params.set('edit', '1');
  if (interactive) params.set('interactive', '1');
  return `${VIEWER_BASE}?${params.toString()}`;
}

export function buildEmbedCode(opts: BuildEmbedOptions): string {
  const src = buildViewerUrl(opts);
  return [
    `<iframe src="${src}"`,
    `  width="${opts.width}" height="${opts.height}"`,
    `  style="border:0;max-width:100%"`,
    `  loading="lazy"`,
    `  referrerpolicy="no-referrer-when-downgrade"`,
    `  title="Fundraising progress"></iframe>`,
  ].join('\n');
}

export function buildViewerLink(opts: BuildEmbedOptions): string {
  return buildViewerUrl(opts);
}
